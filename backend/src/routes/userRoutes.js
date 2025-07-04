import express from 'express';
import {
  login,
  register,
  updateUsername,
  updateAvatar,
  sendVerificationCode,
  resetPassword,
  logout
} from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/auth.js';
import upload from '../utils/upload.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.put('/update-username', authMiddleware, updateUsername);
router.put('/avatar', authMiddleware, upload.single('avatar'), updateAvatar);
router.post('/send-verification-code', sendVerificationCode);
router.post('/reset-password', resetPassword);
router.post('/logout', authMiddleware, logout);

export default router;