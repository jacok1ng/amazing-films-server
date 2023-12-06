import express from "express"
import Rentals from "../schemas/rentals.js"
import User from "../schemas/user.js"
import Movie from "../schemas/movie.js"
import { addDays } from "date-fns"

const router = express.Router()

router.post("/returnMovie", async (req, res) => {
  const { id } = req.body
  const rental = await Rentals.updateOne(
    { _id: id },
    { realReturn: new Date() }
  )
  const rent = await Rentals.findOne({ _id: id })

  await Movie.updateOne({ _id: rent.movieId }, { isRented: false })

  res.json({ status: "OK", rental })
})

router.get("/", async (_, res) => {
  const rentals = await Rentals.find()
  let parsedRentals = []
  if (rentals.length) {
    parsedRentals = await Promise.all(
      rentals.map(
        async ({
          _id,
          clientId,
          movieId,
          rentedAt,
          realReturn,
          shouldReturn,
        }) => {
          const client = await User.findOne({ _id: clientId })
          const movie = await Movie.findOne({ _id: movieId })

          return {
            _id,
            name: client.name,
            surname: client.surname,
            movie: movie.title,
            rentedAt,
            realReturn,
            shouldReturn,
          }
        }
      )
    )
  }
  res.json({ status: "OK", rentals: parsedRentals })
})

router.get("/", async (_, res) => {
  const rentals = await Rentals.find()
  let parsedRentals = []
  if (rentals.length) {
    parsedRentals = await Promise.all(
      rentals.map(
        async ({
          _id,
          clientId,
          movieId,
          rentedAt,
          realReturn,
          shouldReturn,
        }) => {
          const client = await User.findOne({ _id: clientId })
          const movie = await Movie.findOne({ _id: movieId })

          return {
            _id,
            name: client.name,
            surname: client.surname,
            movie: movie.title,
            rentedAt,
            realReturn,
            shouldReturn,
          }
        }
      )
    )
  }
  res.json({ status: "OK", rentals: parsedRentals })
})

router.delete("/", async (req, res) => {
  const deletedRental = await Rentals.deleteOne({
    _id: req.body.id,
  })

  res.json({ rental: deletedRental })
})

router.post("/", async (req, res) => {
  const { title, name, surname } = req.body

  const user = await User.findOne({ name, surname })
  const movie = await Movie.findOne({ title })

  if (!user)
    return res
      .json({ status: "ERROR", message: "User does not exist" })
      .status(422)
  if (!movie)
    return res
      .json({ status: "ERROR", message: "Movie does not exist" })
      .status(422)
  if (movie.isRented)
    return res
      .json({ status: "ERROR", message: "This movie is already rented" })
      .status(422)
  const rentedMovies = await Rentals.find({
    clientId: user._id,
    realReturn: undefined,
  })
  if (rentedMovies?.length === 3)
    return res
      .json({ status: "ERROR", message: "This user have reach movies limit" })
      .status(422)

  const newRental = await Rentals.create({
    clientId: user._id,
    movieId: movie._id,
    rentedAt: new Date(),
    shouldReturn: addDays(new Date(), 2),
  })

  await Movie.updateOne({ _id: movie._id }, { isRented: true })

  res.json({ rental: newRental })
})

export default router
