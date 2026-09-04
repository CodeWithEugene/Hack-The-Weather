from __future__ import annotations

from pathlib import Path

import pytest

from hatua_core.adapters.db import make_session_factory
from hatua_core.application.fuse_forecast import fuse_forecast
from hatua_core.application.ingest_batch import ingest_csv
from hatua_core.domain.observation import JKUAT

ROOT = Path(__file__).resolve().parents[1]
CSV = ROOT / "data" / "3DFEWSNET_SiteJKUAT_KenyaKiambuJKUATIOTAWS-Conduti@Empathy1.csv"


@pytest.fixture(scope="session")
def csv_path() -> Path:
    assert CSV.exists(), f"missing organiser extract at {CSV}"
    return CSV


@pytest.fixture(scope="session")
def db_url(tmp_path_factory, csv_path: Path) -> str:
    path = tmp_path_factory.mktemp("hatua") / "hatua.db"
    url = f"sqlite:///{path}"
    Session = make_session_factory(url)
    session = Session()
    result = ingest_csv(session, csv_path)
    assert result["rows_ok"] > 7000
    fuse_forecast(
        session,
        result.get("daily_rgt") or {},
        station_id=JKUAT.id,
        model={
            "2026-08-28": 0.0,
            "2026-08-29": 0.0,
            "2026-08-30": 0.0,
            "2026-08-31": 1.2,
            "2026-09-01": 0.0,
        },
        model_id="openmeteo_stub",
    )
    session.close()
    return url


@pytest.fixture
def db(db_url: str):
    Session = make_session_factory(db_url)
    session = Session()
    try:
        yield session
    finally:
        session.close()
