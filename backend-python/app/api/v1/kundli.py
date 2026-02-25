"""
Kundli API Router
Handles birth chart generation, storage, and retrieval
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date
import uuid

from app.core.database import get_db
from app.services.astrology_engine import astrology_engine

router = APIRouter()


# ── Schemas ──────────────────────────────────────────────────────────────

class KundliRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    date_of_birth: date
    time_of_birth: str = Field(..., pattern=r"^\d{2}:\d{2}$")
    place_of_birth: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    timezone: Optional[str] = None
    gender: Optional[str] = None
    chart_style: str = "north"   # north | south

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Arjun Sharma",
                "date_of_birth": "1990-06-15",
                "time_of_birth": "10:30",
                "place_of_birth": "Delhi, India",
                "gender": "male"
            }
        }


class PlanetResponse(BaseModel):
    name: str
    sanskrit: str
    symbol: str
    sidereal_longitude: float
    rashi: str
    rashi_symbol: str
    degree_in_rashi: float
    nakshatra: str
    nakshatra_pada: int
    is_retrograde: bool
    house: int


class HouseResponse(BaseModel):
    house: int
    rashi: str
    rashi_symbol: str
    planets: List[str]
    significance: str


class KundliResponse(BaseModel):
    id: str
    name: str
    date_of_birth: str
    time_of_birth: str
    place_of_birth: str
    ascendant_rashi: str
    ascendant_degree: float
    moon_sign: str
    sun_sign: str
    nakshatra: str
    nakshatra_pada: int
    nakshatra_lord: str
    planets: dict
    houses: List[HouseResponse]
    yogas: List[str]
    ayanamsa: float
    dasha_periods: Optional[List] = None


class DashaRequest(BaseModel):
    date_of_birth: date
    moon_longitude: float


# ── Endpoints ────────────────────────────────────────────────────────────

@router.post("/generate", response_model=KundliResponse, status_code=status.HTTP_200_OK)
async def generate_kundli(request: KundliRequest):
    """
    Generate a complete Vedic birth chart (Kundli).

    Calculates:
    - Ascendant (Lagna) and all 12 houses
    - 9 planetary positions (Navagraha) with rashi, nakshatra, degree
    - Rahu/Ketu (lunar nodes)
    - Vimshottari Dasha periods
    - Yogas present in the chart
    """
    try:
        kundli_data = astrology_engine.calculate_kundli(
            dob=request.date_of_birth,
            tob=request.time_of_birth,
            place=request.place_of_birth,
            lat=request.latitude,
            lon=request.longitude,
            timezone=request.timezone
        )

        # Calculate dasha periods
        moon_long = kundli_data.planets["Moon"].sidereal_longitude
        dashas = astrology_engine.calculate_vimshottari_dasha(
            dob=request.date_of_birth,
            moon_longitude=moon_long
        )

        planets_response = {}
        for name, planet in kundli_data.planets.items():
            planets_response[name] = {
                "name": planet.name,
                "sanskrit": planet.sanskrit,
                "symbol": planet.symbol,
                "sidereal_longitude": round(planet.sidereal_longitude, 4),
                "rashi": planet.rashi,
                "rashi_symbol": planet.rashi_symbol,
                "degree_in_rashi": round(planet.degree_in_rashi, 4),
                "nakshatra": planet.nakshatra,
                "nakshatra_pada": planet.nakshatra_pada,
                "is_retrograde": planet.is_retrograde,
                "house": planet.house
            }

        return KundliResponse(
            id=str(uuid.uuid4()),
            name=request.name,
            date_of_birth=str(request.date_of_birth),
            time_of_birth=request.time_of_birth,
            place_of_birth=request.place_of_birth,
            ascendant_rashi=kundli_data.ascendant_rashi,
            ascendant_degree=round(kundli_data.ascendant_degree, 4),
            moon_sign=kundli_data.moon_sign,
            sun_sign=kundli_data.sun_sign,
            nakshatra=kundli_data.nakshatra,
            nakshatra_pada=kundli_data.nakshatra_pada,
            nakshatra_lord=kundli_data.nakshatra_lord,
            planets=planets_response,
            houses=[HouseResponse(**h) for h in kundli_data.houses],
            yogas=kundli_data.yogas,
            ayanamsa=round(kundli_data.ayanamsa, 4),
            dasha_periods=dashas
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Kundli calculation error: {str(e)}"
        )


@router.post("/dasha")
async def get_dasha_periods(request: DashaRequest):
    """Calculate Vimshottari Dasha timeline from birth date and Moon position."""
    dashas = astrology_engine.calculate_vimshottari_dasha(
        dob=request.date_of_birth,
        moon_longitude=request.moon_longitude
    )
    return {"dasha_periods": dashas}


@router.get("/compatibility/{rashi1}/{rashi2}")
async def check_compatibility(rashi1: int, rashi2: int):
    """
    Check basic Kuta compatibility between two Moon signs (Rashis).
    Returns Ashtakoota-based compatibility score.
    """
    if not (0 <= rashi1 <= 11 and 0 <= rashi2 <= 11):
        raise HTTPException(status_code=400, detail="Rashi index must be between 0 and 11")

    RASHIS = [
        "Mesha", "Vrishabha", "Mithuna", "Karka",
        "Simha", "Kanya", "Tula", "Vrischika",
        "Dhanu", "Makara", "Kumbha", "Meena"
    ]

    diff = abs(rashi1 - rashi2)
    if diff > 6:
        diff = 12 - diff

    # Simplified scoring
    scores = {0: 36, 1: 20, 2: 28, 3: 30, 4: 20, 5: 18, 6: 25}
    score = scores.get(diff, 20)

    return {
        "rashi_1": RASHIS[rashi1],
        "rashi_2": RASHIS[rashi2],
        "total_score": score,
        "max_score": 36,
        "percentage": round(score / 36 * 100),
        "recommendation": "Excellent" if score >= 30 else "Good" if score >= 24 else "Average" if score >= 18 else "Challenging"
    }


@router.get("/yogas/{kundli_id}")
async def get_yogas(kundli_id: str):
    """Get yoga analysis for a Kundli (placeholder — extend with DB lookup)."""
    return {
        "kundli_id": kundli_id,
        "message": "Yoga analysis requires computed kundli data. Use /generate endpoint first."
    }
