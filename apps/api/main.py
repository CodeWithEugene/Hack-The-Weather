from pathlib import Path
import os
import sys
from contextlib import asynccontextmanager

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "packages" / "core"))

if os.environ.get("VERCEL"):
    os.environ.setdefault("DATABASE_URL", "sqlite:////tmp/hatua.db")

from datetime import datetime, timezone

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from hatua_core.adapters.db import make_session_factory
from hatua_core.domain.observation import JKUAT
from hatua_core.projections import now as proj

DATABASE_URL = os.environ.get("DATABASE_URL", f"sqlite:///{ROOT / 'hatua.db'}")
WEB_ORIGIN = os.environ.get("WEB_ORIGIN", "http://localhost:3000")
SessionLocal = make_session_factory(DATABASE_URL)

CSV = ROOT / "data" / "3DFEWSNET_SiteJKUAT_KenyaKiambuJKUATIOTAWS-Conduti@Empathy1.csv"


def _maybe_backfill() -> None:
    if os.environ.get("HATUA_SKIP_BACKFILL") == "1":
        return
    from hatua_core.application.fuse_forecast import fuse_forecast
    from hatua_core.application.ingest_batch import ingest_csv, observation_count
    from hatua_core.projections.now import set_source

    db = SessionLocal()
    try:
        if observation_count(db, JKUAT.id) == 0 and CSV.exists():
            result = ingest_csv(db, CSV)
            fuse_forecast(db, result.get("daily_rgt") or {})
            set_source(db, "csv")
    finally:
        db.close()


@asynccontextmanager
async def lifespan(_application: FastAPI):
    _maybe_backfill()
    yield


class ReplayBody(BaseModel):
    t: str
    station_id: int = JKUAT.id


def create_app() -> FastAPI:
    application = FastAPI(title="Hatua API", version="0.1.0", lifespan=lifespan)
    application.add_middleware(
        CORSMiddleware,
        allow_origins=[
            WEB_ORIGIN,
            "http://127.0.0.1:3000",
            "http://localhost:3000",
            "https://hack-the-weather.vercel.app",
        ],
        allow_origin_regex=r"https://.*\.vercel\.app",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    try:
        from apps.api.routers.africastalking import router as at_router
    except ModuleNotFoundError:
        from routers.africastalking import router as at_router

    application.include_router(at_router)

    @application.get("/health")
    def health():
        db = SessionLocal()
        try:
            return proj.health(db)
        finally:
            db.close()

    @application.get("/v1/stations")
    def stations():
        db = SessionLocal()
        try:
            return {"stations": proj.list_stations(db)}
        finally:
            db.close()

    @application.get("/v1/stations/{station_id}/now")
    def station_now(station_id: int, role: str = Query("campus")):
        db = SessionLocal()
        try:
            return proj.now_snapshot(db, station_id, role=role)
        finally:
            db.close()

    @application.get("/v1/stations/{station_id}/actions")
    def actions(station_id: int, kind: str | None = None):
        db = SessionLocal()
        try:
            return {"actions": proj.list_actions(db, station_id, kind=kind)}
        finally:
            db.close()

    @application.get("/v1/stations/{station_id}/trust")
    def trust(station_id: int):
        db = SessionLocal()
        try:
            return {"trust": proj.trust_series(db, station_id)}
        finally:
            db.close()

    @application.get("/v1/stations/{station_id}/observations")
    def observations(station_id: int, every_n: int = 5):
        db = SessionLocal()
        try:
            return {"observations": proj.observations_downsampled(db, station_id, every_n)}
        finally:
            db.close()

    @application.get("/v1/stations/{station_id}/residuals")
    def residuals(station_id: int):
        db = SessionLocal()
        try:
            return {"residuals": proj.residuals(db, station_id)}
        finally:
            db.close()

    @application.get("/v1/stations/{station_id}/explain/{action_id}")
    def explain(station_id: int, action_id: str):
        db = SessionLocal()
        try:
            body = proj.explain_action(db, action_id)
            if not body:
                raise HTTPException(404, "action not found")
            return body
        finally:
            db.close()

    @application.post("/v1/replay")
    def replay(body: ReplayBody):
        t = datetime.fromisoformat(body.t.replace("Z", "+00:00"))
        if t.tzinfo is None:
            t = t.replace(tzinfo=timezone.utc)
        db = SessionLocal()
        try:
            stored = proj.set_replay(db, body.station_id, t)
            return {"as_of": stored.isoformat(), "station_id": body.station_id}
        finally:
            db.close()

    @application.get("/v1/stream")
    def stream():
        import json
        import time

        def gen():
            db = SessionLocal()
            try:
                snap = proj.now_snapshot(db, JKUAT.id, role="science")
                yield f"data: {json.dumps(snap)}\n\n"
                time.sleep(15)
            finally:
                db.close()

        return StreamingResponse(gen(), media_type="text/event-stream")

    return application


app = create_app()
