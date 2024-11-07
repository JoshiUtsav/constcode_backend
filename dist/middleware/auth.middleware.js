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
exports.verifyJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("@/models/user.model"));
const apiError_utils_1 = __importDefault(require("@/utils/apiError.utils"));
const UNAUTHORIZED_MESSAGES = {
    NO_TOKEN: "Unauthorized: No token provided",
    INVALID_TOKEN: "Unauthorized: Invalid access token",
    TOKEN_EXPIRED: "Unauthorized: Token expired",
};
/**
 * Middleware to verify JWT token and attach user to the request object.
 */
const verifyJWT = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // Extract token from cookies or authorization header
        const token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken) ||
            ((_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.replace("Bearer ", ""));
        // Check if token is provided
        if (!token) {
            throw new apiError_utils_1.default(401, UNAUTHORIZED_MESSAGES.NO_TOKEN);
        }
        // Verify the token
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Find user by ID from the decoded token
        const user = yield user_model_1.default.findById(decodedToken.id).select("-password -refreshToken");
        // Check if user exists
        if (!user) {
            throw new apiError_utils_1.default(401, UNAUTHORIZED_MESSAGES.INVALID_TOKEN);
        }
        // Attach user to the request object
        req.user = user;
        // Proceed to the next middleware
        next();
    }
    catch (error) {
        // Handle different types of JWT errors
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return next(new apiError_utils_1.default(401, UNAUTHORIZED_MESSAGES.INVALID_TOKEN));
        }
        else if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return next(new apiError_utils_1.default(401, UNAUTHORIZED_MESSAGES.TOKEN_EXPIRED));
        }
        // Handle any other error that may occur
        if (typeof error === "string") {
            return next(new apiError_utils_1.default(401, error));
        }
        // For unknown error types
        next(new apiError_utils_1.default(401, "Unauthorized"));
    }
});
exports.verifyJWT = verifyJWT;
