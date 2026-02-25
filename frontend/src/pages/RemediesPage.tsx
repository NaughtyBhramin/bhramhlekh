import { useState } from 'react'

const REMEDIES = [
  {pl:'Sun',cat:'mantra',icon:'🌞',title:'Surya Beej Mantra',mantra:'Om Hraam Hreem Hraum Sah Suryaya Namah',gem:'Ruby',day:'Sunday',desc:'Chant 108 times at sunrise to strengthen solar energy, gain confidence, leadership ability, and government favor.'},
  {pl:'Moon',cat:'fasting',icon:'🌙',title:'Somvar Vrat (Monday Fast)',mantra:'Om Shraam Shreem Shraum Sah Chandraya Namah',gem:'Pearl',day:'Monday',desc:'Observe fast on Mondays, consume only white foods and milk. Offer white flowers to Lord Shiva at sunset for emotional peace.'},
  {pl:'Mars',cat:'puja',icon:'🔴',title:'Hanuman Puja',mantra:'Om Kraam Kreem Kraum Sah Bhauma Namah',gem:'Red Coral',day:'Tuesday',desc:'Worship Lord Hanuman with red flowers, sindoor, and sesame oil lamp. Recite Hanuman Chalisa 11 times every Tuesday.'},
  {pl:'Mercury',cat:'donation',icon:'💚',title:'Mercury Donation',mantra:'Om Braam Breem Braum Sah Budhaya Namah',gem:'Emerald',day:'Wednesday',desc:'Donate green cloth, mung beans, and emeralds to students and teachers on Wednesdays to strengthen Mercury energy.'},
  {pl:'Jupiter',cat:'mantra',icon:'🟡',title:'Guru Beej Mantra',mantra:'Om Graam Greem Graum Sah Gurave Namah',gem:'Yellow Sapphire',day:'Thursday',desc:'Chanting Jupiter\'s mantra 108 times on Thursdays attracts wisdom, prosperity, children, and deep spiritual growth.'},
  {pl:'Venus',cat:'yantra',icon:'💗',title:'Shukra Yantra Installation',mantra:'Om Draam Dreem Draum Sah Shukraya Namah',gem:'Diamond',day:'Friday',desc:'Install a copper Shukra Yantra at home on Fridays. This sacred geometric diagram powerfully attracts love and material abundance.'},
  {pl:'Saturn',cat:'puja',icon:'🔵',title:'Shani Temple Puja',mantra:'Om Praam Preem Praum Sah Shanaischaraya Namah',gem:'Blue Sapphire',day:'Saturday',desc:'Visit Shani temple on Saturdays. Offer sesame seeds, black cloth, and mustard oil to the Shani idol for karmic relief.'},
  {pl:'Rahu',cat:'mantra',icon:'🔮',title:'Rahu Beej Mantra',mantra:'Om Bhram Bhreem Bhraum Sah Rahave Namah',gem:'Hessonite',day:'Saturday',desc:'Reduces malefic Rahu effects including sudden reversals and obsessions. Also worship Goddess Durga for protection.'},
  {pl:'Ketu',cat:'mantra',icon:'🌿',title:'Ketu Beej Mantra',mantra:'Om Sraam Sreem Sraum Sah Ketave Namah',gem:"Cat's Eye",day:'Tuesday',desc:'Enhances spiritual growth, psychic abilities, and reduces accidents and confusion. Worship Lord Ganesha regularly.'},
  {pl:'All',cat:'herb',icon:'🌱',title:'Brahmi for Mental Peace',mantra:'',gem:'',day:'Daily',desc:'Take Brahmi (Bacopa monnieri) with warm milk daily. Strengthens Mercury and Moon, enhancing memory, clarity, and emotional peace.'},
  {pl:'All',cat:'herb',icon:'🌾',title:'Ashwagandha for Vitality',mantra:'',gem:'',day:'Daily',desc:'Strengthens Mars energy. Boosts immunity, builds physical strength, and significantly reduces stress hormones and anxiety.'},
  {pl:'All',cat:'gemstone',icon:'💎',title:'Gemstone Therapy Guide',mantra:'',gem:'Various',day:'Per Planet',desc:'Each of the 9 planets has a corresponding gemstone. Always use natural, unheated gems of high quality. Activate with Vedic rituals before wearing.'},
]

const CATS = ['all','mantra','puja','fasting','donation','yantra','herb','gemstone']

export default function RemediesPage() {
  const [filter, setFilter] = useState('all')
  const list = filter === 'all' ? REMEDIES : REMEDIES.filter(r => r.cat === filter)

  return (
    <div>
      <div className="section-title">✿ Vedic Remedies & Healing</div>
      <div className="flex-wrap mb-lg">
        {CATS.map(c => (
          <button key={c} onClick={() => setFilter(c)} className={`btn-filter${filter===c?' active':''}`}>
            {c.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="grid-auto">
        {list.map((r,i) => (
          <div key={i} className="card card-hover card-p">
            <span className="remedy-icon">{r.icon}</span>
            <h4 className="remedy-title">{r.title}</h4>
            <p className="remedy-desc">{r.desc}</p>
            {r.mantra && <p className="remedy-mantra">{r.mantra}</p>}
            <div className="flex-wrap gap-sm">
              {r.gem && <span className="badge">💎 {r.gem}</span>}
              {r.day && <span className="badge">📅 {r.day}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
