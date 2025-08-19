import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

// Provides authentication state to the entire application
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // When the app first loads, check if there's an active session on the server
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/me`, {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {})
      .finally(() => setLoading(false)); // Set loading to false after the check is complete
  }, []);

  // Prevent child components from rendering until the initial auth check is done
  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
