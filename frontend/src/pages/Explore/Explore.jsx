import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "../../components/Navbar/NavBar.jsx";
import "./Explore.css";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Explore() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const queryParam = useQuery().get("q");

  useEffect(() => {
    if (queryParam) {
      setQuery(queryParam);
      searchImages(queryParam);
    }
  }, [queryParam]);

  async function searchImages(searchTerm) {
    try {
      const response = await fetch(
        `https://images-api.nasa.gov/search?q=${encodeURIComponent(searchTerm)}&media_type=image`
      );
      const data = await response.json();
      setResults(data.collection.items || []);
    } catch (error) {
      console.error("Search failed:", error);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (query.trim()) {
      searchImages(query.trim());
    }
  }

  return (
    <div className="explore-page">
      <div className="explore-background"></div>
      <NavBar />
      <div className="explore-content">
        <h2 className="explore-title">NASA Image Search</h2>
        <p className="explore-description">
          Search NASA’s archive of space imagery, from galaxies and nebulae to planets and spacecraft.
        </p>
        <form onSubmit={handleSubmit} className="search-glass explore-form">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search space stuff..."
            className="search-input"
          />
          <button type="submit" className="search-button">→</button>
        </form>
      </div>

      <div className="explore-results">
        {results.map((item, idx) => {
          const img = item.links?.[0]?.href;
          const title = item.data?.[0]?.title;
          return (
            <div className="explore-card" key={idx}>
              <div className="icon-bar">
                <i className="fa-regular fa-heart"></i>
                <i
                  className="fa-solid fa-arrow-down"
                  onClick={() => window.open(img, "_blank")}
                ></i>
              </div>
              <img src={img} alt={title} />
              <p className="img-title">{title}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
