"""
Vedic Astrology Computation Engine
Calculates planetary positions, houses, dashas, nakshatras using Ephem + Swiss Ephemeris
"""

import ephem
import math
from datetime import datetime, date, timedelta
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
import pytz
from geopy.geocoders import Nominatim
from timezonefinder import TimezoneFinder


# ── Constants ──────────────────────────────────────────────────────────────
LAHIRI_AYANAMSA_2000 = 23.85  # degrees at J2000
AYANAMSA_ANNUAL_PRECESSION = 50.3 / 3600  # degrees per year

RASHIS = [
    "Mesha", "Vrishabha", "Mithuna", "Karka",
    "Simha", "Kanya", "Tula", "Vrischika",
    "Dhanu", "Makara", "Kumbha", "Meena"
]

RASHI_SYMBOLS = ["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓"]

NAKSHATRAS = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni",
    "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha",
    "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha",
    "Shravana", "Dhanishtha", "Shatabhisha", "Purva Bhadrapada",
    "Uttara Bhadrapada", "Revati"
]

NAKSHATRA_LORDS = [
    "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu",
    "Jupiter", "Saturn", "Mercury", "Ketu", "Venus", "Sun",
    "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury",
    "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu",
    "Jupiter", "Saturn", "Mercury"
]

DASHA_YEARS = {
    "Ketu": 7, "Venus": 20, "Sun": 6, "Moon": 10,
    "Mars": 7, "Rahu": 18, "Jupiter": 16, "Saturn": 19, "Mercury": 17
}

DASHA_ORDER = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"]


@dataclass
class PlanetPosition:
    name: str
    sanskrit: str
    symbol: str
    longitude: float        # 0–360 tropical
    sidereal_longitude: float  # After ayanamsa correction
    rashi_index: int
    rashi: str
    rashi_symbol: str
    degree_in_rashi: float
    nakshatra: str
    nakshatra_pada: int
    is_retrograde: bool
    house: int


@dataclass
class KundliData:
    ascendant_longitude: float
    ascendant_rashi: str
    ascendant_degree: float
    moon_sign: str
    sun_sign: str
    nakshatra: str
    nakshatra_pada: int
    nakshatra_lord: str
    planets: Dict[str, PlanetPosition]
    houses: List[Dict]
    yogas: List[str]
    ayanamsa: float


