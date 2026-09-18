from __future__ import annotations

import importlib
import sys
from pathlib import Path

from fastapi.testclient import TestClient

from hatua_core.adapters.db import make_session_factory
from hatua_core.domain.observation import JKUAT


def _client(db_url: str) -> TestClient:
    api_dir = str(Path(__file__).resolve().parents[1] / "apps" / "api")
    if api_dir not in sys.path:
        sys.path.insert(0, api_dir)
    import main as api

    api.DATABASE_URL = db_url
    api.SessionLocal = make_session_factory(db_url)
    importlib.reload(api)
    api.DATABASE_URL = db_url
    api.SessionLocal = make_session_factory(db_url)
    return TestClient(api.app)


def test_health_and_now(db_url):
    client = _client(db_url)
    health = client.get("/health").json()
    assert health["api"] == "ok"
    assert health["observations"] >= 7060
    now = client.get(f"/v1/stations/{JKUAT.id}/now", params={"role": "science"}).json()
    assert now["station_id"] == 61
    assert now["trust"]["flags"]


def test_replay_endpoint_rain_onset(db_url):
    client = _client(db_url)
    res = client.post(
        "/v1/replay",
        json={"t": "2026-08-31T03:41:33Z", "station_id": JKUAT.id},
    )
    assert res.status_code == 200
    now = client.get(f"/v1/stations/{JKUAT.id}/now", params={"role": "campus"}).json()
    kinds = {a["kind"] for a in now["actions"]}
    assert "RAIN_ONSET" in kinds
    explained = client.get(
        f"/v1/stations/{JKUAT.id}/explain/{now['actions'][0]['id']}"
    )
    assert explained.status_code == 200
    assert "policy" in explained.json()["explanation"] or explained.json()["policy_id"]


def test_trust_and_residuals_series(db_url):
    client = _client(db_url)
    trust = client.get(f"/v1/stations/{JKUAT.id}/trust").json()["trust"]
    assert len(trust) > 10
    residuals = client.get(f"/v1/stations/{JKUAT.id}/residuals").json()["residuals"]
    assert residuals
    obs = client.get(f"/v1/stations/{JKUAT.id}/observations").json()["observations"]
    assert len(obs) < 7060


def test_africastalking_sms_and_ussd(db_url):
    client = _client(db_url)
    
    # 1. Status endpoint
    status_res = client.get("/v1/africastalking/status")
    assert status_res.status_code == 200
    assert "sms_incoming_callback_url" in status_res.json()["callback_urls"]
    assert "ussd_callback_url" in status_res.json()["callback_urls"]

    # 2. Inbound SMS endpoint
    sms_res = client.post(
        "/v1/africastalking/sms",
        data={"from": "+254712345678", "text": "Je kuna joto kali JKUAT?"},
    )
    assert sms_res.status_code == 200
    assert "<Response>" in sms_res.text
    assert "<Message>" in sms_res.text

    # 3. Interactive USSD endpoint
    # Menu 0
    ussd_init = client.post(
        "/v1/africastalking/ussd",
        data={"sessionId": "test_sess", "serviceCode": "*384*61#", "phoneNumber": "+254712345678", "text": ""},
    )
    assert ussd_init.status_code == 200
    assert ussd_init.text.startswith("CON Karibu Hatua JKUAT")

    # Option 1 (Now)
    ussd_opt1 = client.post(
        "/v1/africastalking/ussd",
        data={"sessionId": "test_sess", "serviceCode": "*384*61#", "phoneNumber": "+254712345678", "text": "1"},
    )
    assert ussd_opt1.status_code == 200
    assert ussd_opt1.text.startswith("END HATUA")
