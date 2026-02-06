const Joi = require("joi");
const mongoose = require("mongoose");
const moment = require("moment");

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    requried: true,
    minlength: 3,
    maxlength: 250,
  },

  isGold: {
    type: Boolean,
    default: false,
  },

  phone: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 10,
  },
});

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 255,
  },
  dailyRentalRate: {
    type: Number,
    min: 0,
    max: 255,
    required: true,
  },
});

const rentalSchema = new mongoose.Schema({
  customer: {
    type: customerSchema,
    required: true,
  },
  movie: {
    type: movieSchema,
    required: true,
  },

  dateOut: {
    type: Date,

    default: Date.now,
  },

  dateReturned: {
    type: Date,
  },
  rentalFee: {
    type: Number,
    min: 0,
    require: true,
  },
});

rentalSchema.statics.lookup = function (customerId, movieId) {
  return this.findOne({
    "customer._id": customerId,
    "movie._id": movieId,
  });
};

rentalSchema.methods.return = function () {
  this.dateReturned = new Date();

  const rentalDate = moment().diff(this.dateOut, "days"); // return '7'  by calculate the dateoout and todays date

  this.rentalFee = rentalDate * this.movie.dailyRentalRate;
};

const Rental = mongoose.model("Rental", rentalSchema);

function validateRental(rental) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return schema.validate(rental);
}

module.exports = {
  validateRental,
  Rental,
};
