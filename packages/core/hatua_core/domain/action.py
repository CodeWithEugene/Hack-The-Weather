from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Any, Optional
from uuid import UUID, uuid4


class ActionKind(str, Enum):
    HEAT_PROTECT = "HEAT_PROTECT"
    UV_PROTECT = "UV_PROTECT"
    HUMIDITY_VENTILATE = "HUMIDITY_VENTILATE"
    WATER_WAIT = "WATER_WAIT"
    RAIN_ONSET = "RAIN_ONSET"
    STATION_FAULT = "STATION_FAULT"


CAMPUS_KINDS = {ActionKind.HEAT_PROTECT, ActionKind.UV_PROTECT, ActionKind.RAIN_ONSET}
FARM_KINDS = {
    ActionKind.HUMIDITY_VENTILATE,
    ActionKind.WATER_WAIT,
    ActionKind.RAIN_ONSET,
}
SCIENCE_KINDS = {ActionKind.STATION_FAULT}

HEADLINES = {
    ActionKind.HEAT_PROTECT: "Shade and water for outdoor work",
    ActionKind.UV_PROTECT: "Peak ultraviolet — cover skin and limit exposure",
    ActionKind.HUMIDITY_VENTILATE: "Ventilate stored produce and greenhouses",
    ActionKind.WATER_WAIT: "Do not irrigate — demand is high, gauge 1 is dry",
    ActionKind.RAIN_ONSET: "Rain has started at gauge 1",
    ActionKind.STATION_FAULT: "Do not calibrate AquaTwin on this timestep",
}

WHO = {
    ActionKind.HEAT_PROTECT: "campus crew",
    ActionKind.UV_PROTECT: "campus crew",
    ActionKind.HUMIDITY_VENTILATE: "grower",
    ActionKind.WATER_WAIT: "grower",
    ActionKind.RAIN_ONSET: "campus crew / grower",
    ActionKind.STATION_FAULT: "science / AquaTwin",
}

PROTOCOLS = {
    ActionKind.HEAT_PROTECT: "JKUAT Estates OHS Protocol #14: Heat Stress Mitigation",
    ActionKind.UV_PROTECT: "JKUAT Athletics & Student Health UV Standard #03",
    ActionKind.HUMIDITY_VENTILATE: "Kiambu Horticultural Field Advisory #08: Nocturnal Moisture",
    ActionKind.WATER_WAIT: "KALRO Irrigation Efficiency Framework (FAO-56)",
    ActionKind.RAIN_ONSET: "Field Operations Rain Protocol #02: Activity Interruption",
    ActionKind.STATION_FAULT: "AquaTwin Ground-Truth Calibration Guard #01",
}

PERSONAS = {
    ActionKind.HEAT_PROTECT: "Estates Lead John Mwangi & Grounds Maintenance Crews",
    ActionKind.UV_PROTECT: "Sports Directorate & Outdoor Campus Personnel",
    ActionKind.HUMIDITY_VENTILATE: "Tomato & French Bean Growers (Juja / Thika)",
    ActionKind.WATER_WAIT: "Juja-Thika Horticultural Smallholders",
    ActionKind.RAIN_ONSET: "Grounds Foremen & Peri-Urban Farmers",
    ActionKind.STATION_FAULT: "JHUB / SPACE-SI Satellite Calibration Scientists",
}

DISPATCH = {
    ActionKind.HEAT_PROTECT: "SMS via Africa's Talking (+254 7XX XXX XXX)",
    ActionKind.UV_PROTECT: "Campus Broadcast & SMS (+254 7XX XXX XXX)",
    ActionKind.HUMIDITY_VENTILATE: "Agri-SMS Broadcast via Africa's Talking",
    ActionKind.WATER_WAIT: "USSD *384*61# On-Demand Advisory",
    ActionKind.RAIN_ONSET: "Priority Emergency SMS Broadcast",
    ActionKind.STATION_FAULT: "Web API Alert (/v1/stations/61/trust)",
}

CLIMATE_KINDS = {
    ActionKind.HEAT_PROTECT,
    ActionKind.UV_PROTECT,
    ActionKind.HUMIDITY_VENTILATE,
    ActionKind.WATER_WAIT,
    ActionKind.RAIN_ONSET,
}


@dataclass
class Action:
    station_id: int
    kind: ActionKind
    status: str
    valid_from: datetime
    valid_until: datetime
    policy_id: str = "actions_v1"
    trust_status: str = "degrade"
    explanation: dict[str, Any] = field(default_factory=dict)
    id: UUID = field(default_factory=uuid4)
    headline: Optional[str] = None

    def display_headline(self) -> str:
        return self.headline or HEADLINES[self.kind]
