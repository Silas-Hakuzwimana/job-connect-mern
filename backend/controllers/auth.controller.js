const User = require('../models/User');
const crypto = require('crypto');
const { generateToken } = require('../services/token.service');
const { sendOTPEmail, sendResetEmail } = require('../services/mail.service');
const dotenv = require('dotenv');
dotenv.config();

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await User.create({ name, email, password, role });
    res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    res.status(400).json({ error: 'User already exists or invalid data' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpiresAt = Date.now() + 10 * 60 * 1000; // 10 min
  await user.save();

  await sendOTPEmail(user.email, otp);
  res.status(200).json({ message: 'OTP sent to your email' });
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.otp !== otp || user.otpExpiresAt < Date.now()) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }

  user.otp = undefined;
  user.otpExpiresAt = undefined;
  await user.save();

  const token = generateToken(user);
  res.status(200).json({ token, user: { name: user.name, role: user.role } });
};

// Request password reset - generates token and emails user
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Generate token & expiration (10 minutes)
    user.resetPasswordToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordExpires = Date.now() + 600;
    await user.save();

    // Send email with reset link containing token
    const resetUrl = `${process.env.FRONT_END_URL}/reset-password?token=${user.resetPasswordToken}&email=${email}`;
    await sendResetEmail(email, resetUrl);

    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send reset email' });
  }
};


exports.resetPassword = async (req, res) => {
  const { token, email, newPassword } = req.body;
  try {
    const user = await User.findOne({ 
      email,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) return res.status(400).json({ error: 'Invalid or expired token' });

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password has been reset' });
  } catch {
    res.status(500).json({ error: 'Password reset failed' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'Strict',
    secure: process.env.NODE_ENV === 'production', // Optional: for production
  });
  res.status(200).json({ message: 'Logged out successfully' });
};
