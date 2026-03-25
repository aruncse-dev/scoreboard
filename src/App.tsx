import { HashRouter, Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import NewMatchPage from './components/NewMatchPage'
import MatchPage from './components/MatchPage'
import { useTheme } from './hooks/useTheme'

export default function App() {
  const { theme, toggle } = useTheme()

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage theme={theme} onToggleTheme={toggle} />} />
        <Route path="/new-match" element={<NewMatchPage />} />
        <Route path="/match/:matchId" element={<MatchPage theme={theme} onToggleTheme={toggle} />} />
      </Routes>
    </HashRouter>
  )
}
