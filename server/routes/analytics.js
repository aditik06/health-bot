const express = require('express');
const db = require('../db');
const { authRequired } = require('../middleware/auth');

const router = express.Router();
router.use(authRequired);

// Allowlist of trackable events. An unknown event name is rejected rather than
// stored, so a compromised or buggy client can't turn this into a free-text
// sink for arbitrary data.
const ALLOWED_EVENTS = new Set([
  'view_overview',
  'view_chat',
  'view_calendar',
  'view_medication',
  'view_diary',
  'view_pregnancy',
  'view_kicks',
  'view_contractions',
  'view_diet',
  'view_appointments',
  'view_emergency',
  'view_resources',
  'view_settings',
  'log_period',
  'log_medication_taken',
  'log_diary_entry',
  'log_weight',
  'log_kick',
  'log_contraction',
  'add_appointment',
  'add_medication',
  'upload_prescription',
  'send_chat_message',
  'use_voice_input',
  'predict_cycle',
  'export_data',
  'toggle_dark_mode'
]);

router.post('/', (req, res) => {
  const { event } = req.body;

  if (!event || !ALLOWED_EVENTS.has(event)) {
    return res.status(400).json({ error: 'Unknown event' });
  }

  db.prepare('INSERT INTO analytics_events (user_id, event) VALUES (?, ?)').run(req.userId, event);
  res.status(204).end();
});

// Aggregate feature usage across all users. Returns counts only - never
// per-user rows - so this can't be used to inspect an individual's activity.
router.get('/summary', (req, res) => {
  const days = Math.min(parseInt(req.query.days) || 30, 365);
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const rows = db.prepare(`
    SELECT event,
           COUNT(*) AS total,
           COUNT(DISTINCT user_id) AS unique_users
    FROM analytics_events
    WHERE created_at >= ?
    GROUP BY event
    ORDER BY total DESC
  `).all(since);

  res.json({
    periodDays: days,
    events: rows.map(r => ({ event: r.event, total: r.total, uniqueUsers: r.unique_users }))
  });
});

module.exports = router;
