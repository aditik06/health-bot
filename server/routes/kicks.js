const express = require('express');
const db = require('../db');
const { authRequired } = require('../middleware/auth');
const { kickSessionToJson } = require('../serializers');

const router = express.Router();
router.use(authRequired);

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM kick_sessions WHERE user_id = ? ORDER BY started_at DESC').all(req.userId);
  res.json(rows.map(kickSessionToJson));
});

// Creates a new session (multiple sessions per day are allowed)
router.post('/', (req, res) => {
  const { date } = req.body;
  if (!date) return res.status(400).json({ error: 'date is required' });

  const info = db.prepare("INSERT INTO kick_sessions (user_id, date, kicks_json) VALUES (?, ?, '[]')")
    .run(req.userId, date);

  const row = db.prepare('SELECT * FROM kick_sessions WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(kickSessionToJson(row));
});

// Records one kick against a session
router.post('/:id/kick', (req, res) => {
  const session = db.prepare('SELECT * FROM kick_sessions WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!session) return res.status(404).json({ error: 'Not found' });

  const kicks = JSON.parse(session.kicks_json || '[]');
  kicks.push(new Date().toISOString());

  db.prepare('UPDATE kick_sessions SET kicks_json = ? WHERE id = ?').run(JSON.stringify(kicks), session.id);

  const row = db.prepare('SELECT * FROM kick_sessions WHERE id = ?').get(session.id);
  res.json(kickSessionToJson(row));
});

router.delete('/:id', (req, res) => {
  const info = db.prepare('DELETE FROM kick_sessions WHERE id = ? AND user_id = ?').run(req.params.id, req.userId);
  if (info.changes === 0) return res.status(404).json({ error: 'Not found' });
  res.status(204).end();
});

module.exports = router;
