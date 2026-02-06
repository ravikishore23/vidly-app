const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { Genre, validateGenres } = require("../models/genre");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const validate = require("../middleware/validate");
router.get("/", async (req, res) => {
  const genre = await Genre.find().sort({ name: 1 });
  res.send(genre);
});

router.post("/", [auth, validate(validateGenres)], async (req, res) => {
  let genre = Genre({
    name: req.body.name,
  });
  genre = await genre.save();
  res.send(genre);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) res.status(404).send("404 error");
  res.send(genre);
});

router.put("/:id", validate(validateGenres), async (req, res) => {
  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true },
  );
  if (!genre) return res.status(404).send("404 error");
  res.send(genre);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);
  if (!genre) return res.status(404).send("404 error");

  res.send(genre);
});

module.exports = router;
