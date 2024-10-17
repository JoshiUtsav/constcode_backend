import { Request, Response, NextFunction } from "express";
import ApiError from "./apiError.utils";

/**
 * Middleware to wrap async functions for error handling.
 * Automatically catches errors and responds with a standardized JSON format.
 *
 * @param {Function} fn - The async function to be wrapped.
 * @returns {Function} A function that catches errors and passes them to the next middleware.
 */
const catchAsync =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((error: any) => {
      // Handle known ApiError and respond with a structured error response
      if (error instanceof ApiError) {
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

export { catchAsync };
