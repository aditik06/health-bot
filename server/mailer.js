const nodemailer = require('nodemailer');
const { EMAIL_ENABLED, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, APP_URL } = require('./config');

const transporter = EMAIL_ENABLED
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS }
    })
  : null;

if (!EMAIL_ENABLED) {
  console.warn(
    'Email is not configured (SMTP_HOST/SMTP_USER/SMTP_PASS) - accounts are ' +
    'auto-verified and verification links are only logged to the console.'
  );
}

function verificationLink(token) {
  return `${APP_URL}/api/auth/verify?token=${encodeURIComponent(token)}`;
}

async function sendVerificationEmail({ to, name, token }) {
  const link = verificationLink(token);

  if (!transporter) {
    // Dev fallback so the flow is still usable without real SMTP creds.
    console.log(`[email] Verification link for ${to}: ${link}`);
    return;
  }

  try {
    await transporter.sendMail({
      from: SMTP_FROM,
      to,
      subject: 'Verify your email - Bloom',
      text: `Hi ${name},\n\nConfirm your email to finish setting up your account:\n${link}\n\nThis link expires in 24 hours. If you didn't sign up, you can ignore this email.`,
      html: `<p>Hi ${name},</p><p>Confirm your email to finish setting up your account:</p><p><a href="${link}">${link}</a></p><p>This link expires in 24 hours. If you didn't sign up, you can ignore this email.</p>`
    });
  } catch (err) {
    // Don't let a flaky mail provider break registration - the user can
    // always ask for the email again via the resend endpoint.
    console.error('Failed to send verification email:', err.message);
  }
}

module.exports = { sendVerificationEmail };
