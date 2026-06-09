import { Routes, Route } from 'react-router-dom'
import Artistpage from './pages/Artistpage.tsx'
import Home from './pages/Home.tsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/artist/:id" element={<Artistpage />} />
    </Routes>
  )
}

export default App