// Middleware to protect routes - it makes sure the user is authenticated

export function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next()
  return res.status(401).json({ message: 'Unauthorized' })
}