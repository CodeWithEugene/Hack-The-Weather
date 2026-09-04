from __future__ import annotations

from datetime import datetime, timezone
from typing import Protocol


class Clock(Protocol):
    def now(self) -> datetime: ...


class SystemClock:
    def now(self) -> datetime:
        return datetime.now(timezone.utc)


class VirtualClock:
    def __init__(self, t: datetime) -> None:
        if t.tzinfo is None:
            t = t.replace(tzinfo=timezone.utc)
        self._t = t

    def now(self) -> datetime:
        return self._t

    def set(self, t: datetime) -> None:
        if t.tzinfo is None:
            t = t.replace(tzinfo=timezone.utc)
        self._t = t
