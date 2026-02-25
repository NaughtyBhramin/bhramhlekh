"""
Bhramhlekh — AI Service
Provider: Groq Cloud (Free Tier)
Model: openai/gpt-oss-120b
Generates: horoscopes, kundli readings, compatibility, dasha, muhurta, chat
"""

from __future__ import annotations

import asyncio
import json
import re
from typing import Any, Dict, List, Optional

from groq import Groq

# ── Settings import ────────────────────────────────────────────────────────
# Ensure `settings` provides the following attributes:
#   GROQ_API_KEY, GROQ_MODEL, GROQ_MAX_TOKENS
from app.core.config import settings

# ── Groq client ─────────────────────────────────────────────────────────────
client = Groq(api_key=settings.GROQ_API_KEY)

# ── System Prompt ───────────────────────────────────────────────────────────
JYOTISH_SYSTEM_PROMPT = """You are Jyotish Guru — an ancient and wise Vedic astrology master with deep knowledge of:
- All 9 Navagrahas (planets) and their significations
- 12 Rashis (zodiac signs) and their characteristics
- 27 Nakshatras (lunar mansions) and their rulers
- Vimshottari Dasha system and planetary periods
- Yogas, aspects, and house significations
- Vedic remedies: mantras, gemstones, yantras, puja, fasting, donations

Your responses must:
1. Be deeply rooted in authentic Vedic astrology tradition
2. Reference specific planetary positions, dashas, and yogas when given
3. Provide actionable, compassionate, and spiritually uplifting guidance
4. Use Sanskrit terms naturally (with brief English translations)
5. Be specific to the person's chart — never give generic readings
6. Include practical remedies tailored to their planetary situation
7. Balance traditional wisdom with modern relevance
8. Maintain an elevated, sacred, yet accessible tone

CRITICAL: Always respond with valid JSON only. No preamble, no explanation outside JSON, no markdown fences.
Never mention that you are an AI or a language model in your readings.
Always begin readings with "Om" in spirit — weave reverence into your words.
"""

# ── Helper utilities ───────────────────────────────────────────────────────
def _strip_markdown_fences(text: str) -> str:
    """Remove optional markdown fences (``` or ```json) from model output."""
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.MULTILINE)
    text = re.sub(r"\s*```$", "", text, flags=re.MULTILINE)
    return text.strip()


def _parse_json(text: str) -> Dict[str, Any]:
    """Parse JSON from a string that may contain stray whitespace or fences."""
    cleaned = _strip_markdown_fences(text)
    return json.loads(cleaned)


async def _call_groq(prompt: str, *, max_tokens: Optional[int] = None) -> str:
    """Execute a Groq chat completion in a thread‑pool to keep the event loop non‑blocking."""
    tokens = max_tokens or settings.GROQ_MAX_TOKENS
    messages = [
        {"role": "system", "content": JYOTISH_SYSTEM_PROMPT},
        {"role": "user", "content": prompt},
    ]

    def _sync_call() -> str:
        resp = client.chat.completions.create(
            model=settings.GROQ_MODEL,
            max_tokens=tokens,
            temperature=0.7,
            messages=messages,
        )
        return resp.choices[0].message.content or ""

    return await asyncio.to_thread(_sync_call)


# ── Horoscope ────────────────────────────────────────────────────────────────
async def generate_ai_horoscope(
    rashi: str,
    rashi_english: str,
    period_type: str,
    date_context: str,
    current_transits: List[Dict[str, Any]],
    current_dasha: Optional[str] = None,
) -> Dict[str, Any]:
    """Return a JSON horoscope for the supplied parameters."""
    transit_lines = [
        f"- {t['planet']} in {t['sign']} at {t.get('deg', '?')}°"
        f"{' (Retrograde)' if t.get('retro') else ''}: {t.get('effect', '')}"
        for t in current_transits[:5]
    ]
    transit_text = "\n".join(transit_lines)

    prompt = f"""Generate a detailed {period_type} horoscope for {rashi} ({rashi_english}) Rashi.

Date/Period: {date_context}
{f'Current Mahadasha: {current_dasha}' if current_dasha else ''}

Active Planetary Transits:
{transit_text}

Respond ONLY with this JSON (no other text):
{{
  "main_prediction": "3-4 sentences of overall energy and key themes",
  "love": "2-3 sentences on romance and relationships",
  "career": "2-3 sentences on professional and financial matters",
  "health": "1-2 sentences on physical and mental wellbeing",
  "spiritual": "1-2 sentences on spiritual practice",
  "lucky_color": "one color",
  "lucky_number": 7,
  "lucky_gem": "one gemstone",
  "lucky_day": "one day of week",
  "love_score": 78,
  "career_score": 82,
  "health_score": 75,
  "finance_score": 80,
  "remedy": "one specific Vedic remedy for this period",
  "mantra": "Sanskrit mantra with transliteration"
}}"""
    raw = await _call_groq(prompt, max_tokens=1024)
    return _parse_json(raw)


