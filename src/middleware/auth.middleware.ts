import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '@/models/user.model';
import ApiError from '@/utils/apiError.utils';

// Extend the Request interface to include the user property
interface AuthenticatedRequest extends Request {
  user?: any; // Replace 'any' with the actual user type if available
}

const UNAUTHORIZED_MESSAGES = {
  NO_TOKEN: 'Unauthorized: No token provided',
  INVALID_TOKEN: 'Unauthorized: Invalid access token',
  TOKEN_EXPIRED: 'Unauthorized: Token expired',
};

/**
 * Middleware to verify JWT token and attach user to the request object.
 */
export const verifyJWT = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract token from cookies or authorization header
    const token =
      req.cookies?.accessToken ||
      req.headers.authorization?.replace('Bearer ', '');

    // Check if token is provided
    if (!token) {
      throw new ApiError(401, UNAUTHORIZED_MESSAGES.NO_TOKEN);
    }

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    // Find user by ID from the decoded token
    const user = await User.findById(decodedToken.id).select(
      '-password -refreshToken'
    );

    // Check if user exists
    if (!user) {
      throw new ApiError(401, UNAUTHORIZED_MESSAGES.INVALID_TOKEN);
    }

    // Attach user to the request object
    req.user = user;

    // Proceed to the next middleware
    next();
  } catch (error) {
    // Handle different types of JWT errors
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new ApiError(401, UNAUTHORIZED_MESSAGES.INVALID_TOKEN));
    } else if (error instanceof jwt.TokenExpiredError) {
      return next(new ApiError(401, UNAUTHORIZED_MESSAGES.TOKEN_EXPIRED));
    }

    // Handle any other error that may occur
    if (typeof error === 'string') {
      return next(new ApiError(401, error));
    }

    // For unknown error types
    next(new ApiError(401, 'Unauthorized'));
  }
};
