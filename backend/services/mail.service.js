const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendOTPEmail = async (toEmail, firstName, otp) => {
  const mailOptions = {
    from: `"JobConnect Verification" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: "🔐 Your JobConnect OTP Code (Valid for 10 minutes)",
    html: `
      <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9f9f9; padding: 40px;">
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; padding: 30px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
          
          <h2 style="color: #007BFF; text-align: center;">🔐 JobConnect OTP Verification</h2>

          <p style="font-size: 16px; color: #333;">Dear ${firstName},</p>

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
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to ${toEmail}`);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw new Error("Failed to send OTP email");
  }
};

const sendResetEmail = async (toEmail, firstName, resetUrl) => {
  const mailOptions = {
    from: `"JobConnect Support" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: "🔄 Reset Your JobConnect Password",
    html: `
      <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9f9f9; padding: 40px;">
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; padding: 30px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">

          <h2 style="color: #007BFF; text-align: center;">🔄 JobConnect Password Reset</h2>

          <p style="font-size: 16px; color: #333;">Dear ${firstName},</p>

          <p style="font-size: 15px; color: #555;">
            We received a request to reset the password for your JobConnect account. If you made this request, please click the button below to create a new password.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #007BFF; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 16px; font-weight: bold;">
              Reset Password
            </a>
          </div>

          <p style="font-size: 15px; color: #555;">
            This link will expire in 30 minutes. If you did not request this change, please ignore this email or contact our support team.
          </p>

          <p style="margin-top: 40px; font-size: 15px; color: #333;">Kind regards,<br><strong>JobConnect Support Team</strong></p>

          <hr style="margin: 40px 0; border: none; border-top: 1px solid #ddd;" />
          <footer style="font-size: 12px; color: #999; text-align: center;">
            This is an automated message. Please do not reply directly.<br/>
            © ${new Date().getFullYear()} JobConnect. All rights reserved.
          </footer>

        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${toEmail}`);
  } catch (error) {
    console.error("❌ Reset email sending failed:", error);
    throw new Error("Failed to send password reset email");
  }
};

const sendPasswordChangeEmail = async (toEmail, userName) => {
  const firstName = userName.split(" ")[0]; 

  const mailOptions = {
    from: `"JobConnect Security Team" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: "Your JobConnect Password Has Been Changed",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 20px; color: #333; background-color: #f9f9f9; border-radius: 8px;">
        <div style="border-bottom: 2px solid #007BFF; margin-bottom: 20px;">
          <h2 style="color: #007BFF;">Hi ${firstName},</h2>
        </div>

        <p>We wanted to let you know that your password on <strong>JobConnect</strong> was successfully changed.</p>
        <p>If you made this change, no further action is needed.</p>
        <p>If you did <strong>not</strong> request this change, please <a href="mailto:support@jobconnect.com" style="color: #dc3545;">contact our support team</a> immediately to secure your account.</p>

        <br>
        <p style="font-size: 14px; color: #555;">
          Best regards,<br>
          <strong>JobConnect Security Team</strong><br>
          <a href="mailto:support@jobconnect.com" style="color: #007BFF;">support@jobconnect.com</a>
        </p>

        <hr style="margin-top: 30px; border-color: #ddd;">
        <p style="font-size: 12px; color: #888;">
          This is an automated message. Please do not reply.<br>
          © 2025 JobConnect. All rights reserved.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendOTPEmail,
  sendResetEmail,
  sendPasswordChangeEmail,
};
