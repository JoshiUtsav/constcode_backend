import { Request, Response } from 'express';
import User from '../models/user.model';
import ApiError from '../utils/apiError.utils';
import ApiResponse from '../utils/apiResponse.utils';
import jwt from 'jsonwebtoken';
import { JWT_REFRESH_SECRET } from '../config/config';
import errorHandler from '../middleware/errorHandler';
import logger from '../config/logger';

/**
 * Handles sign-up logic
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} - Promise that resolves with the response object containing the result
 */
const handleUserSignup = errorHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { name, email, password, phoneNumber } = req.body;

    // Validate input fields
    if (
      [name, email, password, phoneNumber].some(
        (value) => typeof value !== 'string' || value.trim() === ''
      )
    ) {
      logger.warn('Signup attempt with missing required fields');
      throw new ApiError(400, 'Missing required fields');
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn(`Signup attempt failed: Email already exists - ${email}`);
      throw new ApiError(409, 'Email already exists');
    }

    // Create and save new user
    const user = new User({
      username: name,
      email,
      password,
      number: phoneNumber,
    });
    await user.save();

    const createdUser = await User.findById(user.id).select(
      '-password -refreshToken'
    );

    if (!createdUser) {
      logger.error('Signup failed: Unable to retrieve created user');
      throw new ApiError(500, 'Something went wrong while signing up');
    }

    logger.info(`User registered successfully: ${createdUser.email}`);
    return res
      .status(201)
      .json(new ApiResponse(201, createdUser, 'User registered successfully'));
  }
);

/**
 * Handles log-in logic
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} - Promise that resolves with the response object containing the result
 */
const handleUserLogin = errorHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { email, password, phoneNumber } = req.body;

    // Validate input fields
    if (!email || !phoneNumber || !password) {
      throw new ApiError(400, 'Missing required fields');
    }

    // Find user by email or phone number
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(401, 'Invalid email or phone number');
    }

    // Verify phone number and password
    if (
      user.number !== phoneNumber ||
      !(await user.isPasswordCorrect(password))
    ) {
      throw new ApiError(401, 'Invalid email, phone number, or password');
    }

    // Generate tokens
    const { access_token, refresh_token } = await generateAccessAndRefreshToken(
      user.id
    );

    const loggedInUser = await User.findById(user.id).select(
      '-password -refreshToken'
    );

    return res
      .status(200)
      .cookie('accessToken', access_token)
      .cookie('refreshToken', refresh_token)
      .json(
        new ApiResponse(
          200,
          { user: loggedInUser, access_token, refresh_token },
          'User logged in successfully'
        )
      );
  }
);

/**
 * Generates access and refresh tokens for a user
 *
 * @param {string} userId - The user's ID
 * @returns {Promise<{ access_token: string, refresh_token: string }>} - The generated tokens
 */
const generateAccessAndRefreshToken = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const access_token = user.generateAccessToken();
  const refresh_token = user.generateRefreshToken();

  user.refreshToken = refresh_token;
  await user.save({ validateBeforeSave: false });

  return { access_token, refresh_token };
};

/**
 * Handles user logout logic
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} - Promise that resolves with the response object containing the result
 */
const logoutUser = errorHandler(
  async (req: Request, res: Response): Promise<Response> => {
    if (!req.user) {
      throw new ApiError(401, 'User not authenticated');
    }

    await User.findByIdAndUpdate(
      req.user.id,
      { refreshToken: null },
      { new: true }
    );

    return res
      .status(200)
      .clearCookie('accessToken')
      .clearCookie('refreshToken')
      .json(new ApiResponse(200, null, 'User logged out successfully'));
  }
);

/**
 * Handles refreshing the access token
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<Response>} - Promise that resolves with the response object containing the result
 */
const refreshAccessToken = errorHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(401, 'Unauthorized request');
    }

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      JWT_REFRESH_SECRET
    ) as { id: string };

    const user = await User.findById(decodedToken?.id);
    if (!user) {
      throw new ApiError(401, 'Invalid refresh token');
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, 'Refresh token expired or used');
    }

    const { access_token, refresh_token: newRefresh_token } =
      await generateAccessAndRefreshToken(user.id);

    return res
      .status(200)
      .cookie('accessToken', access_token)
      .cookie('refreshToken', newRefresh_token)
      .json(
        new ApiResponse(
          200,
          { access_token, refreshToken: newRefresh_token },
          'Access token refreshed successfully'
        )
      );
  }
);

export { handleUserSignup, handleUserLogin, logoutUser, refreshAccessToken };
