import { Router } from 'express';
import authRouter from '@/routes/auth.route';
import ApiResponse from '@/utils/ApiResponse.utils';

const router = Router();

router.use('/auth', authRouter);

router.route('/health').get(function (req, res) {
  return res.status(200).json(new ApiResponse(200, null, 'Server up and running 🎉🎉'));
});

export default router;
