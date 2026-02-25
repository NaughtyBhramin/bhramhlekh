import { useState } from 'react'

const RASHIS = [
  {n:'Mesha',e:'Aries',s:'♈',r:'Mars',el:'Fire',c:'#e74c3c',dt:'Mar 21–Apr 19',tr:['Courageous','Dynamic','Leader','Impulsive'],desc:'The first sign, ruled by Mars. Dynamic, pioneering, and full of raw energy. Natural leaders who charge forward with unmatched courage.',gem:'Ruby',col:'Red'},
  {n:'Vrishabha',e:'Taurus',s:'♉',r:'Venus',el:'Earth',c:'#27ae60',dt:'Apr 20–May 20',tr:['Stable','Loyal','Sensual','Patient'],desc:'The second sign, ruled by Venus. Deeply sensual, reliable, and pleasure-loving. Builds lasting foundations through patience.',gem:'Diamond',col:'Green'},
  {n:'Mithuna',e:'Gemini',s:'♊',r:'Mercury',el:'Air',c:'#f1c40f',dt:'May 21–Jun 20',tr:['Witty','Curious','Adaptable','Communicative'],desc:'The third sign, ruled by Mercury. Quick-witted, versatile, and eternally curious. Masters of communication.',gem:'Emerald',col:'Yellow'},
  {n:'Karka',e:'Cancer',s:'♋',r:'Moon',el:'Water',c:'#3498db',dt:'Jun 21–Jul 22',tr:['Nurturing','Intuitive','Emotional','Protective'],desc:'The fourth sign, ruled by Moon. Deeply empathetic and home-loving. The cosmic nurturer who leads with the heart.',gem:'Pearl',col:'White'},
  {n:'Simha',e:'Leo',s:'♌',r:'Sun',el:'Fire',c:'#e67e22',dt:'Jul 23–Aug 22',tr:['Regal','Generous','Creative','Proud'],desc:'The fifth sign, ruled by Sun. Noble, generous, and supremely confident. Born leaders who shine at the center of attention.',gem:'Ruby',col:'Gold'},
  {n:'Kanya',e:'Virgo',s:'♍',r:'Mercury',el:'Earth',c:'#1abc9c',dt:'Aug 23–Sep 22',tr:['Analytical','Precise','Helpful','Critical'],desc:'The sixth sign, ruled by Mercury. Meticulous, service-oriented, and deeply analytical. The healer and perfectionist.',gem:'Emerald',col:'Navy Blue'},
  {n:'Tula',e:'Libra',s:'♎',r:'Venus',el:'Air',c:'#9b59b6',dt:'Sep 23–Oct 22',tr:['Balanced','Fair','Social','Diplomatic'],desc:'The seventh sign, ruled by Venus. Seeks harmony, beauty, and justice. The diplomat and aesthete of the cosmos.',gem:'Diamond',col:'Pink'},
  {n:'Vrischika',e:'Scorpio',s:'♏',r:'Mars',el:'Water',c:'#c0392b',dt:'Oct 23–Nov 21',tr:['Intense','Perceptive','Transformative','Secretive'],desc:'The eighth sign, ruled by Mars. Intensely perceptive and powerfully transformative. The phoenix of the zodiac.',gem:'Red Coral',col:'Deep Red'},
  {n:'Dhanu',e:'Sagittarius',s:'♐',r:'Jupiter',el:'Fire',c:'#e74c3c',dt:'Nov 22–Dec 21',tr:['Philosophical','Adventurous','Optimistic','Blunt'],desc:'The ninth sign, ruled by Jupiter. Endlessly optimistic and freedom-loving. The eternal seeker of truth and wisdom.',gem:'Yellow Sapphire',col:'Yellow'},
  {n:'Makara',e:'Capricorn',s:'♑',r:'Saturn',el:'Earth',c:'#7f8c8d',dt:'Dec 22–Jan 19',tr:['Disciplined','Ambitious','Patient','Practical'],desc:'The tenth sign, ruled by Saturn. Supremely disciplined and patient. The master builder who achieves through perseverance.',gem:'Blue Sapphire',col:'Dark Blue'},
  {n:'Kumbha',e:'Aquarius',s:'♒',r:'Saturn',el:'Air',c:'#2980b9',dt:'Jan 20–Feb 18',tr:['Innovative','Humanitarian','Visionary','Rebellious'],desc:'The eleventh sign, ruled by Saturn. Progressive and brilliantly innovative. The cosmic revolutionary.',gem:'Amethyst',col:'Electric Blue'},
  {n:'Meena',e:'Pisces',s:'♓',r:'Jupiter',el:'Water',c:'#16a085',dt:'Feb 19–Mar 20',tr:['Compassionate','Dreamy','Spiritual','Artistic'],desc:'The twelfth sign, ruled by Jupiter. Deeply compassionate and spiritually attuned. The dreamer and mystic.',gem:'Yellow Sapphire',col:'Sea Green'},
]

const EC: Record<string,string> = {Fire:'#e74c3c',Earth:'#27ae60',Air:'#f1c40f',Water:'#3498db'}

export default function RashisPage() {
  const [sel, setSel] = useState<typeof RASHIS[0]|null>(null)
  return (
    <div>
      <div className="section-title">♈ The Twelve Rashis</div>
      <div className="rashi-grid">
        {RASHIS.map(r => (
          <div key={r.n} onClick={() => setSel(r)} className={`rashi-card${sel?.n===r.n?' active':''}`}>
            <span className="rashi-sym">{r.s}</span>
            <div className="rashi-name-text">{r.n}</div>
            <div className="rashi-sub">{r.e}</div>
            <div className="rashi-sub mt-sm" style={{color: EC[r.el]}}>{r.el} · {r.r}</div>
          </div>
        ))}
      </div>

      {sel && (
        <div className="card card-p-lg page-enter">
          <div className="flex-row mb-md">
            <span style={{fontSize:'3.5rem', lineHeight:1}}>{sel.s}</span>
            <div>
              <div style={{fontFamily:'var(--font-display)', color:'var(--gold)', fontSize:'1.5rem'}}>{sel.n}</div>
              <div style={{color:'var(--cream-muted)', fontSize:'0.88rem', marginTop:'3px'}}>{sel.e} · {sel.dt}</div>
              <div style={{fontSize:'0.85rem', marginTop:'5px', color: EC[sel.el]}}>{sel.el} · Ruled by {sel.r}</div>
            </div>
          </div>
          <p style={{color:'var(--cream-dim)', fontSize:'1.02rem', lineHeight:'1.85', marginBottom:'1.25rem'}}>{sel.desc}</p>
          <div className="flex-wrap mb-md">
            {sel.tr.map(t => <span className="badge" key={t}>{t}</span>)}
          </div>
          <div className="lucky-row">
            <div className="lucky-item"><div className="lucky-key">Lucky Gem</div><div className="lucky-val">{sel.gem}</div></div>
            <div className="lucky-item"><div className="lucky-key">Lucky Color</div><div className="lucky-val">{sel.col}</div></div>
          </div>
        </div>
      )}
      {!sel && (
        <div style={{textAlign:'center', padding:'3rem', color:'var(--cream-muted)', fontStyle:'italic'}}>
          ↑ Click any rashi above to see its detailed reading
        </div>
      )}
    </div>
  )
}
