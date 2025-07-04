import mongoose from 'mongoose';

const verificationCodeSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true },
  code: { type: String, required: true },
  type: { type: String, required: true, enum: ['register', 'reset'] }, // 区分注册和重置
  expiresAt: { type: Date, required: true }
});

// 自动删除过期文档
verificationCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('VerificationCode', verificationCodeSchema);