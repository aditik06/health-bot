const express = require('express');
const db = require('../db');
const { authRequired } = require('../middleware/auth');
const { diaryToJson } = require('../serializers');

const router = express.Router();
router.use(authRequired);

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM diary_entries WHERE user_id = ? ORDER BY date DESC').all(req.userId);
  res.json(rows.map(diaryToJson));
});

router.post('/', (req, res) => {
  const { date, mood, energy, title, content, symptoms, tags } = req.body;
  if (!date || !mood) return res.status(400).json({ error: 'date and mood are required' });

  const info = db.prepare(`
    INSERT INTO diary_entries (user_id, date, mood, energy, title, content, symptoms, tags)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    req.userId, date, mood, energy || null, title || null, content || null,
    JSON.stringify(symptoms || []), JSON.stringify(tags || [])
  );

  const row = db.prepare('SELECT * FROM diary_entries WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(diaryToJson(row));
});

router.delete('/:id', (req, res) => {
  const info = db.prepare('DELETE FROM diary_entries WHERE id = ? AND user_id = ?').run(req.params.id, req.userId);
  if (info.changes === 0) return res.status(404).json({ error: 'Not found' });
  res.status(204).end();
});

module.exports = router;
