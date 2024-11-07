"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAsync = void 0;
const apiError_utils_1 = __importDefault(require("@/utils/apiError.utils"));
/**
 * Middleware to wrap async functions for error handling.
 * Automatically catches errors and responds with a standardized JSON format.
 *
 * @param {Function} fn - The async function to be wrapped.
 * @returns {Function} A function that catches errors and passes them to the next middleware.
 */
const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
        // Handle known ApiError and respond with a structured error response
        if (error instanceof apiError_utils_1.default) {
            return res.status(error.statusCode).json({
                success: error.success,
                message: error.message,
                data: error.data,
                errors: error.errors,
            });
        }
        // Log unexpected errors for debugging (optional, but useful in production)
        console.error("Unexpected Error: ", error);
        // For all other unknown or unhandled errors, return a generic 500 response
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            data: null,
            errors: [],
        });
    });
};
exports.catchAsync = catchAsync;
