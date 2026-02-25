"""Jyotish Darshan — FastAPI Main Application"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from contextlib import asynccontextmanager
import structlog

from app.core.config import settings
from app.core.database import engine, Base
from app.api.v1 import kundli, horoscope, transits, remedies, rashis, compatibility, planets, ai

logger = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🔮 Jyotish Darshan API starting...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    logger.info("🌙 Shutting down...")


app = FastAPI(
    title="Jyotish Darshan API",
    description="Vedic Astrology Platform with AI — Kundli, Horoscope, Dasha, Transits & Remedies",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(CORSMiddleware, allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.add_middleware(GZipMiddleware, minimum_size=1000)

app.include_router(kundli.router,        prefix="/api/v1/kundli",        tags=["Kundli"])
app.include_router(horoscope.router,     prefix="/api/v1/horoscope",     tags=["Horoscope"])
app.include_router(transits.router,      prefix="/api/v1/transits",      tags=["Transits"])
app.include_router(remedies.router,      prefix="/api/v1/remedies",      tags=["Remedies"])
app.include_router(rashis.router,        prefix="/api/v1/rashis",        tags=["Rashis"])
app.include_router(compatibility.router, prefix="/api/v1/compatibility", tags=["Compatibility"])
app.include_router(planets.router,       prefix="/api/v1/planets",       tags=["Planets"])
app.include_router(ai.router,            prefix="/api/v1/ai",            tags=["AI Astrology"])


@app.get("/", tags=["Health"])
async def root():
    return {"message": "🔮 Jyotish Darshan API v2.0 — AI Powered", "docs": "/docs"}


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "healthy", "service": "python-api", "version": "2.0.0"}
