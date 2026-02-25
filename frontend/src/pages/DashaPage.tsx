import { useState } from 'react'
import { aiApi } from '@/utils/api'

const PC: Record<string,string> = {
  Sun:'#f39c12', Moon:'#bdc3c7', Mars:'#e74c3c', Mercury:'#2ecc71',
  Jupiter:'#f1c40f', Venus:'#e91e63', Saturn:'#607d8b', Rahu:'#9c27b0', Ketu:'#795548'
}
const SYMBOLS: Record<string,string> = {
  Sun:'☉', Moon:'☽', Mars:'♂', Mercury:'☿', Jupiter:'♃', Venus:'♀', Saturn:'♄', Rahu:'☊', Ketu:'☋'
}
const DASHAS = [
  { p:'Moon', yrs:10, effect:'Emotional growth, family bonds, travel abroad. Mind becomes receptive to higher wisdom and spiritual truths.', period:'2010–2020', start:'2010-01-01', end:'2020-01-01', current:false },
  { p:'Mars', yrs:7, effect:'Energy, courage, property gains. Conflicts may arise but bold ambition drives you powerfully forward.', period:'2020–2027', start:'2020-01-01', end:'2027-01-01', current:true },
  { p:'Rahu', yrs:18, effect:'Sudden gains and losses, foreign connections, material ambitions, and karmic lessons intensify.', period:'2027–2045', start:'2027-01-01', end:'2045-01-01', current:false },
  { p:'Jupiter', yrs:16, effect:'Wisdom, prosperity, spiritual progress. Most auspicious period for growth and expansion in all areas of life.', period:'2045–2061', start:'2045-01-01', end:'2061-01-01', current:false },
  { p:'Saturn', yrs:19, effect:'Hard work, discipline, karmic debts surface. Patience and perseverance yield lasting, meaningful rewards.', period:'2061–2080', start:'2061-01-01', end:'2080-01-01', current:false },
  { p:'Mercury', yrs:17, effect:'Intellect, business ventures, communication skills flourish. Education and networking opportunities abound.', period:'2080–2097', start:'2080-01-01', end:'2097-01-01', current:false },
  { p:'Ketu', yrs:7, effect:'Spiritual awakening, detachment from materialism, moksha path. Deep inner wisdom surfaces naturally.', period:'2097–2104', start:'2097-01-01', end:'2104-01-01', current:false },
  { p:'Venus', yrs:20, effect:'Love, luxury, arts, and relationships fully bloom. Most pleasurable and creatively abundant period of life.', period:'2104–2124', start:'2104-01-01', end:'2124-01-01', current:false },
  { p:'Sun', yrs:6, effect:'Authority, government favor, health improvement. Leadership opportunities arise.', period:'2124–2130', start:'2124-01-01', end:'2130-01-01', current:false },
]
const current = DASHAS.find(d => d.current)!
const next = DASHAS[DASHAS.findIndex(d => d.current) + 1]

