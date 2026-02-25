"""
Jyotish AI Service — Anthropic Claude Integration
Generates AI-powered horoscopes, Kundli readings, remedies, chat responses
"""

import anthropic
from typing import Optional, Dict, Any, AsyncIterator
from app.core.config import settings
import json

client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

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

Always begin readings with "Om" and a relevant Sanskrit invocation.
Never make specific financial predictions or medical diagnoses.
Remind users this is for spiritual guidance, not life decisions."""


async def generate_ai_horoscope(
    rashi: str,
    rashi_english: str,
    period_type: str,  # daily | weekly | monthly | yearly
    date_context: str,
    current_transits: list,
    current_dasha: Optional[str] = None
) -> Dict[str, Any]:
    """Generate a fully AI-powered horoscope reading."""

    transit_text = "\n".join([
        f"- {t['planet']} in {t['sign']} at {t.get('deg', '?')}°{' (Retrograde)' if t.get('retro') else ''}: {t.get('effect', '')}"
        for t in current_transits[:5]
    ])

    prompt = f"""Generate a detailed {period_type} horoscope reading for {rashi} ({rashi_english}) Rashi.

Date/Period: {date_context}
{f'Current Mahadasha: {current_dasha}' if current_dasha else ''}

Current Planetary Transits:
{transit_text}

Please provide:
1. MAIN PREDICTION (3-4 sentences): Overall energy and key themes for this {period_type}
2. LOVE & RELATIONSHIPS (2-3 sentences): Romance, partnerships, family dynamics  
3. CAREER & FINANCE (2-3 sentences): Professional opportunities, financial guidance
4. HEALTH & WELLNESS (1-2 sentences): Physical and mental health focus areas
5. SPIRITUAL GUIDANCE (1-2 sentences): Spiritual practice recommendations
6. LUCKY ELEMENTS: One color, one number (1-9), one gemstone, one best day
7. SCORES (as integers 0-100): love_score, career_score, health_score, finance_score
8. REMEDY OF THE DAY: One specific Vedic remedy appropriate for this {period_type}

Respond in this exact JSON format:
{{
  "main_prediction": "...",
  "love": "...",
  "career": "...",
  "health": "...",
  "spiritual": "...",
  "lucky_color": "...",
  "lucky_number": 7,
  "lucky_gem": "...",
  "lucky_day": "...",
  "love_score": 78,
  "career_score": 82,
  "health_score": 75,
  "finance_score": 80,
  "remedy": "...",
  "mantra": "..."
}}"""

    message = client.messages.create(
        model=settings.AI_MODEL,
        max_tokens=1024,
        system=JYOTISH_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": prompt}]
    )

    text = message.content[0].text.strip()
    # Strip markdown code fences if present
    text = text.replace("```json", "").replace("```", "").strip()
    return json.loads(text)


async def generate_kundli_reading(kundli_data: Dict[str, Any]) -> Dict[str, Any]:
    """Generate comprehensive AI-powered Kundli interpretation."""

    planets_text = "\n".join([
        f"- {name}: in {p['rashi']} ({p['rashi_symbol']}), House {p['house']}, {p['degree_in_rashi']:.1f}°, Nakshatra: {p['nakshatra']} Pada {p['nakshatra_pada']}{' (Retrograde)' if p['is_retrograde'] else ''}"
        for name, p in kundli_data.get('planets', {}).items()
    ])

    yogas_text = "\n".join([f"- {y}" for y in kundli_data.get('yogas', [])])

    prompt = f"""Perform a comprehensive Vedic Kundli (birth chart) analysis for:

Name: {kundli_data.get('name', 'Native')}
Date of Birth: {kundli_data.get('date_of_birth')}
Time of Birth: {kundli_data.get('time_of_birth')}
Place of Birth: {kundli_data.get('place_of_birth')}

CHART DATA:
Ascendant (Lagna): {kundli_data.get('ascendant_rashi')} at {kundli_data.get('ascendant_degree', 0):.1f}°
Moon Sign (Janma Rashi): {kundli_data.get('moon_sign')}
Sun Sign: {kundli_data.get('sun_sign')}
Birth Nakshatra: {kundli_data.get('nakshatra')} Pada {kundli_data.get('nakshatra_pada')} (Lord: {kundli_data.get('nakshatra_lord')})
Ayanamsa: {kundli_data.get('ayanamsa', 23.85):.2f}° (Lahiri)

PLANETARY POSITIONS:
{planets_text}

YOGAS PRESENT:
{yogas_text if yogas_text else 'Standard chart configuration'}

