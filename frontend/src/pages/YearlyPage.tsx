import { useState } from 'react'
import { aiApi } from '@/utils/api'

const RASHIS = [
  {n:'Mesha',e:'Aries',s:'♈'},{n:'Vrishabha',e:'Taurus',s:'♉'},{n:'Mithuna',e:'Gemini',s:'♊'},
  {n:'Karka',e:'Cancer',s:'♋'},{n:'Simha',e:'Leo',s:'♌'},{n:'Kanya',e:'Virgo',s:'♍'},
  {n:'Tula',e:'Libra',s:'♎'},{n:'Vrischika',e:'Scorpio',s:'♏'},{n:'Dhanu',e:'Sagittarius',s:'♐'},
  {n:'Makara',e:'Capricorn',s:'♑'},{n:'Kumbha',e:'Aquarius',s:'♒'},{n:'Meena',e:'Pisces',s:'♓'},
]
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function YearlyPage() {
  const [name, setName] = useState('')
  const [moonSign, setMoonSign] = useState('Mesha')
  const [ascendant, setAscendant] = useState('Simha')
  const [nakshatra, setNakshatra] = useState('Rohini')
  const [year, setYear] = useState(2026)
  const [loading, setLoading] = useState(false)
  const [pred, setPred] = useState<any>(null)
  const [error, setError] = useState('')
  const [selMonth, setSelMonth] = useState('')

  const generate = async () => {
    setLoading(true); setError(''); setPred(null)
    const data = { name, moon_sign: moonSign, ascendant_rashi: ascendant, nakshatra }
    try {
      const res = await aiApi.yearly(data, year)
      setPred(res.data.prediction)
    } catch {
      setError('AI service unavailable. Please add ANTHROPIC_API_KEY to your backend .env file.')
    } finally { setLoading(false) }
  }

  const rashi = RASHIS.find(r => r.n === moonSign)

  return (
    <div>
      <div className="section-title">🌟 Varshphal — Annual AI Prediction</div>
      <p style={{ color: 'var(--cream-muted)', fontStyle: 'italic', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        Your complete year-ahead cosmic forecast — month by month, powered by AI Vedic wisdom
      </p>

      <div className="card card-p-lg mb-lg" style={{ maxWidth: '620px', margin: '0 auto 2rem' }}>
        <div className="form-grid">
          <div>
            <label className="form-label">Your Name</label>
            <input className="form-input" value={name} placeholder="Enter your name" onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="form-label">Forecast Year</label>
            <select className="form-select" value={year} onChange={e => setYear(+e.target.value)}>
              {[2025,2026,2027,2028].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Moon Sign (Rashi)</label>
            <select className="form-select" value={moonSign} onChange={e => setMoonSign(e.target.value)}>
              {RASHIS.map(r => <option key={r.n} value={r.n}>{r.s} {r.n}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Ascendant (Lagna)</label>
            <select className="form-select" value={ascendant} onChange={e => setAscendant(e.target.value)}>
              {RASHIS.map(r => <option key={r.n} value={r.n}>{r.s} {r.n}</option>)}
            </select>
          </div>
        </div>
        <button onClick={generate} disabled={loading} className="btn-gold full-width">
          {loading ? '🔮 Generating Annual Forecast...' : `🌟 Generate ${year} Varshphal`}
        </button>
      </div>

      {error && <div style={{ color: 'var(--rose)', marginBottom: '1rem', fontSize: '0.88rem', textAlign: 'center' }}>⚠ {error}</div>}

      {loading && (
        <div className="card card-p-lg" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'pulseGold 2s ease-in-out infinite' }}>🌟</div>
          <p style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', letterSpacing: '0.15em', fontSize: '0.85rem' }}>CONSULTING TWELVE MONTHS</p>
          <p style={{ color: 'var(--cream-muted)', fontStyle: 'italic', marginTop: '0.5rem', fontSize: '0.9rem' }}>AI Guru is mapping the year {year} for {name || 'you'}...</p>
        </div>
      )}

      {pred && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="page-enter">

          {/* Year overview */}
          <div className="card card-p-lg" style={{ borderColor: 'rgba(201,168,76,0.4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '2.5rem' }}>{rashi?.s}</span>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)', fontSize: '1.3rem' }}>{year} Varshphal</div>
                <div style={{ color: 'var(--cream-muted)', fontSize: '0.88rem', marginTop: '3px' }}>{name || 'Your'} Annual Forecast · {moonSign} Moon Sign</div>
              </div>
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-light)', fontSize: '0.78rem', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>YEAR THEME</div>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.9', color: 'var(--cream)', marginBottom: '1rem' }}>{pred.year_theme}</p>
            <p style={{ color: 'var(--cream-dim)', fontSize: '0.95rem', lineHeight: '1.8' }}>{pred.overall_energy}</p>
          </div>

          {/* Life areas */}
          <div className="grid-4">
            {[['♥ Love',pred.love,'#e91e63'],['✦ Career',pred.career,'#c9a84c'],['🌿 Health',pred.health,'#2ecc71'],['💰 Finance',pred.finance,'#3498db']].map(([l,t,c])=>(
              <div className="card card-p" key={l}>
                <div style={{ fontFamily: 'var(--font-heading)', color: c as string, fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '0.6rem' }}>{l}</div>
                <p style={{ color: 'var(--cream-dim)', fontSize: '0.88rem', lineHeight: '1.7' }}>{t}</p>
              </div>
            ))}
          </div>

          {/* Monthly calendar */}
          {pred.monthly && (
            <div className="card card-p-lg">
              <div style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-light)', fontSize: '0.72rem', letterSpacing: '0.15em', marginBottom: '1.25rem' }}>📅 MONTH BY MONTH FORECAST</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                {MONTHS.map(m => (
                  <div key={m} onClick={() => setSelMonth(selMonth === m ? '' : m)}
                    style={{
                      background: selMonth === m ? 'rgba(201,168,76,0.12)' : 'rgba(0,0,0,0.3)',
                      border: `1px solid ${selMonth === m ? 'var(--gold)' : pred.best_months?.includes(m) ? 'rgba(46,204,113,0.4)' : pred.challenging_months?.includes(m) ? 'rgba(231,76,60,0.3)' : 'rgba(201,168,76,0.12)'}`,
                      borderRadius: '3px', padding: '0.75rem', cursor: 'pointer', transition: 'all 0.25s'
                    }}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.7rem', letterSpacing: '0.08em', color: pred.best_months?.includes(m) ? '#2ecc71' : pred.challenging_months?.includes(m) ? 'var(--rose)' : 'var(--gold-light)', marginBottom: '4px' }}>{m}</div>
                    {selMonth === m && <p style={{ color: 'var(--cream-dim)', fontSize: '0.8rem', lineHeight: '1.6', marginTop: '6px' }}>{pred.monthly[m]}</p>}
                    {selMonth !== m && <p style={{ color: 'var(--cream-muted)', fontSize: '0.75rem', lineHeight: '1.4' }}>{pred.monthly[m]?.substring(0, 50)}...</p>}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#2ecc71' }}><span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgba(46,204,113,0.4)', border: '1px solid rgba(46,204,113,0.6)', display: 'inline-block' }} />Best months</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--rose)' }}><span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgba(231,76,60,0.3)', border: '1px solid rgba(231,76,60,0.4)', display: 'inline-block' }} />Challenging months</div>
              </div>
            </div>
          )}

          {/* Spiritual + Remedy */}
          <div className="grid-2">
            <div className="card card-p">
              <div style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-light)', fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '0.6rem' }}>🕉 SPIRITUAL PATH</div>
              <p style={{ color: 'var(--cream-dim)', fontSize: '0.9rem', lineHeight: '1.75' }}>{pred.spiritual}</p>
            </div>
            <div className="card card-p">
              <div style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-light)', fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '0.6rem' }}>✦ ANNUAL REMEDY</div>
              <p style={{ color: 'var(--cream-dim)', fontSize: '0.9rem', lineHeight: '1.75', marginBottom: '0.6rem' }}>{pred.annual_remedy}</p>
              {pred.annual_mantra && <p style={{ fontStyle: 'italic', color: 'rgba(201,168,76,0.65)', fontSize: '0.82rem', borderLeft: '2px solid rgba(201,168,76,0.3)', paddingLeft: '0.75rem' }}>{pred.annual_mantra}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
