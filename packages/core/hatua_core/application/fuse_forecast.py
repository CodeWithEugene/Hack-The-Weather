from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional

from sqlalchemy.orm import Session

from hatua_core.adapters.db import ResidualRow
from hatua_core.adapters.openmeteo import fetch_openmeteo_daily
from hatua_core.domain.observation import JKUAT


def fuse_forecast(
    session: Session,
    daily_rgt: dict[str, float],
    station_id: int = JKUAT.id,
    model: Optional[dict[str, float]] = None,
    model_id: str = "openmeteo_forecast",
) -> int:
    if not daily_rgt:
        return 0
    days = sorted(daily_rgt)
    if model is None:
        try:
            model = fetch_openmeteo_daily(JKUAT.lat, JKUAT.lon, days[0], days[-1])
        except Exception:
            model = {}
            model_id = "openmeteo_unavailable"
    n = 0
    for day, conduit_mm in daily_rgt.items():
        model_mm = model.get(day)
        delta = None if model_mm is None else round(conduit_mm - model_mm, 3)
        valid_at = datetime.fromisoformat(day).replace(tzinfo=timezone.utc)
        existing = (
            session.query(ResidualRow)
            .filter_by(station_id=station_id, valid_at=valid_at, model_id=model_id)
            .first()
        )
        if existing:
            existing.conduit_mm = conduit_mm
            existing.model_mm = model_mm
            existing.delta_mm = delta
        else:
            session.add(
                ResidualRow(
                    station_id=station_id,
                    valid_at=valid_at,
                    conduit_mm=conduit_mm,
                    model_mm=model_mm,
                    model_id=model_id,
                    delta_mm=delta,
                )
            )
        n += 1
    session.commit()
    return n
