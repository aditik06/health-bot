const path = require('path');
const express = require('express');
const cors = require('cors');
const { PORT } = require('./config');

const db = require('./db'); // ensures schema is created on boot

const app = express();

app.use(cors());
app.use(express.json());

// Health check for uptime monitoring and hosting platform probes.
// Verifies DB connectivity rather than just returning 200 blindly.
app.get('/health', (req, res) => {
  try {
    db.prepare('SELECT 1').get();
    res.json({ status: 'ok', uptime: process.uptime() });
  } catch (err) {
    res.status(503).json({ status: 'unavailable', error: 'database unreachable' });
  }
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/medications', require('./routes/medications'));
app.use('/api/prescriptions', require('./routes/prescriptions'));
app.use('/api/diary', require('./routes/diary'));
app.use('/api/weight', require('./routes/weight'));
app.use('/api/kicks', require('./routes/kicks'));
app.use('/api/contractions', require('./routes/contractions'));
app.use('/api/cycles', require('./routes/cycles'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/analytics', require('./routes/analytics'));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

const CLIENT_DIR = path.join(__dirname, '..', 'client');
app.use(express.static(CLIENT_DIR));
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(CLIENT_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Women's Health Tracker running at http://localhost:${PORT}`);
});
