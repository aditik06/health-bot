const crypto = require('crypto');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { JWT_SECRET, EMAIL_ENABLED } = require('../config');
const { userToJson } = require('../serializers');
const { sendVerificationEmail } = require('../mailer');
const { validateProfile, validateEmail, validatePassword } = require('../validate');

const router = express.Router();

const VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// Emails are identity, so they're compared case-insensitively and without
// stray whitespace - phone keyboards capitalise the first letter and
// autocomplete appends spaces, and "Aditi@x.com" must not be a different
// person from "aditi@x.com".
function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

// lower(email) rather than a plain equality so accounts created before this
// normalisation (stored in whatever case they were typed) still match.
function findUserByEmail(email) {
  return db.prepare('SELECT * FROM users WHERE lower(email) = ?').get(normalizeEmail(email));
}

function issueVerificationToken(userId, email, name) {
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + VERIFICATION_TTL_MS).toISOString();
  db.prepare('UPDATE users SET verification_token = ?, verification_token_expires = ? WHERE id = ?')
    .run(token, expires, userId);
  sendVerificationEmail({ to: email, name, token }).catch((err) => {
    console.error('sendVerificationEmail failed:', err.message);
  });
}

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }

  const inputError = validateEmail(email) || validatePassword(password);
  if (inputError) return res.status(400).json({ error: inputError });

  // Same rules as editing a profile, so registration can't store values the
  // profile editor would refuse (negative cycle length, "banana" status...).
  const { values: profile, error: profileError } = validateProfile(req.body);
  if (profileError) return res.status(400).json({ error: profileError });

  const existing = findUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  // Without a mail server configured there's no way to deliver a
  // verification link, so don't lock people out of an app that just told
  // them registration succeeded - auto-verify instead (matches how the AI
  // chat degrades gracefully without an API key).
  const info = db.prepare(`
    INSERT INTO users (
      name, email, password_hash, age, cycle_start_date, cycle_length,
      pregnancy_status, pregnancy_start_date, doctor_name, doctor_phone,
      emergency_contact, emergency_phone, email_verified
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    profile.name, normalizeEmail(email), passwordHash, profile.age ?? null, profile.cycleStartDate ?? null,
    profile.cycleLength ?? 28, profile.pregnancyStatus ?? 'not-pregnant', profile.pregnancyStartDate ?? null,
    profile.doctorName ?? null, profile.doctorPhone ?? null,
    profile.emergencyContact ?? null, profile.emergencyPhone ?? null,
    EMAIL_ENABLED ? 0 : 1
  );

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid);

  if (EMAIL_ENABLED) {
    issueVerificationToken(user.id, user.email, user.name);
    return res.status(201).json({
      requiresVerification: true,
      message: 'Account created. Check your email for a verification link before logging in.'
    });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });
  res.status(201).json({ token, user: userToJson(user) });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Email and password must be text' });
  }

  const user = findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  if (EMAIL_ENABLED && !user.email_verified) {
    return res.status(403).json({
      error: 'Please verify your email before logging in.',
      requiresVerification: true
    });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, user: userToJson(user) });
});

// Clicked from the email, so this is a plain browser navigation, not a
// fetch() call - respond by redirecting back to the login page with a
// query flag the frontend reads to show a banner.
router.get('/verify', (req, res) => {
  const { token } = req.query;
  if (!token) return res.redirect('/login?verified=0');

  const user = db.prepare('SELECT * FROM users WHERE verification_token = ?').get(token);
  if (!user) return res.redirect('/login?verified=0');

  if (!user.verification_token_expires || new Date(user.verification_token_expires) < new Date()) {
    return res.redirect('/login?verified=0&reason=expired');
  }

  db.prepare('UPDATE users SET email_verified = 1, verification_token = NULL, verification_token_expires = NULL WHERE id = ?')
    .run(user.id);

  res.redirect('/login?verified=1');
});

router.post('/resend-verification', (req, res) => {
  const { email } = req.body;

  // Always the same response either way - confirming or denying an email is
  // registered is its own small information leak.
  const genericResponse = { message: "If that account needs verification, we've sent a new email." };

  if (!EMAIL_ENABLED || !email || typeof email !== 'string') return res.json(genericResponse);

  const user = findUserByEmail(email);
  if (user && !user.email_verified) {
    issueVerificationToken(user.id, user.email, user.name);
  }

  res.json(genericResponse);
});

module.exports = router;
