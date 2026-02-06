const winston = require("winston");
// require("winston-mongodb");

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),

    //handle middleware error and logging info

    new winston.transports.File({ filename: "logs/logfile.log" }),

   /*  new winston.transports.MongoDB({
      db: "mongodb://localhost/vidly",
      level: "info",
    }), */
  ],

  //handle global unhandled error

  exceptionHandlers: [
    new winston.transports.File({ filename: "logs/exceptions.log" }),
  ],

  rejectionHandlers: [
    new winston.transports.File({ filename: "logs/rejections.log" }),
  ],
});

module.exports = logger;
