"""Planets API Router"""
from fastapi import APIRouter
router = APIRouter()

PLANETS_DATA = [
    {"name": "Sun", "sanskrit": "Surya", "symbol": "☉", "nature": "malefic", "day": "Sunday",
     "gemstone": "Ruby", "metal": "Gold", "color": "Gold/Orange",
     "mantra": "Om Hraam Hreem Hraum Sah Suryaya Namah",
     "description": "King of planets. Represents soul, father, authority, vitality, and government."},
    {"name": "Moon", "sanskrit": "Chandra", "symbol": "☽", "nature": "benefic", "day": "Monday",
     "gemstone": "Pearl", "metal": "Silver", "color": "White",
     "mantra": "Om Shraam Shreem Shraum Sah Chandraya Namah",
     "description": "Represents mind, mother, emotions, intuition, and domestic happiness."},
    {"name": "Mars", "sanskrit": "Mangal", "symbol": "♂", "nature": "malefic", "day": "Tuesday",
     "gemstone": "Red Coral", "metal": "Copper", "color": "Red",
     "mantra": "Om Kraam Kreem Kraum Sah Bhauma Namah",
     "description": "Planet of energy, courage, property, siblings, and physical strength."},
    {"name": "Mercury", "sanskrit": "Budha", "symbol": "☿", "nature": "neutral", "day": "Wednesday",
     "gemstone": "Emerald", "metal": "Bronze", "color": "Green",
     "mantra": "Om Braam Breem Braum Sah Budhaya Namah",
     "description": "Governs intellect, communication, business, and analytical thinking."},
    {"name": "Jupiter", "sanskrit": "Guru", "symbol": "♃", "nature": "benefic", "day": "Thursday",
     "gemstone": "Yellow Sapphire", "metal": "Gold", "color": "Yellow",
     "mantra": "Om Graam Greem Graum Sah Gurave Namah",
     "description": "Guru of the gods. Bestows wisdom, prosperity, children, and spirituality."},
    {"name": "Venus", "sanskrit": "Shukra", "symbol": "♀", "nature": "benefic", "day": "Friday",
     "gemstone": "Diamond", "metal": "Silver", "color": "White/Pink",
     "mantra": "Om Draam Dreem Draum Sah Shukraya Namah",
     "description": "Planet of love, beauty, luxury, arts, relationships, and material comforts."},
    {"name": "Saturn", "sanskrit": "Shani", "symbol": "♄", "nature": "malefic", "day": "Saturday",
     "gemstone": "Blue Sapphire", "metal": "Iron", "color": "Blue/Black",
     "mantra": "Om Praam Preem Praum Sah Shanaischaraya Namah",
     "description": "Planet of karma, discipline, delays, hardship, and ultimate liberation."},
    {"name": "Rahu", "sanskrit": "Rahu", "symbol": "☊", "nature": "malefic", "day": "Saturday",
     "gemstone": "Hessonite", "metal": "Lead", "color": "Smoky",
     "mantra": "Om Bhram Bhreem Bhraum Sah Rahave Namah",
     "description": "North node of Moon. Karmic desires, foreign connections, and material ambition."},
    {"name": "Ketu", "sanskrit": "Ketu", "symbol": "☋", "nature": "malefic", "day": "Tuesday",
     "gemstone": "Cat's Eye", "metal": "Lead", "color": "Multi-colored",
     "mantra": "Om Sraam Sreem Sraum Sah Ketave Namah",
     "description": "South node of Moon. Spirituality, moksha, past life karma, and mysticism."},
]


@router.get("/")
async def get_all_planets():
    return {"count": len(PLANETS_DATA), "planets": PLANETS_DATA}


@router.get("/{planet_name}")
async def get_planet(planet_name: str):
    planet = next((p for p in PLANETS_DATA if p["name"].lower() == planet_name.lower()), None)
    if not planet:
        return {"error": f"Planet '{planet_name}' not found"}
    return planet
