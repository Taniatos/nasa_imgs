import express from "express";
import passport from "passport";
import User from "../../models/User.js";
import Favorite from "../../models/Favorite.js"; // Import the Favorite model
import { ensureAuth, ensureAdmin } from "../../middleware/auth.js"; // Import middleware

const router = express.Router();

// Auth middleware
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Not authenticated" });
}

// Register
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User exists" });

    // The default role is 'user' 
    const user = new User({ email, password });
    await user.save();

    req.login(user, (err) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Login failed after registration" });
      res.json({
        message: "Registered and logged in",
        user: { email: user.email, role: user.role },
      });
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Registration error" });
  }
});

// Login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password!" });
    }
    req.login(user, (err) => {
      if (err) return res.status(500).json({ message: "Login failed" });
  
      res.json({
        message: "Logged in",
        user: { email: user.email, role: user.role },
      });
    });
  })(req, res, next);
});

// Logout
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.json({ message: "Logged out" });
  });
});

// Authenticated user route (used by Favorites page)
router.get("/user", isAuthenticated, (req, res) => {
  res.json({
    message: "Authenticated",
    user: { email: req.user.email, role: req.user.role },
  });
});

// Basic session check (used by AuthProvider)
router.get("/me", (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not logged in" });
  // Include the user's role in the response
  res.json({ user: { email: req.user.email, role: req.user.role } });
});

// Route to get all users (for admin dashboard)
router.get("/users", ensureAuth, ensureAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // Fetch all users, excluding their passwords
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// Fetch favorites for a specific user (admin only)
router.get("/favorites/:userId", ensureAuth, ensureAdmin, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.params.userId });
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch favorites" });
  }
});

export default router;