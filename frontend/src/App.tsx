import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout'
import HomePage from '@/pages/HomePage'
import KundliPage from '@/pages/KundliPage'
import HoroscopePage from '@/pages/HoroscopePage'
import RashisPage from '@/pages/RashisPage'
import TransitsPage from '@/pages/TransitsPage'
import RemediesPage from '@/pages/RemediesPage'
import DashaPage from '@/pages/DashaPage'
import AIChatPage from '@/pages/AIChatPage'
import CompatibilityPage from '@/pages/CompatibilityPage'
import MuhurtaPage from '@/pages/MuhurtaPage'
import YearlyPage from '@/pages/YearlyPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/"              element={<HomePage />} />
        <Route path="/kundli"        element={<KundliPage />} />
        <Route path="/horoscope"     element={<HoroscopePage />} />
        <Route path="/rashis"        element={<RashisPage />} />
        <Route path="/transits"      element={<TransitsPage />} />
        <Route path="/remedies"      element={<RemediesPage />} />
        <Route path="/dasha"         element={<DashaPage />} />
        <Route path="/chat"          element={<AIChatPage />} />
        <Route path="/compatibility" element={<CompatibilityPage />} />
        <Route path="/muhurta"       element={<MuhurtaPage />} />
        <Route path="/yearly"        element={<YearlyPage />} />
      </Route>
    </Routes>
  )
}
