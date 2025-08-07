import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/NavBar";
import "./Home.css";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Navigates to the Explore page with the search term as a query parameter
  function handleSearch(e) {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  }

  return (
    <div className="home">
      <Navbar />
      {/* The background is composed of multiple layered images for a parallax effect */}
      <div className="background-container">
        <img
          src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/moon2.png"
          alt="moon"
        />
        <div className="stars"></div>
        <div className="twinkling"></div>
        <div className="clouds"></div>

        <div className="home-content">
          <h2>Welcome to NASA Image Explorer</h2>
          <p>Explore stunning images from NASA’s archives</p>
          <form className="search-glass" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search for planets, stars, galaxies..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-button">
              →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
