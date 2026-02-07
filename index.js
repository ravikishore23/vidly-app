
const express = require("express");

const app = express();

const logger = require( "./startup/logging" );


require("./startup/route")(app);

require("./startup/db")();

require("./startup/config")();

require("./startup/validation")();

require("./startup/prod")(app);

const port = process.env.PORT || 2000;
const server = app.listen(port, () => logger.info(`Listen port: ${port}`));
module.exports = server;
