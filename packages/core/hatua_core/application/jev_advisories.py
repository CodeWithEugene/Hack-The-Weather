from __future__ import annotations

import json
import logging
import os
from typing import Any, Optional

logger = logging.getLogger("hatua.jev")

SWAHILI_TEXTS = {
    "sw_joto_na_kivuli": "Tahadhari ya joto: Wafanyakazi watafute kivuli na wanywe maji mara kwa mara.",
    "sw_mionzi_ya_jua": "Mionzi mikali ya jua (UV): Vaa kofia na mavazi ya kukinga ngozi.",
    "sw_hali_shwari": "Hali ya kawaida: Shughuli za nje zinaweza kuendelea bila masharti.",
    "sw_unyevu_usiku": "Unyevu mwingi usiku: Weka hewa safi ghala na vitaluni kuzuia magonjwa ya mimea.",
    "sw_mvua_imeanza": "Mvua imeanza kituo cha JKUAT. Sitisha unyunyiziaji maji shambani.",
    "sw_hitilafu_ya_mashine": "Kipimo cha hali ya hewa kina hitilafu ya kihisi. Usitegemee data kwa urekebishaji.",
}


def get_jev_contextual_advisory(
    obs_data: dict[str, Any], kind: str
) -> Optional[dict[str, Any]]:
    """
    Calls TypeSafe Jev System One (jev-latest) to generate calibrated, typed
    contextual judgments and bilingual advisories over raw station telemetry.
    Gracefully falls back to deterministic rules if offline or key is missing.
    """
    api_key = os.environ.get("TYPESAFE_API_KEY")
    if not api_key:
        return None

    try:
        from typesafe_sdk import Choice, Noul, Score, TypeSafeClient

        client = TypeSafeClient()

        state = {
            "station_id": obs_data.get("station_id", 61),
            "observed_at": str(obs_data.get("observed_at", "")),
            "temperature_c": obs_data.get("bt1") or obs_data.get("st1"),
            "wbgt_c": obs_data.get("wbgt"),
            "heat_index_c": obs_data.get("hi"),
            "uv_index_su1": obs_data.get("su1"),
            "relative_humidity_pct": obs_data.get("sh1"),
            "wind_speed_ms": obs_data.get("ws"),
            "rain_gauge_1_mm": obs_data.get("rg"),
            "preliminary_action": kind,
        }

        questions = {
            "dominant_regime": Choice(
                instructions="Classify the dominant environmental risk regime for outdoor personnel and horticulture at JKUAT.",
                criteria={
                    "extreme_heat_priority": "Thermal heat stress (WBGT / Heat Index) is the primary physical hazard requiring rest/shade",
                    "uv_radiation_priority": "Solar ultraviolet radiation is the dominant physiological risk requiring protective wear",
                    "compounding_heat_and_uv": "Compounding hazard where elevated temperature and direct UV both present acute exposure",
                    "nocturnal_humidity_stress": "Elevated humidity during dark hours presenting high crop fungal risk",
                    "rain_interruption": "Active precipitation directly interrupting field and construction operations",
                    "low_risk_baseline": "Atmospheric conditions remain within normal operational safety tolerances",
                },
            ),
            "swahili_advisory": Choice(
                instructions="Select the most accurate, culturally appropriate Kiswahili advisory for ground personnel.",
                criteria={
                    "sw_joto_na_kivuli": SWAHILI_TEXTS["sw_joto_na_kivuli"],
                    "sw_mionzi_ya_jua": SWAHILI_TEXTS["sw_mionzi_ya_jua"],
                    "sw_hali_shwari": SWAHILI_TEXTS["sw_hali_shwari"],
                    "sw_unyevu_usiku": SWAHILI_TEXTS["sw_unyevu_usiku"],
                    "sw_mvua_imeanza": SWAHILI_TEXTS["sw_mvua_imeanza"],
                    "sw_hitilafu_ya_mashine": SWAHILI_TEXTS["sw_hitilafu_ya_mashine"],
                },
            ),
            "work_safety_score": Score(
                instructions="Score the outdoor labor safety level under these atmospheric conditions.",
                criteria=[
                    "hazardous",
                    "caution_required",
                    "moderate_precautions",
                    "unrestricted",
                ],
            ),
            "requires_sms_dispatch": Noul(
                instructions="Does this condition warrant triggering an immediate SMS broadcast to field personnel?"
            ),
        }

        res = client.system_one(json.dumps(state), questions)
        sw_choice = res.choices["swahili_advisory"].choice
        sw_text = SWAHILI_TEXTS.get(sw_choice, SWAHILI_TEXTS["sw_hali_shwari"])

        return {
            "dominant_regime": res.choices["dominant_regime"].choice,
            "regime_confidence": round(res.choices["dominant_regime"].confidence, 2),
            "swahili_advisory": sw_text,
            "swahili_key": sw_choice,
            "work_safety_score": round(res.scores["work_safety_score"].score, 2),
            "work_safety_confidence": round(
                res.scores["work_safety_score"].confidence, 2
            ),
            "sms_dispatch_noul": round(res.nouls["requires_sms_dispatch"].noul, 2),
            "model": "jev-latest",
        }
    except Exception as exc:
        logger.warning(f"TypeSafe Jev advisory generation skipped: {exc}")
        return None


