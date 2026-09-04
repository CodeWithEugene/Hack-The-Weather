from __future__ import annotations

import os
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "packages" / "core"))

from hatua_core.adapters.chords import CircuitBreaker, fetch_last
from hatua_core.adapters.db import OutboxRow, make_session_factory
from hatua_core.application.fuse_forecast import fuse_forecast
from hatua_core.application.ingest_batch import ingest_csv, ingest_observations, observation_count
from hatua_core.domain.observation import JKUAT
from hatua_core.projections.now import set_source

CSV = ROOT / "data" / "3DFEWSNET_SiteJKUAT_KenyaKiambuJKUATIOTAWS-Conduti@Empathy1.csv"
DATABASE_URL = os.environ.get("DATABASE_URL", f"sqlite:///{ROOT / 'hatua.db'}")
LIVE = os.environ.get("HATUA_LIVE", "0") == "1"


def backfill() -> None:
    SessionLocal = make_session_factory(DATABASE_URL)
    db = SessionLocal()
    try:
        n = observation_count(db, JKUAT.id)
        if n == 0:
            print("hatua-worker backfill", CSV, flush=True)
            result = ingest_csv(db, CSV)
            summary = {k: result[k] for k in result if k != "daily_rgt"}
            print("backfill", summary, flush=True)
            fuse_forecast(db, result.get("daily_rgt") or {})
            set_source(db, "csv")
        else:
            print("hatua-worker skip backfill existing", n, flush=True)
    finally:
        db.close()


def run_loop() -> None:
    SessionLocal = make_session_factory(DATABASE_URL)
    breaker = CircuitBreaker()
    last_fuse = 0.0
    last_live = 0.0
    while True:
        now = time.time()
        db = SessionLocal()
        try:
            pending = db.query(OutboxRow).filter_by(status="pending").all()
            for row in pending:
                print("outbox", row.channel, row.action_id, flush=True)
                row.status = "sent"
            db.commit()
            if LIVE and now - last_live > 30:
                last_live = now
                try:
                    obs = fetch_last(
                        os.environ.get("CHORDS_EMAIL"),
                        os.environ.get("CHORDS_API_KEY"),
                        breaker=breaker,
                    )
                    ingest_observations(db, [obs], source="chords")
                    set_source(db, "chords")
                    print("live ingest", obs.observed_at.isoformat(), flush=True)
                except Exception as exc:
                    set_source(db, "degraded")
                    print("live fail", type(exc).__name__, flush=True)
            if now - last_fuse > 3600:
                last_fuse = now
        finally:
            db.close()
        time.sleep(1)


if __name__ == "__main__":
    backfill()
    if os.environ.get("HATUA_ONCE", "0") == "1":
        raise SystemExit(0)
    run_loop()
