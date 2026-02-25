"""Rashis API Router"""
from fastapi import APIRouter
router = APIRouter()

RASHIS_DATA = [
    {"id": 1, "name": "Mesha", "english": "Aries", "symbol": "♈", "ruler": "Mars",
     "element": "Fire", "quality": "Cardinal", "dates": "Mar 21 – Apr 19",
     "traits": ["Courageous", "Dynamic", "Leader", "Impulsive"],
     "description": "The first sign, ruled by Mars. Dynamic, pioneering, and full of raw energy."},
    {"id": 2, "name": "Vrishabha", "english": "Taurus", "symbol": "♉", "ruler": "Venus",
     "element": "Earth", "quality": "Fixed", "dates": "Apr 20 – May 20",
     "traits": ["Stable", "Loyal", "Sensual", "Patient"],
     "description": "The second sign, ruled by Venus. Deeply sensual, reliable, and pleasure-loving."},
    {"id": 3, "name": "Mithuna", "english": "Gemini", "symbol": "♊", "ruler": "Mercury",
     "element": "Air", "quality": "Mutable", "dates": "May 21 – Jun 20",
     "traits": ["Witty", "Curious", "Adaptable", "Communicative"],
     "description": "The third sign, ruled by Mercury. Quick-witted, versatile, and eternally curious."},
    {"id": 4, "name": "Karka", "english": "Cancer", "symbol": "♋", "ruler": "Moon",
     "element": "Water", "quality": "Cardinal", "dates": "Jun 21 – Jul 22",
     "traits": ["Nurturing", "Intuitive", "Emotional", "Protective"],
     "description": "The fourth sign, ruled by Moon. Deeply empathetic, intuitive, and home-loving."},
    {"id": 5, "name": "Simha", "english": "Leo", "symbol": "♌", "ruler": "Sun",
     "element": "Fire", "quality": "Fixed", "dates": "Jul 23 – Aug 22",
     "traits": ["Regal", "Generous", "Creative", "Proud"],
     "description": "The fifth sign, ruled by Sun. Noble, generous, and supremely confident."},
    {"id": 6, "name": "Kanya", "english": "Virgo", "symbol": "♍", "ruler": "Mercury",
     "element": "Earth", "quality": "Mutable", "dates": "Aug 23 – Sep 22",
     "traits": ["Analytical", "Precise", "Helpful", "Critical"],
     "description": "The sixth sign, ruled by Mercury. Meticulous, service-oriented, and deeply analytical."},
    {"id": 7, "name": "Tula", "english": "Libra", "symbol": "♎", "ruler": "Venus",
     "element": "Air", "quality": "Cardinal", "dates": "Sep 23 – Oct 22",
     "traits": ["Balanced", "Fair", "Social", "Diplomatic"],
     "description": "The seventh sign, ruled by Venus. Seeks harmony, beauty, and justice in all things."},
    {"id": 8, "name": "Vrischika", "english": "Scorpio", "symbol": "♏", "ruler": "Mars",
     "element": "Water", "quality": "Fixed", "dates": "Oct 23 – Nov 21",
     "traits": ["Intense", "Perceptive", "Transformative", "Secretive"],
     "description": "The eighth sign, ruled by Mars. Intensely perceptive and powerfully transformative."},
    {"id": 9, "name": "Dhanu", "english": "Sagittarius", "symbol": "♐", "ruler": "Jupiter",
     "element": "Fire", "quality": "Mutable", "dates": "Nov 22 – Dec 21",
     "traits": ["Philosophical", "Adventurous", "Optimistic", "Blunt"],
     "description": "The ninth sign, ruled by Jupiter. Endlessly optimistic and freedom-loving."},
    {"id": 10, "name": "Makara", "english": "Capricorn", "symbol": "♑", "ruler": "Saturn",
     "element": "Earth", "quality": "Cardinal", "dates": "Dec 22 – Jan 19",
     "traits": ["Disciplined", "Ambitious", "Patient", "Practical"],
     "description": "The tenth sign, ruled by Saturn. Supremely disciplined and patient."},
    {"id": 11, "name": "Kumbha", "english": "Aquarius", "symbol": "♒", "ruler": "Saturn",
     "element": "Air", "quality": "Fixed", "dates": "Jan 20 – Feb 18",
     "traits": ["Innovative", "Humanitarian", "Visionary", "Rebellious"],
     "description": "The eleventh sign, ruled by Saturn. Progressive and brilliantly innovative."},
    {"id": 12, "name": "Meena", "english": "Pisces", "symbol": "♓", "ruler": "Jupiter",
     "element": "Water", "quality": "Mutable", "dates": "Feb 19 – Mar 20",
     "traits": ["Compassionate", "Dreamy", "Spiritual", "Artistic"],
     "description": "The twelfth sign, ruled by Jupiter. Deeply compassionate and spiritually attuned."},
]


@router.get("/")
async def get_all_rashis():
    return {"count": 12, "rashis": RASHIS_DATA}


@router.get("/{rashi_id}")
async def get_rashi(rashi_id: int):
    rashi = next((r for r in RASHIS_DATA if r["id"] == rashi_id), None)
    if not rashi:
        return {"error": "Rashi not found"}
    return rashi
