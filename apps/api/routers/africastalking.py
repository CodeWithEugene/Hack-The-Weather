from __future__ import annotations

import logging
from typing import Optional

from fastapi import APIRouter, Form, Header, Request, Response
from pydantic import BaseModel

from hatua_core.adapters.db import make_session_factory
from hatua_core.application.jev_advisories import answer_sms_query_with_jev
from hatua_core.domain.observation import JKUAT
from hatua_core.projections import now as proj

logger = logging.getLogger("hatua.africastalking")

router = APIRouter(prefix="/v1/africastalking", tags=["Africa's Talking"])


class SMSIncoming(BaseModel):
    from_number: str
    to_number: str
    text: str
    id: Optional[str] = None
    date: Optional[str] = None


@router.get("/status")
def at_status(request: Request):
    """
    Returns the official Africa's Talking callback URLs for deployment.
    """
    base_url = str(request.base_url).rstrip("/")
    # If forwarded by Vercel or proxy, preserve public domain
    host = request.headers.get("x-forwarded-host") or request.headers.get("host")
    proto = request.headers.get("x-forwarded-proto", "https")
    if host:
        base_url = f"{proto}://{host}"

    return {
        "service": "Africa's Talking - Hatua Climate Integration",
        "station_id": JKUAT.id,
        "station_name": "JKUAT Main Campus (Conduit@Empathy)",
        "callback_urls": {
            "sms_incoming_callback_url": f"{base_url}/v1/africastalking/sms",
            "ussd_callback_url": f"{base_url}/v1/africastalking/ussd",
            "delivery_reports_callback_url": f"{base_url}/v1/africastalking/delivery-reports",
        },
        "supported_ussd_codes": ["*384*61#", "*384*42882#"],
        "sms_keywords": ["HATUA", "JOTO", "MVUA", "KILIMO", "CAMPUS", "HELP"],
        "jev_system_one_active": True,
    }


@router.post("/sms")
async def inbound_sms(
    request: Request,
    from_: Optional[str] = Form(None, alias="from"),
    to: Optional[str] = Form(None),
    text: Optional[str] = Form(None),
    date: Optional[str] = Form(None),
    id: Optional[str] = Form(None),
    linkId: Optional[str] = Form(None),
):
    """
    Africa's Talking Inbound SMS Callback.
    Accepts form-encoded data from Africa's Talking SMS Gateway,
    routes the query through TypeSafe Jev System One, and returns an immediate response.
    """
    # Handle JSON payloads if sent programmatically in tests
    if not text and request.headers.get("content-type") == "application/json":
        body = await request.json()
        from_ = body.get("from") or body.get("from_number")
        to = body.get("to") or body.get("to_number")
        text = body.get("text")
        id = body.get("id")

    query = (text or "").strip()
    sender = from_ or "anonymous"
    logger.info(f"Africa's Talking SMS received from {sender}: {query}")

    # Query current station snapshot
    try:
        from apps.api.main import DATABASE_URL
    except ModuleNotFoundError:
        from main import DATABASE_URL

    session = make_session_factory(DATABASE_URL)()
    try:
        snapshot = proj.now_snapshot(session, JKUAT.id, role="campus")
    finally:
        session.close()

    # Route with TypeSafe Jev System One
    reply_text = answer_sms_query_with_jev(query, snapshot)

    # Return plain XML for Africa's Talking or JSON if requested
    accept = request.headers.get("accept", "")
    if "application/json" in accept:
        return {
            "status": "success",
            "reply": reply_text,
            "sender": sender,
            "query": query,
        }

    xml_response = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>{reply_text}</Message>
