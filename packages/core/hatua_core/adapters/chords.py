from __future__ import annotations

from typing import Any, Optional

import httpx

from hatua_core.domain.observation import JKUAT, Observation, SHORTNAMES
from hatua_core.adapters.geocsv import _parse_time


class CircuitBreaker:
    def __init__(self, fail_max: int = 3) -> None:
        self.fail_max = fail_max
        self.failures = 0
        self.open = False

    def record_ok(self) -> None:
        self.failures = 0
        self.open = False

    def record_fail(self) -> None:
        self.failures += 1
        if self.failures >= self.fail_max:
            self.open = True


def fetch_last(
    email: Optional[str],
    api_key: Optional[str],
    instrument_id: int = JKUAT.id,
    breaker: Optional[CircuitBreaker] = None,
    timeout: float = 20.0,
) -> Observation:
    if breaker and breaker.open:
        raise RuntimeError("chords_circuit_open")
    url = f"https://3d-fewsnet.icdp.ucar.edu/api/v1/data/{instrument_id}.geojson"
    params: dict[str, Any] = {"last": ""}
    if email and api_key:
        params["email"] = email
        params["api_key"] = api_key
    try:
        with httpx.Client(timeout=timeout) as client:
            res = client.get(url, params=params)
            res.raise_for_status()
            body = res.json()
        if breaker:
            breaker.record_ok()
    except Exception:
        if breaker:
            breaker.record_fail()
        raise
    feat = body["features"][0]
    props = feat["properties"]
    data = props["data"][0]
    t = _parse_time(str(data["time"]).replace(" ", "T"))
    measurements = data.get("measurements") or {}
    payload = {k: measurements.get(k) for k in SHORTNAMES if k in measurements}
    return Observation(
        station_id=instrument_id,
        observed_at=t,
        payload=payload,
        source="chords",
    )
