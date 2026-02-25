import { useState } from 'react'
import { aiApi } from '@/utils/api'

const EVENTS = [
  'Marriage / Wedding', 'Business Launch', 'Property Purchase', 'New Job Start',
  'Travel / Journey', 'Surgery / Medical Procedure', 'Vehicle Purchase',
  'Investment / Financial Decision', 'Child Naming (Namkaran)', 'Griha Pravesh (Home Entry)',
  'Filing Legal Documents', 'Starting Education / Course',
]

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function MuhurtaPage() {
  const [event, setEvent] = useState(EVENTS[0])
  const [month, setMonth] = useState('March 2026')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const analyze = async () => {
    setLoading(true); setError(''); setResult(null)
    try {
      const res = await aiApi.muhurta(event, month)
      setResult(res.data.muhurta)
    } catch {
      setError('AI service unavailable. Please add ANTHROPIC_API_KEY to your backend .env file.')
    } finally { setLoading(false) }
  }

  return (
    <div>
      <div className="section-title">⏰ Muhurta — Auspicious Timing</div>
      <p style={{ color: 'var(--cream-muted)', fontStyle: 'italic', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        Let AI select the most auspicious time for your important life events based on Vedic Muhurta Shastra
      </p>

      <div className="card card-p-lg mb-lg" style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <label className="form-label">Select Event Type</label>
          <select className="form-select" value={event} onChange={e => setEvent(e.target.value)}>
            {EVENTS.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label className="form-label">Preferred Month & Year</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <select className="form-select" onChange={e => setMonth(e.target.value + ' ' + month.split(' ')[1] || '2026')}>
              {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select className="form-select" onChange={e => setMonth((month.split(' ')[0] || 'March') + ' ' + e.target.value)}>
              {['2025','2026','2027','2028'].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        <button onClick={analyze} disabled={loading} className="btn-gold full-width">
          {loading ? '🔮 Consulting Panchanga...' : '⏰ Find Auspicious Timing'}
        </button>
      </div>

      {error && <div style={{ color: 'var(--rose)', marginBottom: '1rem', fontSize: '0.88rem', textAlign: 'center' }}>⚠ {error}</div>}

      {loading && (
        <div className="card card-p-lg" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'pulseGold 2s ease-in-out infinite' }}>⏰</div>
          <p style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', letterSpacing: '0.15em', fontSize: '0.85rem' }}>CONSULTING THE PANCHANGA</p>
          <p style={{ color: 'var(--cream-muted)', fontStyle: 'italic', marginTop: '0.5rem', fontSize: '0.9rem' }}>AI Guru is studying the cosmic calendar for your {event}...</p>
        </div>
      )}

      {result && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="page-enter">
          <div className="card card-p-lg" style={{ borderColor: 'rgba(201,168,76,0.4)' }}>
            <div style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)', fontSize: '1.2rem', marginBottom: '0.75rem' }}>{event}</div>
            <p style={{ color: 'var(--cream-dim)', fontSize: '0.95rem', lineHeight: '1.85' }}>{result.general_guidance}</p>
          </div>

          <div className="grid-3">
            <div className="card card-p">
              <div style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-light)', fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>📅 BEST DAYS OF WEEK</div>
              {result.best_days?.map((d: string) => <div key={d} className="badge" style={{ marginBottom: '6px', display: 'block' }}>{d}</div>)}
            </div>
            <div className="card card-p">
              <div style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-light)', fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>🌙 BEST TITHIS (LUNAR DAYS)</div>
              {result.best_tithis?.map((t: string) => <div key={t} className="badge" style={{ marginBottom: '6px', display: 'block' }}>{t}</div>)}
            </div>
            <div className="card card-p">
              <div style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-light)', fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>⭐ FAVORABLE NAKSHATRAS</div>
              {result.favorable_nakshatras?.map((n: string) => <div key={n} className="badge" style={{ marginBottom: '6px', display: 'block' }}>{n}</div>)}
            </div>
          </div>

          <div className="grid-2">
            <div className="card card-p">
              <div style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-light)', fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '0.6rem' }}>☀️ IDEAL TIME OF DAY</div>
              <p style={{ color: 'var(--cream-dim)', fontSize: '0.9rem', lineHeight: '1.7' }}>{result.ideal_time}</p>
            </div>
            <div className="card card-p">
              <div style={{ fontFamily: 'var(--font-heading)', color: 'var(--rose)', fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '0.6rem' }}>⚠ TIMES TO AVOID</div>
              <p style={{ color: 'var(--cream-dim)', fontSize: '0.9rem', lineHeight: '1.7' }}>{result.avoid}</p>
            </div>
          </div>

          {result.ritual && (
            <div className="card card-p">
              <div style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-light)', fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '0.6rem' }}>🕉 MUHURTA RITUAL</div>
              <p style={{ color: 'var(--cream-dim)', fontSize: '0.9rem', lineHeight: '1.8' }}>{result.ritual}</p>
            </div>
          )}

          {result.mantras?.length > 0 && (
            <div className="card card-p">
              <div style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-light)', fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>✦ MANTRAS TO CHANT</div>
              {result.mantras.map((m: string, i: number) => (
                <p key={i} style={{ fontStyle: 'italic', color: 'rgba(201,168,76,0.7)', fontSize: '0.9rem', borderLeft: '2px solid rgba(201,168,76,0.3)', paddingLeft: '0.75rem', marginBottom: '0.6rem', lineHeight: '1.5' }}>{m}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