export default function DashaPage() {
  const [aiLoading, setAiLoading] = useState(false)
  const [aiReading, setAiReading] = useState<any>(null)
  const [error, setError] = useState('')

  const getAIReading = async () => {
    setAiLoading(true); setError('')
    try {
      const res = await aiApi.dasha({
        kundli_data: { name: 'Native', moon_sign: 'Karka', ascendant_rashi: 'Simha', nakshatra: 'Pushya' },
        current_dasha: current.p,
        next_dasha: next?.p || 'Rahu',
        dasha_end_date: current.end,
      })
      setAiReading(res.data.reading)
    } catch {
      setError('AI service unavailable. Please add ANTHROPIC_API_KEY to your backend .env file.')
    } finally { setAiLoading(false) }
  }

  return (
    <div>
      <div className="section-title">⏳ Vimshottari Dasha System</div>
      <p style={{ color: 'var(--cream-muted)', fontStyle: 'italic', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
        The 120-year cycle of 9 planetary periods that governs the unfolding of karma and life events
      </p>

      {/* Current dasha highlight */}
      <div className="card card-p-lg mb-lg" style={{ borderColor: 'var(--gold)', background: 'rgba(201,168,76,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', border: `2px solid ${PC[current.p]}`, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', color: PC[current.p] }}>
              {SYMBOLS[current.p]}
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)', fontSize: '1.2rem' }}>{current.p} Mahadasha</div>
              <div style={{ color: 'var(--cream-muted)', fontSize: '0.85rem', marginTop: '3px' }}>{current.period} · {current.yrs} years</div>
            </div>
          </div>
          <span className="current-badge">CURRENT PERIOD</span>
        </div>
        <p style={{ color: 'var(--cream-dim)', fontSize: '0.95rem', lineHeight: '1.8', marginBottom: '1.25rem' }}>{current.effect}</p>
        <button onClick={getAIReading} disabled={aiLoading} className="btn-gold">
          {aiLoading ? '🔮 Getting AI Analysis...' : '✨ Get AI Dasha Analysis'}
        </button>
      </div>

      {error && <div style={{ color: 'var(--rose)', marginBottom: '1rem', fontSize: '0.88rem' }}>⚠ {error}</div>}

      {/* AI Dasha Reading */}
      {aiLoading && (
        <div className="card card-p-lg mb-lg" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem', animation: 'pulseGold 2s ease-in-out infinite' }}>⏳</div>
          <p style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', letterSpacing: '0.15em', fontSize: '0.85rem' }}>ANALYZING YOUR DASHA PERIOD</p>
        </div>
      )}

      {aiReading && !aiLoading && (
        <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="page-enter">
          <div className="card card-p-lg" style={{ borderColor: 'rgba(201,168,76,0.35)' }}>
            <div style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>✨ AI ANALYSIS — {current.p.toUpperCase()} MAHADASHA</div>
            <p style={{ fontSize: '1.02rem', lineHeight: '1.9', color: 'var(--cream)' }}>{aiReading.overall_message}</p>
          </div>
          <div className="grid-3">
            {[['🌅 Key Themes', aiReading.themes], ['✦ Opportunities', aiReading.opportunities], ['⚡ Challenges', aiReading.challenges],
              ['🏆 Career Impact', aiReading.career], ['♥ Relationships', aiReading.relationships], ['🌿 Health', aiReading.health]
            ].map(([l, t]) => (
              <div className="card card-p" key={l}>
                <div style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-light)', fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '0.6rem' }}>{l}</div>
                <p style={{ color: 'var(--cream-dim)', fontSize: '0.88rem', lineHeight: '1.75' }}>{t}</p>
              </div>
            ))}
          </div>
          {aiReading.best_months?.length > 0 && (
            <div className="card card-p">
              <div style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-light)', fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>📅 BEST MONTHS THIS YEAR</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {aiReading.best_months.map((m: string) => <span key={m} className="badge">{m}</span>)}
              </div>
            </div>
          )}
          {aiReading.remedies?.length > 0 && (
            <div className="card card-p">
              <div style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-light)', fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>✿ DASHA REMEDIES</div>
              {aiReading.remedies.map((r: any, i: number) => (
                <div key={i} style={{ marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: i < aiReading.remedies.length - 1 ? '1px solid rgba(201,168,76,0.1)' : 'none' }}>
                  <div style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', fontSize: '0.8rem', marginBottom: '3px' }}>{r.title}</div>
                  <p style={{ color: 'var(--cream-dim)', fontSize: '0.88rem', lineHeight: '1.65' }}>{r.description}</p>
                  {r.mantra && <p style={{ fontStyle: 'italic', color: 'rgba(201,168,76,0.65)', fontSize: '0.8rem', marginTop: '4px' }}>{r.mantra}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Full timeline */}
      <div style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', fontSize: '0.8rem', letterSpacing: '0.12em', marginBottom: '1rem', textTransform: 'uppercase' }}>Complete Dasha Timeline</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {DASHAS.map((d) => (
          <div key={d.p} className={`dasha-item${d.current ? ' current' : ''}`}>
            <div className="dasha-planet-icon" style={{ color: PC[d.p] || 'var(--gold)' }}>{SYMBOLS[d.p]}</div>
            <div className="dasha-info">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '4px' }}>
                <span className="dasha-title">{d.p} Mahadasha</span>
                <span style={{ color: 'var(--cream-muted)', fontSize: '0.76rem' }}>({d.yrs} years)</span>
                {d.current && <span className="current-badge">CURRENT</span>}
              </div>
              <p className="dasha-effect">{d.effect}</p>
              <p className="dasha-period">{d.period}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
