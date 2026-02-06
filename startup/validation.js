const Joi = require("joi");

module.exports = function () {
  Joi.objectId = require("joi-objectid")(Joi);
};

// object_Id is used in rental for validate  id (object_id)