Provide a detailed, personalized reading covering:
1. PERSONALITY & APPEARANCE: Ascendant analysis, physical traits, overall temperament
2. MIND & EMOTIONS: Moon sign and nakshatra analysis, emotional nature, mental patterns
3. SOUL PURPOSE: Sun sign analysis, dharma, life mission and core identity
4. WEALTH & FAMILY: 2nd house analysis, financial potential, family karma
5. CAREER & STATUS: 10th house analysis, ideal career paths, professional destiny
6. RELATIONSHIPS & MARRIAGE: 7th house analysis, partnership karma, ideal partner traits
7. HEALTH: Planetary influences on health, vulnerable areas, preventive care
8. SPIRITUAL PATH: 12th house, moksha indicators, spiritual practices suited to the chart
9. CURRENT PERIOD: What the chart suggests about the current phase of life
10. SPECIAL BLESSINGS: The most powerful positive combinations in this chart
11. CHALLENGES TO OVERCOME: Key karmic lessons and how to navigate them
12. REMEDIES: 3 specific, personalized remedies based on this exact chart

Respond in JSON format:
{{
  "personality": "...",
  "mind_emotions": "...",
  "soul_purpose": "...",
  "wealth_family": "...",
  "career": "...",
  "relationships": "...",
  "health": "...",
  "spiritual_path": "...",
  "current_period": "...",
  "special_blessings": ["blessing1", "blessing2", "blessing3"],
  "challenges": ["challenge1", "challenge2"],
  "remedies": [
    {{"title": "...", "description": "...", "mantra": "..."}},
    {{"title": "...", "description": "...", "mantra": "..."}},
    {{"title": "...", "description": "...", "mantra": "..."}}
  ],
  "overall_summary": "...",
  "lucky_period": "...",
  "power_planet": "..."
}}"""

    message = client.messages.create(
        model=settings.AI_MODEL,
        max_tokens=settings.AI_MAX_TOKENS,
        system=JYOTISH_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": prompt}]
    )

    text = message.content[0].text.strip()
    text = text.replace("```json", "").replace("```", "").strip()
    return json.loads(text)


async def generate_compatibility_reading(
    person1: Dict[str, Any],
    person2: Dict[str, Any],
    score: int
) -> Dict[str, Any]:
    """AI-powered Kundli Milan (compatibility) analysis."""

    prompt = f"""Perform a detailed Vedic Kundli Milan (compatibility analysis) for this couple:

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

Provide a comprehensive compatibility reading including:
1. OVERALL COMPATIBILITY: What this score and combination means
2. EMOTIONAL COMPATIBILITY: How their minds and hearts align
3. PHYSICAL COMPATIBILITY: Energy levels, lifestyle, attraction
4. INTELLECTUAL MATCH: Communication styles, shared interests
5. SPIRITUAL COMPATIBILITY: Dharmic alignment, shared values
6. STRENGTHS OF THIS UNION: Top 3 beautiful aspects of this match
7. AREAS TO NURTURE: Top 2 areas needing conscious attention
8. LIFE TOGETHER: What life partnership will look and feel like
9. REMEDIES FOR HARMONY: 2 specific remedies to strengthen the bond
10. AUSPICIOUS TIMING: Best seasons/periods for marriage or milestones

Respond in JSON:
{{
  "overall": "...",
  "emotional": "...",
  "physical": "...",
  "intellectual": "...",
  "spiritual": "...",
  "strengths": ["...", "...", "..."],
  "nurture": ["...", "..."],
  "life_together": "...",
  "remedies": [{{"title":"...","description":"..."}},{{"title":"...","description":"..."}}],
  "auspicious_timing": "...",
  "verdict": "Highly Compatible|Compatible|Moderately Compatible|Needs Work",
  "verdict_detail": "..."
}}"""

    message = client.messages.create(
        model=settings.AI_MODEL,
        max_tokens=1500,
        system=JYOTISH_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": prompt}]
    )

    text = message.content[0].text.strip()
    text = text.replace("```json", "").replace("```", "").strip()
    return json.loads(text)


async def generate_dasha_reading(
    kundli_data: Dict[str, Any],
    current_dasha: str,
    next_dasha: str,
    dasha_end_date: str
) -> Dict[str, Any]:
    """AI analysis of current Dasha period."""

    prompt = f"""Analyze the current Vimshottari Dasha period for:

Name: {kundli_data.get('name', 'Native')}
Moon Sign: {kundli_data.get('moon_sign')}
Ascendant: {kundli_data.get('ascendant_rashi')}
Birth Nakshatra: {kundli_data.get('nakshatra')}

CURRENT MAHADASHA: {current_dasha}
Dasha Ends: {dasha_end_date}
UPCOMING DASHA: {next_dasha}

Provide a detailed analysis:
1. CURRENT DASHA THEMES: What {current_dasha} Mahadasha means for this person
2. OPPORTUNITIES: Key doors opening during this period
3. CHALLENGES: What to be watchful about
4. CAREER IMPACT: Professional life during this dasha
5. RELATIONSHIPS: How this dasha affects love and partnerships
6. HEALTH: Physical and mental health themes
7. SPIRITUAL GROWTH: Spiritual opportunities of this period
8. TRANSITION PREPARATION: How to prepare for {next_dasha} Mahadasha
9. BEST MONTHS: Most auspicious months in the current year
10. REMEDIES: 2 specific remedies for this dasha lord

