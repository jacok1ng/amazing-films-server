import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import userRoutes from "./routes/userRoutes.js"
import movieRoutes from "./routes/movieRoutes.js"
import rentRoutes from "./routes/rentRoutes.js"

const app = express()
const port = 3001

mongoose.connect("mongodb://localhost:27017/amazingMovies")

app.use(cors())
app.use(express.json())
app.use("/users", userRoutes)
app.use("/movies", movieRoutes)
app.use("/rentals", rentRoutes)

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
