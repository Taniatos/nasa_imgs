import { Routes, Route } from 'react-router-dom'
import './styles/fonts.css';
import './index.css';

import Home from './pages/Home/Home'
import Explore from './pages/Explore/Explore'
import Login from './pages/Login/Login'
import Favorites from './pages/Favorites/Favorites'

function App() {
  return (
    <div className="app-container">
  
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  )
}

export default App
