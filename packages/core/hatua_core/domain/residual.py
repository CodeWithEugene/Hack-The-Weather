from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class Residual:
    station_id: int
    valid_at: datetime
    conduit_mm: float
    model_mm: Optional[float]
    model_id: str
    delta_mm: Optional[float]
