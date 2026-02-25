import axios from 'axios'

const pythonApi = axios.create({
  baseURL: (import.meta as any).env?.VITE_PYTHON_API_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' }
})

const javaApi = axios.create({
  baseURL: (import.meta as any).env?.VITE_JAVA_API_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' }
})

const attachToken = (config: any) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
}
pythonApi.interceptors.request.use(attachToken)
javaApi.interceptors.request.use(attachToken)

// ── Kundli ──────────────────────────────────────────────────
export const kundliApi = {
  generate: (data: any) => pythonApi.post('/api/v1/kundli/generate', data),
  getDasha: (data: any) => pythonApi.post('/api/v1/kundli/dasha', data),
}

// ── Horoscope ────────────────────────────────────────────────
export const horoscopeApi = {
  getDaily: (rashi: string) => pythonApi.get(`/api/v1/horoscope/daily/${rashi}`),
  getWeekly: (rashi: string) => pythonApi.get(`/api/v1/horoscope/weekly/${rashi}`),
}

// ── AI ───────────────────────────────────────────────────────
export const aiApi = {
  horoscope: (data: {
    rashi: string; rashi_english: string;
    period_type?: string; current_dasha?: string
  }) => pythonApi.post('/api/v1/ai/horoscope', data),

  kundliReading: (kundli_data: any) =>
    pythonApi.post('/api/v1/ai/kundli-reading', { kundli_data }),

  compatibility: (person1: any, person2: any, score: number) =>
    pythonApi.post('/api/v1/ai/compatibility', { person1, person2, score }),

  dasha: (data: {
    kundli_data: any; current_dasha: string;
    next_dasha: string; dasha_end_date: string
  }) => pythonApi.post('/api/v1/ai/dasha', data),

  chat: (messages: {role:string; content:string}[], user_context?: any) =>
    pythonApi.post('/api/v1/ai/chat', { messages, user_context }),

  muhurta: (event_type: string, preferred_month: string, kundli_data?: any) =>
    pythonApi.post('/api/v1/ai/muhurta', { event_type, preferred_month, kundli_data }),

  yearly: (kundli_data: any, year: number) =>
    pythonApi.post('/api/v1/ai/yearly', { kundli_data, year }),

  health: () => pythonApi.get('/api/v1/ai/health'),
}

// ── Transits / Remedies / Rashis ─────────────────────────────
export const transitsApi = { getCurrent: () => pythonApi.get('/api/v1/transits/current') }
export const remediesApi = { getAll: (cat?: string) => pythonApi.get('/api/v1/remedies/', { params: { category: cat } }) }
export const rashisApi   = { getAll: () => pythonApi.get('/api/v1/rashis/') }
export const authApi = {
  register: (data: any) => javaApi.post('/api/auth/register', data),
  login: (data: any) => javaApi.post('/api/auth/login', data),
  refresh: (token: string) => javaApi.post('/api/auth/refresh', { refreshToken: token }),
}

export { pythonApi, javaApi }
