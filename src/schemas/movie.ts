import mongoose from "mongoose"

const movieSchema = new mongoose.Schema({
  title: String,
  genre: String,
  director: String,
  duration: String,
  rating: Number,
  description: String,
  actors: [String],
  createdAt: Date,
  isRented: Boolean,
})

export default mongoose.model("Movie", movieSchema)
