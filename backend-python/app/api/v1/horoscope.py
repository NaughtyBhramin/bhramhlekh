"""Horoscope API Router"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from datetime import date, timedelta
from typing import Optional

from app.core.database import get_db

router = APIRouter()

RASHI_NAMES = [
    "Mesha", "Vrishabha", "Mithuna", "Karka",
    "Simha", "Kanya", "Tula", "Vrischika",
    "Dhanu", "Makara", "Kumbha", "Meena"
]

# Static horoscope data (in production, this would be AI-generated and stored in DB)
HOROSCOPE_DATA = {
    "Mesha": {
        "daily": "Powerful solar energies propel you forward. Leadership opportunities arise — trust your instincts and act decisively. Courage creates positive momentum in all spheres today.",
        "weekly": "This week brings exciting opportunities for advancement. Mars, your ruler, activates your third house of communication. Speak boldly and negotiations go in your favor.",
        "love": "Passion ignites. Bold romantic gestures win hearts. Single natives may encounter a vibrant, magnetic connection.",
        "career": "Initiative is powerfully rewarded. Take the lead on a stalled project today.",
        "health": "Physical vitality peaks. Channel abundant energy into sports or vigorous exercise.",
        "lucky_color": "Red", "lucky_number": 9, "lucky_gem": "Ruby", "lucky_day": "Tuesday",
        "love_score": 85, "career_score": 90, "health_score": 75, "finance_score": 78
    },
    "Vrishabha": {
        "daily": "Venus blesses your material world with grace and stability. Financial matters improve through patience. Resist impulse spending — methodical planning builds lasting security.",
        "weekly": "Venus transiting your second house brings material improvements. A long-standing financial matter resolves. Family harmony is highlighted.",
        "love": "Sensual, stable connections deepen beautifully. Long-term relationships find renewed warmth.",
        "career": "Steady persistence yields excellent financial rewards. Real estate and banking sectors are favorable.",
        "health": "Overindulgence needs mindful balance. Throat and neck care is important this week.",
        "lucky_color": "Green", "lucky_number": 6, "lucky_gem": "Diamond", "lucky_day": "Friday",
        "love_score": 90, "career_score": 70, "health_score": 65, "finance_score": 88
    },
    "Mithuna": {
        "daily": "Mercurial energy sharpens your intellect. Information flows freely and conversations lead to golden opportunities. Choose depth over scattered surface-level pursuits.",
        "weekly": "Mercury activates your communication sector. Excellent week for writing, negotiations, and learning new skills.",
        "love": "Witty banter sparks romantic interest. Mental connection is as vital as physical attraction.",
        "career": "Communication, writing, and negotiations bring success. Contracts finalize favorably.",
        "health": "Nervous system needs calming techniques. Breathwork and brief walking meditations help.",
        "lucky_color": "Yellow", "lucky_number": 5, "lucky_gem": "Emerald", "lucky_day": "Wednesday",
        "love_score": 75, "career_score": 88, "health_score": 70, "finance_score": 75
    },
    "Karka": {
        "daily": "The Moon amplifies your emotional intelligence. Family and home take center stage. Your intuition is a perfect compass — follow its gentle guidance without doubt.",
        "weekly": "Deep emotional processing leads to clarity. Home improvements or real estate matters progress positively.",
        "love": "Emotional vulnerability creates profound intimacy. Share your feelings openly with a trusted partner.",
        "career": "Nurturing professions and team leadership are highlighted. Your empathy makes you invaluable.",
        "health": "Emotional wellbeing equals physical health. Rest, hydrate, and spend time near water.",
        "lucky_color": "Silver", "lucky_number": 2, "lucky_gem": "Pearl", "lucky_day": "Monday",
        "love_score": 92, "career_score": 65, "health_score": 80, "finance_score": 70
    },
    "Simha": {
        "daily": "The royal Sun blazes with confidence through your chart. Recognition arrives — step forward and claim your deserved spotlight. Generosity attracts abundance.",
        "weekly": "Sun in your seventh house activates partnerships. A key collaboration brings mutual benefit and recognition.",
        "love": "Your magnetism is irresistible. Passionate encounters and grand romantic gestures are favored.",
        "career": "Creative leadership earns genuine admiration. Seek visibility — the spotlight belongs to you.",
        "health": "Exceptional vitality. Outdoor activities and sunshine restore your solar energy magnificently.",
        "lucky_color": "Gold", "lucky_number": 1, "lucky_gem": "Ruby", "lucky_day": "Sunday",
        "love_score": 88, "career_score": 95, "health_score": 85, "finance_score": 82
    },
    "Kanya": {
        "daily": "Analytical Mercury gifts you precision and clarity. Details others miss become your competitive advantage. Service-oriented work flourishes. Avoid over-criticism of self.",
        "weekly": "Mercury sharpens your discernment. Health routines established this week bring lasting benefits.",
        "love": "Small, practical acts of love speak volumes. Thoughtful gestures create deep emotional bonds.",
        "career": "Meticulous work yields exceptional results. Research, analysis, and healthcare projects excel.",
        "health": "Digestive system benefits from clean, mindful eating. Establish a consistent wellness routine.",
        "lucky_color": "Navy Blue", "lucky_number": 5, "lucky_gem": "Emerald", "lucky_day": "Wednesday",
        "love_score": 65, "career_score": 85, "health_score": 78, "finance_score": 80
    },
    "Tula": {
        "daily": "Venus weaves harmony through all interactions. Balance is the sacred theme. An important partnership decision becomes clearer through calm, centered reflection.",
        "weekly": "Venus blesses your relationships. Legal matters and partnerships reach favorable conclusions.",
        "love": "Romance flourishes under Venus's gracious light. New love for singles, renewed passion for couples.",
        "career": "Diplomatic skills shine brilliantly. Art, design, law, and negotiation bring recognition.",
        "health": "Kidneys and lower back need gentle care. Yoga and adequate hydration are essential.",
        "lucky_color": "Pink", "lucky_number": 6, "lucky_gem": "Diamond", "lucky_day": "Friday",
        "love_score": 95, "career_score": 80, "health_score": 72, "finance_score": 85
    },
    "Vrischika": {
        "daily": "Powerful transformative energies stir deep change. What was hidden emerges into light. Embrace change rather than resisting it. Regeneration is your greatest gift.",
        "weekly": "Mars and Ketu activate your investigative powers. Research breakthroughs and hidden resources surface.",
        "love": "Soul-deep connections become possible through authentic vulnerability and raw emotional honesty.",
        "career": "Research, investigation, and strategic thinking yield major breakthroughs. Finance excels.",
        "health": "Detoxification and deep rest support your regenerative powers profoundly.",
        "lucky_color": "Deep Red", "lucky_number": 8, "lucky_gem": "Red Coral", "lucky_day": "Tuesday",
        "love_score": 80, "career_score": 82, "health_score": 70, "finance_score": 78
    },
    "Dhanu": {
        "daily": "Expansive Jupiter opens new horizons. Adventure, philosophy, and higher wisdom call out to you. A foreign connection or opportunity presents remarkable possibilities today.",
        "weekly": "Jupiter expands your spiritual ninth house. A teaching or publishing opportunity arises unexpectedly.",
        "love": "Shared ideals and philosophical alignment create profound romantic connections.",
        "career": "International ventures, teaching, and publishing flourish under Jupiter's expansive grace.",
        "health": "Active outdoor pursuits restore your adventurous spirit. Hips and thighs need attention.",
        "lucky_color": "Yellow", "lucky_number": 3, "lucky_gem": "Yellow Sapphire", "lucky_day": "Thursday",
        "love_score": 78, "career_score": 88, "health_score": 82, "finance_score": 85
    },
    "Makara": {
        "daily": "Disciplined Saturn rewards your patient perseverance. Recognition for sustained effort arrives. Build steadily — your unshakeable foundation inspires confidence in all around you.",
        "weekly": "Saturn activates your tenth house of career. A promotion or major responsibility comes your way.",
        "love": "Commitment and reliability are deeply treasured. Relationships built on trust deepen beautifully.",
        "career": "Career advancement through disciplined diligence and long-term planning. Government sectors favor you.",
        "health": "Bone and joint care is essential. Structured routines and adequate sleep are non-negotiable.",
        "lucky_color": "Dark Blue", "lucky_number": 8, "lucky_gem": "Blue Sapphire", "lucky_day": "Saturday",
        "love_score": 70, "career_score": 92, "health_score": 75, "finance_score": 88
    },
    "Kumbha": {
        "daily": "Visionary Uranus channels revolutionary ideas through your brilliant mind. Humanitarian causes are energized. Your unique perspective is your superpower — do not conform to small expectations.",
        "weekly": "Saturn and Rahu activate your social network. A group effort brings collective success and recognition.",
        "love": "Unconventional connections spark authentic love. Mental compatibility is absolutely essential.",
        "career": "Technology, innovation, and social reform bring recognition and breakthrough opportunities.",
        "health": "Nervous system needs rest and restoration. Digital detox and time in nature help enormously.",
        "lucky_color": "Electric Blue", "lucky_number": 4, "lucky_gem": "Amethyst", "lucky_day": "Saturday",
        "love_score": 75, "career_score": 90, "health_score": 68, "finance_score": 80
    },
    "Meena": {
        "daily": "Neptune weaves spiritual magic through your day. Dreams carry divine messages. Creative and intuitive gifts are amplified. Compassion heals both you and everyone you touch.",
        "weekly": "Jupiter in your third house activates creative communication. An artistic project gains recognition.",
        "love": "Soulmate energy surrounds you. Unconditional love and deep spiritual partnership are highlighted.",
        "career": "Art, healing, music, and spiritual work flow with divine ease. Trust your intuition completely.",
        "health": "Emotional and spiritual wellbeing is physical health. Meditation and water therapy restore harmony.",
        "lucky_color": "Sea Green", "lucky_number": 7, "lucky_gem": "Yellow Sapphire", "lucky_day": "Thursday",
        "love_score": 92, "career_score": 72, "health_score": 80, "finance_score": 70
    }
}


@router.get("/daily/{rashi_name}")
async def get_daily_horoscope(rashi_name: str):
    """Get today's horoscope for a specific rashi."""
    rashi_name = rashi_name.capitalize()
    data = HOROSCOPE_DATA.get(rashi_name)
    if not data:
        rashi_names_list = list(HOROSCOPE_DATA.keys())
        return {"error": f"Rashi '{rashi_name}' not found", "valid_rashis": rashi_names_list}

    return {
        "rashi": rashi_name,
        "date": str(date.today()),
        "type": "daily",
        "prediction": data["daily"],
        "love": data["love"],
        "career": data["career"],
        "health": data["health"],
        "scores": {
            "love": data["love_score"],
            "career": data["career_score"],
            "health": data["health_score"],
            "finance": data["finance_score"]
        },
        "lucky": {
            "color": data["lucky_color"],
            "number": data["lucky_number"],
            "gem": data["lucky_gem"],
            "day": data["lucky_day"]
        }
    }


