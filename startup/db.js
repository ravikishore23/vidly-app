const mongoose = require("mongoose");
const winston = require("winston");
const logger = require("./logging");
const config = require("config");

module.exports = function () {
  db = config.get("db");
  mongoose.connect(db).then(() => logger.info(`Connecting to ${db} ...`));
};
