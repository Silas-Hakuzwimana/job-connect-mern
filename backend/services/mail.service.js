const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendOTPEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: `"JobConnect Verification" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: '🔐 Your JobConnect OTP Code (Valid for 10 minutes)',
    html: `
      <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9f9f9; padding: 40px;">
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; padding: 30px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
          
          <h2 style="color: #007BFF; text-align: center;">🔐 JobConnect OTP Verification</h2>

          <p style="font-size: 16px; color: #333;">Dear User,</p>

          <p style="font-size: 15px; color: #555;">
            Thank you for signing in to <strong>JobConnect</strong>. To proceed, please enter the One-Time Password (OTP) below. This code is valid for <strong>10 minutes</strong> only.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 36px; font-weight: bold; color: #007BFF; letter-spacing: 4px;">${otp}</span>
          </div>

          <p style="font-size: 15px; color: #555;">
            If you did not attempt to log in, please secure your account immediately or contact support.
          </p>

          <p style="margin-top: 40px; font-size: 15px; color: #333;">Best regards,<br><strong>JobConnect Security Team</strong></p>

          <hr style="margin: 40px 0; border: none; border-top: 1px solid #ddd;" />
          <footer style="font-size: 12px; color: #999; text-align: center;">
            This is an automated message. Please do not reply directly.<br/>
            © ${new Date().getFullYear()} JobConnect. All rights reserved.
          </footer>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to ${toEmail}`);
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw new Error('Failed to send OTP email');
  }
};

const sendResetEmail = async (toEmail, resetUrl) => {
  const mailOptions = {
    from: `"JobConnect Support" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: 'JobConnect Password Reset Request',
    html: `
      <div style="font-family: Arial,sans-serif; padding: 20px;">
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="display:inline-block; padding:10px 20px; background:#007BFF; color:#fff; text-decoration:none; border-radius:5px;">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `
  };
  await transporter.sendMail(mailOptions);
};

const sendPasswordChangeEmail = async (toEmail, userName) => {
  const mailOptions = {
    from: `"JobConnect Security Team" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: 'Your JobConnect Password Was Changed',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #007BFF;">Hi ${userName},</h2>
        <p>This is a confirmation that your password has been successfully updated.</p>
        <p>If you did not perform this action, please contact our support team immediately.</p>
        <br>
        <p style="font-size: 14px; color: #555;">
          Regards,<br>
          <strong>JobConnect Security Team</strong><br>
          <a href="mailto:support@jobconnect.com" style="color: #007BFF;">support@jobconnect.com</a>
        </p>
        <hr style="margin-top: 30px;">
        <p style="font-size: 12px; color: #888;">
          You received this email because your account is registered on JobConnect.
        </p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendOTPEmail,
  sendResetEmail,
  sendPasswordChangeEmail,
};

