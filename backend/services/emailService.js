const nodemailer = require("nodemailer");

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    // <-- use createTransport, not createTransporter
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

// Send email service
const sendEmailService = async (emailData) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `${process.env.FROM_NAME || "EmailFlow"} <${
        process.env.FROM_EMAIL || process.env.SMTP_USER
      }>`,
      to: Array.isArray(emailData.to) ? emailData.to.join(", ") : emailData.to,
      cc: emailData.cc
        ? Array.isArray(emailData.cc)
          ? emailData.cc.join(", ")
          : emailData.cc
        : undefined,
      bcc: emailData.bcc
        ? Array.isArray(emailData.bcc)
          ? emailData.bcc.join(", ")
          : emailData.bcc
        : undefined,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text,
      attachments: emailData.attachments,
    };

    const result = await transporter.sendMail(mailOptions);

    return {
      messageId: result.messageId,
      providerMessageId: result.messageId,
      accepted: result.accepted,
      rejected: result.rejected,
    };
  } catch (error) {
    console.error("Email service error:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Send simple email (for system notifications)
const sendEmail = async ({ to, subject, html, text, fromEmail }) => {
  try {
    return await sendEmailService({
      from: fromEmail,
      to,
      subject,
      html,
      text,
    });
  } catch (error) {
    console.error("Send email error:", error);
    throw error;
  }
};

// Send welcome email
const sendWelcomeEmail = async (user) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Welcome to EmailFlow!</h2>
      <p>Hi ${user.name},</p>
      <p>Thank you for joining EmailFlow. We're excited to help you streamline your email workflow.</p>
      
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Getting Started:</h3>
        <ul>
          <li>Create your first email template</li>
          <li>Upload your documents for easy attachment</li>
          <li>Set up your email signature</li>
          <li>Explore our template library</li>
        </ul>
      </div>
      
      <p>If you have any questions, feel free to reach out to our support team.</p>
      
      <p>Best regards,<br>The EmailFlow Team</p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      <p style="font-size: 12px; color: #6b7280;">
        This email was sent to ${user.email}. If you didn't create an account, please ignore this email.
      </p>
    </div>
  `;

  return await sendEmail({
    to: user.email,
    subject: "Welcome to EmailFlow - Get Started Today!",
    html,
  });
};

// Send password reset email
const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Password Reset Request</h2>
      <p>Hi ${user.name},</p>
      <p>You requested a password reset for your EmailFlow account.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" 
           style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Reset Password
        </a>
      </div>
      
      <p>This link will expire in 10 minutes for security reasons.</p>
      <p>If you didn't request this password reset, please ignore this email.</p>
      
      <p>Best regards,<br>The EmailFlow Team</p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      <p style="font-size: 12px; color: #6b7280;">
        If the button doesn't work, copy and paste this link: ${resetUrl}
      </p>
    </div>
  `;

  return await sendEmail({
    to: user.email,
    subject: "Reset Your EmailFlow Password",
    html,
  });
};

// Send subscription confirmation email
const sendSubscriptionConfirmationEmail = async (user, plan, amount) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #10b981;">Subscription Confirmed!</h2>
      <p>Hi ${user.name},</p>
      <p>Thank you for upgrading to EmailFlow ${
        plan.charAt(0).toUpperCase() + plan.slice(1)
      }!</p>
      
      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #059669;">Subscription Details:</h3>
        <p><strong>Plan:</strong> ${
          plan.charAt(0).toUpperCase() + plan.slice(1)
        }</p>
        <p><strong>Amount:</strong> $${amount}</p>
        <p><strong>Billing Cycle:</strong> Monthly</p>
      </div>
      
      <p>You now have access to all ${plan} features. Start exploring your enhanced email automation capabilities!</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL}/dashboard" 
           style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Go to Dashboard
        </a>
      </div>
      
      <p>Best regards,<br>The EmailFlow Team</p>
    </div>
  `;

  return await sendEmail({
    to: user.email,
    subject: `Welcome to EmailFlow ${
      plan.charAt(0).toUpperCase() + plan.slice(1)
    }!`,
    html,
  });
};

module.exports = {
  sendEmailService,
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendSubscriptionConfirmationEmail,
};
