// Middleware to protect routes by making sure the user is authenticated
export function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ message: "Unauthorized" });
}

// Middleware to ensure the authenticated user is an admin
export function ensureAdmin(req, res, next) {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  // If not an admin, send a 'Forbidden' status
  return res.status(403).json({ message: "Forbidden: Admins only" });
}
