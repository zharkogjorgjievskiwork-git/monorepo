import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import DraftDayPage from './pages/DraftDay'

function App() {
  const today = new Date().toISOString().split('T')[0]

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={`/draft/${today}`} replace />} />
        <Route path="/draft/:date" element={<DraftDayPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
