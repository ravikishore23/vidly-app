const express = require("express");
const auth = require("../middleware/auth");
const { Rental } = require("../models/rental");
const router = express.Router();
const Joi = require("joi");
const validate = require("../middleware/validate");
const { Movie } = require("../models/movie");

router.post("/", [auth, validate(validateReturns)], async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental) return res.status(404).send("rental no fou.,nd");
  if (rental.dateReturned)
    return res.status(400).send("Retrun already processed");

  rental.return();

  await Movie.updateOne(
    { _id: rental.movie._id },
    { $inc: { numberInStock: 1 } },
  );
  await rental.save();

  res.send(rental);
});

function validateReturns(data) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return schema.validate(data);
}

module.exports = router;
