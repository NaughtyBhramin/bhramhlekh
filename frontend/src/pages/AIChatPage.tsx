import { useState, useRef, useEffect } from 'react'
import { aiApi } from '@/utils/api'

interface Message { role: 'user' | 'assistant'; content: string; ts?: number }

const SUGGESTIONS = [
  "What does my Lagna (ascendant) say about my personality?",
  "Which gemstone should I wear based on Vedic astrology?",
  "What is Vimshottari Dasha and how does it affect me?",
  "Explain Gajakesari Yoga and its effects",
  "What are the best remedies for Saturn's malefic effects?",
  "How do I find my lucky colours and numbers?",
  "What is the significance of Rahu and Ketu in a chart?",
  "Explain the 12 houses of the Kundli",
]

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: 'Om Namo Narayanaya 🙏\n\nI am Jyotish Guru, your AI Vedic astrology guide. I carry the wisdom of the ancient rishis — the Brihat Parashara Hora Shastra, Jataka Parijata, and centuries of celestial knowledge.\n\nAsk me anything about your Kundli, Dashas, planetary remedies, Nakshatras, Yogas, auspicious timing, or any aspect of Vedic Jyotish. I am here to illuminate your path.'
  }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = async (text?: string) => {
    const msg = text || input.trim()
    if (!msg || loading) return
    setInput('')
    setError('')

    const userMsg: Message = { role: 'user', content: msg, ts: Date.now() }
    const next = [...messages, userMsg]
    setMessages(next)
    setLoading(true)

    try {
      const apiMessages = next.map(m => ({ role: m.role, content: m.content }))
      const res = await aiApi.chat(apiMessages)
      setMessages(prev => [...prev, {
        role: 'assistant', content: res.data.response, ts: Date.now()
      }])
    } catch {
      setError('AI service unavailable. Please add ANTHROPIC_API_KEY to your backend .env file.')
      setMessages(prev => prev.slice(0, -1))
    } finally { setLoading(false) }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 160px)', maxWidth: '860px', margin: '0 auto' }}>
      <div className="section-title">💬 AI Jyotish Guru — Chat with the Stars</div>
      <p style={{ color: 'var(--cream-muted)', fontStyle: 'italic', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
        Ask anything about Vedic astrology — your chart, dashas, remedies, yogas, timing, relationships
      </p>

      {/* Chat window */}
      <div style={{
        flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem',
        padding: '1.25rem', background: 'rgba(10,6,18,0.6)', border: '1px solid rgba(201,168,76,0.18)',
        borderRadius: '3px', marginBottom: '1rem'
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '78%',
              background: m.role === 'user'
                ? 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(123,63,160,0.2))'
                : 'rgba(26,10,46,0.8)',
              border: `1px solid ${m.role === 'user' ? 'rgba(201,168,76,0.4)' : 'rgba(201,168,76,0.15)'}`,
              borderRadius: '3px',
              padding: '0.9rem 1.1rem',
            }}>
              {m.role === 'assistant' && (
                <div style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', fontSize: '0.6rem', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>
                  🔮 JYOTISH GURU
                </div>
              )}
              <p style={{
                color: m.role === 'user' ? 'var(--cream)' : 'var(--cream-dim)',
                fontSize: '0.95rem', lineHeight: '1.75', whiteSpace: 'pre-wrap', margin: 0
              }}>{m.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ background: 'rgba(26,10,46,0.8)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '3px', padding: '0.9rem 1.1rem' }}>
              <div style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', fontSize: '0.6rem', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>🔮 JYOTISH GURU</div>
              <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: '7px', height: '7px', borderRadius: '50%', background: 'var(--gold)',
                    animation: `twinkle 1.2s ease-in-out ${i * 0.2}s infinite`
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {error && (
        <div style={{ background: 'rgba(201,107,138,0.1)', border: '1px solid rgba(201,107,138,0.35)', borderRadius: '3px', padding: '0.75rem 1rem', marginBottom: '0.75rem', color: 'var(--rose)', fontSize: '0.85rem' }}>
          ⚠ {error}
        </div>
      )}

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div style={{ marginBottom: '0.75rem' }}>
          <div style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-light)', fontSize: '0.6rem', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>SUGGESTED QUESTIONS</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {SUGGESTIONS.map(s => (
              <button key={s} onClick={() => send(s)}
                style={{ background: 'rgba(26,10,46,0.7)', border: '1px solid rgba(201,168,76,0.2)', color: 'rgba(240,230,208,0.6)', fontFamily: 'var(--font-body)', fontSize: '0.8rem', padding: '5px 12px', borderRadius: '2px', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = 'rgba(201,168,76,0.5)'; (e.target as HTMLElement).style.color = 'var(--cream)' }}
                onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = 'rgba(201,168,76,0.2)'; (e.target as HTMLElement).style.color = 'rgba(240,230,208,0.6)' }}
              >{s}</button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask the stars anything... (Enter to send, Shift+Enter for new line)"
          rows={2}
          style={{
            flex: 1, background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(201,168,76,0.28)',
            color: 'var(--cream)', fontFamily: 'var(--font-body)', fontSize: '1rem',
            padding: '11px 14px', borderRadius: '2px', outline: 'none', resize: 'none',
            transition: 'border-color 0.25s'
          }}
          onFocus={e => (e.target.style.borderColor = 'var(--gold)')}
          onBlur={e => (e.target.style.borderColor = 'rgba(201,168,76,0.28)')}
        />
        <button onClick={() => send()} disabled={loading || !input.trim()} className="btn-gold"
          style={{ padding: '13px 22px', flexShrink: 0 }}>
          ✦ Send
        </button>
      </div>
    </div>
  )
}
