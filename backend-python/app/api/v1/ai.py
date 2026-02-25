"""
AI Astrology API Router — All Claude-powered endpoints
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import date, datetime

from app.services.ai_service import (
    generate_ai_horoscope,
    generate_kundli_reading,
    generate_compatibility_reading,
    generate_dasha_reading,
    chat_with_astrologer,
    generate_muhurta,
    generate_yearly_prediction,
)

router = APIRouter()

CURRENT_TRANSITS = [
    {"planet":"Sun","sign":"Aquarius","deg":15.3,"retro":False,"effect":"Focus on community and innovation"},
    {"planet":"Moon","sign":"Scorpio","deg":22.7,"retro":False,"effect":"Deep emotional undercurrents"},
    {"planet":"Mars","sign":"Gemini","deg":18.4,"retro":False,"effect":"Mental energy elevated"},
    {"planet":"Jupiter","sign":"Taurus","deg":12.9,"retro":False,"effect":"Steady material abundance"},
    {"planet":"Venus","sign":"Pisces","deg":14.5,"retro":False,"effect":"Romantic and spiritual peak"},
]


# ── Schemas ───────────────────────────────────────────────────────────────

class HoroscopeRequest(BaseModel):
    rashi: str
    rashi_english: str
    period_type: str = "daily"   # daily | weekly | monthly | yearly
    current_dasha: Optional[str] = None

class KundliReadingRequest(BaseModel):
    kundli_data: Dict[str, Any]

class CompatibilityRequest(BaseModel):
    person1: Dict[str, Any]
    person2: Dict[str, Any]
    score: int = 24

class DashaRequest(BaseModel):
    kundli_data: Dict[str, Any]
    current_dasha: str
    next_dasha: str
    dasha_end_date: str

class ChatMessage(BaseModel):
    role: str   # user | assistant
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    user_context: Optional[Dict[str, Any]] = None

class MuhurtaRequest(BaseModel):
    event_type: str
    preferred_month: str
    kundli_data: Optional[Dict[str, Any]] = None

class YearlyRequest(BaseModel):
    kundli_data: Dict[str, Any]
    year: int = datetime.now().year


# ── Endpoints ─────────────────────────────────────────────────────────────

@router.post("/horoscope")
async def ai_horoscope(req: HoroscopeRequest):
    """Generate a fully AI-powered horoscope reading using Claude."""
    try:
        today = date.today()
        if req.period_type == "daily":
            date_ctx = today.strftime("%A, %d %B %Y")
        elif req.period_type == "weekly":
            date_ctx = f"Week of {today.strftime('%d %B %Y')}"
        elif req.period_type == "monthly":
            date_ctx = today.strftime("%B %Y")
        else:
            date_ctx = str(today.year)

        result = await generate_ai_horoscope(
            rashi=req.rashi,
            rashi_english=req.rashi_english,
            period_type=req.period_type,
            date_context=date_ctx,
            current_transits=CURRENT_TRANSITS,
            current_dasha=req.current_dasha
        )
        return {"success": True, "rashi": req.rashi, "period": req.period_type, "reading": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI horoscope error: {str(e)}")


@router.post("/kundli-reading")
async def ai_kundli_reading(req: KundliReadingRequest):
    """Generate a comprehensive AI interpretation of a Kundli."""
    try:
        result = await generate_kundli_reading(req.kundli_data)
        return {"success": True, "reading": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Kundli reading error: {str(e)}")


@router.post("/compatibility")
async def ai_compatibility(req: CompatibilityRequest):
    """Generate AI-powered Kundli Milan compatibility analysis."""
    try:
        result = await generate_compatibility_reading(req.person1, req.person2, req.score)
        return {"success": True, "score": req.score, "reading": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI compatibility error: {str(e)}")


@router.post("/dasha")
async def ai_dasha(req: DashaRequest):
    """Generate AI analysis of current Dasha period."""
    try:
        result = await generate_dasha_reading(
            req.kundli_data, req.current_dasha, req.next_dasha, req.dasha_end_date
        )
        return {"success": True, "current_dasha": req.current_dasha, "reading": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI dasha error: {str(e)}")


@router.post("/chat")
async def ai_chat(req: ChatRequest):
    """Interactive chat with the AI Vedic astrologer."""
    import traceback
    try:
        messages = [{"role": m.role, "content": m.content} for m in req.messages]
        response = await chat_with_astrologer(messages, req.user_context)
        return {"success": True, "response": response}
    except Exception as e:
        tb = traceback.format_exc()
        print(f"\n[AI CHAT ERROR]\n{tb}")          # visible in uvicorn terminal
        raise HTTPException(status_code=500, detail=f"AI chat error: {str(e)} | {tb[-300:]}")


@router.post("/muhurta")
async def ai_muhurta(req: MuhurtaRequest):
    """AI-powered auspicious timing selection."""
    try:
        result = await generate_muhurta(req.event_type, req.preferred_month, req.kundli_data)
        return {"success": True, "event": req.event_type, "muhurta": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI muhurta error: {str(e)}")


@router.post("/yearly")
async def ai_yearly(req: YearlyRequest):
    """AI-powered annual prediction (Varshphal)."""
    try:
        result = await generate_yearly_prediction(req.kundli_data, req.year)
        return {"success": True, "year": req.year, "prediction": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI yearly error: {str(e)}")


@router.get("/health")
async def ai_health():
    """Check if Groq AI service is configured."""
    from app.core.config import settings
    configured = bool(settings.GROQ_API_KEY)
    return {
        "ai_enabled": configured,
        "provider": "Groq Cloud (Free Tier)",
        "model": settings.GROQ_MODEL if configured else "not configured",
        "message": "Groq AI service ready" if configured else "Set GROQ_API_KEY in .env — get free key at console.groq.com"
    }
