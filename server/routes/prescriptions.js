const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const db = require('../db');
const { authRequired } = require('../middleware/auth');
const { prescriptionToJson } = require('../serializers');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const safeExt = path.extname(file.originalname).slice(0, 10);
    cb(null, `${req.userId}-${Date.now()}${safeExt}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

const router = express.Router();
router.use(authRequired);

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM prescriptions WHERE user_id = ? ORDER BY uploaded_at DESC').all(req.userId);
  res.json(rows.map(prescriptionToJson));
});

router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const info = db.prepare(`
    INSERT INTO prescriptions (user_id, filename, mime_type, file_path)
    VALUES (?, ?, ?, ?)
  `).run(req.userId, req.file.originalname, req.file.mimetype, req.file.filename);

  const row = db.prepare('SELECT * FROM prescriptions WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(prescriptionToJson(row));
});

router.get('/:id/file', (req, res) => {
  const row = db.prepare('SELECT * FROM prescriptions WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.sendFile(path.join(UPLOAD_DIR, row.file_path));
});

router.delete('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM prescriptions WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!row) return res.status(404).json({ error: 'Not found' });

  db.prepare('DELETE FROM prescriptions WHERE id = ?').run(row.id);
  fs.unlink(path.join(UPLOAD_DIR, row.file_path), () => {});
  res.status(204).end();
});

module.exports = router;
