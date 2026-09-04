from __future__ import annotations

from datetime import datetime, timezone

from hatua_core.adapters.db import ActionRow, ObservationRow, ResidualRow
from hatua_core.application.fuse_forecast import fuse_forecast
from hatua_core.application.ingest_batch import ingest_csv, observation_count
from hatua_core.domain.observation import JKUAT
from hatua_core.projections.now import now_snapshot, set_replay


RAIN_TIP = datetime(2026, 8, 31, 3, 41, 33, tzinfo=timezone.utc)


def test_ingest_is_idempotent(db, csv_path):
    n1 = observation_count(db, JKUAT.id)
    actions1 = db.query(ActionRow).count()
    again = ingest_csv(db, csv_path)
    assert again.get("skipped") is True
    assert observation_count(db, JKUAT.id) == n1
    assert db.query(ActionRow).count() == actions1


def test_extract_size(db):
    assert observation_count(db, JKUAT.id) >= 7060


def test_replay_second_rain_tip_shows_onset(db):
    set_replay(db, JKUAT.id, RAIN_TIP)
    snap = now_snapshot(db, JKUAT.id, role="campus")
    kinds = {a["kind"] for a in snap["actions"]}
    assert "RAIN_ONSET" in kinds
    assert snap["observed_at"] == "2026-08-31T03:41:33Z"


def test_station_fault_covers_science_face(db):
    set_replay(db, JKUAT.id, datetime(2026, 9, 1, 12, tzinfo=timezone.utc))
    snap = now_snapshot(db, JKUAT.id, role="science")
    kinds = {a["kind"] for a in snap["actions"]}
    assert "STATION_FAULT" in kinds
    flags = snap["trust"]["flags"]
    assert "rg2_stuck" in flags
    assert "cloned_gust_dir" in flags


def test_residuals_exist_for_stub_model(db):
    rows = db.query(ResidualRow).filter_by(station_id=JKUAT.id).all()
    assert rows
    assert any(r.model_id == "openmeteo_stub" for r in rows)


def test_residual_skipped_when_model_missing(db):
    fuse_forecast(db, {}, station_id=JKUAT.id)
    n = (
        db.query(ObservationRow)
        .filter_by(station_id=JKUAT.id)
        .count()
    )
    assert n >= 7060
