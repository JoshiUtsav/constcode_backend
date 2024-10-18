import { Router } from "express";

// Controller
import {
  handleUserLogin,
  handleUserSignup,
  logoutUser,
  refreshAccessToken,
} from "../controller/auth.controller";

// Middleware
import { verifyJWT } from "../middleware/auth.middleware";
import storage from "@/middleware/multer.middleware";
import multer from "multer";

const router = Router();
const upload = multer({ storage });

router.route("/signup").post(handleUserSignup);
router.route("/login").post(handleUserLogin);

// Secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refreshToken").post(refreshAccessToken);

export default router;
