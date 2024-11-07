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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
require("module-alias/register");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const index_route_1 = __importDefault(require("@/routes/index.route"));
const config_1 = require("@/config");
const index_1 = require("@/database/index");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const logger_1 = __importDefault(require("@/config/logger"));
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: "16kb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "16kb" }));
app.use((0, cors_1.default)({
    origin: config_1.CORS_ORIGIN,
    credentials: true,
}));
app.use(express_1.default.static("public"));
app.use((0, cookie_parser_1.default)());
app.use("/api", index_route_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    logger_1.default.error(`Internal Server Error: ${err.message}`); // Log the error
    res.status(500).send(`Internal Server Error: ${err.message}`);
});
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, index_1.databaseConnect)();
        app.listen(config_1.PORT, () => {
            logger_1.default.info(`Server is running at http://localhost:${config_1.PORT}`); // Use logger instead of console.log
        });
    }
    catch (error) {
        (0, index_1.handleDatabaseConnectionError)(error);
        logger_1.default.error(`Database connection error: ${error.message}`); // Log database connection error
    }
});
startServer();
