"""Remedies API Router"""
from fastapi import APIRouter
router = APIRouter()

REMEDIES = [
    {"planet": "Sun", "category": "mantra", "title": "Surya Beej Mantra",
     "mantra": "Om Hraam Hreem Hraum Sah Suryaya Namah", "gemstone": "Ruby",
     "day": "Sunday", "color": "Red", "duration": "108 times at sunrise",
     "description": "Chant the seed mantra of Sun to strengthen solar energy, gain confidence, leadership, and government favor."},
    {"planet": "Moon", "category": "fasting", "title": "Somvar Vrat (Monday Fast)",
     "mantra": "Om Shraam Shreem Shraum Sah Chandraya Namah", "gemstone": "Pearl",
     "day": "Monday", "color": "White", "duration": "Every Monday",
     "description": "Observe fast on Mondays. Consume only white foods and milk. Offer white flowers to Shiva at sunset."},
    {"planet": "Mars", "category": "puja", "title": "Hanuman Puja",
     "mantra": "Om Kraam Kreem Kraum Sah Bhauma Namah", "gemstone": "Red Coral",
     "day": "Tuesday", "color": "Red", "duration": "Every Tuesday",
     "description": "Worship Lord Hanuman with red flowers, sindoor, and sesame oil lamp. Recite Hanuman Chalisa."},
    {"planet": "Mercury", "category": "donation", "title": "Mercury Donation",
     "mantra": "Om Braam Breem Braum Sah Budhaya Namah", "gemstone": "Emerald",
     "day": "Wednesday", "color": "Green", "duration": "Every Wednesday",
     "description": "Donate green items (green cloth, mung beans) to students on Wednesdays to strengthen Mercury."},
    {"planet": "Jupiter", "category": "mantra", "title": "Guru Beej Mantra",
     "mantra": "Om Graam Greem Graum Sah Gurave Namah", "gemstone": "Yellow Sapphire",
     "day": "Thursday", "color": "Yellow", "duration": "108 times on Thursdays",
     "description": "Chanting Jupiter's mantra attracts wisdom, prosperity, children, and spiritual growth."},
    {"planet": "Venus", "category": "yantra", "title": "Shukra Yantra",
     "mantra": "Om Draam Dreem Draum Sah Shukraya Namah", "gemstone": "Diamond",
     "day": "Friday", "color": "White", "duration": "Install and worship daily",
     "description": "Install a copper Shukra Yantra at home on Fridays. Attracts love, beauty, abundance, and harmony."},
    {"planet": "Saturn", "category": "puja", "title": "Shani Temple Puja",
     "mantra": "Om Praam Preem Praum Sah Shanaischaraya Namah", "gemstone": "Blue Sapphire",
     "day": "Saturday", "color": "Black", "duration": "Every Saturday",
     "description": "Visit Shani temple on Saturdays. Offer sesame seeds, black cloth, and mustard oil."},
    {"planet": "Rahu", "category": "mantra", "title": "Rahu Beej Mantra",
     "mantra": "Om Bhram Bhreem Bhraum Sah Rahave Namah", "gemstone": "Hessonite",
     "day": "Saturday", "color": "Smoky", "duration": "108 times daily",
     "description": "Reduces malefic Rahu effects including sudden reversals, obsessions, and karmic confusion."},
    {"planet": "Ketu", "category": "mantra", "title": "Ketu Beej Mantra",
     "mantra": "Om Sraam Sreem Sraum Sah Ketave Namah", "gemstone": "Cat's Eye",
     "day": "Tuesday", "color": "Multi", "duration": "108 times daily",
     "description": "Enhances spiritual growth, psychic abilities, and reduces accidents and confusion."},
    {"planet": None, "category": "herb", "title": "Brahmi for Mental Peace",
     "mantra": None, "gemstone": None, "day": None, "color": "Green",
     "duration": "Daily with warm milk",
     "description": "Brahmi (Bacopa monnieri) strengthens Mercury and Moon. Enhances memory, clarity, and calmness."},
    {"planet": None, "category": "herb", "title": "Ashwagandha for Vitality",
     "mantra": None, "gemstone": None, "day": None, "color": "White",
     "duration": "Daily with warm milk",
     "description": "Strengthens Mars energy. Boosts immunity, builds physical strength, reduces stress and cortisol."},
]


@router.get("/")
async def get_all_remedies(category: str = None, planet: str = None):
    remedies = REMEDIES
    if category:
        remedies = [r for r in remedies if r["category"] == category.lower()]
    if planet:
        remedies = [r for r in remedies if r["planet"] and r["planet"].lower() == planet.lower()]
    return {"count": len(remedies), "remedies": remedies}


@router.get("/planet/{planet_name}")
async def get_planet_remedies(planet_name: str):
    remedies = [r for r in REMEDIES if r["planet"] and r["planet"].lower() == planet_name.lower()]
    if not remedies:
        return {"error": f"No remedies found for planet '{planet_name}'"}
    return {"planet": planet_name, "remedies": remedies}
