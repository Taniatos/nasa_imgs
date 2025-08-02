import express from 'express'
import Favorite from '../../models/Favorite.js'
import { ensureAuth } from '../../middleware/auth.js'

const router = express.Router()

// Get all favorites for the logged-in user
router.get('/', ensureAuth, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id })
    res.json(favorites)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching favorites' })
  }
})

// Save a new favorite
router.post('/', ensureAuth, async (req, res) => {
  try {
    const { nasaId, title, url } = req.body
    const existing = await Favorite.findOne({ user: req.user._id, nasaId })
    if (existing) return res.status(400).json({ message: 'Already saved' })

    const favorite = new Favorite({
      user: req.user._id,
      nasaId,
      title,
      url
    })

    await favorite.save()
    res.status(201).json(favorite)
  } catch (err) {
    res.status(500).json({ message: 'Error saving favorite' })
  }
})
// DELETE /api/favorites/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await Favorite.findByIdAndDelete(req.params.id)
    if (!result) return res.status(404).json({ message: 'Favorite not found' })
    res.json({ message: 'Deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' })
  }
})

// PUT /api/favorites/:id
router.put('/:id', async (req, res) => {
  try {
    const updated = await Favorite.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!updated) return res.status(404).json({ message: 'Favorite not found' })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: 'Update failed' })
  }
})

export default router
