const nodemailer = require("nodemailer");

/**
 * Create email transporter based on environment
 */
const createTransporter = () => {
  if (process.env.NODE_ENV === "production") {
    // 🚀 PRODUCTION: Use a real email service
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_PORT === "465",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  } else {
    // 🧪 DEVELOPMENT: Use Ethereal or log to console
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: process.env.ETHEREAL_USER || "ethereal.user@ethereal.email",
        pass: process.env.ETHEREAL_PASS || "ethereal_password",
      },
    });
  }
};

/**
 * Generic send email function
 */
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME || "Hostel Finder"} <${
        process.env.EMAIL_FROM || "noreply@hostelfinder.com"
      }>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);

    // Log preview URL in development
    if (process.env.NODE_ENV !== "production") {
      console.log("📧 Email Preview URL:", nodemailer.getTestMessageUrl(info));
    }

    console.log("✅ Email sent successfully to:", options.email);
    return info;
  } catch (error) {
    console.error("❌ Email sending error:", error);
    throw new Error("Failed to send email");
  }
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (user, resetToken) => {
  const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const message = `
Hi ${user.name},

You requested to reset your password for your Hostel Finder account.

Click the link below to reset your password:
${resetURL}

This link will expire in 10 minutes.

If you didn't request this, please ignore this email and your password will remain unchanged.

Best regards,
Hostel Finder Team
  `;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .container {
      background-color: #f9f9f9;
      border-radius: 10px;
      padding: 30px;
      border: 1px solid #e0e0e0;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #4f46e5;
      margin: 0;
    }
    .button {
      display: inline-block;
      padding: 14px 28px;
      background-color: #4f46e5;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
      font-weight: bold;
    }
    .warning {
      background-color: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 12px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      font-size: 12px;
      color: #666;
      text-align: center;
    }
    .link-text {
      word-break: break-all;
      color: #4f46e5;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔐 Password Reset Request</h1>
    </div>
    
    <p>Hi <strong>${user.name}</strong>,</p>
    
    <p>You requested to reset your password for your Hostel Finder account.</p>
    
    <p>Click the button below to reset your password:</p>
    
    <div style="text-align: center;">
      <a href="${resetURL}" class="button">Reset Password</a>
    </div>
    
    <p>Or copy and paste this link into your browser:</p>
    <p class="link-text">${resetURL}</p>
    
    <div class="warning">
      <strong>⏰ Important:</strong> This link will expire in <strong>10 minutes</strong>.
    </div>
    
    <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
    
    <div class="footer">
      <p>Best regards,<br><strong>Hostel Finder Team</strong></p>
      <p style="margin-top: 10px;">
        This is an automated email. Please do not reply to this message.
      </p>
    </div>
  </div>
</body>
</html>
  `;

  await sendEmail({
    email: user.email,
    subject: "Password Reset Request (Valid for 10 minutes)",
    message,
    html,
  });
};

/**
 * Send password changed confirmation email (optional)
 */
const sendPasswordChangedEmail = async (user) => {
  const message = `
Hi ${user.name},

Your password has been successfully changed.

If you did not make this change, please contact our support team immediately.

Best regards,
Hostel Finder Team
  `;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .container {
      background-color: #f9f9f9;
      border-radius: 10px;
      padding: 30px;
      border: 1px solid #e0e0e0;
    }
    .success {
      background-color: #d1fae5;
      border-left: 4px solid #10b981;
      padding: 12px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .warning {
      background-color: #fee2e2;
      border-left: 4px solid #ef4444;
      padding: 12px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      font-size: 12px;
      color: #666;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2 style="color: #10b981;">✅ Password Changed Successfully</h2>
    
    <p>Hi <strong>${user.name}</strong>,</p>
    
    <div class="success">
      Your password has been successfully changed.
    </div>
    
    <p>You can now log in to your account using your new password.</p>
    
    <div class="warning">
      <strong>⚠️ Didn't make this change?</strong><br>
      If you did not change your password, please contact our support team immediately.
    </div>
    
    <div class="footer">
      <p>Best regards,<br><strong>Hostel Finder Team</strong></p>
      <p style="margin-top: 10px;">
        This is an automated email. Please do not reply to this message.
      </p>
    </div>
  </div>
</body>
</html>
  `;

  await sendEmail({
    email: user.email,
    subject: "Password Changed Successfully",
    message,
    html,
  });
};

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
};
