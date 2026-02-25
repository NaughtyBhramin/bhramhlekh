"""Transits API Router"""
from fastapi import APIRouter
from datetime import date

router = APIRouter()

CURRENT_TRANSITS = [
    {"planet": "Sun", "symbol": "☉", "sign": "Aquarius", "degree": 15.3, "is_retrograde": False,
     "effects": "Focus on community, humanitarian ideals, and innovative thinking.", "color": "#f39c12"},
    {"planet": "Moon", "symbol": "☽", "sign": "Scorpio", "degree": 22.7, "is_retrograde": False,
     "effects": "Deep emotional undercurrents. Excellent for meditation and healing.", "color": "#ecf0f1"},
    {"planet": "Mars", "symbol": "♂", "sign": "Gemini", "degree": 18.4, "is_retrograde": False,
     "effects": "Mental energy elevated. Favorable for debates and quick decisions.", "color": "#e74c3c"},
    {"planet": "Mercury", "symbol": "☿", "sign": "Aquarius", "degree": 8.1, "is_retrograde": False,
     "effects": "Brilliant ideas flow. Technology and unconventional communication flourish.", "color": "#2ecc71"},
    {"planet": "Jupiter", "symbol": "♃", "sign": "Taurus", "degree": 12.9, "is_retrograde": False,
     "effects": "Steady material abundance. Wealth through patience and methodical effort.", "color": "#f1c40f"},
    {"planet": "Venus", "symbol": "♀", "sign": "Pisces", "degree": 14.5, "is_retrograde": False,
     "effects": "Romantic and spiritual peak. Art, compassion, and unconditional love highlighted.", "color": "#e91e63"},
    {"planet": "Saturn", "symbol": "♄", "sign": "Pisces", "degree": 19.2, "is_retrograde": False,
     "effects": "Karmic lessons around spiritual boundaries. Discipline in creative endeavors.", "color": "#607d8b"},
    {"planet": "Rahu", "symbol": "☊", "sign": "Pisces", "degree": 4.6, "is_retrograde": True,
     "effects": "Karmic pull toward spirituality and transcendence. Watch for self-deception.", "color": "#9c27b0"},
    {"planet": "Ketu", "symbol": "☋", "sign": "Virgo", "degree": 4.6, "is_retrograde": True,
     "effects": "Spiritual detachment and analytical past life karma. Healing gifts activated.", "color": "#795548"},
]


@router.get("/current")
async def get_current_transits():
    return {"date": str(date.today()), "transits": CURRENT_TRANSITS}


@router.get("/planet/{planet_name}")
async def get_planet_transit(planet_name: str):
    planet = next((t for t in CURRENT_TRANSITS if t["planet"].lower() == planet_name.lower()), None)
    if not planet:
        return {"error": f"Planet '{planet_name}' not found"}
    return planet
