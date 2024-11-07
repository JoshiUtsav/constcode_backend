"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerStream = void 0;
const winston_1 = __importDefault(require("winston"));
// Define the custom logger instance with Winston
const logger = winston_1.default.createLogger({
    level: "info",
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json()),
    transports: [
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple()),
        }),
        // File transport for all logs
        new winston_1.default.transports.File({ filename: "logs/app.log" }),
        // Separate error log file for errors only
        new winston_1.default.transports.File({ filename: "logs/error.log", level: "error" }),
    ],
});
// Define a stream for HTTP request logging, compatible with `morgan`
exports.loggerStream = {
    write: (message) => {
        logger.info(message.trim());
    },
};
exports.default = logger;
