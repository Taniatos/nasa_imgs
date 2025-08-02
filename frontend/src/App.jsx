import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'

import Home from './pages/Home/Home'
import Search from './pages/Search/Search'
import Login from './pages/Login/Login'
import Favorites from './pages/Favorites/Favorites'

function App() {
  return (
    <div className="app-container">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  )
}

export default App
