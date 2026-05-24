const nodemailer = require('nodemailer');

/**
 * Creates a reusable Nodemailer transporter using SMTP credentials from .env
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Checks if the configured email settings are placeholders or empty
 */
const isMockEmailConfig = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  return (
    !user ||
    !pass ||
    user === 'your_gmail_address@gmail.com' ||
    pass === 'your_16_char_app_password' ||
    user.trim() === '' ||
    pass.trim() === ''
  );
};

/**
 * Send OTP verification email to newly registered user
 * @param {string} to - Recipient email address
 * @param {string} name - Recipient's name
 * @param {string} otp - 6-digit OTP code
 */
const sendOTPEmail = async (to, name, otp) => {
  const isMock = isMockEmailConfig();

  if (isMock) {
    console.log('\n' + '═'.repeat(60));
    console.log('📬  [SMTP MOCK] EMAIL SERVICE (Credentials Not Configured)');
    console.log(`To:        ${to}`);
    console.log(`Name:      ${name}`);
    console.log(`Subject:   Verify Your Email – TaskFlow`);
    console.log(`OTP Code:  ⚡️  ${otp}  ⚡️`);
    console.log(`Expiry:    ⏱  10 minutes`);
    console.log('═'.repeat(60) + '\n');
    return;
  }

  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"TaskFlow App" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Verify Your Email – TaskFlow',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <style>
              body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f6fb; margin: 0; padding: 0; }
              .container { max-width: 520px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
              .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 36px 40px; text-align: center; }
              .header h1 { color: #fff; margin: 0; font-size: 26px; letter-spacing: -0.5px; }
              .header p { color: rgba(255,255,255,0.85); margin: 6px 0 0; font-size: 14px; }
              .body { padding: 36px 40px; }
              .body p { color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 16px; }
              .otp-box { background: #f0f0ff; border: 2px dashed #6366f1; border-radius: 10px; text-align: center; padding: 24px; margin: 24px 0; }
              .otp-code { font-size: 42px; font-weight: 800; letter-spacing: 12px; color: #4f46e5; font-family: 'Courier New', monospace; }
              .expiry { color: #9ca3af; font-size: 13px; margin-top: 8px; }
              .footer { background: #f9fafb; padding: 20px 40px; text-align: center; border-top: 1px solid #e5e7eb; }
              .footer p { color: #9ca3af; font-size: 12px; margin: 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✅ TaskFlow</h1>
                <p>Email Verification</p>
              </div>
              <div class="body">
                <p>Hi <strong>${name}</strong>,</p>
                <p>Welcome to <strong>TaskFlow</strong>! Please use the OTP below to verify your email address and activate your account.</p>
                <div class="otp-box">
                  <div class="otp-code">${otp}</div>
                  <p class="expiry">⏱ This code expires in <strong>10 minutes</strong></p>
                </div>
                <p>If you did not create an account, please ignore this email.</p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} TaskFlow. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent successfully to ${to}`);
  } catch (error) {
    console.error('❌ Failed to send OTP email via SMTP:', error.message);
    console.log('\n' + '═'.repeat(60));
    console.log('📬  [SMTP FALLBACK] OTP DETAILS');
    console.log(`To:        ${to}`);
    console.log(`Name:      ${name}`);
    console.log(`OTP Code:  ⚡️  ${otp}  ⚡️`);
    console.log(`Expiry:    ⏱  10 minutes`);
    console.log('═'.repeat(60) + '\n');
    // Note: Do not rethrow the error, allowing local signup to succeed even if network/SMTP fails.
  }
};

/**
 * Send contact form confirmation email
 * @param {string} to - Sender's email
 * @param {string} name - Sender's name
 * @param {string} message - Original message content
 */
const sendContactConfirmationEmail = async (to, name, message) => {
  const isMock = isMockEmailConfig();

  if (isMock) {
    console.log('\n' + '═'.repeat(60));
    console.log('📬  [SMTP MOCK] CONTACT FORM SUBMISSION (Credentials Not Configured)');
    console.log(`From:      ${name} (${to})`);
    console.log(`Message:   "${message}"`);
    console.log('═'.repeat(60) + '\n');
    return;
  }

  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"TaskFlow Support" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'We received your message – TaskFlow',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <style>
              body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f6fb; margin: 0; padding: 0; }
              .container { max-width: 520px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
              .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 36px 40px; text-align: center; }
              .header h1 { color: #fff; margin: 0; font-size: 26px; }
              .body { padding: 36px 40px; }
              .body p { color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 16px; }
              .message-box { background: #f9fafb; border-left: 4px solid #6366f1; border-radius: 6px; padding: 16px 20px; margin: 16px 0; color: #4b5563; font-style: italic; }
              .footer { background: #f9fafb; padding: 20px 40px; text-align: center; border-top: 1px solid #e5e7eb; }
              .footer p { color: #9ca3af; font-size: 12px; margin: 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>📬 TaskFlow</h1>
              </div>
              <div class="body">
                <p>Hi <strong>${name}</strong>,</p>
                <p>Thank you for reaching out! We've received your message and will get back to you within 24–48 hours.</p>
                <p><strong>Your message:</strong></p>
                <div class="message-box">${message}</div>
                <p>In the meantime, feel free to explore TaskFlow and manage your tasks.</p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} TaskFlow. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Also notify the admin
    const adminMail = {
      from: `"TaskFlow Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Submission from ${name}`,
      html: `<p><strong>From:</strong> ${name} (${to})</p><p><strong>Message:</strong></p><p>${message}</p>`,
    };
    await transporter.sendMail(adminMail);
    console.log(`✅ Contact confirmation email sent successfully to ${to}`);
  } catch (error) {
    console.error('❌ Failed to send contact confirmation email via SMTP:', error.message);
    console.log('\n' + '═'.repeat(60));
    console.log('📬  [SMTP FALLBACK] CONTACT FORM SUBMISSION');
    console.log(`From:      ${name} (${to})`);
    console.log(`Message:   "${message}"`);
    console.log('═'.repeat(60) + '\n');
    // Note: Do not rethrow the error, allowing contact form submissions to succeed locally.
  }
};

module.exports = { sendOTPEmail, sendContactConfirmationEmail, isMockEmailConfig };