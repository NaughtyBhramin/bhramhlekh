"""Compatibility API Router"""
from fastapi import APIRouter
router = APIRouter()


@router.get("/{rashi1}/{rashi2}")
async def get_compatibility(rashi1: int, rashi2: int):
    RASHIS = ["Mesha","Vrishabha","Mithuna","Karka","Simha","Kanya",
              "Tula","Vrischika","Dhanu","Makara","Kumbha","Meena"]
    if not (1 <= rashi1 <= 12 and 1 <= rashi2 <= 12):
        return {"error": "Rashi must be between 1 and 12"}
    r1, r2 = rashi1 - 1, rashi2 - 1
    diff = abs(r1 - r2)
    if diff > 6:
        diff = 12 - diff
    score_map = {0: 36, 1: 20, 2: 28, 3: 30, 4: 20, 5: 18, 6: 25}
    score = score_map.get(diff, 20)
    return {
        "rashi_1": RASHIS[r1], "rashi_2": RASHIS[r2],
        "total_score": score, "max_score": 36,
        "percentage": round(score / 36 * 100),
        "recommendation": "Excellent" if score >= 30 else "Good" if score >= 24 else "Average" if score >= 18 else "Challenging"
    }
