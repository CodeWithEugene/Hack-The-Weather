from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Optional
from zoneinfo import ZoneInfo

from sqlalchemy import func
from sqlalchemy.orm import Session

from hatua_core.adapters.db import (
    ActionRow,
    ObservationRow,
    ReplayRow,
    ResidualRow,
    SourceStateRow,
    StationRow,
    TrustRow,
)
from hatua_core.domain.action import CAMPUS_KINDS, FARM_KINDS, SCIENCE_KINDS, ActionKind
from hatua_core.domain.observation import JKUAT

EAT = ZoneInfo("Africa/Nairobi")
ROLE_KINDS = {
    "campus": {k.value for k in CAMPUS_KINDS} | {ActionKind.STATION_FAULT.value},
    "farm": {k.value for k in FARM_KINDS} | {ActionKind.STATION_FAULT.value},
    "science": {k.value for k in SCIENCE_KINDS}
    | {k.value for k in CAMPUS_KINDS}
    | {k.value for k in FARM_KINDS},
}


def _iso(t: Optional[datetime]) -> Optional[str]:
    if t is None:
        return None
    if t.tzinfo is None:
        t = t.replace(tzinfo=timezone.utc)
    return t.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")


def _eat(t: Optional[datetime]) -> Optional[str]:
    if t is None:
        return None
    if t.tzinfo is None:
        t = t.replace(tzinfo=timezone.utc)
    return t.astimezone(EAT).isoformat()


def as_of(session: Session, station_id: int) -> Optional[datetime]:
    row = session.get(ReplayRow, station_id)
    if row:
        return row.as_of
    last = (
        session.query(func.max(ObservationRow.observed_at))
        .filter_by(station_id=station_id)
        .scalar()
    )
    return last


def set_replay(session: Session, station_id: int, t: datetime) -> datetime:
    if t.tzinfo is None:
        t = t.replace(tzinfo=timezone.utc)
    row = session.get(ReplayRow, station_id)
    if row is None:
        session.add(ReplayRow(station_id=station_id, as_of=t))
    else:
        row.as_of = t
    session.commit()
    return t


def source_flag(session: Session) -> str:
    row = session.get(SourceStateRow, "chords")
    return row.value if row else "csv-only"


def set_source(session: Session, value: str) -> None:
    now = datetime.now(timezone.utc)
    row = session.get(SourceStateRow, "chords")
    if row is None:
        session.add(SourceStateRow(key="chords", value=value, updated_at=now))
    else:
        row.value = value
        row.updated_at = now
    session.commit()


def now_snapshot(session: Session, station_id: int, role: str = "campus") -> dict[str, Any]:
    t = as_of(session, station_id)
    station = session.get(StationRow, station_id)
    if station is None or t is None:
        return {
            "station_id": station_id,
            "observed_at": None,
            "as_of_eat": None,
            "trust": {"status": "reject", "flags": ["no_data"]},
            "actions": [],
            "quiet_reason": "No Conduit observations ingested yet.",
            "ingest": {"lag_s": None, "source": source_flag(session)},
            "observation": None,
        }
    obs = (
        session.query(ObservationRow)
        .filter(
            ObservationRow.station_id == station_id,
            ObservationRow.observed_at <= t,
        )
        .order_by(ObservationRow.observed_at.desc())
        .first()
    )
    trust = (
        session.query(TrustRow)
        .filter(
            TrustRow.station_id == station_id,
            TrustRow.observed_at == obs.observed_at,
        )
        .first()
        if obs
        else None
    )
    kinds = ROLE_KINDS.get(role, ROLE_KINDS["science"])
    actions = (
        session.query(ActionRow)
        .filter(
            ActionRow.station_id == station_id,
            ActionRow.status == "issued",
            ActionRow.valid_from <= t,
            ActionRow.valid_until >= t,
            ActionRow.kind.in_(kinds),
        )
        .order_by(ActionRow.valid_from.desc())
        .all()
    )
    climate = [a for a in actions if a.kind != ActionKind.STATION_FAULT.value]
    unique_climate: list[ActionRow] = []
    seen_kinds: set[str] = set()
    for row in climate:
        if row.kind in seen_kinds:
            continue
        seen_kinds.add(row.kind)
        unique_climate.append(row)
    climate = unique_climate
    faults = [a for a in actions if a.kind == ActionKind.STATION_FAULT.value]

    def _persist(row: ActionRow) -> bool:
        comps = (row.explanation or {}).get("components") or []
        return any(
            c.get("flag") in {"rg2_stuck", "cloned_gust_dir", "battery_unknown"}
            for c in comps
        )

    persist = [a for a in faults if _persist(a)]
    health = [a for a in faults if not _persist(a)]
    if role == "science":
        shown_faults = persist + health[-1:]
    else:
        shown_faults = persist[:1]
    actions = climate + shown_faults
    last_max = (
        session.query(func.max(ObservationRow.observed_at))
        .filter_by(station_id=station_id)
        .scalar()
    )
    lag = None
    if last_max:
        lag = int((datetime.now(timezone.utc) - last_max.replace(tzinfo=timezone.utc)).total_seconds())
        if lag < 0:
            lag = 0
    flags = list(trust.flags) if trust else []
    status = trust.status if trust else "reject"
    payload = [
        {
            "id": a.id,
            "kind": a.kind,
            "headline": a.headline,
            "until_eat": _eat(a.valid_until),
            "valid_from": _iso(a.valid_from),
            "trust_status": a.trust_status,
            "who": _who(a.kind),
            "explanation": a.explanation,
        }
        for a in actions
    ]
    quiet = None
    if not payload:
        quiet = "All clear. No outdoor restriction for this audience at this time."
        if "rg2_stuck" in flags:
            quiet += " Rain gauge 2 is still untrusted."
    return {
        "station_id": station_id,
        "station_name": station.name,
        "lon": station.lon,
        "lat": station.lat,
        "elev_m": station.elev_m,
        "observed_at": _iso(obs.observed_at) if obs else None,
        "as_of": _iso(t),
        "as_of_eat": _eat(t),
        "trust": {"status": status, "flags": flags, "score": trust.score if trust else 0},
        "actions": payload,
        "quiet_reason": quiet,
        "ingest": {"lag_s": lag, "source": obs.source if obs else source_flag(session)},
        "observation": {
            "wbgt": obs.wbgt if obs else None,
            "hi": obs.hi if obs else None,
            "sh1": obs.sh1 if obs else None,
            "rg": obs.rg if obs else None,
            "rg2": obs.rg2 if obs else None,
            "su1": obs.su1 if obs else None,
            "st1": obs.st1 if obs else None,
            "ws": obs.ws if obs else None,
        }
        if obs
        else None,
    }


