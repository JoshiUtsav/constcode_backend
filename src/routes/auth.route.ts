import { Router } from 'express';

// Controller
import {
  handleUserLogin,
  handleUserSignup,
  logoutUser,
  refreshAccessToken,
} from '../controller/auth.controller';

// Middleware
import { verifyJWT } from '../middleware/auth.middleware';

const router = Router();

router.route('/signup').post(handleUserSignup);
router.route('/login').post(handleUserLogin);

// Secured routes
router.route('/logout').post(verifyJWT, logoutUser);
router.route('/refreshToken').post(refreshAccessToken);

export default router;
