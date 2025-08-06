import { useState } from "react";
import NavBar from "../../components/Navbar/NavBar";
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

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function validatePassword(password) {
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
    return passwordRegex.test(password);
  }

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

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      if (isRegister) {
        console.log("Registering:", formData);
      } else {
        console.log("Logging in:", formData);
      }
    }
  }

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="login-overlay"></div>
      </div>
      <NavBar />
      <div className="login-container">
        <div className="login-form-wrapper">
          <h2 className="login-title">{isRegister ? "Create Account" : "Welcome"}</h2>
          <p className="login-subtitle">
            {isRegister
              ? "Register to save your favorite NASA images"
              : "Log in to continue exploring space"}
          </p>
          <form className="login-form" onSubmit={handleSubmit} noValidate>
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
            {errors.password && <div className="error-text">{errors.password}</div>}
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
                {errors.repeatPassword && <div className="error-text">{errors.repeatPassword}</div>}
              </>
            )}
            <button type="submit" className="login-button">
              {isRegister ? "Register" : "Login"}
            </button>
            <p className="register-prompt">
              {isRegister ? "Already have an account?" : "Don’t have an account?"}{" "}
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
