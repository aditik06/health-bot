const express = require('express');
const db = require('../db');
const { authRequired } = require('../middleware/auth');
const { appointmentToJson } = require('../serializers');

const router = express.Router();
router.use(authRequired);

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM appointments WHERE user_id = ? ORDER BY date ASC').all(req.userId);
  res.json(rows.map(appointmentToJson));
});

router.post('/', (req, res) => {
  const { date, time, type, doctor, notes, reminder } = req.body;
  if (!date) return res.status(400).json({ error: 'date is required' });

  const info = db.prepare(`
    INSERT INTO appointments (user_id, date, time, type, doctor, notes, reminder)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(req.userId, date, time || null, type || null, doctor || null, notes || null, reminder ? 1 : 0);

  const row = db.prepare('SELECT * FROM appointments WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(appointmentToJson(row));
});

router.delete('/:id', (req, res) => {
  const info = db.prepare('DELETE FROM appointments WHERE id = ? AND user_id = ?').run(req.params.id, req.userId);
  if (info.changes === 0) return res.status(404).json({ error: 'Not found' });
  res.status(204).end();
});

module.exports = router;
