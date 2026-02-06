const express = require("express");
const router = express.Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const validate = require("../middleware/validate");

router.post("/", validate(validatePassword), async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");
  const valiedUser = await bcrypt.compare(req.body.password, user.password);
  if (!valiedUser) return res.status(400).send("Invalid email or password");

  const token = user.generateAuthToken();

  res.send(token);
});

function validatePassword(password) {
  const schema = Joi.object({
    email: Joi.string().min(10).max(255).required(),
    password: Joi.string().min(8).max(255).required(),
  });
  return schema.validate(password);
}

module.exports = router;