# ── Kundli Reading ───────────────────────────────────────────────────────────
async def generate_kundli_reading(kundli_data: Dict[str, Any]) -> Dict[str, Any]:
    """Return a comprehensive Vedic Kundli analysis in JSON."""
    planets_text = "\n".join(
        f"- {name}: {p['rashi']} ({p['rashi_symbol']}), House {p['house']}, "
        f"{p['degree_in_rashi']:.1f}°, Nakshatra: {p['nakshatra']} Pada {p['nakshatra_pada']}"
        f"{' (Retrograde)' if p['is_retrograde'] else ''}"
        for name, p in kundli_data.get("planets", {}).items()
    )

    yogas_text = "\n".join(f"- {y}" for y in kundli_data.get("yogas", []))

    prompt = f"""Perform a complete Vedic Kundli analysis for:

Name: {kundli_data.get('name', 'Native')}
Date of Birth: {kundli_data.get('date_of_birth')}
Time of Birth: {kundli_data.get('time_of_birth')}
Place of Birth: {kundli_data.get('place_of_birth')}

Ascendant (Lagna): {kundli_data.get('ascendant_rashi')} at {kundli_data.get('ascendant_degree', 0):.1f}°
Moon Sign: {kundli_data.get('moon_sign')}
Sun Sign: {kundli_data.get('sun_sign')}
Birth Nakshatra: {kundli_data.get('nakshatra')} Pada {kundli_data.get('nakshatra_pada')} (Lord: {kundli_data.get('nakshatra_lord')})

PLANETARY POSITIONS:
{planets_text}

YOGAS PRESENT:
{yogas_text if yogas_text else 'Standard chart configuration'}

Respond ONLY with this JSON (no other text):
{{
  "personality": "Ascendant analysis — physical traits and overall temperament",
  "mind_emotions": "Moon sign and nakshatra — emotional nature and mental patterns",
  "soul_purpose": "Sun sign analysis — dharma and life mission",
  "wealth_family": "2nd house — financial potential and family karma",
  "career": "10th house — ideal career paths and professional destiny",
  "relationships": "7th house — partnership karma and ideal partner traits",
  "health": "Planetary influences on health and vulnerable areas",
  "spiritual_path": "12th house and moksha indicators",
  "current_period": "What the chart suggests about the current phase of life",
  "special_blessings": ["blessing 1", "blessing 2", "blessing 3"],
  "challenges": ["karmic lesson 1", "karmic lesson 2"],
  "remedies": [
    {{"title": "remedy name", "description": "how to do it", "mantra": "Sanskrit mantra"}},
    {{"title": "remedy name", "description": "how to do it", "mantra": "Sanskrit mantra"}},
    {{"title": "remedy name", "description": "how to do it", "mantra": "Sanskrit mantra"}}
  ],
  "overall_summary": "2-3 sentence synthesis of the entire chart",
  "lucky_period": "best upcoming time period",
  "power_planet": "the strongest planet in this chart"
}}"""
    raw = await _call_groq(prompt, max_tokens=2048)
    return _parse_json(raw)


