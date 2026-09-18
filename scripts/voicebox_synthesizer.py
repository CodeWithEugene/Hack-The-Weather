"""Voicebox (jamiepine/voicebox) Local Voice Integration for Hatua.

Voicebox is a local-first AI voice studio featuring 7 TTS engines
(Kokoro, Chatterbox Multilingual, Qwen3-TTS, LuxTTS, TADA),
voice cloning, and a built-in MCP server / REST API.

This module provides:
1. Seamless connection to local Voicebox server (default http://127.0.0.1:18888).
2. Voice synthesis with Swahili and English language support.
3. Fallback to native macOS high-quality speech synthesis if Voicebox is offline.
"""

from __future__ import annotations

import json
import logging
import os
import subprocess
from pathlib import Path
from typing import Optional
import urllib.request
import urllib.error

logger = logging.getLogger("hatua.voicebox")

VOICEBOX_BASE_URL = os.environ.get("VOICEBOX_BASE_URL", "http://127.0.0.1:18888")

def is_voicebox_available() -> bool:
    """Check if the local Voicebox studio server is running."""
    try:
        req = urllib.request.Request(
            f"{VOICEBOX_BASE_URL}/health",
            headers={"User-Agent": "Hatua-Voice-Client/1.0"}
        )
        with urllib.request.urlopen(req, timeout=1.0) as resp:
            return resp.status == 200
    except Exception:
        return False

def synthesize_speech(
    text: str,
    output_path: Path | str,
    voice_id: Optional[str] = None,
    language: str = "en",
    speed: float = 1.0,
) -> Path:
    """Synthesize speech using Voicebox if available, otherwise fallback to macOS say.

    Args:
        text: Text to speak.
        output_path: Destination audio file (WAV or MP3).
        voice_id: Optional Voicebox cloned voice ID.
        language: Language code ('en' for English, 'sw' for Swahili).
        speed: Speech rate multiplier (1.0 = normal).
    """
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    if is_voicebox_available():
        logger.info("Synthesizing via local Voicebox server (%s)...", VOICEBOX_BASE_URL)
        payload = {
            "input": text,
            "voice": voice_id or "default",
            "model": "chatterbox-multilingual" if language == "sw" else "kokoro",
            "language": language,
            "speed": speed,
            "response_format": "wav",
        }
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            f"{VOICEBOX_BASE_URL}/v1/audio/speech",
            data=data,
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=30.0) as resp:
                output_path.write_bytes(resp.read())
                logger.info("Voicebox synthesis saved to %s", output_path)
                return output_path
        except urllib.error.URLError as exc:
            logger.warning("Voicebox request failed (%s). Falling back to macOS speech.", exc)

    # Fallback: macOS high-quality speech synthesis
    logger.info("Using macOS local speech synthesis fallback...")
    voice_name = "Daniel" if language == "en" else "Maged"
    aiff_temp = output_path.with_suffix(".aiff")
    rate = int(175 * speed)
    clean_text = text.replace('"', '\\"')
    
    subprocess.run(
        ["say", "-v", voice_name, "-r", str(rate), clean_text, "-o", str(aiff_temp)],
        check=True,
    )
    subprocess.run(
        ["ffmpeg", "-y", "-i", str(aiff_temp), "-ar", "44100", "-ac", "2", str(output_path)],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    if aiff_temp.exists():
        aiff_temp.unlink()

    return output_path

if __name__ == "__main__":
    print("Testing Voicebox / TTS engine...")
    available = is_voicebox_available()
    print(f"Voicebox Server (127.0.0.1:18888) Active: {available}")
    test_out = Path("video/audio/voicebox_test.wav")
    synthesize_speech("Hatua: Trust First, Then Act.", test_out)
    print(f"Test audio generated at: {test_out} ({test_out.stat().st_size} bytes)")
