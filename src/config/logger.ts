import winston from "winston";

// Define the custom logger instance with Winston
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),

    // File transport for all logs
    new winston.transports.File({ filename: "logs/app.log" }),

    // Separate error log file for errors only
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
  ],
});

// Define a stream for HTTP request logging, compatible with `morgan`
export const loggerStream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

export default logger;
