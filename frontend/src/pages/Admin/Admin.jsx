import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import NavBar from "../../components/Navbar/NavBar";
import "./Admin.css";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Protect the route and fetch initial data
  useEffect(() => {
    // Wait for the initial auth check to finish
    if (loading) {
      return;
    }

    // If auth check is done, verify the user is an admin
    if (!user || user.role !== "admin") {
      navigate("/"); // Redirect non-admins to the home page
      return;
    }

    // If the user is confirmed to be an admin, fetch the list of all users
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [user, loading, navigate]);

  // Fetch favorites for the selected user
  const handleViewFavorites = async (userId) => {
    if (selectedUser && selectedUser._id === userId) {
      setSelectedUser(null);
      setFavorites([]);
      return;
    }
    try {
      const res = await fetch(`/api/admin/favorites/${userId}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        const userToSelect = users.find((u) => u._id === userId);
        setSelectedUser(userToSelect);
        setFavorites(data);
      } else {
        console.error("Failed to fetch favorites for user");
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  // Render nothing while loading or if the user is not a verified admin
  if (loading || !user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="admin-page">
      <div className="admin-background"></div>
      <NavBar />
      <div className="admin-content">
        <h2 className="admin-title">Admin Dashboard</h2>
        <div className="user-list-container">
          <h3 className="user-list-title">All Users ({users.length})</h3>
          <ul className="user-list">
            {users.map((u) => (
              <li key={u._id} className="user-list-item">
                <span>
                  {u.email} ({u.role})
                </span>
                <button onClick={() => handleViewFavorites(u._id)}>
                  {selectedUser && selectedUser._id === u._id
                    ? "Hide Favorites"
                    : "View Favorites"}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {selectedUser && (
          <div className="favorites-container">
            <h3>Favorites for <strong>{selectedUser.email}</strong></h3>
            {favorites.length > 0 ? (
              <div className="favorites-grid-admin">
                {favorites.map((fav) => (
                  <div className="favorite-card-admin" key={fav._id}>
                    <img src={fav.imageUrl} alt={fav.title} />
                    <p className="img-title-admin">{fav.title}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>This user has no favorites.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
