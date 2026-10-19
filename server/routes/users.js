const fs = require('fs');
const path = require('path');
const express = require('express');
const db = require('../db');
const { UPLOAD_DIR } = require('../config');
const { authRequired } = require('../middleware/auth');
const { userToJson } = require('../serializers');
const { validateProfile } = require('../validate');

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
  const { values: profile, error } = validateProfile(req.body || {});
  if (error) return res.status(400).json({ error });

  const updates = [];
  const values = [];

  for (const [jsKey, column] of Object.entries(EDITABLE_FIELDS)) {
    if (Object.prototype.hasOwnProperty.call(profile, jsKey)) {
      updates.push(`${column} = ?`);
      values.push(jsKey === 'darkMode' ? (profile[jsKey] ? 1 : 0) : profile[jsKey]);
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
  // The DB rows cascade away with the user, but the uploaded prescription
  // files don't - collect their names first, or "delete my account" would
  // leave someone's medical documents sitting on disk.
  const files = db.prepare('SELECT file_path FROM prescriptions WHERE user_id = ?').all(req.userId);

  db.prepare('DELETE FROM users WHERE id = ?').run(req.userId);

  for (const { file_path } of files) {
    fs.unlink(path.join(UPLOAD_DIR, file_path), (err) => {
      if (err && err.code !== 'ENOENT') console.error('Could not remove uploaded file:', err.message);
    });
  }

  res.status(204).end();
});

module.exports = router;
