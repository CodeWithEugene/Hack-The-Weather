from __future__ import annotations

from pathlib import Path
from typing import Any

import yaml

POLICY_DIR = Path(__file__).resolve().parent


def load_yaml(name: str) -> dict[str, Any]:
    path = POLICY_DIR / name
    with path.open() as f:
        data = yaml.safe_load(f)
    if not isinstance(data, dict):
        raise ValueError(f"policy {name} is not a mapping")
    return data


def trust_policy() -> dict[str, Any]:
    return load_yaml("trust_v1.yaml")


def action_policy() -> dict[str, Any]:
    return load_yaml("actions_v1.yaml")
