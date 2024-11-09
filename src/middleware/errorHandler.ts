import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/apiError.utils';
import logger from '../config/logger';

const errorHandler =
  (fn: Function) => (req: Request, res: Response, next?: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      if (error instanceof ApiError) {
        logger.warn(`API Error: ${error.message}`, {
          statusCode: error.statusCode,
        });
        return res
          .status(error.statusCode)
          .json(new ApiError(error.statusCode, null, error.message));
      }

      // Log unexpected errors for debugging
      logger.error('Unexpected Error: %o', error);

      // For all other unknown or unhandled errors, return a generic 500 response
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    });
  };

export default errorHandler;
