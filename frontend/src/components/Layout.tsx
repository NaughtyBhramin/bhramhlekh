import { useEffect, useRef } from 'react'
import { Outlet, NavLink } from 'react-router-dom'

const NAV = [
  { path: '/kundli',        icon: '⬡',  label: 'Kundli' },
  { path: '/horoscope',     icon: '☽',  label: 'Horoscope' },
  { path: '/rashis',        icon: '♈',  label: 'Rashis' },
  { path: '/dasha',         icon: '⏳', label: 'Dasha' },
  { path: '/transits',      icon: '☿',  label: 'Transits' },
  { path: '/remedies',      icon: '✿',  label: 'Remedies' },
  { path: '/compatibility', icon: '♥',  label: 'Match' },
  { path: '/muhurta',       icon: '⏰', label: 'Muhurta' },
  { path: '/yearly',        icon: '🌟', label: 'Yearly' },
  { path: '/chat',          icon: '💬', label: 'AI Chat', ai: true },
]

export default function Layout() {
  const sfRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sf = sfRef.current
    if (!sf) return
    for (let i = 0; i < 140; i++) {
      const s = document.createElement('div')
      s.className = 'star'
      const sz = Math.random() * 2.5 + 0.5
      s.style.cssText = `width:${sz}px;height:${sz}px;left:${Math.random()*100}%;top:${Math.random()*100}%;--dur:${2+Math.random()*4}s;--delay:${Math.random()*6}s;`
      sf.appendChild(s)
    }
  }, [])

  return (
    <div className="app-wrapper">
      <div ref={sfRef} className="starfield" />
      <div className="cosmic-glow" />

      <nav className="navbar">
        <div className="navbar-inner">
          <NavLink to="/" className="navbar-brand">
            <span className="navbar-om">ॐ</span>
            <span className="navbar-title">Jyotish Darshan</span>
          </NavLink>
          <div className="nav-links">
            {NAV.map(item => (
              <NavLink key={item.path} to={item.path} end={item.path === '/'}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}${item.ai ? ' ai-nav' : ''}`}>
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="page-enter"><Outlet /></div>
      </main>

      <footer className="footer">🔮 Jyotish Darshan · AI-Powered Ancient Vedic Wisdom · For spiritual guidance only</footer>
    </div>
  )
}