Return JSON:
{{
  "themes": "...",
  "opportunities": "...",
  "challenges": "...",
  "career": "...",
  "relationships": "...",
  "health": "...",
  "spiritual": "...",
  "transition": "...",
  "best_months": ["...", "...", "..."],
  "remedies": [{{"title":"...","description":"...","mantra":"..."}}],
  "overall_message": "..."
}}"""

    message = client.messages.create(
        model=settings.AI_MODEL,
        max_tokens=1200,
        system=JYOTISH_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": prompt}]
    )

    text = message.content[0].text.strip()
    text = text.replace("```json", "").replace("```", "").strip()
    return json.loads(text)


async def chat_with_astrologer(
    messages: list,
    user_context: Optional[Dict] = None
) -> str:
    """Interactive AI astrologer chat."""

    context_text = ""
    if user_context:
        context_text = f"""
User's Chart Context:
- Moon Sign: {user_context.get('moon_sign', 'Unknown')}
- Ascendant: {user_context.get('ascendant_rashi', 'Unknown')}
- Nakshatra: {user_context.get('nakshatra', 'Unknown')}
- Current Dasha: {user_context.get('current_dasha', 'Unknown')}
"""

    system = JYOTISH_SYSTEM_PROMPT + (f"\n\n{context_text}" if context_text else "")

    api_messages = [{"role": m["role"], "content": m["content"]} for m in messages]

    message = client.messages.create(
        model=settings.AI_MODEL,
        max_tokens=800,
        system=system,
        messages=api_messages
    )

    return message.content[0].text


async def generate_muhurta(
    event_type: str,
    preferred_month: str,
    kundli_data: Optional[Dict] = None
) -> Dict[str, Any]:
    """AI-powered auspicious timing (Muhurta) selection."""

    chart_context = ""
    if kundli_data:
        chart_context = f"""
Person's Chart:
- Ascendant: {kundli_data.get('ascendant_rashi')}
- Moon Sign: {kundli_data.get('moon_sign')}
- Nakshatra: {kundli_data.get('nakshatra')}
"""

    prompt = f"""Select the most auspicious Muhurta (timing) for the following event:

Event Type: {event_type}
Preferred Month/Period: {preferred_month}
{chart_context}

Provide Muhurta guidance including:
1. BEST DAYS OF WEEK: Which weekdays are most favorable
2. BEST TITHIS: Favorable lunar days (Tithis) for this event
3. FAVORABLE NAKSHATRAS: Nakshatras that support this event
4. AVOID: Times, days, or conditions to strictly avoid
5. IDEAL TIME OF DAY: Morning, afternoon, evening, or specific hours
6. MUHURTA RITUAL: Brief ritual to maximize the chosen timing
7. MANTRAS: Specific mantras to chant on the chosen day

Return JSON:
{{
  "best_days": ["Monday", "Thursday"],
  "best_tithis": ["...", "..."],
  "favorable_nakshatras": ["...", "...", "..."],
  "avoid": "...",
  "ideal_time": "...",
  "ritual": "...",
  "mantras": ["...", "..."],
  "general_guidance": "..."
}}"""

    message = client.messages.create(
        model=settings.AI_MODEL,
        max_tokens=800,
        system=JYOTISH_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": prompt}]
    )

    text = message.content[0].text.strip()
    text = text.replace("```json", "").replace("```", "").strip()
    return json.loads(text)


async def generate_yearly_prediction(
    kundli_data: Dict[str, Any],
    year: int
) -> Dict[str, Any]:
    """AI-powered annual prediction (Varshphal)."""

    prompt = f"""Generate a detailed annual prediction (Varshphal) for {year}:

Name: {kundli_data.get('name', 'Native')}
Moon Sign: {kundli_data.get('moon_sign')}
Ascendant: {kundli_data.get('ascendant_rashi')}
Nakshatra: {kundli_data.get('nakshatra')}
Current Dasha: {kundli_data.get('current_dasha', 'Unknown')}

Provide month-by-month guidance for {year} and overall annual themes.

Return JSON:
{{
  "year_theme": "...",
  "overall_energy": "...",
  "career": "...",
  "love": "...",
  "health": "...",
  "finance": "...",
  "spiritual": "...",
  "monthly": {{
    "January": "...", "February": "...", "March": "...",
    "April": "...", "May": "...", "June": "...",
    "July": "...", "August": "...", "September": "...",
    "October": "...", "November": "...", "December": "..."
  }},
  "best_months": ["...", "...", "..."],
  "challenging_months": ["...", "..."],
  "annual_mantra": "...",
  "annual_remedy": "..."
}}"""

    message = client.messages.create(
        model=settings.AI_MODEL,
        max_tokens=2000,
        system=JYOTISH_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": prompt}]
    )

    text = message.content[0].text.strip()
    text = text.replace("```json", "").replace("```", "").strip()
    return json.loads(text)
