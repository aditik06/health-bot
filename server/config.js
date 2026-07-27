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

module.exports = {
  DATA_DIR,
  JWT_SECRET: loadOrCreateSecret(),
  PORT: process.env.PORT || 3000,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || null,
  ANTHROPIC_CHAT_MODEL: process.env.ANTHROPIC_CHAT_MODEL || 'claude-opus-5'
};
