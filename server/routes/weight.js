const express = require('express');
const db = require('../db');
const { authRequired } = require('../middleware/auth');
const { weightToJson } = require('../serializers');

const router = express.Router();
router.use(authRequired);

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM weight_logs WHERE user_id = ? ORDER BY date ASC').all(req.userId);
  res.json(rows.map(weightToJson));
});

router.post('/', (req, res) => {
  const { date, weight } = req.body;
  if (!date || weight === undefined) return res.status(400).json({ error: 'date and weight are required' });

  const info = db.prepare('INSERT INTO weight_logs (user_id, date, weight) VALUES (?, ?, ?)')
    .run(req.userId, date, weight);

  const row = db.prepare('SELECT * FROM weight_logs WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(weightToJson(row));
});

router.delete('/:id', (req, res) => {
  const info = db.prepare('DELETE FROM weight_logs WHERE id = ? AND user_id = ?').run(req.params.id, req.userId);
  if (info.changes === 0) return res.status(404).json({ error: 'Not found' });
  res.status(204).end();
});

module.exports = router;
