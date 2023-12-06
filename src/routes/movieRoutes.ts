import express from "express"
import Movie from "../schemas/movie.js"
import Rentals from "../schemas/rentals.js"

const router = express.Router()

router.get("/", async (_, res) => {
  const movies = await Movie.find()

  res.json({ status: "OK", movies })
})

router.delete("/", async (req, res) => {
  const { id } = req.body

  const rentalsWithPickedMovie = await Rentals.find({
    movieId: id,
    realReturn: undefined,
  })

  if (rentalsWithPickedMovie?.length)
    return res
      .json({ status: "ERROR", message: "This movie is rented!" })
      .status(422)

  await Rentals.deleteMany({ movieId: id })

  const deletedMovie = await Movie.deleteOne({
    _id: id,
  })

  res.json({ movie: deletedMovie })
})

router.post("/", async (req, res) => {
  const { actors, ...rest } = req.body

  const parsedActors = actors.includes(",") ? actors.split(",") : actors

  const newMovie = await Movie.create({
    isRented: false,
    createdAt: new Date(),
    actors: parsedActors,
    ...rest,
  })

  res.json({ movie: newMovie })
})

export default router
