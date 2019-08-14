const winston = require("winston");
const split = require("split");

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(
                winston.format.colorize({ level: true }),
                winston.format.simple()
            )
        })
    ]
});

logger.stream = split().on("data", message => {
    logger.info(message);
});

module.exports = logger;
