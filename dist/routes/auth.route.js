"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// Controller
const auth_controller_1 = require("@/controller/auth.controller");
// Middleware
const auth_middleware_1 = require("@/middleware/auth.middleware");
const router = (0, express_1.Router)();
router.route("/signup").post(auth_controller_1.handleUserSignup);
router.route("/login").post(auth_controller_1.handleUserLogin);
// Secured routes
router.route("/logout").post(auth_middleware_1.verifyJWT, auth_controller_1.logoutUser);
router.route("/refreshToken").post(auth_controller_1.refreshAccessToken);
exports.default = router;
