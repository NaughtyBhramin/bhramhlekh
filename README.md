<div align="center">

```
     ██╗██╗   ██╗ ██████╗ ████████╗██╗███████╗██╗  ██╗
     ██║╚██╗ ██╔╝██╔═══██╗╚══██╔══╝██║██╔════╝██║  ██║
     ██║ ╚████╔╝ ██║   ██║   ██║   ██║███████╗███████║
██   ██║  ╚██╔╝  ██║   ██║   ██║   ██║╚════██║██╔══██║
╚█████╔╝   ██║   ╚██████╔╝   ██║   ██║███████║██║  ██║
 ╚════╝    ╚═╝    ╚═════╝    ╚═╝   ╚═╝╚══════╝╚═╝  ╚═╝

    ██████╗  █████╗ ██████╗ ███████╗██╗  ██╗ █████╗ ███╗   ██╗
    ██╔══██╗██╔══██╗██╔══██╗██╔════╝██║  ██║██╔══██╗████╗  ██║
    ██║  ██║███████║██████╔╝███████╗███████║███████║██╔██╗ ██║
    ██║  ██║██╔══██║██╔══██╗╚════██║██╔══██║██╔══██║██║╚██╗██║
    ██████╔╝██║  ██║██║  ██║███████║██║  ██║██║  ██║██║ ╚████║
    ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝
```

### ॐ &nbsp; Ancient Vedic Wisdom · AI-Powered Cosmic Guidance &nbsp; ॐ

