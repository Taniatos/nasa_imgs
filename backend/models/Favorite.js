import mongoose from "mongoose";

// Schema for a user's favorite image
const favoriteSchema = new mongoose.Schema({
  // One-to-many relationship: one User can have many Favorites
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  // The unique identifier for the image
  nasaId: { type: String, required: true },
  title: String,
  imageUrl: String,
  dateSaved: { type: Date, default: Date.now },
});

export default mongoose.model("Favorite", favoriteSchema);