def answer_sms_query_with_jev(
    user_query: str, current_context: dict[str, Any]
) -> str:
    """
    Interprets an inbound SMS or USSD natural language query from a field worker
    or farmer, routing it with Jev System One to produce an immediate 160-char SMS response.
    """
    api_key = os.environ.get("TYPESAFE_API_KEY")
    if not api_key:
        # Fallback to current headline
        actions = current_context.get("actions", [])
        if actions:
            return f"HATUA: {actions[0].get('headline', 'Hali ya kawaida JKUAT.')} As of {current_context.get('as_of_eat', 'leo')}."
        return "HATUA JKUAT: Hali ya hewa ni shwari. Hakuna tahadhari ya joto au mvua kwa sasa."

    try:
        from typesafe_sdk import Choice, TypeSafeClient

        client = TypeSafeClient()

        state = {
            "incoming_sms": user_query,
            "current_actions": [a.get("kind") for a in current_context.get("actions", [])],
            "headlines": [a.get("headline") for a in current_context.get("actions", [])],
            "wbgt": current_context.get("observation", {}).get("wbgt"),
            "temperature": current_context.get("observation", {}).get("st1"),
            "rain_mm": current_context.get("observation", {}).get("rg", 0.0),
            "trust_status": current_context.get("trust", {}).get("status", "accept"),
        }

        questions = {
            "user_intent": Choice(
                instructions="Classify the user's inquiry intent.",
                criteria={
                    "campus_work_or_heat": "Asking about outdoor work safety, heat, shade, or sports on campus",
                    "farm_irrigation_or_disease": "Asking about irrigation timing, spraying, humidity, or crop protection",
                    "rain_or_weather_status": "Asking if it will rain or current general weather",
                    "station_trust_or_science": "Asking if Conduit station data is reliable",
                },
            ),
            "language": Choice(
                instructions="What language is the inquiry in?",
                criteria={"swahili": None, "english": None},
            ),
        }

        res = client.system_one(json.dumps(state), questions)
        intent = res.choices["user_intent"].choice
        lang = res.choices["language"].choice

        # Deterministic message construction based on Jev typed intent
        actions = current_context.get("actions", [])
        top_action = actions[0] if actions else None

        if lang == "swahili":
            if intent == "campus_work_or_heat":
                if any("HEAT" in a.get("kind", "") for a in actions):
                    return "HATUA: Joto kali JKUAT (WBGT juu). Pumzikeni kivulini na kunywa maji sasa hadi 16:30 EAT."
                return "HATUA: Hali ya joto ni shwari JKUAT. Shughuli za nje zinaweza kuendelea."
            elif intent == "farm_irrigation_or_disease":
                if any("HUMIDITY" in a.get("kind", "") for a in actions):
                    return "HATUA KILIMO: Unyevu mwingi usiku (85%+). Weka hewa safi greenhouse kuzuia ukungu wa majani."
                return "HATUA KILIMO: Hakuna haja ya unyunyiziaji wa dharura leo. Angalia hali ya unyevu jioni."
            elif intent == "rain_or_weather_status":
                if any("RAIN" in a.get("kind", "") for a in actions):
                    return "HATUA: Mvua imeanza kituo cha JKUAT (Kipimo 1). Linda vifaa na mazao."
                return "HATUA: Hakuna mvua inayonyesha JKUAT kwa sasa (0.0mm). Hali ni kavu."
            else:
                return "HATUA JKUAT: Kituo cha Conduit kinafanya kazi. Data imehakikiwa kuzuia hitilafu za vipimo."
        else:
            if intent == "campus_work_or_heat":
                if any("HEAT" in a.get("kind", "") for a in actions):
                    return "HATUA: Heat alert at JKUAT. Outdoor crews must take shade & hydration breaks until 16:30 EAT."
                return "HATUA: Conditions are safe for outdoor activities at JKUAT today."
            elif intent == "farm_irrigation_or_disease":
                if any("HUMIDITY" in a.get("kind", "") for a in actions):
                    return "HATUA FARM: High night humidity (85%+). Ventilate greenhouses to stop fungal leaf wetness."
                return "HATUA FARM: Low water demand detected; withhold unnecessary irrigation today."
            elif intent == "rain_or_weather_status":
                if any("RAIN" in a.get("kind", "") for a in actions):
                    return "HATUA: Rain onset recorded at JKUAT Gauge 1. Halt spraying and secure equipment."
                return "HATUA: No rain currently recorded at JKUAT station (0.0mm). Dry conditions prevailing."
            else:
                return "HATUA JKUAT: Conduit AWS active. Data trust verification in effect. Dial *384*61# for menus."

    except Exception as exc:
        logger.warning(f"Jev SMS processing fallback: {exc}")
        return "HATUA JKUAT: Hali ya hewa ni shwari. Hakuna tahadhari kubwa kwa sasa."
