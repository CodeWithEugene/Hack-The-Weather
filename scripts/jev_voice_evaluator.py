"""TypeSafe Jev Voice Evaluator.

Uses TypeSafe Jev (System One `jev-latest`) to semantically evaluate
candidate voice synthesis tools and select the optimal natural African
voice for the Hatua Hack The Weather hackathon presentation video.
"""

import os
import json
import logging
from typesafe_sdk import TypeSafeClient, Choice, Score, Noul

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("hatua.jev_voice")

def evaluate_voice_candidates():
    api_key = os.environ.get("TYPESAFE_API_KEY")
    if not api_key:
        print("Warning: TYPESAFE_API_KEY not found in environment.")
        return None

    client = TypeSafeClient(api_key=api_key)

    state = {
        "hackathon": "Hack The Weather 2026",
        "organizers": "JHUB Africa & JKUAT (Juja, Kiambu County, Kenya)",
        "project": "Hatua — Operational, Trust-Gated Climate Intelligence on Conduit@Empathy",
        "audience": "Kenyan and international judges, meteorologists, agricultural stakeholders, and students",
        "previous_issue": "User reported that macOS local TTS ('Daniel') produces a mumbled, robotic, grumbled voice that damages presentation credibility",
        "requirement": "A natural, warm, articulate, highly intelligible African / Kenyan voice for the 3.3-minute video presentation",
        "candidates": [
            {
                "tool": "edge-tts",
                "engine": "Microsoft Neural Speech Engine",
                "voices": ["en-KE-ChilembaNeural (Male, Kenyan English)", "en-KE-AsiliaNeural (Female, Kenyan English)", "sw-KE-RafikiNeural (Male, Kenyan Swahili)"],
                "quality": "Human-grade neural prosody, authentic East African inflection, native Nairobi/Kenyan accent, zero latency, completely free with no API limits",
                "availability": "Installed and verified locally in .venv"
            },
            {
                "tool": "jamiepine/voicebox",
                "engine": "Local-first Tauri AI Voice Studio (Kokoro / Qwen3-TTS / Chatterbox Multilingual)",
                "quality": "High quality voice cloning, supports Swahili via Chatterbox, but requires local desktop server running on port 18888 with multi-gigabyte models",
                "availability": "Server not currently running on port 18888"
            },
            {
                "tool": "elevenlabs",
                "engine": "Cloud ElevenLabs Multilingual v2",
                "quality": "Ultra realistic, but requires paid API credits and external network dependencies",
                "availability": "Requires API key and billing"
            },
            {
                "tool": "macos-say",
                "engine": "macOS Speech Synthesizer (Daniel / Tessa en_ZA)",
                "quality": "Robotic, mechanical, lacks emotional nuance, user described as 'mumbled grumbled ai voice'",
                "availability": "Built-in"
            }
        ]
    }

    questions = {
        "selected_tool": Choice(
            instructions="Which voice tool best delivers a natural, reliable, authentic African voice for the JKUAT hackathon video without failure risk?",
            criteria={
                "edge_tts": "Microsoft Neural Speech Engine via edge-tts with native en-KE Kenyan neural voices",
                "voicebox": "Jamie Pine's Voicebox local studio server with Kokoro / Chatterbox models",
                "elevenlabs": "Cloud ElevenLabs API with external credits",
                "macos_say": "Built-in macOS system voice synthesizer"
            }
        ),
        "selected_voice": Choice(
            instructions="Which specific Kenyan voice profile provides the clearest, most authoritative yet natural presentation delivery for Hatua?",
            criteria={
                "chilemba_male_ke": "en-KE-ChilembaNeural (Male Kenyan English - warm, articulate, documentary broadcast tone)",
                "asilia_female_ke": "en-KE-AsiliaNeural (Female Kenyan English - bright, approachable, professional clarity)",
                "rafiki_swahili": "sw-KE-RafikiNeural (Male Kenyan Swahili - fluent regional vernacular)"
            }
        ),
        "kenyan_authenticity_score": Score(
            instructions="Score how effectively a native Kenyan neural voice (en-KE) elevates the regional relevance and judging impression for JHUB Africa JKUAT compared to generic American/British TTS.",
            criteria=[
                "generic_robotic",
                "adequate_standard_tts",
                "good_clear_speech",
                "strong_regional_resonance",
                "flawless_authentic_kenyan_oratory"
            ]
        ),
        "rate_adjustment": Choice(
            instructions="What speech rate adjustment is optimal for clear technical comprehension of the climate data autopsy?",
            criteria={
                "normal": "Standard pace (0% adjustment)",
                "slightly_measured": "-4% rate change for technical data clarity and gravitas",
                "faster": "+8% rate change for hurried energy"
            }
        )
    }

    logger.info("Submitting voice selection questions to TypeSafe Jev System One...")
    res = client.system_one(json.dumps(state), questions)
    return res

if __name__ == "__main__":
    res = evaluate_voice_candidates()
    print("\n=== TYPESAFE JEV SYSTEM ONE VOICE JUDGMENT ===")
    if res:
        print(f"Selected Tool: {res.choices['selected_tool'].choice} (confidence: {res.choices['selected_tool'].confidence:.2f})")
        print(f"Selected Voice: {res.choices['selected_voice'].choice} (confidence: {res.choices['selected_voice'].confidence:.2f})")
        print(f"Kenyan Authenticity Score: {res.scores['kenyan_authenticity_score'].score:.2f} / 4.0")
        print(f"Recommended Pacing: {res.choices['rate_adjustment'].choice} (confidence: {res.choices['rate_adjustment'].confidence:.2f})")
        
        results_dict = {
            "selected_tool": res.choices["selected_tool"].choice,
            "selected_tool_confidence": res.choices["selected_tool"].confidence,
            "selected_voice": res.choices["selected_voice"].choice,
            "selected_voice_confidence": res.choices["selected_voice"].confidence,
            "kenyan_authenticity_score": res.scores["kenyan_authenticity_score"].score,
            "rate_adjustment": res.choices["rate_adjustment"].choice,
            "rate_adjustment_confidence": res.choices["rate_adjustment"].confidence
        }
        with open(".jev_voice_judgment.json", "w") as f:
            json.dump(results_dict, f, indent=2)
