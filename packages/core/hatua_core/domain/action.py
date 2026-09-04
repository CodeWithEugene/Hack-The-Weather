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
