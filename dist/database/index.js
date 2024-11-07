"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDatabaseConnectionError = exports.databaseConnect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("@/config");
const logger_1 = __importDefault(require("@/config/logger"));
/**
 * Establish a connection to the MongoDB database.
 * @returns {Promise<void>}
 */
const databaseConnect = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const databaseInstance = yield mongoose_1.default.connect(`${config_1.DB_URI}/dashboard`);
        logger_1.default.info(`MongoDB Connected! DB Host: ${databaseInstance.connection.host}`);
    }
    catch (error) {
        (0, exports.handleDatabaseConnectionError)(error);
    }
});
exports.databaseConnect = databaseConnect;
const handleDatabaseConnectionError = (error) => {
    logger_1.default.error("MongoDB connection error: " + error.message);
    if (error.name === "MongoNetworkError") {
        logger_1.default.error("Network error. Check your connection.");
    }
    process.exit(1);
};
exports.handleDatabaseConnectionError = handleDatabaseConnectionError;
