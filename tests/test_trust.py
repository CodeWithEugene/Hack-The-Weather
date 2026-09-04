from __future__ import annotations

from datetime import datetime, timedelta, timezone

from hatua_core.adapters.geocsv import parse_geocsv
from hatua_core.application.evaluate_trust import evaluate_trust
from hatua_core.domain.observation import JKUAT, Observation
from hatua_core.domain.trust import QCState
from hatua_core.policy import trust_policy


def _at(iso: str) -> datetime:
    return datetime.fromisoformat(iso.replace("Z", "+00:00"))


def test_cloned_gust_and_battery_on_first_row(csv_path):
    first = next(parse_geocsv(csv_path, JKUAT.id))
    verdict, _ = evaluate_trust(first, trust_policy(), QCState())
    assert "cloned_gust_dir" in verdict.flags
    assert "battery_unknown" in verdict.flags
    assert "rg2_stuck" not in verdict.flags
    assert verdict.status == "degrade"
    assert verdict.climate_eligible


def test_rg2_stuck_after_six_hours(csv_path):
    policy = trust_policy()
    state = QCState()
    stuck = None
    for obs in parse_geocsv(csv_path, JKUAT.id):
        verdict, state = evaluate_trust(obs, policy, state)
        if "rg2_stuck" in verdict.flags:
            stuck = (obs, verdict)
            break
    assert stuck is not None
    obs, verdict = stuck
    assert obs.observed_at >= _at("2026-08-28T06:00:25Z")
    assert obs.get("rg2") == 0
    assert verdict.status == "degrade"


def test_health_spike_is_garbage_not_weather(csv_path):
    policy = trust_policy()
    found = None
    for obs in parse_geocsv(csv_path, JKUAT.id):
        if obs.get("hth") == 33501705:
            found = obs
            break
    assert found is not None
    verdict, _ = evaluate_trust(found, policy, QCState())
    assert "health_garbage" in verdict.flags
    assert verdict.climate_eligible


def test_rain_tips_are_climate_eligible(csv_path):
    tips = [
        obs
        for obs in parse_geocsv(csv_path, JKUAT.id)
        if obs.get("rg") and obs.get("rg") > 0
    ]
    assert [o.observed_at for o in tips] == [
        _at("2026-08-31T00:13:44Z"),
        _at("2026-08-31T03:41:33Z"),
    ]
    policy = trust_policy()
    for obs in tips:
        verdict, _ = evaluate_trust(obs, policy, QCState())
        assert verdict.climate_eligible
        assert obs.get("rg") == 0.2


def test_implausible_physics_rejects_climate():
    obs = Observation(
        station_id=61,
        observed_at=datetime(2026, 8, 28, 12, tzinfo=timezone.utc),
        payload={"st1": 60.0, "sh1": 50.0, "rg": 0.0, "rg2": 0.0},
    )
    verdict, _ = evaluate_trust(obs, trust_policy(), QCState())
    assert verdict.status == "reject"
    assert "implausible_physics" in verdict.flags
    assert not verdict.climate_eligible


def test_thermometer_spread_degrades():
    obs = Observation(
        station_id=61,
        observed_at=datetime(2026, 8, 28, 12, tzinfo=timezone.utc),
        payload={"st1": 20.0, "bt1": 18.5, "mt1": 20.1, "sh1": 50.0, "hth": 0, "rg2": 1.0},
    )
    verdict, _ = evaluate_trust(obs, trust_policy(), QCState())
    assert "thermometer_spread" in verdict.flags
    assert verdict.status == "degrade"


def test_stuck_window_resets_on_nonzero_rg2():
    policy = trust_policy()
    state = QCState()
    t0 = datetime(2026, 8, 28, tzinfo=timezone.utc)
    zeros = Observation(61, t0, {"rg2": 0.0, "hth": 0, "sh1": 50})
    later = Observation(61, t0 + timedelta(hours=7), {"rg2": 0.2, "hth": 0, "sh1": 50})
    v1, state = evaluate_trust(zeros, policy, state)
    assert "rg2_stuck" not in v1.flags
    v2, state = evaluate_trust(later, policy, state)
    assert "rg2_stuck" not in v2.flags
    assert state.rg2_zero_since is None
