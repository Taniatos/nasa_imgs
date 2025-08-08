import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/Navbar/NavBar.jsx";
import { useAuth } from "../../context/useAuth";
import "./Favorites.css";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait until the initial authentication check is complete
    if (loading) {
      return;
    }

    // If the check is done and there's no user, redirect to login
    if (!user) {
      navigate("/login");
      return;
    }

    // If there is a user, proceed to fetch their favorites
    async function fetchFavorites() {
      try {
        const favoritesResponse = await fetch("/api/favorites", {
          credentials: "include",
        });
        if (favoritesResponse.ok) {
          const data = await favoritesResponse.json();
          setFavorites(data);
        } else {
          console.error("Failed to fetch favorites.");
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    }

    fetchFavorites();
  }, [user, loading, navigate]);

  const handleDeleteFavorite = async (id) => {
    try {
      const response = await fetch(`/api/favorites/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        setFavorites(favorites.filter((fav) => fav._id !== id));
      } else {
        console.error("Failed to delete favorite.");
      }
    } catch (error) {
      console.error("Error deleting favorite:", error);
    }
  };

  // Don't render anything while the auth check is in progress or if there's no user
  if (loading || !user) {
    return null;
  }

  return (
    <div className="favorites-page">
      <div className="favorites-background"></div>
      <NavBar />
      <div className="favorites-content">
        <h2 className="favorites-title">Your Favorite Images</h2>
        {favorites.length > 0 ? (
          <>
            <p className="favorites-description">
              A collection of NASA images you’ve saved. Click to view or
              download.
            </p>
            <div className="favorites-grid">
              {favorites.map((item) => (
                <div className="favorites-card" key={item._id}>
                  <div className="icon-bar">
                    <div className="icon-wrapper">
                      <i
                        className="fa-solid fa-arrow-down"
                        onClick={() => window.open(item.imageUrl, "_blank")}
                      ></i>
                      <span className="icon-label">Download</span>
                    </div>
                    <div className="icon-wrapper">
                      <i
                        className="fa-solid fa-trash-can"
                        onClick={() => handleDeleteFavorite(item._id)}
                      ></i>
                      <span className="icon-label">Delete</span>
                    </div>
                  </div>
                  <img src={item.imageUrl} alt={item.title} />
                  <p className="img-title">{item.title}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="favorites-description">No favorites yet.</p>
        )}
      </div>
    </div>
  );
}

export default Favorites;
