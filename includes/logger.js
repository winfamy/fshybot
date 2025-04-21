const winston = require("winston");
const { combine, cli, errors, simple } = winston.format;
const { ENVIRONMENT } = require("../config.json");

const logger = winston.createLogger({
  level: ENVIRONMENT === "development" ? "debug" : "error",
  format: errors({ stack: true }),
  transports: [
    new winston.transports.Console({
      format: combine(cli(), errors({ stack: true })),
    }),
    new winston.transports.File({
      filename: "debug.log",
      format: simple(),
    }),
  ],
});

module.exports = logger;
