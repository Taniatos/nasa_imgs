import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import "./NavBar.css";

export default function NavBar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // On component mount, check if a user session exists on the server
  useEffect(() => {
    fetch("/api/auth/me", {
      credentials: "include", // sends cookies with the request
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setIsAuthenticated(!!data.user))
      .catch(() => setIsAuthenticated(false));
  }, []);

  // Handles the user logout process
  async function handleLogout(e) {
    e.preventDefault();
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    // Update state and redirect to home page after logout
    setIsAuthenticated(false);
    navigate("/");
  }

  return (
    <nav className="navbar">
      {/* Create a CSS-only hamburger menu for mobile */}
      <input type="checkbox" id="menu-toggle" className="menu-toggle" />
      <label htmlFor="menu-toggle" className="burger">
        &#9776;
      </label>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/explore">Explore</Link>
        <Link to="/favorites">Favorites</Link>

        {/* Conditionally render Logout or Login link based on auth state */}
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
