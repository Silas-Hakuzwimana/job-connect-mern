const User = require('../models/User');
const crypto = require('crypto');
const { generateToken } = require('../services/token.service');
const {
  sendOTPEmail,
  sendResetEmail,
  sendPasswordChangeEmail,
} = require('../services/mail.service');
const dotenv = require('dotenv');
const { log } = require('console');
dotenv.config();

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    await User.create({ name, email, password, role });
    res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    res.status(400).json({ error: 'User already exists or invalid data' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  console.log('login user:', user);

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  // Extract first name
  const firstName = user.name?.split(' ')[0] || 'User';

  // Send OTP email
  await sendOTPEmail(user.email, firstName, otp);

  res.status(200).json({ message: 'OTP sent to your email' });
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Log incoming request (optional for debugging)
    console.log('verifyOTP req.body:', req.body);

    // Validate input types
    if (typeof email !== 'string' || typeof otp !== 'string') {
      return res.status(400).json({ error: 'Email and OTP must be strings' });
    }

    // Look up the user by email
    const user = await User.findOne({ email });

    if (
      !user ||
      user.otp !== otp ||
      !user.otpExpiresAt ||
      user.otpExpiresAt < Date.now()
    ) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Clear OTP fields
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    // Generate JWT token
    const token = generateToken(user);

    // Send response
    res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        id: user._id,
      },
      token,
    });
    console.log(`User data : \n ${user}`);
  } catch (error) {
    console.error('verifyOTP error:', error.message);
    res.status(500).json({ error: 'Server error during OTP verification' });
  }
};

// Request password reset - generates token and emails user
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  console.log('requestPasswordReset email:', email);
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Generate token & expiration (10 minutes)
    user.resetPasswordToken = crypto.randomBytes(32).toString('hex');
    const expirationTimeInMinutes = 10;
    user.resetPasswordExpires = new Date(
      Date.now() + expirationTimeInMinutes * 60 * 1000,
    );
    await user.save();

    // Send email with reset link containing token
    const resetUrl = `${process.env.FRONT_END_URL}/reset-password?token=${user.resetPasswordToken}&email=${user.email}`;
    console.log('Reset URL:', resetUrl);

    //Extract first name for email
    const firstName = user.name?.split(' ')[0] || 'User';
    // Send reset email
    await sendResetEmail(email, firstName, resetUrl);

    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send reset email' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  console.log('resetPassword token:', token);
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    await sendPasswordChangeEmail(user.email, user.name);

    res.json({ message: 'Password has been reset successfully!' });
  } catch (error) {
    console.error('Password reset error:', error.message);
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