@router.get("/weekly/{rashi_name}")
async def get_weekly_horoscope(rashi_name: str):
    """Get this week's horoscope."""
    rashi_name = rashi_name.capitalize()
    data = HOROSCOPE_DATA.get(rashi_name)
    if not data:
        return {"error": f"Rashi not found"}

    today = date.today()
    week_start = today - timedelta(days=today.weekday())
    week_end = week_start + timedelta(days=6)

    return {
        "rashi": rashi_name,
        "week_from": str(week_start),
        "week_to": str(week_end),
        "type": "weekly",
        "prediction": data["weekly"],
        "scores": {
            "love": data["love_score"],
            "career": data["career_score"],
            "health": data["health_score"],
            "finance": data["finance_score"]
        }
    }


@router.get("/all/daily")
async def get_all_daily_horoscopes():
    """Get today's horoscope for all 12 rashis."""
    result = {}
    for rashi, data in HOROSCOPE_DATA.items():
        result[rashi] = {
            "prediction": data["daily"],
            "scores": {
                "love": data["love_score"],
                "career": data["career_score"],
                "health": data["health_score"],
                "finance": data["finance_score"]
            },
            "lucky_color": data["lucky_color"],
            "lucky_gem": data["lucky_gem"]
        }
    return {"date": str(date.today()), "horoscopes": result}
