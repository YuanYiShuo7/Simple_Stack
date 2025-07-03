import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';

// Helper function for verification code generation
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

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
      token,
      user: {
        id: user._id,
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

export const register = async (req, res) => {
  console.log('Registration attempt:', req.body);
  try {
    const { username, email, password, verificationCode } = req.body;
    
    // Validate input
    if (!username || !email || !password || !verificationCode) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Verify the code
    const tempUser = await User.findOne({ 
      email,
      registerVerificationCode: verificationCode,
      registerVerificationExpiry: { $gt: new Date() }
    });

    if (!tempUser) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user (update the temp record)
    tempUser.username = username;
    tempUser.password = hashedPassword;
    tempUser.registerVerificationCode = undefined;
    tempUser.registerVerificationExpiry = undefined;
    tempUser.avatar = 'src/assets/imgs/default.png';
    tempUser.role = 'user';
    
    await tempUser.save();
    
    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: tempUser._id,
        username: tempUser.username,
        email: tempUser.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const sendRegisterVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if email already registered
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.password) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Generate code (6 digits)
    const verificationCode = generateVerificationCode();
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    
    // Create or update user record
    const user = existingUser || new User({ email });
    user.registerVerificationCode = verificationCode;
    user.registerVerificationExpiry = expiry;
    await user.save();
    
    // In production: Send email with verificationCode
    console.log(`Verification code for ${email}: ${verificationCode}`);
    
    res.status(200).json({ 
      message: 'Verification code sent',
      expiry: expiry.toISOString()
    });
  } catch (error) {
    console.error('Verification code error:', error);
    res.status(500).json({ message: 'Failed to send verification code' });
  }
};

export const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password -registerVerificationCode -registerVerificationExpiry');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Get user info error:', error);
    res.status(500).json({ message: 'Server error retrieving user info' });
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
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const avatarUrl = `${req.protocol}://${req.get('host')}/avatars/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { avatar: avatarUrl },
      { new: true }
    ).select('-password -registerVerificationCode -registerVerificationExpiry');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ avatarUrl: user.avatar });
  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(500).json({ message: 'Server error updating avatar' });
  }
};

export const sendResetPasswordVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const resetCode = generateVerificationCode();
    const resetCodeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    
    user.resetCode = resetCode;
    user.resetCodeExpiry = resetCodeExpiry;
    await user.save();
    
    // In production: Send email with resetCode
    console.log(`Password reset code for ${email}: ${resetCode}`);
    
    res.status(200).json({ 
      message: 'Verification code sent',
      expiry: resetCodeExpiry.toISOString()
    });
  } catch (error) {
    console.error('Password reset code error:', error);
    res.status(500).json({ message: 'Failed to send verification code' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, verificationCode, newPassword } = req.body;
    
    if (!email || !verificationCode || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.resetCode !== verificationCode || new Date() > user.resetCodeExpiry) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }
    
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetCode = null;
    user.resetCodeExpiry = null;
    await user.save();
    
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Server error resetting password' });
  }
};

export const logout = async (req, res) => {
  res.status(200).json({ message: 'Logout successful' });
};