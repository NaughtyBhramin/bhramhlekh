import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { kundliApi, aiApi } from '@/utils/api'

interface KundliForm {
  name:string; date_of_birth:string; time_of_birth:string;
  place_of_birth:string; gender:string; chart_style:string;
}
const PC: Record<string,string> = {
  Sun:'#f39c12',Moon:'#bdc3c7',Mars:'#e74c3c',Mercury:'#2ecc71',
  Jupiter:'#f1c40f',Venus:'#e91e63',Saturn:'#607d8b',Rahu:'#9c27b0',Ketu:'#795548'
}
const RASHIS = ['Mesha','Vrishabha','Mithuna','Karka','Simha','Kanya','Tula','Vrischika','Dhanu','Makara','Kumbha','Meena']
const SYMS   = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓']

function mockKundli(data: KundliForm) {
  const h = parseInt(data.time_of_birth.split(':')[0])
  const ai = Math.floor(h/2)%12
  const pN=['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu']
  const pS=['Surya','Chandra','Mangal','Budha','Guru','Shukra','Shani','Rahu','Ketu']
  const pSy=['☉','☽','♂','☿','♃','♀','♄','☊','☋']
  const planets:any={}
  pN.forEach((name,i)=>{
    const si=(ai+i*3)%12
    planets[name]={name,sanskrit:pS[i],symbol:pSy[i],sidereal_longitude:si*30+(i*7.3)%30,
      rashi:RASHIS[si],rashi_symbol:SYMS[si],degree_in_rashi:(i*7.3)%30,
      nakshatra:'Rohini',nakshatra_pada:(i%4)+1,is_retrograde:i>6,house:((si-ai+12)%12)+1}
  })
  const houses=Array.from({length:12},(_,i)=>({
    house:i+1,rashi:RASHIS[(ai+i)%12],rashi_symbol:SYMS[(ai+i)%12],
    planets:pN.filter(n=>planets[n].house===i+1),
    significance:['Self','Wealth','Siblings','Home','Children','Health','Marriage','Transformation','Fortune','Career','Gains','Liberation'][i]
  }))
  return {id:'demo',name:data.name,date_of_birth:data.date_of_birth,
    time_of_birth:data.time_of_birth,place_of_birth:data.place_of_birth,
    ascendant_rashi:RASHIS[ai],ascendant_degree:h*1.5,moon_sign:RASHIS[(ai+3)%12],
    sun_sign:RASHIS[(ai+4)%12],nakshatra:'Punarvasu',nakshatra_pada:2,nakshatra_lord:'Jupiter',
    planets,houses,ayanamsa:23.85,
    yogas:['Gajakesari Yoga — Moon and Jupiter in mutual kendra: prosperity and wisdom',
           'Budhaditya Yoga — Sun and Mercury conjunction: sharp intellect and fame'],
    dasha_periods:[{planet:'Saturn',start_date:'2020-01-01',end_date:'2039-01-01',years:19,is_current:true},
                   {planet:'Mercury',start_date:'2039-01-01',end_date:'2056-01-01',years:17,is_current:false}]}
}

