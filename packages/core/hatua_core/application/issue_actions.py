from __future__ import annotations

from datetime import datetime, timedelta
from statistics import quantiles
from typing import Any, Optional
from zoneinfo import ZoneInfo

from hatua_core.domain.action import (
    CLIMATE_KINDS,
    HEADLINES,
    Action,
    ActionKind,
)
from hatua_core.domain.observation import Observation
from hatua_core.domain.trust import QCState, TrustVerdict

EAT = ZoneInfo("Africa/Nairobi")


def eat_hour(t: datetime) -> int:
    return t.astimezone(EAT).hour


def eat_date(t: datetime) -> str:
    return t.astimezone(EAT).date().isoformat()


def _median_temps(obs: Observation) -> Optional[float]:
    vals = [v for v in (obs.get("st1"), obs.get("bt1"), obs.get("mt1")) if v is not None]
    if not vals:
        return None
    vals = sorted(vals)
    mid = len(vals) // 2
    if len(vals) % 2:
        return vals[mid]
    return (vals[mid - 1] + vals[mid]) / 2


def et0_proxy(obs: Observation) -> float:
    t = _median_temps(obs) or 0.0
    rh = obs.get("sh1") if obs.get("sh1") is not None else 50.0
    ws = obs.get("ws") if obs.get("ws") is not None else 0.0
    vis = obs.get("sv1") if obs.get("sv1") is not None else 300.0
    return max(0.0, (t - 10.0) * (100.0 - rh) / 100.0 * (1.0 + ws) * (vis / 400.0))


def climatology(observations: list[Observation], policy: dict[str, Any]) -> dict[str, float]:
    heat_hours = set(policy.get("heat_hours_eat", [12, 13, 14, 15, 16]))
    wbgt_pm = []
    uv_day = []
    for obs in observations:
        h = eat_hour(obs.observed_at)
        wbgt = obs.get("wbgt")
        if wbgt is not None and h in heat_hours:
            wbgt_pm.append(wbgt)
        su1 = obs.get("su1")
        if su1 is not None and su1 > 0:
            uv_day.append(su1)
    def p90(xs: list[float], fallback: float) -> float:
        if len(xs) < 10:
            return fallback
        return float(quantiles(xs, n=10)[-1])

    return {
        "wbgt_p90": p90(wbgt_pm, 20.0),
        "uv_p90": p90(uv_day, 2.5),
    }


def _due(state: QCState, kind: ActionKind, at: datetime, hysteresis_min: int) -> bool:
    last = state.last_action_at.get(kind.value)
    if last is None:
        return True
    return at - last >= timedelta(minutes=hysteresis_min)


def _issue(
    obs: Observation,
    verdict: TrustVerdict,
    kind: ActionKind,
    policy: dict[str, Any],
    extra: dict[str, Any],
    state: QCState,
) -> Action:
    ttl = int(policy.get("action_ttl_min", 90))
    if kind == ActionKind.STATION_FAULT:
        components = extra.get("components") or []
        only_health = bool(components) and all(
            c.get("flag") == "health_garbage" for c in components
        )
        if not only_health:
            ttl = int(policy.get("fault_ttl_h", 24)) * 60
    state.last_action_at[kind.value] = obs.observed_at
    return Action(
        station_id=obs.station_id,
        kind=kind,
        status="issued",
        valid_from=obs.observed_at,
        valid_until=obs.observed_at + timedelta(minutes=ttl),
        policy_id=str(policy.get("id", "actions_v1")),
        trust_status=verdict.status,
        headline=HEADLINES[kind],
        explanation={
            "policy": str(policy.get("id", "actions_v1")),
            "trust_flags": verdict.flags,
            **extra,
        },
    )


def _suppress(
    obs: Observation, verdict: TrustVerdict, kind: ActionKind, policy: dict[str, Any], reason: str
) -> Action:
    return Action(
        station_id=obs.station_id,
        kind=kind,
        status="suppressed",
        valid_from=obs.observed_at,
        valid_until=obs.observed_at + timedelta(minutes=1),
        policy_id=str(policy.get("id", "actions_v1")),
        trust_status=verdict.status,
        headline=HEADLINES[kind],
        explanation={"reason": reason, "trust_flags": verdict.flags},
    )


