const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

require('dotenv').config({ path: path.join(__dirname, '.env') });

// Where the SQLite database and uploaded files live. In production this must
// point at a persistent disk (see render.yaml) or both are lost on restart.
// Defaults to the server directory for local development.
const DATA_DIR = process.env.DATA_DIR || __dirname;
fs.mkdirSync(DATA_DIR, { recursive: true });

const SECRET_FILE = path.join(DATA_DIR, '.jwt_secret');

function loadOrCreateSecret() {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;

  if (fs.existsSync(SECRET_FILE)) {
    return fs.readFileSync(SECRET_FILE, 'utf8').trim();
  }

  const secret = crypto.randomBytes(48).toString('hex');
  fs.writeFileSync(SECRET_FILE, secret, 'utf8');
  return secret;
}

const PORT = process.env.PORT || 3000;

// Email verification needs a real mail transport to send anything. Without
// one configured, gating login on a link we can never deliver would just
// lock every user out - so verification is only enforced when all three of
// these are set (see server/mailer.js).
const SMTP_HOST = process.env.SMTP_HOST || null;
const SMTP_PORT = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
const SMTP_USER = process.env.SMTP_USER || null;
const SMTP_PASS = process.env.SMTP_PASS || null;
const SMTP_FROM = process.env.SMTP_FROM || SMTP_USER;
const EMAIL_ENABLED = !!(SMTP_HOST && SMTP_USER && SMTP_PASS);

// Base URL used to build the link in verification emails.
const APP_URL = (process.env.APP_URL || `http://localhost:${PORT}`).replace(/\/$/, '');

module.exports = {
  DATA_DIR,
  JWT_SECRET: loadOrCreateSecret(),
  PORT,
  APP_URL,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || null,
  ANTHROPIC_CHAT_MODEL: process.env.ANTHROPIC_CHAT_MODEL || 'claude-opus-5',
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
  EMAIL_ENABLED
};
