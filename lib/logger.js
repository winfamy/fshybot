const winston = require("winston");
const { combine, timestamp, json } = winston.format;

const logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.Console({ format: winston.format.cli() }),
    new winston.transports.File({
      filename: "debug.log",
      format: winston.format.simple(),
    }),
  ],
});

logger.info("Hello from Winston logger!");

module.exports = logger;