# ── Compatibility ───────────────────────────────────────────────────────────
async def generate_compatibility_reading(
    person1: Dict[str, Any],
    person2: Dict[str, Any],
    score: int,
) -> Dict[str, Any]:
    """Return a Vedic Kundli Milan (compatibility) analysis in JSON."""
    prompt = f"""Perform a Vedic Kundli Milan (compatibility analysis) for this couple:

PERSON 1:
Name: {person1.get('name', 'Person 1')}
Moon Sign (Rashi): {person1.get('moon_sign')}
Ascendant: {person1.get('ascendant_rashi')}
Nakshatra: {person1.get('nakshatra')}

PERSON 2:
Name: {person2.get('name', 'Person 2')}
Moon Sign (Rashi): {person2.get('moon_sign')}
Ascendant: {person2.get('ascendant_rashi')}
Nakshatra: {person2.get('nakshatra')}

ASHTAKOOTA SCORE: {score}/36

Respond ONLY with this JSON (no other text):
{{
  "overall": "what this score and combination means overall",
  "emotional": "how their emotional natures align",
  "physical": "energy levels, lifestyle, and attraction compatibility",
  "intellectual": "communication styles and shared interests",
  "spiritual": "dharmic alignment and shared values",
  "strengths": ["beautiful aspect 1", "beautiful aspect 2", "beautiful aspect 3"],
  "nurture": ["area needing attention 1", "area needing attention 2"],
  "life_together": "what life partnership will look and feel like",
  "remedies": [
    {{"title": "remedy name", "description": "how to strengthen the bond"}},
    {{"title": "remedy name", "description": "how to strengthen the bond"}}
  ],
  "auspicious_timing": "best seasons or periods for marriage or milestones",
  "verdict": "Highly Compatible",
  "verdict_detail": "one sentence explaining the verdict"
}}

For verdict use exactly one of: Highly Compatible | Compatible | Moderately Compatible | Needs Work"""
    raw = await _call_groq(prompt, max_tokens=1500)
    return _parse_json(raw)


# ── Dasha Reading ───────────────────────────────────────────────────────────
async def generate_dasha_reading(
    kundli_data: Dict[str, Any],
    current_dasha: str,
    next_dasha: str,
    dasha_end_date: str,
) -> Dict[str, Any]:
    """Return a Vimshottari Dasha period analysis in JSON."""
    prompt = f"""Analyze the current Vimshottari Dasha period for:

Name: {kundli_data.get('name', 'Native')}
Moon Sign: {kundli_data.get('moon_sign')}
Ascendant: {kundli_data.get('ascendant_rashi')}
Birth Nakshatra: {kundli_data.get('nakshatra')}

CURRENT MAHADASHA: {current_dasha}
Dasha Ends: {dasha_end_date}
UPCOMING DASHA: {next_dasha}

Respond ONLY with this JSON (no other text):
{{
  "themes": "key themes and overall energy of this {current_dasha} Mahadasha",
  "opportunities": "doors opening during this period",
  "challenges": "what to be watchful about",
  "career": "professional life during this dasha",
  "relationships": "love and partnership effects",
  "health": "physical and mental health themes",
  "spiritual": "spiritual growth opportunities",
  "transition": "how to prepare for the upcoming {next_dasha} Mahadasha",
  "best_months": ["Month 1", "Month 2", "Month 3"],
  "remedies": [
    {{"title": "remedy name", "description": "how to do it", "mantra": "Sanskrit mantra"}}
  ],
  "overall_message": "2-sentence inspiring summary for this period"
}}"""
    raw = await _call_groq(prompt, max_tokens=1200)
    return _parse_json(raw)


