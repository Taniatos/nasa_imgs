import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/Navbar/NavBar.jsx";
import "./Favorites.css";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Runs once on component mount to protect the route and fetch data
  useEffect(() => {
    async function checkAuthAndFetchFavorites() {
      try {
        // Check if the user has an active session
        const authResponse = await fetch("/api/auth/user", {
          credentials: "include",
        });

        if (authResponse.ok) {
          // If authenticated, fetch the user's saved favorites
          setIsAuthenticated(true);
          const favoritesResponse = await fetch("/api/favorites", {
            credentials: "include",
          });
          if (favoritesResponse.ok) {
            const data = await favoritesResponse.json();
            setFavorites(data);
          } else {
            console.error("Failed to fetch favorites.");
            setFavorites([]);
          }
        } else {
          // If not authenticated, redirect to the login page
          navigate("/login");
        }
      } catch (error) {
        console.error("Authentication check or fetch failed:", error);
        navigate("/login");
      }
    }

    checkAuthAndFetchFavorites();
  }, [navigate]);

  // Handles deleting a favorite image from the user's collection
  const handleDeleteFavorite = async (id) => {
    try {
      const response = await fetch(`/api/favorites/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        // Update the local state to remove the deleted favorite
        setFavorites(favorites.filter((fav) => fav._id !== id));
      } else {
        console.error("Failed to delete favorite.");
      }
    } catch (error) {
      console.error("Error deleting favorite:", error);
    }
  };

  // Prevents the component from rendering before the authentication check is complete
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="favorites-page">
      <div className="favorites-background"></div>
      <NavBar />
      <div className="favorites-content">
        <h2 className="favorites-title">Your Favorite Images</h2>
        {/* Conditionally render the grid of favorites or a "No favorites" message */}
        {favorites.length > 0 ? (
          <>
            <p className="favorites-description">
              A collection of NASA images you’ve saved. Click to view or
              download.
            </p>
            <div className="favorites-grid">
              {favorites.map((item, idx) => {
                return (
                  <div className="favorites-card" key={idx}>
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
                );
              })}
            </div>
          </>
        ) : (
          <p className="favorites-description">
            You have no favorite images yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default Favorites;
