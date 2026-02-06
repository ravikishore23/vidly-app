const Joi = require("joi");
const mongoose = require("mongoose");
const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 25,
    get: (v) => v.toUpperCase(),
    set: (v) => v.toUpperCase(),
  },
});
const Genre = mongoose.model("Genres", genreSchema);

function validateGenres(data) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(10).required(),
  });

  return schema.validate(data);
}

module.exports = {
  validateGenres,
  Genre,
  genreSchema,
};