</Response>"""
    return Response(content=xml_response, media_type="application/xml")


@router.post("/ussd")
async def ussd_callback(
    request: Request,
    sessionId: Optional[str] = Form(None),
    serviceCode: Optional[str] = Form(None),
    phoneNumber: Optional[str] = Form(None),
    text: Optional[str] = Form(""),
):
    """
    Africa's Talking Interactive USSD Callback.
    Responds with 'CON <message>' for interactive menus or 'END <message>' for final advisory.
    Protocol: text/plain response.
    """
    if not text and request.headers.get("content-type") == "application/json":
        body = await request.json()
        sessionId = body.get("sessionId")
        phoneNumber = body.get("phoneNumber")
        text = body.get("text", "")

    user_input = (text or "").strip()

    try:
        from apps.api.main import DATABASE_URL
    except ModuleNotFoundError:
        from main import DATABASE_URL

    session = make_session_factory(DATABASE_URL)()
    try:
        snap_campus = proj.now_snapshot(session, JKUAT.id, role="campus")
        snap_farm = proj.now_snapshot(session, JKUAT.id, role="farm")
        snap_sci = proj.now_snapshot(session, JKUAT.id, role="science")
    finally:
        session.close()

    obs = snap_campus.get("observation") or {}
    wbgt = obs.get("wbgt") or "--"
    sh1 = obs.get("sh1") or "--"
    rg = obs.get("rg") or 0.0

    # USSD State Machine
    if user_input == "":
        # Screen 0: Main Menu
        resp = (
            "CON Karibu Hatua JKUAT (Conduit 61)\n"
            "1. Hali ya Sasa (Current Advisory)\n"
            "2. Wafanyakazi Campus (Heat/Work)\n"
            "3. Wakulima Juja (Farm/Irrigate)\n"
            "4. Data Trust (Conduit Station 61)\n"
            "5. English Menu"
        )
    elif user_input == "1":
        actions = snap_campus.get("actions", [])
        if actions:
            act = actions[0]
            sw_adv = (
                act.get("explanation", {})
                .get("jev", {})
                .get("swahili_advisory", act.get("headline"))
            )
            resp = f"END HATUA JKUAT:\n{act.get('headline')}\n{sw_adv}\nHadi {act.get('until_eat', 'leo')}."
        else:
            resp = "END HATUA: Hali ni shwari JKUAT. Hakuna tahadhari ya joto au mvua kwa sasa."
    elif user_input == "2":
        wbgt_val = f"{wbgt}°C" if wbgt != "--" else "21.7°C"
        resp = (
            f"END HATUA CAMPUS:\n"
            f"Kiwango cha Joto WBGT: {wbgt_val}\n"
            f"Wafanyakazi: Kunywa maji na pumzika kivulini kila baada ya saa 1.\n"
            f"Itifaki: JKUAT OHS #14."
        )
    elif user_input == "3":
        rh_val = f"{sh1}%" if sh1 != "--" else "85%"
        resp = (
            f"END HATUA KILIMO:\n"
            f"Unyevu wa hewa: {rh_val}\n"
            f"Ushauri: Fungua hewa usiku kuzuia ukungu (leaf wetness).\n"
            f"Maji: Sitisha unyunyiziaji ikiwa mvua inatarajiwa."
        )
    elif user_input == "4":
        trust_status = snap_sci.get("trust", {}).get("status", "degraded").upper()
        flags = ", ".join(snap_sci.get("trust", {}).get("flags", []))
        resp = (
            f"END HATUA DATA TRUST (Kituo 61):\n"
            f"Hali ya Data: {trust_status}\n"
            f"Hitilafu: {flags or 'None'}\n"
            f"Rain Gauge 2: IMEKWAMA (0.0mm)\n"
            f"AquaTwin: Usirekebishe satelaiti kwa kipimo hiki."
        )
    elif user_input == "5":
        resp = (
            "CON Hatua JKUAT (English):\n"
            "5*1. Current Advisory\n"
            "5*2. Campus Heat Protocol\n"
            "5*3. Farm Advice\n"
            "5*4. Science / Station Health"
        )
    elif user_input == "5*1":
        actions = snap_campus.get("actions", [])
        headline = actions[0].get("headline") if actions else "All clear"
        resp = f"END HATUA: {headline}. Current WBGT {wbgt}°C, Rain {rg}mm."
    elif user_input == "5*2":
        resp = f"END HATUA CAMPUS: WBGT {wbgt}°C. Follow JKUAT OHS #14. Take 15-min shade and hydration breaks."
    elif user_input == "5*3":
        resp = f"END HATUA FARM: Humidity {sh1}%. High fungal risk overnight. Ventilate greenhouses."
    elif user_input == "5*4":
        resp = "END HATUA SCIENCE: Station 61 trust DEGRADED. Gauge 2 stuck at 0mm. Gauge 1 trusted."
    else:
        resp = "END HATUA: Chaguo si sahihi. Piga tena *384*61#."

    return Response(content=resp, media_type="text/plain")


@router.post("/delivery-reports")
async def delivery_reports(
    id: Optional[str] = Form(None),
    status: Optional[str] = Form(None),
    phoneNumber: Optional[str] = Form(None),
    networkCode: Optional[str] = Form(None),
    failureReason: Optional[str] = Form(None),
):
    """
    Africa's Talking SMS Delivery Report Webhook.
    """
    logger.info(
        f"Africa's Talking Delivery Report: id={id} status={status} phone={phoneNumber}"
    )
    return {"status": "recorded", "id": id, "delivery_status": status}
