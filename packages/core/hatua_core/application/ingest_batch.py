from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path
from typing import Optional
from uuid import uuid4

from sqlalchemy.orm import Session

from hatua_core.adapters.db import (
    ActionRow,
    EventRow,
    IngestRunRow,
    ObservationRow,
    OutboxRow,
    StationRow,
    TrustRow,
)
from hatua_core.adapters.geocsv import parse_geocsv
from hatua_core.application.evaluate_trust import evaluate_trust
from hatua_core.application.issue_actions import (
    climatology,
    eat_date,
    issue_for_observation,
    rain_onset,
)
from hatua_core.domain.observation import (
    JKUAT,
    KENYA_3D_PAWS_STATIONS,
    Observation,
    Station,
)
from hatua_core.domain.trust import QCState
from hatua_core.policy import action_policy, trust_policy

HOT = ("rg", "rg2", "st1", "bt1", "mt1", "sh1", "wbgt", "hi", "su1", "ws", "wg", "hth")


def ensure_station(session: Session, station: Station = JKUAT) -> None:
    for st in KENYA_3D_PAWS_STATIONS:
        row = session.get(StationRow, st.id)
        if row is None:
            session.add(
                StationRow(
                    id=st.id,
                    site_id=st.site_id,
                    name=st.name,
                    lon=st.lon,
                    lat=st.lat,
                    elev_m=st.elev_m,
                    timezone=st.timezone,
                    cadence_s=st.cadence_s,
                )
            )
    session.flush()


def observation_count(session: Session, station_id: int) -> int:
    return session.query(ObservationRow).filter_by(station_id=station_id).count()


def ingest_observations(
    session: Session,
    observations: list[Observation],
    source: str,
    station: Station = JKUAT,
) -> dict:
    ensure_station(session, station)
    existing_n = observation_count(session, station.id)
    if observations and existing_n >= max(1, int(len(observations) * 0.9)):
        return {
            "run_id": None,
            "rows_ok": 0,
            "rows_dead": 0,
            "actions": 0,
            "skipped": True,
            "existing": existing_n,
        }

    tpol = trust_policy()
    apol = action_policy()
    run_id = str(uuid4())
    now = datetime.now(timezone.utc)
    run = IngestRunRow(
        id=run_id, source=source, started_at=now, rows_ok=0, rows_dead=0
    )
    session.add(run)

    state = QCState()
    obs_keep: list[Observation] = []
    verdicts: list[tuple] = []
    last_rain_before: Optional[datetime] = None
    daily_rgt: dict[str, float] = {}

    existing_times = set()
    if existing_n:
        existing_times = {
            r[0]
            for r in session.query(ObservationRow.observed_at)
            .filter_by(station_id=station.id)
            .all()
        }

    for obs in observations:
        obs.ingest_run_id = run_id
        prev_rain = last_rain_before
        try:
            verdict, state = evaluate_trust(obs, tpol, state)
        except Exception as exc:
            run.rows_dead += 1
            session.add(
                EventRow(
                    ts=obs.observed_at,
                    type="DeadLetter",
                    station_id=obs.station_id,
                    payload={"error": str(exc)},
                )
            )
            continue
        rgt = obs.get("rgt")
        if rgt is not None:
            day = eat_date(obs.observed_at)
            daily_rgt[day] = max(daily_rgt.get(day, 0.0), rgt)
        if obs.observed_at not in existing_times:
            session.add(
                ObservationRow(
                    station_id=obs.station_id,
                    observed_at=obs.observed_at,
                    payload=obs.payload,
                    source=obs.source,
                    ingest_run_id=run_id,
                    **{k: obs.get(k) for k in HOT},
                )
            )
            session.add(
                TrustRow(
                    station_id=verdict.station_id,
                    observed_at=verdict.observed_at,
                    status=verdict.status,
                    score=verdict.score,
                    flags=verdict.flags,
                    policy_id=verdict.policy_id,
                    details=verdict.details,
                )
            )
            run.rows_ok += 1
        obs_keep.append(obs)
        verdicts.append((obs, verdict, prev_rain))
        rg = obs.get("rg")
        if rg is not None and rg > 0:
            last_rain_before = obs.observed_at

    session.flush()
    clima = climatology(obs_keep, apol)
    actions_n = 0
    issue_state = QCState()
    have_actions = session.query(ActionRow).filter_by(station_id=station.id).count() > 0
    if not have_actions:
        for obs, verdict, prev_rain in verdicts:
            issued = issue_for_observation(
                obs, verdict, apol, issue_state, clima, daily_rgt
            )
            onset = rain_onset(obs, verdict, apol, prev_rain, issue_state)
            if onset:
                issued.append(onset)
            for action in issued:
                session.add(
                    ActionRow(
                        id=str(action.id),
                        station_id=action.station_id,
                        kind=action.kind.value,
                        status=action.status,
                        valid_from=action.valid_from,
                        valid_until=action.valid_until,
                        policy_id=action.policy_id,
                        trust_status=action.trust_status,
                        explanation=action.explanation,
                        headline=action.display_headline(),
                    )
                )
                session.add(
                    EventRow(
                        ts=action.valid_from,
                        type="ActionIssued"
                        if action.status == "issued"
                        else "ActionSuppressed",
                        station_id=action.station_id,
                        payload={"kind": action.kind.value, "status": action.status},
                    )
                )
                if action.status == "issued":
                    session.add(
                        OutboxRow(
                            action_id=str(action.id),
                            channel="log",
                            payload={
                                "kind": action.kind.value,
                                "headline": action.display_headline(),
                            },
                            status="pending",
                        )
                    )
                actions_n += 1

    run.finished_at = datetime.now(timezone.utc)
    session.commit()
    return {
        "run_id": run_id,
        "rows_ok": run.rows_ok,
        "rows_dead": run.rows_dead,
        "actions": actions_n,
        "climatology": clima,
        "daily_rgt": daily_rgt,
        "skipped": False,
    }


def ingest_csv(session: Session, path: Path, station: Station = JKUAT) -> dict:
    rows = list(parse_geocsv(path, station.id, source="csv"))
    return ingest_observations(session, rows, source="csv", station=station)
