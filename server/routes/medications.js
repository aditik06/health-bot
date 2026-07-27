const express = require('express');
const db = require('../db');
const { authRequired } = require('../middleware/auth');
const { medicationToJson } = require('../serializers');

const router = express.Router();
router.use(authRequired);

function ownedMedication(id, userId) {
  return db.prepare('SELECT * FROM medications WHERE id = ? AND user_id = ?').get(id, userId);
}

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM medications WHERE user_id = ? ORDER BY time ASC').all(req.userId);
  res.json(rows.map(medicationToJson));
});

router.post('/', (req, res) => {
  const { name, dosage, frequency, time, purpose, notes, reminder } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });

  const info = db.prepare(`
    INSERT INTO medications (user_id, name, dosage, frequency, time, purpose, notes, reminder)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(req.userId, name, dosage || null, frequency || null, time || null, purpose || null, notes || null, reminder ? 1 : 0);

  const row = db.prepare('SELECT * FROM medications WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(medicationToJson(row));
});

router.put('/:id', (req, res) => {
  const med = ownedMedication(req.params.id, req.userId);
  if (!med) return res.status(404).json({ error: 'Not found' });

  const { name, dosage, frequency, time, purpose, notes, active, reminder } = req.body;
  db.prepare(`
    UPDATE medications SET
      name = COALESCE(?, name),
      dosage = COALESCE(?, dosage),
      frequency = COALESCE(?, frequency),
      time = COALESCE(?, time),
      purpose = COALESCE(?, purpose),
      notes = COALESCE(?, notes),
      active = ?,
      reminder = ?
    WHERE id = ?
  `).run(
    name ?? null, dosage ?? null, frequency ?? null, time ?? null, purpose ?? null, notes ?? null,
    active !== undefined ? (active ? 1 : 0) : med.active,
    reminder !== undefined ? (reminder ? 1 : 0) : med.reminder,
    med.id
  );

  const row = db.prepare('SELECT * FROM medications WHERE id = ?').get(med.id);
  res.json(medicationToJson(row));
});

router.delete('/:id', (req, res) => {
  const info = db.prepare('DELETE FROM medications WHERE id = ? AND user_id = ?').run(req.params.id, req.userId);
  if (info.changes === 0) return res.status(404).json({ error: 'Not found' });
  res.status(204).end();
});

// Log a dose as taken
router.post('/:id/log', (req, res) => {
  const med = ownedMedication(req.params.id, req.userId);
  if (!med) return res.status(404).json({ error: 'Not found' });

  db.prepare('INSERT INTO medication_logs (medication_id) VALUES (?)').run(med.id);
  res.status(201).json({ ok: true });
});

// Logs for today, across all of the user's medications (for the "today's meds" widget)
router.get('/logs/today', (req, res) => {
  const rows = db.prepare(`
    SELECT ml.medication_id, ml.taken_at
    FROM medication_logs ml
    JOIN medications m ON m.id = ml.medication_id
    WHERE m.user_id = ? AND date(ml.taken_at) = date('now')
  `).all(req.userId);
  res.json(rows.map(r => ({ medicationId: r.medication_id, takenAt: r.taken_at })));
});

module.exports = router;
