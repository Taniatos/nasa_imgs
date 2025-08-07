import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../../components/Navbar/NavBar.jsx";
import { useAuth } from "../../context/useAuth"; // This import is crucial
import "./Explore.css";

// A hook to access URL query parameters
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Explore() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [favorites, setFavorites] = useState([]);
  // Get both user and loading state from the context
  const { user, loading } = useAuth();
  const navigate = useNavigate(); // Hook for programmatic navigation
  const queryParam = useQuery().get("q");

  // On component mount, fetch the user's existing favorites if they are logged in
  useEffect(() => {
    // Only fetch favorites if a user is logged in
    if (user) {
      async function fetchFavorites() {
        try {
          const response = await fetch("/api/favorites", {
            credentials: "include",
          });
          if (response.ok) {
            const data = await response.json();
            setFavorites(data);
          }
        } catch (error) {
          console.error("Failed to fetch favorites:", error);
        }
      }
      fetchFavorites();
    } else {
      // If user is not logged in, ensure favorites list is empty
      setFavorites([]);
    }
  }, [user]); // Re-run this effect if the user logs in or out

  // If the page is loaded with a search query in the URL, trigger a search
  useEffect(() => {
    if (queryParam) {
      setQuery(queryParam);
      searchImages(queryParam);
    }
  }, [queryParam]);

  // Fetches images from the NASA API based on the search term
  async function searchImages(searchTerm) {
    try {
      const response = await fetch(
        `https://images-api.nasa.gov/search?q=${encodeURIComponent(
          searchTerm
        )}&media_type=image`
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

  // Adding and removing a favorite image
  async function handleFavoriteToggle(item) {
    // First, check if the auth status is still loading; if so, do nothing
    if (loading) {
      return;
    }
    // If loading is complete and there is no user, redirect to the login page
    if (!user) {
      navigate('/login');
      return;
    }

    const nasaId = item.data?.[0]?.nasa_id;
    const title = item.data?.[0]?.title;
    const img = item.links?.[0]?.href;

    if (!nasaId || !title || !img) {
      console.error("Missing data to favorite this image.");
      return;
    }

    const isFavorited = favorites.some((fav) => fav.nasaId === nasaId);

    if (isFavorited) {
      // If already in favorite, find its ID and send a DELETE request
      const favoriteToDelete = favorites.find((fav) => fav.nasaId === nasaId);
      if (!favoriteToDelete) return;
      try {
        const response = await fetch(`/api/favorites/${favoriteToDelete._id}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (response.ok) {
          setFavorites((prevFavorites) =>
            prevFavorites.filter((fav) => fav.nasaId !== nasaId)
          );
        } else {
          console.error("Failed to remove favorite.");
        }
      } catch (error) {
        console.error("Error removing favorite:", error);
      }
    } else {
      // If not in favorites, send a POST request to add it
      try {
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nasaId, title, imageUrl: img }),
          credentials: "include",
        });

        if (response.ok) {
          const newFavorite = await response.json();
          setFavorites((prevFavorites) => [...prevFavorites, newFavorite]);
        } else {
          console.error("Failed to add favorite.");
        }
      } catch (error) {
        console.error("Error adding favorite:", error);
      }
    }
  }

  return (
    <div className="explore-page">
      <div className="explore-background"></div>
      <NavBar />
      <div className="explore-content">
        <h2 className="explore-title">NASA Image Search</h2>
        <p className="explore-description">
          Search NASA’s archive of space imagery, from galaxies and nebulae to
          planets and spacecraft.
        </p>
        <form onSubmit={handleSubmit} className="search-glass explore-form">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search space stuff..."
            className="search-input"
          />
          <button type="submit" className="search-button">
            →
          </button>
        </form>
      </div>

      <div className="explore-results">
        {results.map((item, idx) => {
          const img = item.links?.[0]?.href;
          const title = item.data?.[0]?.title;
          const nasaId = item.data?.[0]?.nasa_id;

          if (!img || !title || !nasaId) return null;

          // Check if the current image's nasaId is in the user's favorites list
          const isFavorited = favorites.some((fav) => fav.nasaId === nasaId);

          return (
            <div className="explore-card" key={idx}>
              <div className="icon-bar">
                <i
                  className={
                    isFavorited ? "fa-solid fa-heart" : "fa-regular fa-heart"
                  }
                  onClick={() => handleFavoriteToggle(item)}
                ></i>
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
