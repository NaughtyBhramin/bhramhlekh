import { useState } from 'react'
import { aiApi } from '@/utils/api'

const RASHIS = [
  {n:'Mesha',e:'Aries',s:'♈'},{n:'Vrishabha',e:'Taurus',s:'♉'},{n:'Mithuna',e:'Gemini',s:'♊'},
  {n:'Karka',e:'Cancer',s:'♋'},{n:'Simha',e:'Leo',s:'♌'},{n:'Kanya',e:'Virgo',s:'♍'},
  {n:'Tula',e:'Libra',s:'♎'},{n:'Vrischika',e:'Scorpio',s:'♏'},{n:'Dhanu',e:'Sagittarius',s:'♐'},
  {n:'Makara',e:'Capricorn',s:'♑'},{n:'Kumbha',e:'Aquarius',s:'♒'},{n:'Meena',e:'Pisces',s:'♓'},
]
const NAKSHATRAS = ['Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra','Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni','Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha','Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishta','Shatabhisha','Purva Bhadrapada','Uttara Bhadrapada','Revati']

const VERDICT_COLORS: Record<string, string> = {
  'Highly Compatible': '#2ecc71', 'Compatible': '#f1c40f',
  'Moderately Compatible': '#f39c12', 'Needs Work': '#e74c3c'
}

// Simple Ashtakoota score calculator
function calcScore(r1: string, r2: string): number {
  const i1 = RASHIS.findIndex(r => r.n === r1)
  const i2 = RASHIS.findIndex(r => r.n === r2)
  const diff = Math.abs(i1 - i2)
  if (diff === 0) return 28
  if ([1, 11].includes(diff)) return 18
  if ([2, 10].includes(diff)) return 22
  if ([3, 9].includes(diff)) return 25
  if ([4, 8].includes(diff)) return 20
  if ([5, 7].includes(diff)) return 24
  if (diff === 6) return 15
  return 20
}

