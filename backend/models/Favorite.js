import mongoose from 'mongoose'

const favoriteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nasaId: { type: String, required: true },
  title: String,
  imageUrl: String,
  dateSaved: { type: Date, default: Date.now }
})

export default mongoose.model('Favorite', favoriteSchema)
