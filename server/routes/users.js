const express = require('express');
const db = require('../db');
const { authRequired } = require('../middleware/auth');
const { userToJson } = require('../serializers');

const router = express.Router();
router.use(authRequired);

const EDITABLE_FIELDS = {
  name: 'name',
  age: 'age',
  cycleStartDate: 'cycle_start_date',
  cycleLength: 'cycle_length',
  pregnancyStatus: 'pregnancy_status',
  pregnancyStartDate: 'pregnancy_start_date',
  doctorName: 'doctor_name',
  doctorPhone: 'doctor_phone',
  hospitalName: 'hospital_name',
  hospitalPhone: 'hospital_phone',
  emergencyContact: 'emergency_contact',
  emergencyPhone: 'emergency_phone',
  darkMode: 'dark_mode',
  dietaryNotes: 'dietary_notes'
};

router.get('/me', (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(userToJson(user));
});

router.put('/me', (req, res) => {
  const updates = [];
  const values = [];

  for (const [jsKey, column] of Object.entries(EDITABLE_FIELDS)) {
    if (Object.prototype.hasOwnProperty.call(req.body, jsKey)) {
      updates.push(`${column} = ?`);
      let value = req.body[jsKey];
      if (jsKey === 'darkMode') value = value ? 1 : 0;
      values.push(value);
    }
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }

  values.push(req.userId);
  db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...values);

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId);
  res.json(userToJson(user));
});

router.delete('/me', (req, res) => {
  db.prepare('DELETE FROM users WHERE id = ?').run(req.userId);
  res.status(204).end();
});

module.exports = router;
