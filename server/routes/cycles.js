const express = require('express');
const db = require('../db');
const { authRequired } = require('../middleware/auth');
const { cycleLogToJson } = require('../serializers');

const router = express.Router();
router.use(authRequired);

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM cycle_logs WHERE user_id = ? ORDER BY start_date ASC').all(req.userId);
  res.json(rows.map(cycleLogToJson));
});

router.post('/', (req, res) => {
  const { startDate, length } = req.body;
  if (!startDate) return res.status(400).json({ error: 'startDate is required' });

  const info = db.prepare('INSERT INTO cycle_logs (user_id, start_date, length) VALUES (?, ?, ?)')
    .run(req.userId, startDate, length || null);

  const row = db.prepare('SELECT * FROM cycle_logs WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(cycleLogToJson(row));
});

router.delete('/:id', (req, res) => {
  const info = db.prepare('DELETE FROM cycle_logs WHERE id = ? AND user_id = ?').run(req.params.id, req.userId);
  if (info.changes === 0) return res.status(404).json({ error: 'Not found' });
  res.status(204).end();
});

module.exports = router;
