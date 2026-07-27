const express = require('express');
const db = require('../db');
const { authRequired } = require('../middleware/auth');
const { contractionToJson } = require('../serializers');

const router = express.Router();
router.use(authRequired);

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM contraction_logs WHERE user_id = ? ORDER BY start_time DESC').all(req.userId);
  res.json(rows.map(contractionToJson));
});

router.post('/', (req, res) => {
  const { startTime, endTime, durationSec } = req.body;
  if (!startTime) return res.status(400).json({ error: 'startTime is required' });

  const info = db.prepare(`
    INSERT INTO contraction_logs (user_id, start_time, end_time, duration_sec)
    VALUES (?, ?, ?, ?)
  `).run(req.userId, startTime, endTime || null, durationSec || null);

  const row = db.prepare('SELECT * FROM contraction_logs WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(contractionToJson(row));
});

router.delete('/', (req, res) => {
  db.prepare('DELETE FROM contraction_logs WHERE user_id = ?').run(req.userId);
  res.status(204).end();
});

router.delete('/:id', (req, res) => {
  const info = db.prepare('DELETE FROM contraction_logs WHERE id = ? AND user_id = ?').run(req.params.id, req.userId);
  if (info.changes === 0) return res.status(404).json({ error: 'Not found' });
  res.status(204).end();
});

module.exports = router;
