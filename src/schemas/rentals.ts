import mongoose from "mongoose"

const rentalsSchema = new mongoose.Schema({
  clientId: mongoose.SchemaTypes.ObjectId,
  movieId: mongoose.SchemaTypes.ObjectId,
  rentedAt: Date,
  shouldReturn: Date,
  realReturn: Date,
})

export default mongoose.model("Rent", rentalsSchema)
