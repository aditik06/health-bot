const fs = require('fs');
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
const LANDING_DIR = path.join(CLIENT_DIR, 'landing');
const AUTH_PAGE = path.join(CLIENT_DIR, 'index.html');

// The marketing landing page is the front door. It's a built React bundle, so
// it only exists after `npm run build --prefix web`; fall back to the auth page
// rather than 404ing a fresh checkout that hasn't built the frontend yet.
const hasLanding = fs.existsSync(path.join(LANDING_DIR, 'index.html'));
if (!hasLanding) {
  console.warn('Landing page not built - serving the app at /. Run: npm run build --prefix web');
}

app.get('/', (req, res) => {
  res.sendFile(hasLanding ? path.join(LANDING_DIR, 'index.html') : AUTH_PAGE);
});

// Friendly alias for the auth screen; '#register' opens the sign-up tab.
app.get('/login', (req, res) => res.sendFile(AUTH_PAGE));

app.use('/landing', express.static(LANDING_DIR));
app.use(express.static(CLIENT_DIR));

// Anything else that isn't an API call falls through to the app shell, so
// deep links and refreshes keep working.
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(AUTH_PAGE);
});

app.listen(PORT, () => {
  console.log(`Bloom running at http://localhost:${PORT}`);
});
