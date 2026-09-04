from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, Literal, Optional

TrustStatus = Literal["accept", "degrade", "reject"]


@dataclass
class TrustVerdict:
    station_id: int
    observed_at: datetime
    status: TrustStatus
    score: float
    flags: list[str] = field(default_factory=list)
    policy_id: str = "trust_v1"
    details: dict[str, Any] = field(default_factory=dict)

    @property
    def climate_eligible(self) -> bool:
        return self.status in ("accept", "degrade")


@dataclass
class QCState:
    """Rolling per-station QC. Lives in the worker, not the HTTP path."""

    rg2_zero_since: Optional[datetime] = None
    last_rain_at: Optional[datetime] = None
    last_action_at: dict[str, datetime] = field(default_factory=dict)
    humidity_streak_start: Optional[datetime] = None
    humidity_streak_eat_ok: bool = False
    rg2_stuck_emitted: bool = False
    clone_emitted: bool = False
    battery_emitted: bool = False
    daily_water_days: set[str] = field(default_factory=set)
