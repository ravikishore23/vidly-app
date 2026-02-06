const Joi = require("joi");
const mongoose = require("mongoose");

const Customer = mongoose.model(
  "Customers",
  new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, minlength: 5 },
    isGold: { type: Boolean },
  }),
);

function validateCustomer(data) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(10).required(),
    phone: Joi.string().min(5).max(50).required(),
    isGold: Joi.boolean().required(),
  });

  return schema.validate(data);
}


module.exports = {
  validateCustomer,
  Customer,
};
