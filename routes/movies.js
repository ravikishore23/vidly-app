const { Movie, validateMovie } = require("../models/movie");
const express = require("express");
const router = express.Router();

const { Genre } = require("../models/genre");
const auth = require( "../middleware/auth" );
const validate = require( "../middleware/validate" );

router.get("/", async (req, res) => {
  const movie = await Movie.find().sort({ title: 1 });
  res.send(movie);
});

router.post("/", [auth , validate(validateMovie)], async (req, res) => {
  
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(404).send("Invalid Genre");
  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
  await movie.save();
  res.send(movie);
});




router.get("/:id", validate(validateMovie), async (req, res) => {
  
  const movie = await Movie.findById(req.params.id);
  if (!movie) res.status(404).send("404 error");
  res.send(movie);
});

router.put("/:id",validate(validateMovie), async (req, res) => {
  
  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        name: req.body.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    { new: true },
  );
  if (!movie) return res.status(404).send("404 error");
  res.send(movie);
});

router.delete("/:id", async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie) return res.status(404).send("404 error");

  res.send(movie);
});

module.exports = router;