export default function CompatibilityPage() {
  const [p1, setP1] = useState({ name: '', moon_sign: 'Mesha', nakshatra: 'Ashwini', ascendant_rashi: 'Simha' })
  const [p2, setP2] = useState({ name: '', moon_sign: 'Vrishabha', nakshatra: 'Rohini', ascendant_rashi: 'Kanya' })
  const [loading, setLoading] = useState(false)
  const [reading, setReading] = useState<any>(null)
  const [score, setScore] = useState(0)
  const [error, setError] = useState('')

  const analyze = async () => {
    if (!p1.name || !p2.name) { setError('Please enter both names'); return }
    const s = calcScore(p1.moon_sign, p2.moon_sign)
    setScore(s); setLoading(true); setError(''); setReading(null)
    try {
      const res = await aiApi.compatibility(p1, p2, s)
      setReading(res.data.reading)
    } catch {
      setError('AI service unavailable. Please add ANTHROPIC_API_KEY to your backend .env file.')
    } finally { setLoading(false) }
  }

  const scorePct = Math.round((score / 36) * 100)

  return (
    <div>
      <div className="section-title">♥ Kundli Milan — AI Compatibility Analysis</div>
      <p style={{ color: 'var(--cream-muted)', fontStyle: 'italic', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        Ancient Ashtakoota matching system enhanced with AI-powered interpretation
      </p>

      {/* Input forms */}
      <div className="grid-2 mb-lg">
        {[{ label: 'Person 1', state: p1, setter: setP1 }, { label: 'Person 2', state: p2, setter: setP2 }].map(({ label, state, setter }) => (
          <div className="card card-p" key={label}>
            <div style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: '1rem' }}>{label}</div>

            <div style={{ marginBottom: '0.75rem' }}>
              <label className="form-label">Full Name</label>
              <input className="form-input" value={state.name} placeholder="Enter name"
                onChange={e => setter(s => ({ ...s, name: e.target.value }))} />
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <label className="form-label">Moon Sign (Janma Rashi)</label>
              <select className="form-select" value={state.moon_sign} onChange={e => setter(s => ({ ...s, moon_sign: e.target.value }))}>
                {RASHIS.map(r => <option key={r.n} value={r.n}>{r.s} {r.n} ({r.e})</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <label className="form-label">Birth Nakshatra</label>
              <select className="form-select" value={state.nakshatra} onChange={e => setter(s => ({ ...s, nakshatra: e.target.value }))}>
                {NAKSHATRAS.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            <div>
              <label className="form-label">Ascendant (Lagna)</label>
              <select className="form-select" value={state.ascendant_rashi} onChange={e => setter(s => ({ ...s, ascendant_rashi: e.target.value }))}>
                {RASHIS.map(r => <option key={r.n} value={r.n}>{r.s} {r.n}</option>)}
              </select>
            </div>
          </div>
        ))}
      </div>

      {error && <div style={{ color: 'var(--rose)', marginBottom: '1rem', fontSize: '0.88rem' }}>⚠ {error}</div>}

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <button onClick={analyze} disabled={loading} className="btn-gold">
          {loading ? '🔮 Analyzing Cosmic Compatibility...' : '♥ Analyze Kundli Milan ♥'}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="card card-p-lg" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'pulseGold 2s ease-in-out infinite' }}>♥</div>
          <p style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', letterSpacing: '0.15em', fontSize: '0.85rem' }}>CONSULTING THE STARS</p>
          <p style={{ color: 'var(--cream-muted)', fontStyle: 'italic', marginTop: '0.5rem', fontSize: '0.9rem' }}>AI is performing your Ashtakoota analysis...</p>
        </div>
      )}

      {/* Results */}
      {reading && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="page-enter">

          {/* Score card */}
          <div className="card card-p-lg" style={{ textAlign: 'center', borderColor: 'rgba(201,168,76,0.4)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', color: VERDICT_COLORS[reading.verdict] || 'var(--gold)', marginBottom: '0.5rem' }}>
              {score}/36
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: VERDICT_COLORS[reading.verdict] || 'var(--gold)', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
              {reading.verdict}
            </div>
            <p style={{ color: 'var(--cream-dim)', fontStyle: 'italic', maxWidth: '500px', margin: '0 auto 1.25rem' }}>{reading.verdict_detail}</p>

            {/* Score bar */}
            <div style={{ maxWidth: '400px', margin: '0 auto' }}>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${scorePct}%`, background: `linear-gradient(90deg, ${VERDICT_COLORS[reading.verdict] || 'var(--gold)'}, var(--gold))`, borderRadius: '4px', transition: 'width 1.5s ease' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontFamily: 'var(--font-heading)', fontSize: '0.6rem', color: 'var(--cream-muted)' }}>
                <span>0</span><span>18 (Min)</span><span>27 (Good)</span><span>36</span>
              </div>
            </div>
          </div>

          {/* Couple names */}
          <div style={{ textAlign: 'center', fontFamily: 'var(--font-heading)', color: 'var(--gold)', fontSize: '1rem', letterSpacing: '0.1em' }}>
            {p1.name} {RASHIS.find(r => r.n === p1.moon_sign)?.s} · {p2.name} {RASHIS.find(r => r.n === p2.moon_sign)?.s}
          </div>

          {/* Detailed readings */}
          <div className="grid-2">
            {[
              ['🌙 Emotional Compatibility', reading.emotional, '#bdc3c7'],
              ['❤️ Physical Connection', reading.physical, '#e74c3c'],
              ['🧠 Intellectual Match', reading.intellectual, '#f1c40f'],
              ['🕉 Spiritual Alignment', reading.spiritual, '#9c27b0'],
            ].map(([lbl, txt, col]) => (
              <div className="card card-p" key={lbl}>
                <div style={{ fontFamily: 'var(--font-heading)', color: col as string, fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '0.6rem' }}>{lbl}</div>
                <p style={{ color: 'var(--cream-dim)', fontSize: '0.9rem', lineHeight: '1.75' }}>{txt}</p>
              </div>
            ))}
          </div>

          {/* Strengths + Nurture */}
          <div className="grid-2">
            <div className="card card-p">
              <div style={{ fontFamily: 'var(--font-heading)', color: '#2ecc71', fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>✦ STRENGTHS OF THIS UNION</div>
              {reading.strengths?.map((s: string, i: number) => (
                <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#2ecc71', flexShrink: 0 }}>★</span>
                  <p style={{ color: 'var(--cream-dim)', fontSize: '0.88rem', lineHeight: '1.6' }}>{s}</p>
                </div>
              ))}
            </div>
            <div className="card card-p">
              <div style={{ fontFamily: 'var(--font-heading)', color: '#f39c12', fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>🌱 AREAS TO NURTURE</div>
              {reading.nurture?.map((s: string, i: number) => (
                <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#f39c12', flexShrink: 0 }}>◆</span>
                  <p style={{ color: 'var(--cream-dim)', fontSize: '0.88rem', lineHeight: '1.6' }}>{s}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Life together + Timing */}
          <div className="card card-p-lg">
            <div style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-light)', fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>🌟 LIFE TOGETHER</div>
            <p style={{ color: 'var(--cream-dim)', fontSize: '0.95rem', lineHeight: '1.85', marginBottom: '1rem' }}>{reading.life_together}</p>
            {reading.auspicious_timing && (
              <>
                <div style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-light)', fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>✦ AUSPICIOUS TIMING</div>
                <p style={{ color: 'var(--cream-dim)', fontStyle: 'italic', fontSize: '0.9rem' }}>{reading.auspicious_timing}</p>
              </>
            )}
          </div>

          {/* Remedies */}
          {reading.remedies?.length > 0 && (
            <div className="card card-p">
              <div style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-light)', fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>✿ REMEDIES FOR HARMONY</div>
              <div className="grid-2">
                {reading.remedies.map((r: any, i: number) => (
                  <div key={i} style={{ background: 'rgba(0,0,0,0.25)', padding: '0.85rem', borderRadius: '2px', border: '1px solid rgba(201,168,76,0.15)' }}>
                    <div style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', fontSize: '0.78rem', marginBottom: '0.4rem' }}>{r.title}</div>
                    <p style={{ color: 'var(--cream-dim)', fontSize: '0.85rem', lineHeight: '1.65' }}>{r.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