[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Java](https://img.shields.io/badge/Java-17-ED8B00?style=flat-square&logo=openjdk&logoColor=white)](https://openjdk.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=flat-square&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Groq AI](https://img.shields.io/badge/Groq_AI-Free_Tier-F55036?style=flat-square)](https://console.groq.com)
[![License](https://img.shields.io/badge/License-MIT-gold?style=flat-square)](LICENSE)

</div>

---

## ◈ What Is Jyotish Darshan?

**Jyotish Darshan** is a full-stack Vedic astrology platform that bridges 5,000 years of ancient Indian astronomical science with the frontier of modern artificial intelligence. It is not a horoscope widget — it is a complete *Jyotish Shastra* engine, rebuilt for the digital age.

At its core, the platform uses **real astronomical calculations** (Swiss Ephemeris + Lahiri Ayanamsa) to generate accurate sidereal birth charts, then layers **Claude AI** on top to provide deeply personalized interpretations that a human astrologer would take hours to compose.

Whether you want to understand the Yogas in your Kundli, navigate your current Mahadasha, find an auspicious Muhurta, or simply ask *"what should I focus on this week?"* — Jyotish Darshan delivers in seconds.

---

## ◈ The Vision

> *"Jyotish is the eye of the Vedas — the science of light that illuminates the dark corridors of time."*  
> — Brihat Parashara Hora Shastra

Most astrology apps give you pre-written horoscopes stored in a database. Jyotish Darshan is fundamentally different: **every reading is generated fresh by AI**, using your actual planetary positions, current transits, active Dasha period, and the authentic rules of Vedic Jyotish.

The goal is to make the wisdom of a master astrologer accessible to anyone, anywhere, at any time — while staying true to the classical tradition.

---

## ◈ Feature Matrix

```
┌─────────────────────────────────────────────────────────────────┐
│                    JYOTISH DARSHAN v2.0                         │
├────────────────────────┬────────────────────────────────────────┤
│  ASTRONOMICAL ENGINE   │  AI INTELLIGENCE LAYER                 │
├────────────────────────┼────────────────────────────────────────┤
│  ✦ Swiss Ephemeris     │  💬 AI Jyotish Guru Chat              │
│  ✦ Lahiri Ayanamsa     │  ✨ AI Kundli Interpretation          │
│  ✦ 9 Navagraha Calc    │  ☽  AI Daily/Weekly/Monthly Horoscope │
│  ✦ 27 Nakshatras       │  ♥  AI Kundli Milan Compatibility     │
│  ✦ 12 Bhava Houses     │  ⏰ AI Muhurta (Auspicious Timing)    │
│  ✦ Vimshottari Dasha   │  🌟 AI Varshphal (Annual Forecast)    │
│  ✦ Yoga Detection      │  ⏳ AI Dasha Period Analysis          │
│  ✦ Retrograde Tracking │  ✿  Personalized Vedic Remedies       │
│  ✦ Geocoding Support   │  🔮 Real-time Planetary Transit Info  │
└────────────────────────┴────────────────────────────────────────┘
```

---

## ◈ Architecture

```
                         ┌─────────────────────┐
                         │    USER BROWSER      │
                         │  React 18 + Vite     │
                         │  TypeScript + CSS    │
                         └────────┬─────────────┘
                                  │  HTTP
                    ┌─────────────▼──────────────┐
                    │       NGINX PROXY           │
                    │   /api/v1  →  Python        │
                    │   /api/auth → Java          │
                    └───────┬────────────┬────────┘
                            │            │
             ┌──────────────▼──┐   ┌─────▼──────────────┐
             │  PYTHON/FASTAPI  │   │  JAVA/SPRING BOOT   │
             │                  │   │                     │
             │  Kundli Calc     │   │  Registration       │
             │  Horoscopes      │   │  Login / Logout     │
             │  Transits        │   │  JWT Access Tokens  │
             │  Remedies        │   │  Refresh Tokens     │
             │  AI Service  ◄───┼───┼─── Anthropic API    │
             │  Compatibility   │   │                     │
             └────────┬─────────┘   └─────────┬───────────┘
                      │                       │
             ┌────────▼───────────────────────▼──────┐
             │             POSTGRESQL 15              │
             │  users · kundlis · planets · rashis    │
             │  nakshatras · dashas · horoscopes      │
             │  transits · remedies · compatibility   │
             └────────────────────────────────────────┘
                                │
                    ┌───────────▼───────────┐
                    │        REDIS 7         │
                    │   Session Caching      │
                    │   API Rate Limiting    │
                    └───────────────────────┘
```

---

## ◈ Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18, TypeScript, Vite | SPA with cosmic dark UI |
| **Styling** | Pure CSS Variables | Zero framework dependency |
| **State** | Zustand + React Query | Auth + server state management |
| **Python API** | FastAPI, SQLAlchemy (async) | Astrology computation engine |
| **AI Engine** | Groq Cloud — Llama 3.1 70B (Free) | All AI-powered readings |
| **Astronomy** | PyEphem, Swiss Ephemeris | Accurate planetary positions |
| **Java Service** | Spring Boot 3, Spring Security | Authentication and JWT |
| **Database** | PostgreSQL 15 | Primary data store |
| **Cache** | Redis 7 | Session and response caching |
| **Reverse Proxy** | Nginx | Routing and load balancing |
| **Containers** | Docker, Docker Compose | One-command deployment |

---

## ◈ Quick Start

### Option A — Docker (Recommended)

```bash
# 1. Clone
git clone https://github.com/yourusername/jyotish-darshan.git
cd jyotish-darshan

# 2. Set your API key
cp backend-python/.env.example backend-python/.env
# Edit .env → add ANTHROPIC_API_KEY=sk-ant-...

# 3. Launch
docker-compose up --build
```

Open `http://localhost:3000` — the cosmos awaits.

---

### Option B — Manual Setup (Ubuntu / Debian)

**Prerequisites:**

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install git nodejs npm python3.11 python3.11-venv python3-pip \
                 openjdk-17-jdk maven postgresql postgresql-contrib redis-server -y
```

**Database:**

```bash
sudo -u postgres psql -c "CREATE USER jyotish_user WITH PASSWORD 'jyotish_secret';"
sudo -u postgres psql -c "CREATE DATABASE jyotish_darshan OWNER jyotish_user;"
cd database/migrations
psql -U jyotish_user -d jyotish_darshan -h localhost -f 001_init.sql
psql -U jyotish_user -d jyotish_darshan -h localhost -f 002_seed_data.sql
```

**Python Backend (Terminal 1):**

```bash
cd backend-python
python3.11 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env        # Add your ANTHROPIC_API_KEY here
uvicorn app.main:app --reload --port 8000
```

**Java Backend (Terminal 2):**

```bash
cd backend-java
mvn clean install -DskipTests
mvn spring-boot:run
```

**Frontend (Terminal 3):**

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

---

## ◈ Environment Variables

### `backend-python/.env`

```env
DATABASE_URL=postgresql+asyncpg://jyotish_user:jyotish_secret@localhost:5432/jyotish_darshan
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your-secret-key-change-this
JAVA_SERVICE_URL=http://localhost:8080

# ─────────────────────────────────────────────────
# GROQ AI — Free, no credit card needed
# Get your key at: https://console.groq.com
# ─────────────────────────────────────────────────
GROQ_API_KEY=your-groq-api-key-here
GROQ_MODEL=openai/gpt-oss-120b
GROQ_MAX_TOKENS=2048
```

---

## ◈ API Reference

| Service | URL |
|---------|-----|
| Python API Docs (Swagger) | `http://localhost:8000/docs` |
| Java Auth Docs (Swagger) | `http://localhost:8080/swagger-ui.html` |
| Health Check | `http://localhost:8000/health` |
| AI Health Check | `http://localhost:8000/api/v1/ai/health` |

**AI Endpoints:**

```
POST  /api/v1/ai/horoscope        AI daily / weekly / monthly / yearly horoscope
POST  /api/v1/ai/kundli-reading   Complete AI Kundli interpretation
POST  /api/v1/ai/compatibility    AI Kundli Milan analysis
POST  /api/v1/ai/dasha            AI Mahadasha period analysis
POST  /api/v1/ai/muhurta          AI auspicious timing
POST  /api/v1/ai/yearly           AI annual Varshphal forecast
POST  /api/v1/ai/chat             Interactive AI astrologer chat
GET   /api/v1/ai/health           AI service status
```

---

## ◈ Project Structure

```
jyotish-darshan/
├── frontend/                       React 18 + TypeScript SPA
│   └── src/
│       ├── pages/
│       │   ├── HomePage.tsx
│       │   ├── KundliPage.tsx      AI birth chart generation
│       │   ├── HoroscopePage.tsx   AI horoscope readings
│       │   ├── AIChatPage.tsx      AI conversational astrologer
│       │   ├── CompatibilityPage.tsx
│       │   ├── DashaPage.tsx
│       │   ├── MuhurtaPage.tsx
│       │   ├── YearlyPage.tsx
│       │   ├── RashisPage.tsx
│       │   ├── TransitsPage.tsx
│       │   └── RemediesPage.tsx
│       ├── components/Layout.tsx
│       ├── utils/api.ts            Axios clients for both APIs
│       └── index.css               Pure CSS design system
│
├── backend-python/                 FastAPI astrology engine
│   └── app/
│       ├── main.py
│       ├── api/v1/
│       │   ├── ai.py               All Claude AI endpoints
│       │   ├── kundli.py
│       │   ├── horoscope.py
│       │   └── ...
│       └── services/
│           ├── ai_service.py       Anthropic Claude integration
│           └── astrology_engine.py Swiss Ephemeris + Lahiri
│
├── backend-java/                   Spring Boot auth service
│   └── src/main/java/
│       ├── controller/AuthController.java
│       ├── service/JwtService.java
│       └── model/User.java
│
├── database/migrations/
│   ├── 001_init.sql                15+ table schema
│   └── 002_seed_data.sql           Planets, rashis, nakshatras
│
├── docker-compose.yml
├── nginx.conf
├── LICENSE
└── README.md
```

---

## ◈ Vedic Astrology — What's Under the Hood

| Concept | Implementation |
|---------|---------------|
| **Coordinate System** | Sidereal (not tropical) |
| **Ayanamsa** | Lahiri — 23.85° at J2000, 50.3"/year precession |
| **Planetary Engine** | PyEphem + Swiss Ephemeris |
| **House System** | Whole Sign (Parashari tradition) |
| **Dasha System** | Vimshottari — 120-year cycle from Moon's Nakshatra |
| **Nakshatra Division** | 27 lunar mansions × 4 padas = 108 divisions |
| **Yoga Detection** | Gajakesari, Budhaditya, Pancha Mahapurusha |
| **Geocoding** | Nominatim API — place name to latitude/longitude/timezone |

---

## ◈ Contributing

Contributions are welcomed. The cosmos is vast — there is room for many minds.

```bash
git clone https://github.com/yourusername/jyotish-darshan.git
git checkout -b feature/your-feature-name
# Make changes, test thoroughly
git commit -m "feat: describe your change clearly"
git push origin feature/your-feature-name
# Open a Pull Request
```

**Areas Open for Contribution:**
- South Indian chart style renderer
- Shadbala (planetary strength) calculations
- Ashtakavarga system
- Prashna (horary astrology) module
- Mobile app (React Native)
- Hindi / Tamil / Telugu language support

---

## ◈ Roadmap

```
v2.0  [DONE]  AI-powered readings via Claude
v2.1  [NEXT]  Shadbala and Ashtakavarga calculations
v2.2  [NEXT]  South Indian chart style
v2.3  [NEXT]  Prashna (horary) astrology
v2.4  [PLAN]  React Native mobile app
v3.0  [PLAN]  Real-time transit push notifications
v3.1  [PLAN]  Professional astrologer dashboard
v3.2  [PLAN]  Paid reading booking system
```

---

## ◈ License

This project is released under the **MIT License** — see [LICENSE](LICENSE) for full details.

You are free to use, modify, distribute, and build upon this project for any purpose, commercial or personal, with attribution.

---

## ◈ Acknowledgements

- **Maharishi Parashara** — author of the *Brihat Parashara Hora Shastra*, the foundational text of Vedic astrology
- **Groq** — for the blazing-fast free AI inference layer that powers all readings
- **Swiss Ephemeris** — for the most accurate open-source planetary calculation library
- **The Vedic tradition** — for 5,000 years of astronomical and spiritual inquiry

---

<div align="center">

```
    ॐ नमो भगवते वासुदेवाय
    Om Namo Bhagavate Vasudevaya

    May the light of Jyotish illuminate your path.
```

**If this project helped you, please give it a ⭐ on GitHub**

*Built with cosmic intention · Powered by ancient wisdom · Enhanced by modern AI*

</div>