def _who(kind: str) -> str:
    return {
        "HEAT_PROTECT": "campus crew",
        "UV_PROTECT": "campus crew",
        "HUMIDITY_VENTILATE": "grower",
        "WATER_WAIT": "grower",
        "RAIN_ONSET": "campus crew / grower",
        "STATION_FAULT": "science / AquaTwin",
    }.get(kind, "operator")


def list_actions(session: Session, station_id: int, kind: Optional[str] = None) -> list[dict]:
    q = session.query(ActionRow).filter_by(station_id=station_id)
    if kind:
        q = q.filter_by(kind=kind)
    rows = q.order_by(ActionRow.valid_from.asc()).all()
    return [
        {
            "id": r.id,
            "kind": r.kind,
            "status": r.status,
            "headline": r.headline,
            "valid_from": _iso(r.valid_from),
            "valid_until": _iso(r.valid_until),
            "trust_status": r.trust_status,
            "explanation": r.explanation,
        }
        for r in rows
    ]


def trust_series(
    session: Session, station_id: int, limit: int = 2000, stride: int = 5
) -> list[dict]:
    rows = (
        session.query(TrustRow)
        .filter_by(station_id=station_id)
        .order_by(TrustRow.observed_at.asc())
        .all()
    )
    picked = rows[:: max(stride, 1)]
    if rows and rows[-1] not in picked:
        picked.append(rows[-1])
    return [
        {
            "observed_at": _iso(r.observed_at),
            "status": r.status,
            "score": r.score,
            "flags": r.flags,
        }
        for r in picked[:limit]
    ]


def observations_downsampled(session: Session, station_id: int, every_n: int = 5) -> list[dict]:
    rows = (
        session.query(ObservationRow)
        .filter_by(station_id=station_id)
        .order_by(ObservationRow.observed_at.asc())
        .all()
    )
    out = []
    for i, r in enumerate(rows):
        if i % every_n != 0:
            continue
        out.append(
            {
                "observed_at": _iso(r.observed_at),
                "wbgt": r.wbgt,
                "hi": r.hi,
                "sh1": r.sh1,
                "rg": r.rg,
                "su1": r.su1,
                "st1": r.st1,
            }
        )
    return out


def residuals(session: Session, station_id: int) -> list[dict]:
    rows = (
        session.query(ResidualRow)
        .filter_by(station_id=station_id)
        .order_by(ResidualRow.valid_at.asc())
        .all()
    )
    return [
        {
            "valid_at": r.valid_at.date().isoformat(),
            "conduit_mm": r.conduit_mm,
            "model_mm": r.model_mm,
            "model_id": r.model_id,
            "delta_mm": r.delta_mm,
        }
        for r in rows
    ]


def explain_action(session: Session, action_id: str) -> Optional[dict]:
    r = session.get(ActionRow, action_id)
    if r is None:
        return None
    return {
        "id": r.id,
        "kind": r.kind,
        "status": r.status,
        "headline": r.headline,
        "valid_from": _iso(r.valid_from),
        "valid_until": _iso(r.valid_until),
        "policy_id": r.policy_id,
        "trust_status": r.trust_status,
        "explanation": r.explanation,
    }


def health(session: Session) -> dict:
    last = session.query(func.max(ObservationRow.observed_at)).scalar()
    n = session.query(func.count(ObservationRow.station_id)).scalar()
    lag = None
    if last:
        aware = last if last.tzinfo else last.replace(tzinfo=timezone.utc)
        lag = int((datetime.now(timezone.utc) - aware).total_seconds())
        if lag < 0:
            lag = 0
    return {
        "api": "ok",
        "db": "ok",
        "last_obs": _iso(last) if last else None,
        "observations": int(n or 0),
        "worker_lag_s": lag,
        "source": source_flag(session),
        "station_id": JKUAT.id,
    }


def list_stations(session: Session) -> list[dict]:
    rows = session.query(StationRow).all()
    return [
        {
            "id": r.id,
            "name": r.name,
            "lon": r.lon,
            "lat": r.lat,
            "elev_m": r.elev_m,
            "site_id": r.site_id,
        }
        for r in rows
    ]
