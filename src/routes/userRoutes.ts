import express from "express"
import User from "../schemas/user.js"
import Rentals from "../schemas/rentals.js"
import Movie from "../schemas/movie.js"

const router = express.Router()

router.get("/", async (_, res) => {
  const users = await User.find(
    {},
    {
      _id: 1,
      address: 1,
      isAdmin: 1,
      name: 1,
      surname: 1,
      registerAt: 1,
      phone: 1,
    }
  )

  res.json({ status: "OK", users })
})

router.get("/:id", async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }, { password: 0 })

  res.json({ status: "OK", user })
})

router.post("/", async (req, res) => {
  const newUser = await User.create({
    registerAt: new Date(),
    ...req.body,
  })

  res.json({ user: newUser })
})

router.delete("/", async (req, res) => {
  const { id } = req.body

  const rentalsWithPickedUser = await Rentals.find({
    clientId: id,
    realReturn: undefined,
  })

  if (rentalsWithPickedUser?.length)
    return res
      .json({ status: "ERROR", message: "This user has active rentals!" })
      .status(422)

  const movieToReset = await Rentals.find({ clientId: id }, { movieId: 1 })

  if (movieToReset?.length) {
    movieToReset.forEach(
      async ({ movieId }) =>
        await Movie.updateOne({ _id: movieId }, { isRented: false })
    )
  }

  await Rentals.deleteMany({ clientId: id })

  const deletedUser = await User.deleteOne({
    _id: id,
  })

  res.json({ user: deletedUser })
})

router.patch("/", async (req, res) => {
  const { _id, ...rest } = req.body
  const newUser = await User.updateOne({ _id }, { ...rest })

  res.json({ user: newUser })
})

export default router
