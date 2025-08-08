import express from "express";
import passport from "passport";
import User from "../../models/User.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User exists" });

    const user = new User({ email, password });
    await user.save();

    req.login(user, (err) => {
      if (err) return res.status(500).json({ message: "Login failed after registration" });
      res.json({
        message: "Registered and logged in",
        user: { email: user.email, role: user.role },
      });
    });
  } catch (err) {
    res.status(500).json({ message: "Registration error" });
  }
});

// Login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: "Invalid email or password!" });
    
    req.login(user, (err) => {
      if (err) return res.status(500).json({ message: "Login failed" });
      res.json({ message: "Logged in", user: { email: user.email, role: user.role } });
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

// Basic session check for AuthProvider
router.get("/me", (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not logged in" });
  res.json({ user: { email: req.user.email, role: req.user.role } });
});

export default router;
