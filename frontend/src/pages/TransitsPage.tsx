const TRANSITS = [
  {icon:'☉',name:'Sun',sign:'Aquarius',deg:15.3,retro:false,color:'#f39c12',effect:'Focus on community, humanitarian ideals, and innovative thinking. Authority comes from original ideas and genuine service to others.'},
  {icon:'☽',name:'Moon',sign:'Scorpio',deg:22.7,retro:false,color:'#bdc3c7',effect:'Deep emotional undercurrents run strong. Excellent time for meditation, inner healing, and accessing the hidden wisdom of the subconscious mind.'},
  {icon:'♂',name:'Mars',sign:'Gemini',deg:18.4,retro:false,color:'#e74c3c',effect:'Mental energy dramatically elevated. Favorable for debates, negotiations, rapid learning, and making quick, decisive strategic decisions.'},
  {icon:'☿',name:'Mercury',sign:'Aquarius',deg:8.1,retro:false,color:'#2ecc71',effect:'Brilliant, revolutionary ideas flow freely and abundantly. Technology, science, and unconventional modes of communication flourish.'},
  {icon:'♃',name:'Jupiter',sign:'Taurus',deg:12.9,retro:false,color:'#f1c40f',effect:'Steady material abundance continues to build. Wealth accumulation through patient, methodical, and determined effort is fully supported.'},
  {icon:'♀',name:'Venus',sign:'Pisces',deg:14.5,retro:false,color:'#e91e63',effect:'Romantic and spiritual peak period. Art, compassion, unconditional love, and deep creative expression are magnificently highlighted.'},
  {icon:'♄',name:'Saturn',sign:'Pisces',deg:19.2,retro:false,color:'#607d8b',effect:'Karmic lessons around spiritual boundaries and creative discipline continue. Structure in imaginative and healing endeavors is rewarded.'},
  {icon:'☊',name:'Rahu',sign:'Pisces',deg:4.6,retro:true,color:'#9c27b0',effect:'Karmic pull toward spirituality, foreign journeys, and transcendence. Watch carefully for illusions and subtle self-deception.'},
  {icon:'☋',name:'Ketu',sign:'Virgo',deg:4.6,retro:true,color:'#795548',effect:'Spiritual detachment and past life analytical karma surface clearly. Healing gifts and profound psychic sensitivity are activated.'},
]

export default function TransitsPage() {
  return (
    <div>
      <div className="section-title">☿ Current Planetary Transits</div>
      <p style={{fontStyle:'italic', color:'var(--cream-muted)', marginBottom:'1.5rem', fontSize:'0.95rem'}}>
        Real-time positions of all 9 Navagrahas and their influence on earthly life today.
      </p>
      <div className="grid-3">
        {TRANSITS.map(t => (
          <div className="transit-card" key={t.name}>
            <div className="transit-header">
              <span className="transit-icon" style={{color:t.color}}>{t.icon}</span>
              <div>
                <div className="transit-planet-name">{t.name}</div>
                <div className="transit-position">
                  In {t.sign} · {t.deg}°
                  {t.retro && <span style={{color:'var(--rose)', marginLeft:'6px', fontFamily:'var(--font-heading)', fontSize:'0.65rem'}}>(R)</span>}
                </div>
              </div>
            </div>
            <p className="transit-effect">{t.effect}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
