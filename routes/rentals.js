const express = require("express");
const router = express.Router();
const { Rental, validateRental } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");

router.get("/", async (req, res) => {
  const rental = await Rental.find().sort({ customer: 1 });
  res.send(rental);
});

router.post("/", [auth, validate(validateRental)], async (req, res) => {
  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customer.");
  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid movie.");
  if (movie.numberInStock === 0)
    return res.status(400).send("movies outofStocks");
  const rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      isGold: customer.isGold,
      phone: customer.phone,
    },

    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  await rental.save();
  movie.numberInStock--;
  movie.save();
  res.send(rental);
});

router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental) res.status(404).send("404 error");
  res.send(rental);
});

/* router.put("/:id", async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) res.status(400).send(error.details[0].message);
  const rental = await Rental.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true },
  );
  if (!rental) return res.status(404).send("404 error");
  res.send(rental);
});

router.delete("/:id", async (req, res) => {
  const rental = await Rental.findByIdAndDelete(req.params.id);
  if (!rental) return res.status(404).send("404 error");

  res.send(rental);
}); */

module.exports = router;
