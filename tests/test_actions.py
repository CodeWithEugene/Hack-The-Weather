from __future__ import annotations

from datetime import datetime, timedelta, timezone

from hatua_core.application.evaluate_trust import evaluate_trust
from hatua_core.application.issue_actions import climatology, issue_for_observation, rain_onset
from hatua_core.domain.action import ActionKind
from hatua_core.domain.observation import Observation
from hatua_core.domain.trust import QCState
from hatua_core.policy import action_policy, trust_policy


def _obs(minute: int, **payload) -> Observation:
    t = datetime(2026, 8, 28, 9, 0, tzinfo=timezone.utc) + timedelta(minutes=minute)
    base = {
        "hth": 0,
        "st1": 27.0,
        "bt1": 27.0,
        "mt1": 27.0,
        "sh1": 45.0,
        "wbgt": 21.5,
        "hi": 27.5,
        "su1": 5.0,
        "rg": 0.0,
        "rg2": 0.2,
        "sv1": 400,
        "ws": 1.0,
    }
    base.update(payload)
    return Observation(station_id=61, observed_at=t, payload=base)


def test_heat_hysteresis_collapses_sixty_minutes_to_few_actions():
    policy = action_policy()
    tpol = trust_policy()
    rows = [_obs(i) for i in range(60)]
    clima = climatology(rows, policy)
    state = QCState()
    issued = []
    for obs in rows:
        verdict, _ = evaluate_trust(obs, tpol, QCState())
        actions = issue_for_observation(obs, verdict, policy, state, clima, {"2026-08-28": 0.0})
        issued.extend([a for a in actions if a.kind == ActionKind.HEAT_PROTECT and a.status == "issued"])
    assert 1 <= len(issued) <= 2
    assert issued[0].explanation["policy"] == "actions_v1"
    assert issued[0].headline


def test_reject_suppresses_climate_kinds():
    obs = _obs(0, st1=60.0, bt1=60.0, mt1=60.0)
    verdict, _ = evaluate_trust(obs, trust_policy(), QCState())
    assert not verdict.climate_eligible
    actions = issue_for_observation(
        obs, verdict, action_policy(), QCState(), {"wbgt_p90": 20, "uv_p90": 2}, {}
    )
    climate = [a for a in actions if a.kind != ActionKind.STATION_FAULT]
    assert climate
    assert all(a.status == "suppressed" for a in climate)


def test_rain_onset_fires_after_gap():
    policy = action_policy()
    tpol = trust_policy()
    dry = _obs(0, rg=0.0, su1=0, hi=12)
    tip = Observation(
        station_id=61,
        observed_at=dry.observed_at + timedelta(hours=4),
        payload={**dry.payload, "rg": 0.2},
    )
    v_dry, _ = evaluate_trust(dry, tpol, QCState())
    v_tip, _ = evaluate_trust(tip, tpol, QCState())
    state = QCState()
    assert rain_onset(dry, v_dry, policy, None, state) is None
    onset = rain_onset(tip, v_tip, policy, None, state)
    assert onset is not None
    assert onset.kind == ActionKind.RAIN_ONSET
    second = Observation(
        station_id=61,
        observed_at=tip.observed_at + timedelta(hours=1),
        payload={**tip.payload, "rg": 0.2},
    )
    v2, _ = evaluate_trust(second, tpol, QCState())
    assert rain_onset(second, v2, policy, tip.observed_at, state) is None
