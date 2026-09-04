from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any, Optional

from hatua_core.domain.observation import Observation
from hatua_core.domain.trust import QCState, TrustVerdict


def _spread(obs: Observation) -> Optional[float]:
    st1, bt1, mt1 = obs.get("st1"), obs.get("bt1"), obs.get("mt1")
    vals = [v for v in (st1, bt1, mt1) if v is not None]
    if len(vals) < 2:
        return None
    return max(vals) - min(vals)


def evaluate_trust(
    obs: Observation, policy: dict[str, Any], state: QCState
) -> tuple[TrustVerdict, QCState]:
    flags: list[str] = []
    details: dict[str, Any] = {}
    reject = False

    rg2 = obs.get("rg2")
    if rg2 is None or rg2 == 0:
        if state.rg2_zero_since is None:
            state.rg2_zero_since = obs.observed_at
        stuck_h = float(policy.get("stuck_hours", 6))
        if obs.observed_at - state.rg2_zero_since >= timedelta(hours=stuck_h):
            flags.append("rg2_stuck")
            details["rg2_zero_since"] = state.rg2_zero_since.isoformat()
    else:
        state.rg2_zero_since = None

    wg, wgd = obs.get("wg"), obs.get("wgd")
    if wg is not None and wgd is not None and wg == wgd:
        flags.append("cloned_gust_dir")
        details["wg"] = wg
        details["wgd"] = wgd

    if obs.get("bv") is None:
        flags.append("battery_unknown")

    hth = obs.get("hth")
    allowed = set(policy.get("health_allowed", [0, 1, 2, 3]))
    health_max = float(policy.get("health_max", 100))
    if hth is None or hth not in allowed or hth > health_max:
        flags.append("health_garbage")
        details["hth"] = hth

    spread = _spread(obs)
    limit = float(policy.get("thermometer_spread_c", 1.0))
    if spread is not None:
        details["thermometer_spread_c"] = round(spread, 3)
        if spread > limit:
            flags.append("thermometer_spread")

    t_vals = [obs.get(k) for k in ("st1", "bt1", "mt1")]
    t_vals = [v for v in t_vals if v is not None]
    t_min = float(policy.get("t_min_c", -5))
    t_max = float(policy.get("t_max_c", 45))
    if any(v < t_min or v > t_max for v in t_vals):
        flags.append("implausible_physics")
        reject = True
    sh1 = obs.get("sh1")
    if sh1 is not None and (sh1 < 0 or sh1 > 100):
        flags.append("implausible_physics")
        reject = True
    rg = obs.get("rg")
    if rg is not None and rg > float(policy.get("rain_tip_max_mm", 20)):
        flags.append("implausible_physics")
        reject = True

    if rg is not None and rg > 0:
        state.last_rain_at = obs.observed_at

    penalties = policy.get("score_penalties", {})
    score = 1.0
    for flag in flags:
        score -= float(penalties.get(flag, 0.1))
    score = max(0.0, min(1.0, score))

    if reject:
        status = "reject"
    elif flags:
        status = "degrade"
    else:
        status = "accept"

    verdict = TrustVerdict(
        station_id=obs.station_id,
        observed_at=obs.observed_at,
        status=status,
        score=round(score, 3),
        flags=list(dict.fromkeys(flags)),
        policy_id=str(policy.get("id", "trust_v1")),
        details=details,
    )
    return verdict, state
