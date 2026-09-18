from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, Optional

SHORTNAMES = (
    "hth",
    "bv",
    "bcs",
    "css",
    "rg",
    "rg2",
    "rgt",
    "rgt2",
    "rgp",
    "rgp2",
    "bt1",
    "bp1",
    "mt1",
    "st1",
    "sh1",
    "sv1",
    "si1",
    "su1",
    "ws",
    "wd",
    "wg",
    "wgd",
    "hi",
    "wbt",
    "wbgt",
)

CSV_TO_SHORT = {
    "Health": "hth",
    "Battery Voltage": "bv",
    "Battery charge status": "bcs",
    "Cell signal strength": "css",
    "Rain Gauge 1": "rg",
    "Rain Gauge 2": "rg2",
    "Rain Gauge 1 Total Today": "rgt",
    "Rain Gauge 2 Total Today": "rgt2",
    "Rain Gauge 1 Total Prior": "rgp",
    "Rain Gauge 2 Total Prior": "rgp2",
    "BMX Temperature 1": "bt1",
    "BMX Pressure 1": "bp1",
    "MCP Temperature 1": "mt1",
    "SHT Temperature": "st1",
    "SHT Humidity": "sh1",
    "SI1145 Visible 1": "sv1",
    "SI1145 Infrared 1": "si1",
    "SI1145 Ultraviolet 1": "su1",
    "Wind Speed": "ws",
    "Wind Direction": "wd",
    "Wind Gust": "wg",
    "Wind Gust Direction": "wgd",
    "Heat Index": "hi",
    "Wet Bulb Temperature": "wbt",
    "Wet Bulb Globe Temperature": "wbgt",
}

FORBIDDEN_CLIMATE = frozenset({"rg2", "wgd", "bv", "hth"})


@dataclass(frozen=True)
class Station:
    id: int
    site_id: int
    name: str
    lon: float
    lat: float
    elev_m: float
    timezone: str = "Africa/Nairobi"
    cadence_s: int = 61


JKUAT = Station(
    id=61,
    site_id=62,
    name="Kenya Kiambu JKUAT IOT AWS - Conduit@Empathy1",
    lon=37.014528,
    lat=-1.099736,
    elev_m=1523.0,
)

THIKA = Station(
    id=10,
    site_id=11,
    name="Kenya Kiambu KALRO Thika AWS",
    lon=37.070000,
    lat=-1.033300,
    elev_m=1548.0,
)

GARISSA = Station(
    id=15,
    site_id=16,
    name="Kenya Garissa Agricultural ASAL Station",
    lon=39.658300,
    lat=-0.453200,
    elev_m=147.0,
)

WAJIR = Station(
    id=22,
    site_id=23,
    name="Kenya Wajir Airport AWS",
    lon=40.091700,
    lat=1.747100,
    elev_m=235.0,
)

KENYA_3D_PAWS_STATIONS = [JKUAT, THIKA, GARISSA, WAJIR]


@dataclass
class Observation:
    station_id: int
    observed_at: datetime
    payload: dict[str, Any] = field(default_factory=dict)
    source: str = "csv"
    ingest_run_id: Optional[str] = None

    def get(self, short: str) -> Optional[float]:
        v = self.payload.get(short)
        if v is None or v == "":
            return None
        try:
            return float(v)
        except (TypeError, ValueError):
            return None
