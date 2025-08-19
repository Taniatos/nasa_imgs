import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/Navbar/NavBar";
import { useAuth } from "../../context/useAuth";
import "./Login.css";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    repeatPassword: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { setUser } = useAuth();

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const endpoint = isRegister
        ? `${apiBaseUrl}/api/auth/register`
        : `${apiBaseUrl}/api/auth/login`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include", 
      });

      if (response.ok) {
        const data = await response.json();
        // Updates the global user state
        setUser(data.user);
        navigate("/");
      } else {
        const errorData = await response.json();
        setErrors({ general: errorData.message || "An error occurred." });
      }
    } catch (error) {
      console.error("Authentication failed:", error);
      setErrors({ general: "An unexpected error occurred. Please try again." });
    }
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="login-overlay"></div>
      </div>
      <NavBar />
      <div className="login-container">
        <div className="login-form-wrapper">
          <h2 className="login-title">
            {isRegister ? "Create Account" : "Welcome"}
          </h2>
          <p className="login-subtitle">
            {isRegister
              ? "Register to save your favorite NASA images"
              : "Log in to continue exploring space"}
          </p>
          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {errors.general && (
              <div className="error-text">{errors.general}</div>
            )}
            {isRegister && (
              <input
                name="name"
                placeholder="Name"
                className="login-input"
                value={formData.name}
                onChange={handleChange}
              />
            )}
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="login-input"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="login-input"
              value={formData.password}
              onChange={handleChange}
            />
            {isRegister && (
              <input
                name="repeatPassword"
                type="password"
                placeholder="Repeat Password"
                className="login-input"
                value={formData.repeatPassword}
                onChange={handleChange}
              />
            )}
            <button type="submit" className="login-button">
              {isRegister ? "Register" : "Login"}
            </button>
            <p className="register-prompt">
              {isRegister
                ? "Already have an account?"
                : "Don’t have an account?"}{" "}
              <button
                type="button"
                className="toggle-link"
                onClick={() => setIsRegister(!isRegister)}
              >
                {isRegister ? "Login" : "Register"}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