def issue_for_observation(
    obs: Observation,
    verdict: TrustVerdict,
    policy: dict[str, Any],
    state: QCState,
    clima: dict[str, float],
    daily_rgt: dict[str, float],
) -> list[Action]:
    out: list[Action] = []
    hyst = int(policy.get("hysteresis_min", 45))
    hour = eat_hour(obs.observed_at)
    heat_hours = set(policy.get("heat_hours_eat", [12, 13, 14, 15, 16]))
    humid_hours = set(policy.get("humidity_hours_eat", [21, 22, 23, 0, 1, 2, 3, 4, 5, 6]))

    components: list[dict[str, Any]] = []
    headlines: list[str] = []
    if "rg2_stuck" in verdict.flags and not state.rg2_stuck_emitted:
        components.append({"component": "rg2", "flag": "rg2_stuck"})
        headlines.append("Rain gauge 2 is stuck at 0 — do not average rainfall")
        state.rg2_stuck_emitted = True
    if "cloned_gust_dir" in verdict.flags and not state.clone_emitted:
        components.append({"component": "wgd", "flag": "cloned_gust_dir"})
        headlines.append("Gust direction is a copy of gust speed — drop wgd")
        state.clone_emitted = True
    if "battery_unknown" in verdict.flags and not state.battery_emitted:
        components.append({"component": "bv", "flag": "battery_unknown"})
        headlines.append("Battery voltage is missing — station health unknown")
        state.battery_emitted = True
    if "health_garbage" in verdict.flags and (
        components or _due(state, ActionKind.STATION_FAULT, obs.observed_at, hyst)
    ):
        components.append(
            {"component": "hth", "flag": "health_garbage", "hth": obs.get("hth")}
        )
        headlines.append("Health flag is not a weather event — discard for calibration")
    if components:
        a = _issue(
            obs,
            verdict,
            ActionKind.STATION_FAULT,
            policy,
            {"components": components, "flag": components[0]["flag"]},
            state,
        )
        a.headline = headlines[0] if len(headlines) == 1 else "Station faults — do not calibrate"
        out.append(a)

    if not verdict.climate_eligible:
        for kind in CLIMATE_KINDS:
            if _due(state, kind, obs.observed_at, hyst):
                out.append(_suppress(obs, verdict, kind, policy, "trust_reject"))
        return out

    wbgt, hi, su1 = obs.get("wbgt"), obs.get("hi"), obs.get("su1")
    heat_hi = float(policy.get("heat_index_floor", 26))
    heat_ok = hour in heat_hours and (
        (wbgt is not None and wbgt >= clima["wbgt_p90"])
        or (hi is not None and hi >= heat_hi and su1 is not None and su1 > 0)
    )
    if heat_ok and _due(state, ActionKind.HEAT_PROTECT, obs.observed_at, hyst):
        out.append(
            _issue(
                obs,
                verdict,
                ActionKind.HEAT_PROTECT,
                policy,
                {"wbgt": wbgt, "hi": hi, "su1": su1, "wbgt_p90": clima["wbgt_p90"]},
                state,
            )
        )

    if (
        su1 is not None
        and su1 >= clima["uv_p90"]
        and su1 > 0
        and 7 <= hour <= 18
        and _due(state, ActionKind.UV_PROTECT, obs.observed_at, hyst)
    ):
        out.append(
            _issue(
                obs,
                verdict,
                ActionKind.UV_PROTECT,
                policy,
                {"su1": su1, "uv_p90": clima["uv_p90"]},
                state,
            )
        )

    rh = obs.get("sh1")
    rh_lim = float(policy.get("humidity_rh", 90))
    need_min = int(policy.get("humidity_minutes", 60))
    if hour in humid_hours and rh is not None and rh >= rh_lim:
        if state.humidity_streak_start is None:
            state.humidity_streak_start = obs.observed_at
        dur = (obs.observed_at - state.humidity_streak_start).total_seconds() / 60.0
        if dur >= need_min and _due(state, ActionKind.HUMIDITY_VENTILATE, obs.observed_at, hyst):
            out.append(
                _issue(
                    obs,
                    verdict,
                    ActionKind.HUMIDITY_VENTILATE,
                    policy,
                    {"sh1": rh, "streak_min": round(dur, 1)},
                    state,
                )
            )
    else:
        state.humidity_streak_start = None

    day = eat_date(obs.observed_at)
    rain_cap = float(policy.get("water_rain_mm", 1.0))
    proxy = et0_proxy(obs)
    if (
        hour in heat_hours
        and daily_rgt.get(day, 0.0) < rain_cap
        and proxy >= float(policy.get("et0_proxy_floor", 0.35))
        and day not in state.daily_water_days
        and _due(state, ActionKind.WATER_WAIT, obs.observed_at, hyst)
    ):
        out.append(
            _issue(
                obs,
                verdict,
                ActionKind.WATER_WAIT,
                policy,
                {
                    "eat_date": day,
                    "gauge1_mm": daily_rgt.get(day, 0.0),
                    "et0_proxy": round(proxy, 3),
                    "note": "ET0 proxy from T, RH, wind, SI1145 — not soil moisture",
                },
                state,
            )
        )
        state.daily_water_days.add(day)

    return out


def rain_onset(
    obs: Observation,
    verdict: TrustVerdict,
    policy: dict[str, Any],
    last_rain_before: Optional[datetime],
    state: QCState,
) -> Optional[Action]:
    if not verdict.climate_eligible:
        return None
    rg = obs.get("rg")
    if rg is None or rg <= 0:
        return None
    gap_h = float(policy.get("rain_gap_hours", 6))
    hyst = int(policy.get("hysteresis_min", 45))
    if last_rain_before is not None:
        if obs.observed_at - last_rain_before < timedelta(hours=gap_h):
            return None
    if not _due(state, ActionKind.RAIN_ONSET, obs.observed_at, hyst):
        return None
    return _issue(
        obs,
        verdict,
        ActionKind.RAIN_ONSET,
        policy,
        {"rg": rg, "gap_hours": gap_h},
        state,
    )