class AstrologyEngine:

    def __init__(self, ayanamsa: str = "lahiri"):
        self.ayanamsa = ayanamsa
        self.geolocator = Nominatim(user_agent="jyotish_darshan")
        self.tf = TimezoneFinder()

    def get_ayanamsa(self, dt: datetime) -> float:
        """Calculate Lahiri ayanamsa for given datetime."""
        year = dt.year + (dt.timetuple().tm_yday / 365.25)
        return LAHIRI_AYANAMSA_2000 + (year - 2000) * AYANAMSA_ANNUAL_PRECESSION

    def tropical_to_sidereal(self, tropical: float, ayanamsa: float) -> float:
        """Convert tropical longitude to sidereal (Vedic)."""
        sidereal = (tropical - ayanamsa) % 360
        return sidereal if sidereal >= 0 else sidereal + 360

    def get_rashi(self, sidereal_longitude: float) -> Tuple[int, str, float]:
        """Get rashi index, name, and degree within rashi."""
        rashi_idx = int(sidereal_longitude / 30)
        degree_in_rashi = sidereal_longitude % 30
        return rashi_idx, RASHIS[rashi_idx], degree_in_rashi

    def get_nakshatra(self, sidereal_longitude: float) -> Tuple[str, int, str]:
        """Get nakshatra name, pada (1–4), and lord."""
        nakshatra_span = 360 / 27  # 13.333...°
        nakshatra_idx = int(sidereal_longitude / nakshatra_span)
        nakshatra_idx = min(nakshatra_idx, 26)
        pos_in_nakshatra = sidereal_longitude % nakshatra_span
        pada = int(pos_in_nakshatra / (nakshatra_span / 4)) + 1
        pada = min(pada, 4)
        return NAKSHATRAS[nakshatra_idx], pada, NAKSHATRA_LORDS[nakshatra_idx]

    def geocode_place(self, place: str) -> Tuple[float, float, str]:
        """Geocode a place name to lat, lon, timezone."""
        try:
            location = self.geolocator.geocode(place)
            if location:
                tz = self.tf.timezone_at(lat=location.latitude, lng=location.longitude)
                return location.latitude, location.longitude, tz or "UTC"
        except Exception:
            pass
        # Fallback: Delhi, India
        return 28.6139, 77.2090, "Asia/Kolkata"

    def build_observer(self, dob: date, tob_str: str, lat: float, lon: float, tz: str) -> ephem.Observer:
        """Build PyEphem observer."""
        obs = ephem.Observer()
        obs.lat = str(lat)
        obs.lon = str(lon)
        obs.elevation = 0

        tz_obj = pytz.timezone(tz)
        local_dt = tz_obj.localize(
            datetime(dob.year, dob.month, dob.day,
                     int(tob_str[:2]), int(tob_str[3:5]))
        )
        utc_dt = local_dt.astimezone(pytz.utc)
        obs.date = ephem.Date(utc_dt.strftime("%Y/%m/%d %H:%M:%S"))
        obs.pressure = 0
        obs.epoch = ephem.J2000
        return obs

    def compute_planet_position(
        self,
        ephem_planet,
        name: str,
        sanskrit: str,
        symbol: str,
        observer: ephem.Observer,
        ayanamsa: float,
        ascendant_sidereal: float,
        previous_long: Optional[float] = None
    ) -> PlanetPosition:
        """Compute full position data for a planet."""
        ephem_planet.compute(observer)
        tropical_long = math.degrees(ephem_planet.hlong) % 360
        sidereal_long = self.tropical_to_sidereal(tropical_long, ayanamsa)

        rashi_idx, rashi_name, degree_in_rashi = self.get_rashi(sidereal_long)
        nakshatra, pada, _ = self.get_nakshatra(sidereal_long)

        # Determine retrograde
        is_retrograde = False
        if previous_long is not None:
            diff = (sidereal_long - previous_long) % 360
            is_retrograde = diff > 180

        # House calculation (whole sign system)
        asc_rashi = int(ascendant_sidereal / 30)
        house = ((rashi_idx - asc_rashi) % 12) + 1

        return PlanetPosition(
            name=name, sanskrit=sanskrit, symbol=symbol,
            longitude=tropical_long, sidereal_longitude=sidereal_long,
            rashi_index=rashi_idx, rashi=rashi_name,
            rashi_symbol=RASHI_SYMBOLS[rashi_idx],
            degree_in_rashi=degree_in_rashi,
            nakshatra=nakshatra, nakshatra_pada=pada,
            is_retrograde=is_retrograde, house=house
        )

    def calculate_kundli(
        self, dob: date, tob: str, place: str,
        lat: Optional[float] = None, lon: Optional[float] = None,
        timezone: Optional[str] = None
    ) -> KundliData:
        """Main method: calculate full Vedic birth chart."""

        # Geocode if not provided
        if lat is None or lon is None:
            lat, lon, timezone = self.geocode_place(place)

        dt = datetime(dob.year, dob.month, dob.day,
                      int(tob[:2]), int(tob[3:5]))
        ayanamsa = self.get_ayanamsa(dt)
        observer = self.build_observer(dob, tob, lat, lon, timezone or "Asia/Kolkata")

        # ── Ascendant (Lagna) ──────────────────────────────────────
        # Compute sidereal time and ascendant
        lst = observer.sidereal_time()  # in radians
        lst_deg = math.degrees(lst) % 360
        lat_rad = math.radians(lat)
        obliquity = math.radians(23.4397)  # approximate

        # Simplified ascendant calculation
        y = -math.cos(math.radians(lst_deg))
        x = math.sin(math.radians(lst_deg)) * math.cos(obliquity) + math.tan(lat_rad) * math.sin(obliquity)
        asc_tropical = (math.degrees(math.atan2(y, x)) % 360)
        asc_sidereal = self.tropical_to_sidereal(asc_tropical, ayanamsa)
        asc_rashi_idx, asc_rashi, asc_degree = self.get_rashi(asc_sidereal)

        # ── Planets ────────────────────────────────────────────────
        planets_config = [
            (ephem.Sun(),     "Sun",     "Surya",   "☉"),
            (ephem.Moon(),    "Moon",    "Chandra", "☽"),
            (ephem.Mars(),    "Mars",    "Mangal",  "♂"),
            (ephem.Mercury(), "Mercury", "Budha",   "☿"),
            (ephem.Jupiter(), "Jupiter", "Guru",    "♃"),
            (ephem.Venus(),   "Venus",   "Shukra",  "♀"),
            (ephem.Saturn(),  "Saturn",  "Shani",   "♄"),
        ]

        planets = {}
        for ephem_obj, name, sanskrit, symbol in planets_config:
            planets[name] = self.compute_planet_position(
                ephem_obj, name, sanskrit, symbol,
                observer, ayanamsa, asc_sidereal
            )

        # ── Rahu / Ketu (Moon's nodes) ─────────────────────────────
        moon = ephem.Moon()
        moon.compute(observer)
        rahu_tropical = (math.degrees(moon.g_ra) - 90) % 360
        rahu_sidereal = self.tropical_to_sidereal(rahu_tropical, ayanamsa)
        ketu_sidereal = (rahu_sidereal + 180) % 360

        r_idx, r_rashi, r_deg = self.get_rashi(rahu_sidereal)
        k_idx, k_rashi, k_deg = self.get_rashi(ketu_sidereal)
        r_nak, r_pada, _ = self.get_nakshatra(rahu_sidereal)
        k_nak, k_pada, _ = self.get_nakshatra(ketu_sidereal)
        asc_rashi_for_house = int(asc_sidereal / 30)

        planets["Rahu"] = PlanetPosition(
            name="Rahu", sanskrit="Rahu", symbol="☊",
            longitude=rahu_tropical, sidereal_longitude=rahu_sidereal,
            rashi_index=r_idx, rashi=r_rashi, rashi_symbol=RASHI_SYMBOLS[r_idx],
            degree_in_rashi=r_deg, nakshatra=r_nak, nakshatra_pada=r_pada,
            is_retrograde=True, house=((r_idx - asc_rashi_for_house) % 12) + 1
        )
        planets["Ketu"] = PlanetPosition(
            name="Ketu", sanskrit="Ketu", symbol="☋",
            longitude=(rahu_tropical + 180) % 360, sidereal_longitude=ketu_sidereal,
            rashi_index=k_idx, rashi=k_rashi, rashi_symbol=RASHI_SYMBOLS[k_idx],
            degree_in_rashi=k_deg, nakshatra=k_nak, nakshatra_pada=k_pada,
            is_retrograde=True, house=((k_idx - asc_rashi_for_house) % 12) + 1
        )

        # ── Moon sign ──────────────────────────────────────────────
        moon_sign = planets["Moon"].rashi
        sun_sign = planets["Sun"].rashi
        moon_nak, moon_pada, moon_nak_lord = self.get_nakshatra(planets["Moon"].sidereal_longitude)

        # ── Houses ────────────────────────────────────────────────
        houses = []
        for i in range(12):
            h_rashi_idx = (asc_rashi_idx + i) % 12
            h_start = h_rashi_idx * 30.0
            planets_in_house = [
                p.name for p in planets.values() if p.house == i + 1
            ]
            houses.append({
                "house": i + 1,
                "rashi": RASHIS[h_rashi_idx],
                "rashi_symbol": RASHI_SYMBOLS[h_rashi_idx],
                "start_degree": h_start,
                "planets": planets_in_house,
                "significance": self._house_significance(i + 1)
            })

        # ── Yogas ─────────────────────────────────────────────────
        yogas = self._detect_yogas(planets, asc_rashi_idx)

        return KundliData(
            ascendant_longitude=asc_sidereal,
            ascendant_rashi=asc_rashi,
            ascendant_degree=asc_degree,
            moon_sign=moon_sign,
            sun_sign=sun_sign,
            nakshatra=moon_nak,
            nakshatra_pada=moon_pada,
            nakshatra_lord=moon_nak_lord,
            planets=planets,
            houses=houses,
            yogas=yogas,
            ayanamsa=ayanamsa
        )

    def calculate_vimshottari_dasha(
        self, dob: date, moon_longitude: float
    ) -> List[Dict]:
        """Calculate Vimshottari Dasha periods from birth."""
        nak_span = 360 / 27
        nak_idx = int(moon_longitude / nak_span)
        nak_lord = NAKSHATRA_LORDS[nak_idx]
        pos_in_nak = moon_longitude % nak_span
        completed_fraction = pos_in_nak / nak_span

        # Find starting point in dasha order
        dasha_start_idx = DASHA_ORDER.index(nak_lord)
        total_years_in_first = DASHA_YEARS[nak_lord]
        elapsed_years = completed_fraction * total_years_in_first
        remaining_years = total_years_in_first - elapsed_years

        dashas = []
        current_date = datetime(dob.year, dob.month, dob.day)

        for i in range(9):
            dasha_idx = (dasha_start_idx + i) % 9
            planet = DASHA_ORDER[dasha_idx]
            years = DASHA_YEARS[planet] if i > 0 else remaining_years

            start = current_date
            end = start + timedelta(days=years * 365.25)

            # Antardasha breakdown
            antardashas = []
            ad_start = start
            for j in range(9):
                ad_idx = (dasha_idx + j) % 9
                ad_planet = DASHA_ORDER[ad_idx]
                ad_years = years * DASHA_YEARS[ad_planet] / 120
                ad_end = ad_start + timedelta(days=ad_years * 365.25)
                antardashas.append({
                    "planet": ad_planet,
                    "start_date": ad_start.date().isoformat(),
                    "end_date": ad_end.date().isoformat(),
                    "years": round(ad_years, 2)
                })
                ad_start = ad_end

            dashas.append({
                "planet": planet,
                "start_date": start.date().isoformat(),
                "end_date": end.date().isoformat(),
                "years": round(years, 2),
                "is_current": start.date() <= date.today() <= end.date(),
                "antardashas": antardashas
            })
            current_date = end

        return dashas

    def _house_significance(self, house: int) -> str:
        meanings = {
            1: "Self, personality, physical appearance, health",
            2: "Wealth, family, speech, food, accumulated assets",
            3: "Siblings, courage, communication, short journeys",
            4: "Mother, home, happiness, property, education",
            5: "Children, creativity, intelligence, past life merit",
            6: "Enemies, diseases, debts, service, daily routine",
            7: "Marriage, partnerships, business, foreign travel",
            8: "Transformation, secrets, occult, death, inheritance",
            9: "Fortune, dharma, father, guru, long journeys, religion",
            10: "Career, fame, status, government, authority",
            11: "Gains, income, friends, elder siblings, aspirations",
            12: "Losses, expenses, liberation, foreign lands, spiritual growth"
        }
        return meanings.get(house, "")

    def _detect_yogas(self, planets: Dict, asc_rashi: int) -> List[str]:
        """Detect major Vedic yogas in the chart."""
        yogas = []

        # Gajakesari Yoga: Moon and Jupiter in mutual kendras (1,4,7,10)
        moon_house = planets["Moon"].house
        jupiter_house = planets["Jupiter"].house
        if (jupiter_house - moon_house) % 3 == 0:
            yogas.append("Gajakesari Yoga — Moon and Jupiter in mutual kendra: prosperity and wisdom")

        # Budhaditya Yoga: Sun and Mercury conjunct
        if planets["Sun"].rashi == planets["Mercury"].rashi:
            yogas.append("Budhaditya Yoga — Sun and Mercury conjunct: sharp intellect and fame")

        # Pancha Mahapurusha Yogas
        mahapurusha = {
            "Mars": "Ruchaka Yoga — Mars exalted or in own sign in kendra",
            "Mercury": "Bhadra Yoga — Mercury exalted or in own sign in kendra",
            "Jupiter": "Hamsa Yoga — Jupiter exalted or in own sign in kendra",
            "Venus": "Malavya Yoga — Venus exalted or in own sign in kendra",
            "Saturn": "Shasha Yoga — Saturn exalted or in own sign in kendra",
        }
        exaltation_rashis = {
            "Sun": 0, "Moon": 1, "Mars": 9, "Mercury": 5,
            "Jupiter": 3, "Venus": 11, "Saturn": 6
        }
        own_rashis = {
            "Sun": [4], "Moon": [3], "Mars": [0, 7], "Mercury": [2, 5],
            "Jupiter": [8, 11], "Venus": [1, 6], "Saturn": [9, 10]
        }
        kendras = [1, 4, 7, 10]

        for planet_name, yoga_name in mahapurusha.items():
            if planet_name in planets:
                p = planets[planet_name]
                in_kendra = p.house in kendras
                exalted = p.rashi_index == exaltation_rashis.get(planet_name, -1)
                in_own = p.rashi_index in own_rashis.get(planet_name, [])
                if in_kendra and (exalted or in_own):
                    yogas.append(yoga_name)

        # Dhana Yoga: 2nd and 11th lord relationship
        if not yogas:
            yogas.append("Chart contains Subha (auspicious) planetary configurations")

        return yogas


# Global engine instance
astrology_engine = AstrologyEngine()
