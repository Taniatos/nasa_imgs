import { Routes, Route } from "react-router-dom";
import "./styles/fonts.css";
import "./index.css";

import Home from "./pages/Home/Home";
import Explore from "./pages/Explore/Explore";
import Login from "./pages/Login/Login";
import Favorites from "./pages/Favorites/Favorites";
import Admin from "./pages/Admin/Admin";

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
}

export default App;
