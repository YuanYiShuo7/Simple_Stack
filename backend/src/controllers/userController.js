//src/userController.js
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import VerificationCode from '../models/VerificationCode.js';
import { generateToken } from '../utils/jwt.js';
import { generateVerificationCode } from '../utils/generateVerificationCode.js';  

export const login = async (req, res) => {
  console.log('Login attempt:', req.body);
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' }); // Don't reveal if user exists
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = generateToken(user._id);
    
    res.status(200).json({ 
      token: token,
      expiresIn: 3600 * 12, // 1 hour, you can adjust this as needed
      userInfo: {
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const sendVerificationCode = async (req, res) => {
  try {
    const { email, type = 'register' } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required', code: 'EMAIL_REQUIRED' });
    }

    // 检查邮箱是否已注册 (仅注册时检查)
    if (type === 'register') {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ 
          message: 'Email already registered', 
          code: 'EMAIL_EXISTS' 
        });
      }
    }

    // 生成验证码
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15分钟过期

    // 存储验证码 (覆盖旧记录)
    await VerificationCode.findOneAndUpdate(
      { email, type },
      { code, expiresAt },
      { upsert: true, new: true }
    );

    // 开发环境打印验证码，生产环境应发送邮件
    console.log(`[${type}] Verification code for ${email}: ${code}`);
    
    res.status(200).json({ 
      message: 'Verification code sent successfully',
      code: 'CODE_SENT',
      expiry: expiresAt.toISOString()
    });
  } catch (error) {
    console.error('Send verification code error:', error);
    res.status(500).json({ 
      message: 'Failed to send verification code',
      code: 'SERVER_ERROR'
    });
  }
};

// 注册用户
export const register = async (req, res) => {
  try {
    const { username, email, password, code } = req.body;
    
    // 验证输入并返回具体缺失字段
    const missingFields = [];
    if (!username) missingFields.push('username');
    if (!email) missingFields.push('email');
    if (!password) missingFields.push('password');
    if (!code) missingFields.push('code');

    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: `The following fields are required: ${missingFields.join(', ')}`,
        code: 'MISSING_FIELDS',
        missingFields: missingFields  // 可选：单独返回缺失字段数组
      });
    }

    // 验证用户名格式
    if (username.length < 3) {
      return res.status(400).json({
        message: 'Username must be at least 3 characters',
        code: 'INVALID_USERNAME'
      });
    }

    // 验证密码强度
    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters',
        code: 'WEAK_PASSWORD'
      });
    }

    // 检查验证码
    const verification = await VerificationCode.findOne({ 
      email, 
      code,
      type: 'register',
      expiresAt: { $gt: new Date() }
    });

    if (!verification) {
      return res.status(400).json({ 
        message: 'Invalid or expired verification code',
        code: 'INVALID_CODE'
      });
    }

    // 检查用户名是否已存在
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({ 
        message: 'Username already taken',
        code: 'USERNAME_EXISTS'
      });
    }

    // 创建用户
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      avatar: '',
      role: 'user'
    });

    // 删除已使用的验证码
    await VerificationCode.deleteOne({ _id: verification._id });

    // 生成JWT
    const token = generateToken(user._id);

    res.status(200).json({
      message: 'Registration successful',
      code: 'REGISTRATION_SUCCESS',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Server error during registration',
      code: 'SERVER_ERROR'
    });
  }
};

// 重置密码
export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    
    if (!email || !code || !newPassword) {
      return res.status(400).json({ 
        message: 'All fields are required',
        code: 'MISSING_FIELDS'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters',
        code: 'WEAK_PASSWORD'
      });
    }

    // 验证验证码
    const verification = await VerificationCode.findOne({ 
      email, 
      code,
      type: 'reset',
      expiresAt: { $gt: new Date() }
    });

    if (!verification) {
      return res.status(400).json({ 
        message: 'Invalid or expired verification code',
        code: 'INVALID_CODE'
      });
    }

    // 更新密码
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // 删除已使用的验证码
    await VerificationCode.deleteOne({ _id: verification._id });

    res.status(200).json({ 
      message: 'Password reset successful',
      code: 'PASSWORD_RESET_SUCCESS'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ 
      message: 'Server error during password reset',
      code: 'SERVER_ERROR'
    });
  }
};

export const updateUsername = async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username || username.length < 3) {
      return res.status(400).json({ message: 'Username must be at least 3 characters' });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { username },
      { new: true }
    ).select('-password -registerVerificationCode -registerVerificationExpiry');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Update username error:', error);
    res.status(500).json({ message: 'Server error updating username' });
  }
};

export const updateAvatar = async (req, res) => {
  try {
    // 1. 验证请求数据
    if (!req.file) {
      return res.status(400).json({ 
        message: 'No file uploaded' 
      });
    }

    if (!req.body.email) {
      // 如果文件已上传但缺少email，删除临时文件
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        message: 'Email is required' 
      });
    }
    
    // 查找用户
    const user = await User.findOne({ email });
    if (!user) {
      // 删除已上传的文件
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ 
        message: 'User not found',
      });
    }

    // 删除旧头像文件(如果存在)
    if (user.avatar) {
      const oldFilename = user.avatar.split('/').pop();
      const oldPath = path.join('uploads/avatars', oldFilename);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // 生成新的头像URL
    const avatarUrl = `${req.protocol}://${req.get('host')}/avatars/${req.file.filename}`;
    
    // 更新用户头像
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { avatar: avatarUrl },
      { new: true }
    ).select('-password');

    res.status(200).json({
      message: 'Avatar updated successfully',
      avatarUrl: updatedUser.avatar,
    });

  } catch (error) {
    console.error('Update avatar error:', error);
    
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      message: 'Server error updating avatar',
    });
  }
};

export const logout = async (req, res) => {
  res.status(200).json({ message: 'Logout successful' });
};