# ── Chat ─────────────────────────────────────────────────────────────────────
async def chat_with_astrologer(
    messages: List[Dict[str, str]],
    user_context: Optional[Dict[str, str]] = None,
) -> str:
    """Conversational chat – returns plain‑text response (no JSON)."""
    context_note = ""
    if user_context:
        context_note = (
            f"\n[User Chart — Moon Sign: {user_context.get('moon_sign','?')}, "
            f"Ascendant: {user_context.get('ascendant_rashi','?')}, "
            f"Nakshatra: {user_context.get('nakshatra','?')}, "
            f"Current Dasha: {user_context.get('current_dasha','?')}]"
        )

    chat_system = (
        "You are Jyotish Guru — a wise, warm Vedic astrology master. "
        "Respond conversationally in plain text as a knowledgeable astrologer would speak. "
        "Use Sanskrit terms naturally with brief English translations. "
        "Be specific, compassionate, and spiritually uplifting. "
        "Do NOT respond with JSON. Do NOT mention you are an AI."
        + context_note
    )

    # Ensure the conversation starts with a user message (Groq requirement)
    filtered = [m for m in messages if m["role"] in ("user", "assistant")]
    while filtered and filtered[0]["role"] == "assistant":
        filtered = filtered[1:]

    if not filtered:
        return "Namaste 🙏 Please ask your question and I will illuminate your path."

    groq_messages = [{"role": "system", "content": chat_system}] + filtered

    def _sync_call() -> str:
        resp = client.chat.completions.create(
            model=settings.GROQ_MODEL,
            max_tokens=800,
            temperature=0.75,
            messages=groq_messages,
        )
        return resp.choices[0].message.content or ""

    return await asyncio.to_thread(_sync_call)


# ── Muhurta ───────────────────────────────────────────────────────────────────
async def generate_muhurta(
    event_type: str,
    preferred_month: str,
    kundli_data: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """Return auspicious Muhurta timing in JSON."""
    chart_ctx = ""
    if kundli_data:
        chart_ctx = (
            f"Person's Ascendant: {kundli_data.get('ascendant_rashi')}, "
            f"Moon Sign: {kundli_data.get('moon_sign')}"
        )

    prompt = f"""Select the most auspicious Muhurta (timing) for:

Event: {event_type}
Preferred Month: {preferred_month}
{chart_ctx}

Respond ONLY with this JSON (no other text):
{{
  "best_days": ["Monday", "Thursday"],
  "best_tithis": ["Panchami", "Dashami"],
  "favorable_nakshatras": ["Rohini", "Pushya", "Uttara Phalguni"],
  "avoid": "what times, days, or conditions to strictly avoid",
  "ideal_time": "best time of day with explanation",
  "ritual": "brief ritual to maximize the chosen timing",
  "mantras": ["mantra 1", "mantra 2"],
  "general_guidance": "2-3 sentences of overall Muhurta guidance for this event"
}}"""
    raw = await _call_groq(prompt, max_tokens=800)
    return _parse_json(raw)


# ── Yearly Prediction ────────────────────────────────────────────────────────
async def generate_yearly_prediction(
    kundli_data: Dict[str, Any],
    year: int,
) -> Dict[str, Any]:
    """Return a Varshphal (annual) prediction in JSON."""
    prompt = f"""Generate a detailed annual Varshphal prediction for {year}:

Name: {kundli_data.get('name', 'Native')}
Moon Sign: {kundli_data.get('moon_sign')}
Ascendant: {kundli_data.get('ascendant_rashi')}
Nakshatra: {kundli_data.get('nakshatra')}
Current Dasha: {kundli_data.get('current_dasha', 'Unknown')}

Respond ONLY with this JSON (no other text):
{{
  "year_theme": "one powerful sentence capturing the essence of this year",
  "overall_energy": "2-3 sentences on the year's overall cosmic climate",
  "career": "career and professional forecast for {year}",
  "love": "love and relationship forecast for {year}",
  "health": "health and wellness focus for {year}",
  "finance": "financial forecast for {year}",
  "spiritual": "spiritual growth path for {year}",
  "monthly": {{
    "January": "brief January forecast",
    "February": "brief February forecast",
    "March": "brief March forecast",
    "April": "brief April forecast",
    "May": "brief May forecast",
    "June": "brief June forecast",
    "July": "brief July forecast",
    "August": "brief August forecast",
    "September": "brief September forecast",
    "October": "brief October forecast",
    "November": "brief November forecast",
    "December": "brief December forecast"
  }},
  "best_months": ["Month1", "Month2", "Month3"],
  "challenging_months": ["Month1", "Month2"],
  "annual_mantra": "Sanskrit mantra for the year",
  "annual_remedy": "one key remedy to practice throughout {year}"
}}"""
    raw = await _call_groq(prompt, max_tokens=2000)
    return _parse_json(raw)