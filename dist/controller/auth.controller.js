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
exports.refreshAccessToken = exports.logoutUser = exports.handleUserLogin = exports.handleUserSignup = void 0;
const user_model_1 = __importDefault(require("@/models/user.model"));
const apiError_utils_1 = __importDefault(require("@/utils/apiError.utils"));
const apiResponse_utils_1 = __importDefault(require("@/utils/apiResponse.utils"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("@/config/index");
// Type guard to check if error is an instance of ApiError
const isApiError = (error) => error instanceof apiError_utils_1.default;
// Sign-up logic
const handleUserSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, phoneNumber } = req.body;
        // Validate input fields
        if ([name, email, password, phoneNumber].some((value) => typeof value !== "string" || value.trim() === "")) {
            throw new apiError_utils_1.default(400, "Missing required fields");
        }
        // Check for existing user
        const existingUser = yield user_model_1.default.findOne({ email });
        if (existingUser) {
            throw new apiError_utils_1.default(409, "Email already exists");
        }
        // Create and save new user
        const user = new user_model_1.default({
            username: name,
            email,
            password,
            number: phoneNumber,
        });
        yield user.save();
        const createdUser = yield user_model_1.default.findById(user.id).select("-password -refreshToken");
        if (!createdUser) {
            throw new apiError_utils_1.default(500, "Something went wrong while signing up");
        }
        return res
            .status(201)
            .json(new apiResponse_utils_1.default(201, createdUser, "User registered successfully"));
    }
    catch (error) {
        if (isApiError(error)) {
            res.status(error.statusCode).json(error);
        }
        else {
            res.status(500).json(new apiError_utils_1.default(500, "Internal Server Error"));
        }
    }
});
exports.handleUserSignup = handleUserSignup;
// Login logic
const handleUserLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, phoneNumber } = req.body;
        // Validate input fields
        if (!email || !phoneNumber || !password) {
            throw new apiError_utils_1.default(400, "Missing required fields");
        }
        // Find user by email or phone number
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            throw new apiError_utils_1.default(401, "Invalid email or phone number");
        }
        // Verify phone number and password
        if (user.number !== phoneNumber ||
            !(yield user.isPasswordCorrect(password))) {
            throw new apiError_utils_1.default(401, "Invalid email, phone number, or password");
        }
        // Generate tokens
        const { access_token, refresh_token } = yield generateAccessAndRefreshToken(user.id);
        // Send response
        const loggedInUser = yield user_model_1.default.findById(user.id).select("-password -refreshToken");
        return res
            .status(200)
            .cookie("accessToken", access_token)
            .cookie("refreshToken", refresh_token)
            .json(new apiResponse_utils_1.default(200, { user: loggedInUser, access_token, refresh_token }, "User logged in successfully"));
    }
    catch (error) {
        if (isApiError(error)) {
            res.status(error.statusCode).json(error);
        }
        else {
            res.status(500).json(new apiError_utils_1.default(500, "Internal Server Error"));
        }
    }
});
exports.handleUserLogin = handleUserLogin;
// Token generation logic
const generateAccessAndRefreshToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(userId);
    if (!user) {
        throw new apiError_utils_1.default(404, "User not found");
    }
    const access_token = user.generateAccessToken();
    const refresh_token = user.generateRefreshToken();
    user.refreshToken = refresh_token;
    yield user.save({ validateBeforeSave: false });
    return { access_token, refresh_token };
});
// Logout logic
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res
                .status(401)
                .json(new apiResponse_utils_1.default(401, null, "User not authenticated"));
        }
        yield user_model_1.default.findByIdAndUpdate(req.user.id, { refreshToken: null }, { new: true });
        return res
            .status(200)
            .clearCookie("accessToken")
            .clearCookie("refreshToken")
            .json(new apiResponse_utils_1.default(200, null, "User logged out successfully"));
    }
    catch (error) {
        if (isApiError(error)) {
            res.status(error.statusCode).json(error);
        }
        else {
            res.status(500).json(new apiError_utils_1.default(500, "Internal Server Error"));
        }
    }
});
exports.logoutUser = logoutUser;
// Refresh token logic
const refreshAccessToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
        if (!incomingRefreshToken) {
            throw new apiError_utils_1.default(401, "Unauthorized request");
        }
        const decodedToken = jsonwebtoken_1.default.verify(incomingRefreshToken, index_1.JWT_REFRESH_SECRET);
        const user = yield user_model_1.default.findById(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id);
        if (!user) {
            throw new apiError_utils_1.default(401, "Invalid refresh token");
        }
        if (incomingRefreshToken !== (user === null || user === void 0 ? void 0 : user.refreshToken)) {
            throw new apiError_utils_1.default(401, "Refresh token expired or used");
        }
        const { access_token, refresh_token: newRefresh_token } = yield generateAccessAndRefreshToken(user.id);
        return res
            .status(200)
            .cookie("accessToken", access_token)
            .cookie("refreshToken", newRefresh_token)
            .json(new apiResponse_utils_1.default(200, { access_token, refreshToken: newRefresh_token }, "Access token refreshed successfully"));
    }
    catch (error) {
        if (isApiError(error)) {
            res.status(error.statusCode).json(error);
        }
        else {
            res.status(500).json(new apiError_utils_1.default(500, "Internal Server Error"));
        }
    }
});
exports.refreshAccessToken = refreshAccessToken;
