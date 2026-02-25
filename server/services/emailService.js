const nodemailer = require("nodemailer");
const logger = require("../middleware/logger");

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
      from: `${process.env.EMAIL_FROM_NAME || "Connecting Hostels"} <${
        process.env.EMAIL_FROM || "noreply@connectinghostels.com"
      }>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);

    if (process.env.NODE_ENV !== "production") {
      logger.debug("Email preview URL: " + nodemailer.getTestMessageUrl(info));
    }

    logger.info("Email sent to: " + options.email);
    return info;
  } catch (error) {
    logger.error("Email sending error: " + error.message);
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

You requested to reset your password for your Connecting Hostels  account.

Click the link below to reset your password:
${resetURL}

This link will expire in 10 minutes.

If you didn't request this, please ignore this email and your password will remain unchanged.

Best regards,
Connecting Hostels Team
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
    
    <p>You requested to reset your password for your Connecting Hostels account.</p>
    
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
      <p>Best regards,<br><strong>Connecting Hostels Team</strong></p>
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
Connecting Hostels Team
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
      <p>Best regards,<br><strong>Connecting Hostels Team</strong></p>
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

// ─── Shared CSS ───────────────────────────────────────────────────────────────
const BASE_CSS = `
  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
  .container { background-color: #f9f9f9; border-radius: 10px; padding: 30px; border: 1px solid #e0e0e0; }
  .header { text-align: center; margin-bottom: 24px; }
  .badge { display: inline-block; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: bold; margin-bottom: 8px; }
  .badge-green { background: #d1fae5; color: #065f46; }
  .badge-red   { background: #fee2e2; color: #991b1b; }
  .badge-blue  { background: #dbeafe; color: #1e40af; }
  .info-box { background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 12px 16px; border-radius: 4px; margin: 16px 0; }
  .footer { margin-top: 28px; padding-top: 16px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666; text-align: center; }
`;

const wrapHtml = (title, body) => `
<!DOCTYPE html><html><head><style>${BASE_CSS}</style></head>
<body><div class="container">
  <div class="header"><h2 style="color:#4f46e5;margin:0">${title}</h2></div>
  ${body}
  <div class="footer"><p>Best regards,<br><strong>Connecting Hostels Team</strong></p>
  <p>This is an automated email. Please do not reply.</p></div>
</div></body></html>`;

// ─── Welcome Email ────────────────────────────────────────────────────────────
const sendWelcomeEmail = async (user) => {
  const html = wrapHtml("Welcome to Connecting Hostels! 🎉", `
    <p>Hi <strong>${user.name}</strong>,</p>
    <p>Welcome! Your account has been created successfully.</p>
    <div class="info-box">
      <strong>Email:</strong> ${user.email}<br>
      <strong>Role:</strong> ${user.role}
    </div>
    <p>You can now browse hostels, send booking requests, and manage your stay — all in one place.</p>
  `);
  await sendEmail({
    email: user.email,
    subject: "Welcome to Connecting Hostels!",
    message: `Hi ${user.name}, welcome to Connecting Hostels!`,
    html,
  });
};

// ─── Booking Approved ─────────────────────────────────────────────────────────
const sendBookingApprovedEmail = async ({ studentName, studentEmail, hostelName, hostelAddress, roomNumber, floor }) => {
  const html = wrapHtml("Booking Approved ✅", `
    <p>Hi <strong>${studentName}</strong>,</p>
    <span class="badge badge-green">✅ Approved</span>
    <p>Great news! Your booking request has been <strong>approved</strong>.</p>
    <div class="info-box">
      <strong>Hostel:</strong> ${hostelName}<br>
      ${hostelAddress ? `<strong>Address:</strong> ${hostelAddress}<br>` : ""}
      <strong>Room Number:</strong> ${roomNumber}<br>
      ${floor ? `<strong>Floor:</strong> ${floor}` : ""}
    </div>
    <p>Please contact the hostel owner for check-in details. Welcome home!</p>
  `);
  await sendEmail({
    email: studentEmail,
    subject: `Booking Approved — ${hostelName}`,
    message: `Hi ${studentName}, your booking at ${hostelName} has been approved. Room: ${roomNumber}.`,
    html,
  });
};

// ─── Booking Rejected ─────────────────────────────────────────────────────────
const sendBookingRejectedEmail = async ({ studentName, studentEmail, hostelName, reason }) => {
  const html = wrapHtml("Booking Request Update", `
    <p>Hi <strong>${studentName}</strong>,</p>
    <span class="badge badge-red">❌ Not Approved</span>
    <p>Unfortunately your booking request for <strong>${hostelName}</strong> could not be approved at this time.</p>
    ${reason ? `<div class="info-box"><strong>Reason:</strong> ${reason}</div>` : ""}
    <p>You can explore other available hostels on our platform. We hope to find you the perfect match soon!</p>
  `);
  await sendEmail({
    email: studentEmail,
    subject: `Booking Request Update — ${hostelName}`,
    message: `Hi ${studentName}, your booking request for ${hostelName} was not approved. ${reason || ""}`,
    html,
  });
};

// ─── Hostel Approved ─────────────────────────────────────────────────────────
const sendHostelApprovedEmail = async ({ ownerName, ownerEmail, hostelName }) => {
  const html = wrapHtml("Your Hostel is Live! 🏠", `
    <p>Hi <strong>${ownerName}</strong>,</p>
    <span class="badge badge-green">✅ Live</span>
    <p>Congratulations! Your hostel <strong>${hostelName}</strong> has been reviewed and approved by our admin team.</p>
    <p>It is now <strong>live on the platform</strong> and visible to students searching for accommodation.</p>
  `);
  await sendEmail({
    email: ownerEmail,
    subject: `${hostelName} is now live on Connecting Hostels!`,
    message: `Hi ${ownerName}, your hostel "${hostelName}" has been approved and is now live.`,
    html,
  });
};

// ─── Hostel Rejected ─────────────────────────────────────────────────────────
const sendHostelRejectedEmail = async ({ ownerName, ownerEmail, hostelName, reason }) => {
  const html = wrapHtml("Hostel Review Update", `
    <p>Hi <strong>${ownerName}</strong>,</p>
    <span class="badge badge-red">Review Needed</span>
    <p>Your hostel <strong>${hostelName}</strong> could not be approved in its current state.</p>
    ${reason ? `<div class="info-box"><strong>Reason:</strong> ${reason}</div>` : ""}
    <p>Please address the feedback above and re-submit your hostel listing. Our team will review it again.</p>
  `);
  await sendEmail({
    email: ownerEmail,
    subject: `Action Required — ${hostelName} Review Update`,
    message: `Hi ${ownerName}, your hostel "${hostelName}" was not approved. ${reason || ""}`,
    html,
  });
};

// ─── Due Reminder ─────────────────────────────────────────────────────────────
const sendDueReminderEmail = async ({ studentName, studentEmail, hostelName, amount, dueDate, title }) => {
  const formattedDate = dueDate ? new Date(dueDate).toLocaleDateString("en-IN") : "—";
  const html = wrapHtml("Payment Due Reminder 💰", `
    <p>Hi <strong>${studentName}</strong>,</p>
    <span class="badge badge-blue">Payment Due</span>
    <p>A new payment has been raised for your stay at <strong>${hostelName}</strong>.</p>
    <div class="info-box">
      <strong>Description:</strong> ${title}<br>
      <strong>Amount:</strong> ₹${amount.toLocaleString("en-IN")}<br>
      <strong>Due Date:</strong> ${formattedDate}
    </div>
    <p>Please log in to your dashboard to make the payment before the due date to avoid late fees.</p>
  `);
  await sendEmail({
    email: studentEmail,
    subject: `Payment Due — ₹${amount.toLocaleString("en-IN")} for ${hostelName}`,
    message: `Hi ${studentName}, a payment of ₹${amount} is due for ${hostelName} by ${formattedDate}.`,
    html,
  });
};

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
  sendWelcomeEmail,
  sendBookingApprovedEmail,
  sendBookingRejectedEmail,
  sendHostelApprovedEmail,
  sendHostelRejectedEmail,
  sendDueReminderEmail,
};
