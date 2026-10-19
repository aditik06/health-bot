const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const db = require('../db');
const { authRequired } = require('../middleware/auth');
const { prescriptionToJson } = require('../serializers');
const { UPLOAD_DIR } = require('../config');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const safeExt = path.extname(file.originalname).slice(0, 10);
    cb(null, `${req.userId}-${Date.now()}${safeExt}`);
  }
});

// Prescriptions are photos or scans. Anything else (notably .html/.svg, which
// a browser would run as a page when opened) is refused. Both the declared
// MIME type and the extension must agree, since each is client-supplied.
const ALLOWED_UPLOADS = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/gif': ['.gif'],
  'application/pdf': ['.pdf']
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExts = ALLOWED_UPLOADS[file.mimetype];
    if (allowedExts && allowedExts.includes(ext)) return cb(null, true);
    cb(Object.assign(new Error('Only JPG, PNG, WebP, GIF or PDF files can be uploaded'), { status: 400 }));
  }
});

// multer reports its own failures as plain Errors, which would surface as a
// generic 500 - translate them into something the client can show.
function handleUpload(req, res, next) {
  upload.single('file')(req, res, (err) => {
    if (!err) return next();
    if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: 'That file is too large (10MB max)' });
    res.status(err.status || 400).json({ error: err.message });
  });
}

const router = express.Router();
router.use(authRequired);

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM prescriptions WHERE user_id = ? ORDER BY uploaded_at DESC').all(req.userId);
  res.json(rows.map(prescriptionToJson));
});

router.post('/', handleUpload, (req, res) => {
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

  // Files uploaded before the allowlist existed may be any type: serve those
  // as an opaque download rather than letting the browser render them.
  const safeType = ALLOWED_UPLOADS[row.mime_type];
  res.set('X-Content-Type-Options', 'nosniff');
  if (safeType) {
    res.type(row.mime_type);
  } else {
    res.type('application/octet-stream');
    res.set('Content-Disposition', 'attachment');
  }
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