export default function KundliPage() {
  const [kundli,setKundli]=useState<any>(null)
  const [loading,setLoading]=useState(false)
  const [aiLoading,setAiLoading]=useState(false)
  const [aiReading,setAiReading]=useState<any>(null)
  const [aiError,setAiError]=useState('')
  const [activeTab,setActiveTab]=useState<'chart'|'ai'|'dasha'>('chart')
  const canvasRef=useRef<HTMLCanvasElement>(null)
  const {register,handleSubmit,formState:{errors}}=useForm<KundliForm>({
    defaultValues:{date_of_birth:'1990-06-15',time_of_birth:'10:30',place_of_birth:'Delhi, India',gender:'male',chart_style:'north'}
  })

  const onSubmit=async(data:KundliForm)=>{
    setLoading(true); setAiReading(null)
    try{const res=await kundliApi.generate(data);setKundli(res.data)}
    catch{setKundli(mockKundli(data))}
    finally{setLoading(false); setActiveTab('chart')}
  }

  const generateAIReading=async()=>{
    if(!kundli)return
    setAiLoading(true); setAiError('')
    try{
      const res=await aiApi.kundliReading(kundli)
      setAiReading(res.data.reading)
      setActiveTab('ai')
    }catch{setAiError('AI service unavailable. Please add ANTHROPIC_API_KEY to your backend .env file.')}
    finally{setAiLoading(false)}
  }

  useEffect(()=>{if(kundli&&activeTab==='chart')drawChart()},[kundli,activeTab])

  function drawChart(){
    const canvas=canvasRef.current; if(!canvas||!kundli)return
    const ctx=canvas.getContext('2d')!
    const W=canvas.width,H=canvas.height,cx=W/2,cy=H/2,sz=Math.min(W,H)*0.22
    ctx.clearRect(0,0,W,H)
    ctx.fillStyle='rgba(10,6,18,0.95)';ctx.fillRect(0,0,W,H)
    const ai=RASHIS.indexOf(kundli.ascendant_rashi)
    ctx.strokeStyle='rgba(201,168,76,0.55)';ctx.lineWidth=1
    ctx.strokeRect(cx-sz*2,cy-sz*1.5,sz*4,sz*3)
    for(let i=1;i<4;i++){ctx.beginPath();ctx.moveTo(cx-sz*2+i*sz,cy-sz*1.5);ctx.lineTo(cx-sz*2+i*sz,cy+sz*1.5);ctx.stroke()}
    ctx.beginPath();ctx.moveTo(cx-sz*2,cy-sz*0.5);ctx.lineTo(cx+sz*2,cy-sz*0.5);ctx.stroke()
    ctx.beginPath();ctx.moveTo(cx-sz*2,cy+sz*0.5);ctx.lineTo(cx+sz*2,cy+sz*0.5);ctx.stroke()
    ;[[cx-sz,cy-sz*0.5,cx,cy-sz*1.5],[cx,cy-sz*1.5,cx+sz,cy-sz*0.5],
      [cx+sz,cy-sz*0.5,cx+sz*2,cy-sz*1.5],[cx-sz*2,cy-sz*1.5,cx-sz,cy-sz*0.5],
      [cx-sz,cy+sz*0.5,cx,cy+sz*1.5],[cx,cy+sz*1.5,cx+sz,cy+sz*0.5],
      [cx+sz,cy+sz*0.5,cx+sz*2,cy+sz*1.5],[cx-sz*2,cy+sz*1.5,cx-sz,cy+sz*0.5]
    ].forEach(([x1,y1,x2,y2])=>{ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke()})
    const HG=[[1,0],[0,0],[0,1],[0,2],[1,2],[2,2],[3,2],[3,1],[3,0],[2,0],[2,1],[1,1]]
    HG.forEach(([col,row],hIdx)=>{
      const bx=cx-sz*2+col*sz,by=cy-sz*1.5+row*sz,ri=(hIdx+ai)%12
      ctx.fillStyle='rgba(201,168,76,0.35)';ctx.font='9px serif';ctx.fillText(String(hIdx+1),bx+5,by+14)
      ctx.fillStyle='#c9a84c';ctx.font='17px serif';ctx.fillText(SYMS[ri],bx+sz/2-9,by+sz/2+5)
      if(kundli.planets){
        Object.values(kundli.planets).filter((p:any)=>p.house===hIdx+1).forEach((p:any,pi)=>{
          ctx.fillStyle=PC[p.name]||'#fff';ctx.font='11px serif';ctx.fillText(p.symbol,bx+5+pi*14,by+sz-7)
        })
      }
      if(hIdx===0){ctx.fillStyle='#e74c3c';ctx.font='bold 9px serif';ctx.fillText('L',bx+sz-14,by+14)}
    })
  }

  const SectionCard=({title,children}:{title:string,children:any})=>(
    <div style={{marginBottom:'1rem'}}>
      <div style={{fontFamily:'var(--font-heading)',color:'var(--gold-light)',fontSize:'0.72rem',
        letterSpacing:'0.15em',textTransform:'uppercase',marginBottom:'0.5rem'}}>{title}</div>
      <p style={{color:'var(--cream-dim)',fontSize:'0.95rem',lineHeight:'1.8'}}>{children}</p>
    </div>
  )

  return (
    <div>
      <div className="section-title">⬡ Kundli Generator</div>

      {/* Form */}
      <div className="card card-p-lg mb-lg" style={{maxWidth:'620px',margin:'0 auto 2rem'}}>
        <h2 style={{fontFamily:'var(--font-heading)',color:'var(--gold)',textAlign:'center',
          marginBottom:'1.5rem',letterSpacing:'0.1em',fontSize:'1rem'}}>✦ Enter Birth Details ✦</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-grid">
            <div>
              <label className="form-label">Full Name</label>
              <input {...register('name',{required:'Required'})} className="form-input" placeholder="Your full name" />
              {errors.name&&<p className="error-msg">{errors.name.message}</p>}
            </div>
            <div><label className="form-label">Date of Birth</label><input type="date" {...register('date_of_birth')} className="form-input"/></div>
            <div><label className="form-label">Time of Birth</label><input type="time" {...register('time_of_birth')} className="form-input"/></div>
            <div><label className="form-label">Place of Birth</label><input {...register('place_of_birth')} className="form-input" placeholder="City, Country"/></div>
            <div><label className="form-label">Gender</label>
              <select {...register('gender')} className="form-select">
                <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
              </select>
            </div>
            <div><label className="form-label">Chart Style</label>
              <select {...register('chart_style')} className="form-select">
                <option value="north">North Indian</option><option value="south">South Indian</option>
              </select>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-gold full-width">
            {loading?'⏳ Computing Chart...':'✦ GENERATE KUNDLI ✦'}
          </button>
        </form>
      </div>

      {/* Results */}
      {kundli && (
        <div className="kundli-results page-enter">
          {/* Tabs */}
          <div style={{display:'flex',gap:'6px',marginBottom:'1.5rem',flexWrap:'wrap'}}>
            {[['chart','⬡ Birth Chart'],['ai','✨ AI Reading'],['dasha','⏳ Dasha']].map(([t,l])=>(
              <button key={t} onClick={()=>setActiveTab(t as any)}
                className={`btn-filter${activeTab===t?' active':''}`}>{l}</button>
            ))}
            <button onClick={generateAIReading} disabled={aiLoading} className="btn-gold"
              style={{padding:'7px 18px',fontSize:'0.75rem',letterSpacing:'0.12em'}}>
              {aiLoading?'🔮 Consulting AI...':'✨ Generate AI Reading'}
            </button>
          </div>

          {aiError&&<div style={{background:'rgba(201,107,138,0.1)',border:'1px solid rgba(201,107,138,0.35)',
            borderRadius:'3px',padding:'1rem',marginBottom:'1rem',color:'var(--rose)',fontSize:'0.88rem'}}>⚠ {aiError}</div>}

          {/* Chart Tab */}
          {activeTab==='chart'&&(
            <div style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
              <div className="grid-2">
                <div className="card card-p">
                  <p className="chart-label">North Indian Kundli — {kundli.name}</p>
                  <canvas ref={canvasRef} width={420} height={320} className="kundli-canvas"/>
                </div>
                <div className="card card-p">
                  <p className="section-subtitle">Planetary Positions</p>
                  {Object.values(kundli.planets).map((p:any)=>(
                    <div className="planet-row" key={p.name}>
                      <span className="planet-name" style={{color:PC[p.name]||'#c9a84c'}}>{p.symbol} {p.sanskrit}</span>
                      <span className="planet-sign-txt">{p.rashi_symbol} {p.rashi}</span>
                      <span className="planet-deg">{p.degree_in_rashi?.toFixed(1)}°{p.is_retrograde&&<span className="text-rose"> R</span>}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card card-p">
                <p className="section-subtitle">Birth Summary</p>
                <div className="summary-grid">
                  {[['ASCENDANT',kundli.ascendant_rashi],['MOON SIGN',kundli.moon_sign],
                    ['SUN SIGN',kundli.sun_sign],['NAKSHATRA',`${kundli.nakshatra} P${kundli.nakshatra_pada}`],
                    ['NAK. LORD',kundli.nakshatra_lord],['AYANAMSA',`${kundli.ayanamsa?.toFixed(2)}°`]
                  ].map(([k,v])=>(<div key={k}><div className="summary-key">{k}</div><div className="summary-val">{v}</div></div>))}
                </div>
              </div>
              {kundli.yogas?.length>0&&(
                <div className="card card-p">
                  <p className="section-subtitle">✦ Yogas</p>
                  <div className="space-y">
                    {kundli.yogas.map((y:string,i:number)=>(
                      <div className="yoga-item" key={i}><span className="text-gold">✦</span><p className="yoga-text">{y}</p></div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* AI Reading Tab */}
          {activeTab==='ai'&&(
            <div>
              {aiLoading&&(
                <div className="card card-p-lg" style={{textAlign:'center',padding:'4rem'}}>
                  <div style={{fontSize:'3rem',marginBottom:'1rem',animation:'pulseGold 2s ease-in-out infinite'}}>🔮</div>
                  <p style={{fontFamily:'var(--font-heading)',color:'var(--gold)',letterSpacing:'0.15em',fontSize:'0.85rem'}}>
                    GENERATING YOUR READING
                  </p>
                  <p style={{color:'var(--cream-muted)',fontStyle:'italic',marginTop:'0.5rem',fontSize:'0.9rem'}}>
                    Claude AI is analyzing your complete Kundli...
                  </p>
                </div>
              )}
              {aiReading&&!aiLoading&&(
                <div style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
                  {/* Summary */}
                  <div className="card card-p-lg" style={{borderColor:'rgba(201,168,76,0.4)'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'1rem'}}>
                      <span style={{fontSize:'0.65rem',fontFamily:'var(--font-heading)',letterSpacing:'0.15em',background:'var(--gold)',color:'var(--deep)',padding:'4px 12px',borderRadius:'20px'}}>✨ AI GENERATED</span>
                      <span style={{fontSize:'0.65rem',fontFamily:'var(--font-heading)',letterSpacing:'0.15em',color:'var(--gold-light)'}}>COMPLETE JYOTISH ANALYSIS</span>
                    </div>
                    <p style={{fontSize:'1.05rem',lineHeight:'1.9',color:'var(--cream)'}}>{aiReading.overall_summary}</p>
                    {aiReading.power_planet&&<p style={{marginTop:'0.75rem',fontStyle:'italic',color:'var(--gold)',fontSize:'0.9rem'}}>⚡ Power Planet: {aiReading.power_planet} · Best Period: {aiReading.lucky_period}</p>}
                  </div>

                  {/* Core readings grid */}
                  <div className="grid-2">
                    {[['🌅 Personality & Appearance',aiReading.personality],
                      ['🌙 Mind & Emotions',aiReading.mind_emotions],
                      ['☉ Soul Purpose',aiReading.soul_purpose],
                      ['💰 Wealth & Family',aiReading.wealth_family],
                      ['🏆 Career & Status',aiReading.career],
                      ['♥ Relationships & Marriage',aiReading.relationships],
                      ['🌿 Health',aiReading.health],
                      ['🕉 Spiritual Path',aiReading.spiritual_path],
                    ].map(([lbl,txt])=>(
                      <div className="card card-p" key={lbl}>
                        <div style={{fontFamily:'var(--font-heading)',color:'var(--gold-light)',fontSize:'0.7rem',letterSpacing:'0.1em',marginBottom:'0.6rem'}}>{lbl}</div>
                        <p style={{color:'var(--cream-dim)',fontSize:'0.9rem',lineHeight:'1.75'}}>{txt}</p>
                      </div>
                    ))}
                  </div>

                  {/* Blessings + Challenges */}
                  <div className="grid-2">
                    <div className="card card-p">
                      <div style={{fontFamily:'var(--font-heading)',color:'var(--gold-light)',fontSize:'0.7rem',letterSpacing:'0.1em',marginBottom:'0.75rem'}}>✦ SPECIAL BLESSINGS</div>
                      {aiReading.special_blessings?.map((b:string,i:number)=>(
                        <div key={i} style={{display:'flex',gap:'0.5rem',marginBottom:'0.5rem'}}>
                          <span style={{color:'#f1c40f',flexShrink:0}}>★</span>
                          <p style={{color:'var(--cream-dim)',fontSize:'0.88rem',lineHeight:'1.6'}}>{b}</p>
                        </div>
                      ))}
                    </div>
                    <div className="card card-p">
                      <div style={{fontFamily:'var(--font-heading)',color:'var(--rose)',fontSize:'0.7rem',letterSpacing:'0.1em',marginBottom:'0.75rem'}}>⚡ KARMIC LESSONS</div>
                      {aiReading.challenges?.map((c:string,i:number)=>(
                        <div key={i} style={{display:'flex',gap:'0.5rem',marginBottom:'0.5rem'}}>
                          <span style={{color:'var(--rose)',flexShrink:0}}>◆</span>
                          <p style={{color:'var(--cream-dim)',fontSize:'0.88rem',lineHeight:'1.6'}}>{c}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Remedies */}
                  {aiReading.remedies?.length>0&&(
                    <div className="card card-p-lg">
                      <div style={{fontFamily:'var(--font-heading)',color:'var(--gold-light)',fontSize:'0.72rem',letterSpacing:'0.15em',marginBottom:'1rem'}}>✿ PERSONALIZED REMEDIES</div>
                      <div className="grid-3">
                        {aiReading.remedies.map((r:any,i:number)=>(
                          <div key={i} style={{background:'rgba(0,0,0,0.25)',borderRadius:'2px',padding:'1rem',border:'1px solid rgba(201,168,76,0.15)'}}>
                            <div style={{fontFamily:'var(--font-heading)',color:'var(--gold)',fontSize:'0.8rem',marginBottom:'0.5rem'}}>{r.title}</div>
                            <p style={{color:'var(--cream-dim)',fontSize:'0.85rem',lineHeight:'1.65',marginBottom:'0.5rem'}}>{r.description}</p>
                            {r.mantra&&<p style={{fontStyle:'italic',color:'rgba(201,168,76,0.65)',fontSize:'0.78rem',borderLeft:'2px solid rgba(201,168,76,0.3)',paddingLeft:'0.5rem'}}>{r.mantra}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {!aiReading&&!aiLoading&&(
                <div style={{textAlign:'center',padding:'4rem',color:'var(--cream-muted)'}}>
                  <div style={{fontSize:'3rem',marginBottom:'1rem',opacity:0.4}}>✨</div>
                  <p style={{fontStyle:'italic'}}>Click "Generate AI Reading" above to get your personalized AI-powered Kundli interpretation</p>
                </div>
              )}
            </div>
          )}

          {/* Dasha Tab */}
          {activeTab==='dasha'&&(
            <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
              <p style={{fontStyle:'italic',color:'var(--cream-muted)',marginBottom:'0.5rem',fontSize:'0.9rem'}}>Your Vimshottari Dasha timeline based on Moon's nakshatra position</p>
              {kundli.dasha_periods?.map((d:any,i:number)=>(
                <div key={i} className={`dasha-item${d.is_current?' current':''}`}>
                  <div className="dasha-planet-icon" style={{color:PC[d.planet]||'var(--gold)'}}>
                    {d.planet.charAt(0)}
                  </div>
                  <div className="dasha-info">
                    <div style={{display:'flex',alignItems:'center',gap:'0.75rem',flexWrap:'wrap',marginBottom:'4px'}}>
                      <span className="dasha-title">{d.planet} Mahadasha</span>
                      <span style={{color:'var(--cream-muted)',fontSize:'0.76rem'}}>({d.years?.toFixed(1)} years)</span>
                      {d.is_current&&<span className="current-badge">CURRENT</span>}
                    </div>
                    <p className="dasha-period">{d.start_date} → {d.end_date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
