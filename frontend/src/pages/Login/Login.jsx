import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/Navbar/NavBar";
import { useAuth } from "../../context/useAuth"; 
import "./Login.css";

export default function Login() {
  // State to toggle between Login and Register forms
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

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function validatePassword(password) {
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
    return passwordRegex.test(password);
  }

  // Performs client-side validation before submitting the form
  function validate() {
    const errs = {};
    if (isRegister && !formData.name.trim()) errs.name = "Name is required.";

    if (!formData.email.trim()) {
      errs.email = "Email is required.";
    } else if (!validateEmail(formData.email)) {
      errs.email = "Invalid email format.";
    }

    if (!formData.password.trim()) {
      errs.password = "Password is required.";
    } else if (!validatePassword(formData.password)) {
      errs.password =
        "Password must be at least 8 characters and include a number and a special character.";
    }

    if (isRegister && formData.password !== formData.repeatPassword) {
      errs.repeatPassword = "Passwords do not match.";
    }

    return errs;
  }

  // Form submission for both login and registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      // Set the API endpoint based on whether the user is registering or logging in
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        // After a successful login/registration, update the global user state
        setUser(data.user);
        // Upon successful login or registration, navigate to the Explore page
        navigate("/explore");
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
              <>
                <input
                  name="name"
                  placeholder="Name"
                  className="login-input"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <div className="error-text">{errors.name}</div>}
              </>
            )}
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="login-input"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <div className="error-text">{errors.email}</div>}
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="login-input"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <div className="error-text">{errors.password}</div>
            )}
            {isRegister && (
              <>
                <input
                  name="repeatPassword"
                  type="password"
                  placeholder="Repeat Password"
                  className="login-input"
                  value={formData.repeatPassword}
                  onChange={handleChange}
                />
                {errors.repeatPassword && (
                  <div className="error-text">{errors.repeatPassword}</div>
                )}
              </>
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
                onClick={() => {
                  setIsRegister(!isRegister);
                  setErrors({});
                }}
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
