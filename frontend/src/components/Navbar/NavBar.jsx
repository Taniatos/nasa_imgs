import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import "./NavBar.css";

export default function NavBar() {
  // Get the user object from the global AuthContext
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  // Determine authentication status from the presence of the user object
  const isAuthenticated = !!user;

  // Handles the user logout process
  async function handleLogout(e) {
    e.preventDefault();
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      // Clear the user from the global state
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <nav className="navbar">
      <input type="checkbox" id="menu-toggle" className="menu-toggle" />
      <label htmlFor="menu-toggle" className="burger">
        &#9776;
      </label>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/explore">Explore</Link>
        <Link to="/favorites">Favorites</Link>

        {/* Conditionally render the Admin link only if the user exists and has the 'admin' role */}
        {user && user.role === "admin" && <Link to="/admin">Admin</Link>}

        {isAuthenticated ? (
          <a href="#" onClick={handleLogout}>
            Logout
          </a>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}
