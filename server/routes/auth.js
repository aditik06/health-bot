const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { JWT_SECRET } = require('../config');
const { userToJson } = require('../serializers');

const router = express.Router();

router.post('/register', async (req, res) => {
  const {
    name, email, password, age,
    cycleStartDate, cycleLength,
    pregnancyStatus, pregnancyStartDate,
    doctorName, doctorPhone,
    emergencyContact, emergencyPhone
  } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const info = db.prepare(`
    INSERT INTO users (
      name, email, password_hash, age, cycle_start_date, cycle_length,
      pregnancy_status, pregnancy_start_date, doctor_name, doctor_phone,
      emergency_contact, emergency_phone
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    name, email, passwordHash, age || null, cycleStartDate || null,
    cycleLength || 28, pregnancyStatus || 'not-pregnant', pregnancyStartDate || null,
    doctorName || null, doctorPhone || null, emergencyContact || null, emergencyPhone || null
  );

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid);
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });

  res.status(201).json({ token, user: userToJson(user) });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, user: userToJson(user) });
});

module.exports = router;
