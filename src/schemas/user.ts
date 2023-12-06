import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  login: String,
  password: String,
  name: String,
  surname: String,
  address: String,
  phone: String,
  registerAt: Date,
  isAdmin: Boolean,
})

export default mongoose.model("User", userSchema)
