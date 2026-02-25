import { Link } from 'react-router-dom'

const FEATURES = [
  { icon: '⬡', title: 'AI Kundli Generator', desc: 'Generate your complete birth chart and get a deep AI-powered interpretation of every planet, yoga, and house.', path: '/kundli', ai: true },
  { icon: '☽', title: 'AI Horoscope', desc: 'Daily, weekly, monthly and yearly predictions generated fresh by Claude AI — specific to your rashi and transits.', path: '/horoscope', ai: true },
  { icon: '♥', title: 'AI Kundli Milan', desc: 'Ashtakoota compatibility analysis with AI-powered relationship insights, strengths, and harmony remedies.', path: '/compatibility', ai: true },
  { icon: '⏳', title: 'AI Dasha Analysis', desc: 'Understand your current Vimshottari Dasha period in depth — opportunities, challenges, and remedies.', path: '/dasha', ai: true },
  { icon: '🌟', title: 'Varshphal — Yearly', desc: 'Your complete year-ahead forecast with month-by-month AI predictions for all areas of life.', path: '/yearly', ai: true },
  { icon: '⏰', title: 'AI Muhurta', desc: 'Find the most auspicious timing for marriage, travel, business, or any important life event.', path: '/muhurta', ai: true },
  { icon: '♈', title: 'Rashis & Signs', desc: 'Deep exploration of all 12 Vedic zodiac signs — traits, elements, ruling planets, and compatibility.', path: '/rashis', ai: false },
  { icon: '☿', title: 'Planetary Transits', desc: 'Real-time positions of all 9 Navagrahas and their influence on earthly life today.', path: '/transits', ai: false },
  { icon: '✿', title: 'Vedic Remedies', desc: 'Mantras, gemstones, yantras, fasting, donation and Ayurvedic remedies for every planet.', path: '/remedies', ai: false },
]

export default function HomePage() {
  return (
    <div>
      <div className="hero">
        <span className="hero-om">ॐ</span>
        <h1 className="hero-title">Jyotish Darshan</h1>
        <p className="hero-subtitle">Ancient Vedic Wisdom · AI-Powered Guidance</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/kundli" className="btn-gold">⬡ Generate Kundli</Link>
          <Link to="/chat" className="btn-gold" style={{ background: 'linear-gradient(135deg, rgba(123,63,160,0.25), rgba(201,168,76,0.15))' }}>💬 Chat with AI Guru</Link>
        </div>
      </div>

      {/* AI Chat promo banner */}
      <Link to="/chat" style={{ textDecoration: 'none', display: 'block', marginBottom: '2rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(123,63,160,0.2), rgba(201,168,76,0.15), rgba(123,63,160,0.2))',
          border: '1px solid rgba(201,168,76,0.35)',
          borderRadius: '3px', padding: '1.25rem 1.75rem',
          display: 'flex', alignItems: 'center', gap: '1rem',
          transition: 'all 0.3s'
        }}>
          <span style={{ fontSize: '2rem' }}>💬</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', fontSize: '0.85rem', letterSpacing: '0.1em', marginBottom: '3px' }}>✨ NEW — AI JYOTISH GURU CHAT</div>
            <p style={{ color: 'var(--cream-dim)', fontSize: '0.9rem', margin: 0 }}>Ask anything about your chart, dashas, remedies, timing, yogas — get personalized wisdom from Claude AI trained in Vedic astrology</p>
          </div>
          <span style={{ color: 'var(--gold)', fontFamily: 'var(--font-heading)', fontSize: '0.75rem', letterSpacing: '0.12em', flexShrink: 0 }}>CHAT NOW →</span>
        </div>
      </Link>

      {/* Feature grid */}
      <div className="grid-3 mb-lg">
        {FEATURES.map(f => (
          <Link key={f.path} to={f.path} style={{ textDecoration: 'none' }}>
            <div className="card card-hover card-p" style={{ height: '100%', position: 'relative' }}>
              {f.ai && (
                <span style={{
                  position: 'absolute', top: '10px', right: '10px',
                  background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.35)',
                  color: 'var(--gold)', fontFamily: 'var(--font-heading)',
                  fontSize: '0.55rem', letterSpacing: '0.1em', padding: '2px 8px', borderRadius: '20px'
                }}>✨ AI</span>
              )}
              <span className="feature-icon">{f.icon}</span>
              <div className="feature-title">{f.title}</div>
              <p className="feature-desc">{f.desc}</p>
              <span className="feature-explore">EXPLORE →</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="card card-p-lg quote-box">
        <p className="quote-text">
          "Jyotish is the eye of the Vedas. Just as the eye reveals the world of form,
          Jyotish reveals the nature of time and the pattern of one's destiny."
        </p>
        <div className="quote-attr">— VEDANGA JYOTISHA</div>
      </div>
    </div>
  )
}
