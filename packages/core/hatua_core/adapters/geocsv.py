from __future__ import annotations

import csv
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterator, Optional

from hatua_core.domain.observation import CSV_TO_SHORT, Observation


def _parse_time(raw: str) -> datetime:
    raw = raw.strip()
    if raw.endswith("Z"):
        raw = raw[:-1] + "+00:00"
    t = datetime.fromisoformat(raw)
    if t.tzinfo is None:
        t = t.replace(tzinfo=timezone.utc)
    return t.astimezone(timezone.utc)


def _num(value: str) -> Optional[float]:
    value = (value or "").strip()
    if value == "":
        return None
    try:
        return float(value)
    except ValueError:
        return None


def parse_geocsv(
    path: Path, station_id: int, source: str = "csv"
) -> Iterator[Observation]:
    with path.open(newline="", encoding="utf-8") as handle:
        # skip GeoCSV comment header
        pos = handle.tell()
        first = handle.readline()
        if not first.startswith("#"):
            handle.seek(pos)
        else:
            while True:
                pos = handle.tell()
                line = handle.readline()
                if not line.startswith("#"):
                    handle.seek(pos)
                    break
        reader = csv.DictReader(handle)
        for row in reader:
            observed_at = _parse_time(row["Time"])
            payload = {}
            for col, short in CSV_TO_SHORT.items():
                if col in row:
                    payload[short] = _num(row[col])
            yield Observation(
                station_id=station_id,
                observed_at=observed_at,
                payload=payload,
                source=source,
            )
