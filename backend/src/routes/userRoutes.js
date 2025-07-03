import express from 'express';
import {
  login,
  register,
  getUserInfo,
  updateUsername,
  updateAvatar,
  sendRegisterVerificationCode,
  sendResetPasswordVerificationCode,
  resetPassword,
  logout
} from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/auth.js';
import upload from '../utils/upload.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/info', authMiddleware, getUserInfo);
router.put('/update-username', authMiddleware, updateUsername);
router.put('/avatar', authMiddleware, upload.single('avatar'), updateAvatar);
router.post('/send-register-code', sendRegisterVerificationCode);
router.post('/send-reset-password-code', sendResetPasswordVerificationCode);
router.post('/reset-password', resetPassword);
router.post('/logout', authMiddleware, logout);

export default router;