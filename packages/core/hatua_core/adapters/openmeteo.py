from __future__ import annotations

import httpx
from hatua_core.domain.observation import JKUAT


def fetch_openmeteo_daily(
    lat: float = JKUAT.lat,
    lon: float = JKUAT.lon,
    start: str = "",
    end: str = "",
    timeout: float = 20.0,
) -> dict[str, float]:
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat,
        "longitude": lon,
        "daily": "precipitation_sum",
        "start_date": start,
        "end_date": end,
        "timezone": "Africa/Nairobi",
    }
    with httpx.Client(timeout=timeout) as client:
        res = client.get(url, params=params)
        res.raise_for_status()
        body = res.json()
    days = body.get("daily", {}).get("time", [])
    rain = body.get("daily", {}).get("precipitation_sum", [])
    return {d: float(v or 0) for d, v in zip(days, rain)}
