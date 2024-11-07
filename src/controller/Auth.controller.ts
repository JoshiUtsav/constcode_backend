import { Request, Response } from "express";
import User from "@/models/user.model";
import ApiError from "@/utils/apiError.utils";
import ApiResponse from "@/utils/apiResponse.utils";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_REFRESH_SECRET } from "@/config/index";

// Sign-up logic
const handleUserSignup = async (req: Request, res: Response) => {
  const { name, email, password, phoneNumber } = req.body;

  // Validate input fields
  if (
    [name, email, password, phoneNumber].some(
      (value) => typeof value !== "string" || value.trim() === ""
    )
  ) {
    throw new ApiError(400, "Missing required fields");
  }

  // Check for existing user
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "Email already exists");
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
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while signing up");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
};

// Login logic
const handleUserLogin = async (req: Request, res: Response) => {
  const { email, password, phoneNumber } = req.body;

  // Validate input fields
  if (!email || !password || !phoneNumber) {
    throw new ApiError(400, "Missing required fields");
  }

  // Find user and verify password
  const user = await User.findOne({ email });
  if (!user || !(await user.isPasswordCorrect(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Generate tokens
  const { access_token, refresh_token } = await generateAccessAndRefreshToken(
    user.id
  );

  // Send response
  const loggedInUser = await User.findById(user.id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", access_token)
    .cookie("refreshToken", refresh_token)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, access_token, refresh_token },
        "User logged in successfully"
      )
    );
};

// Token generation logic
const generateAccessAndRefreshToken = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const access_token = jwt.sign({ id: user.id }, JWT_SECRET, {
    expiresIn: "15m",
  });
  const refresh_token = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

  user.refreshToken = refresh_token;
  await user.save({ validateBeforeSave: false });

  return { access_token, refresh_token };
};

// Logout logic
const logoutUser = async (req: Request, res: Response) => {
  // Ensure that req.user is defined and is of type UserDocument
  if (!req.user) {
    return res
      .status(401)
      .json(new ApiResponse(401, null, "User not authenticated"));
  }

  await User.findByIdAndUpdate(
    req.user.id,
    { refreshToken: null },
    { new: true }
  );

  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, null, "User logged out successfully"));
};

// Refresh token logic
const refreshAccessToken = async (req: Request, res: Response) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  const decodedToken = jwt.verify(incomingRefreshToken, JWT_REFRESH_SECRET) as {
    id: string;
  }; // Type assertion for decoded token

  const user = await User.findById(decodedToken?.id);
  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }

  if (incomingRefreshToken !== user?.refreshToken) {
    throw new ApiError(401, "Refresh token expired or used");
  }

  const { access_token, refresh_token: newRefresh_token } =
    await generateAccessAndRefreshToken(user.id);

  return res
    .status(200)
    .cookie("accessToken", access_token)
    .cookie("refreshToken", newRefresh_token)
    .json(
      new ApiResponse(
        200,
        { access_token, refreshToken: newRefresh_token },
        "Access token refreshed successfully"
      )
    );
};

export { handleUserSignup, handleUserLogin, logoutUser, refreshAccessToken };
