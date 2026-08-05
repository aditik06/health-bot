const path = require('path');
const { DatabaseSync } = require('node:sqlite');
const { DATA_DIR } = require('./config');

const db = new DatabaseSync(path.join(DATA_DIR, 'data.sqlite'));
db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  age INTEGER,
  cycle_start_date TEXT,
  cycle_length INTEGER DEFAULT 28,
  pregnancy_status TEXT DEFAULT 'not-pregnant',
  pregnancy_start_date TEXT,
  doctor_name TEXT,
  doctor_phone TEXT,
  hospital_name TEXT,
  hospital_phone TEXT,
  emergency_contact TEXT,
  emergency_phone TEXT,
  dark_mode INTEGER DEFAULT 0,
  dietary_notes TEXT,
  email_verified INTEGER DEFAULT 0,
  verification_token TEXT,
  verification_token_expires TEXT,
  created_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS appointments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  time TEXT,
  type TEXT,
  doctor TEXT,
  notes TEXT,
  reminder INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS medications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dosage TEXT,
  frequency TEXT,
  time TEXT,
  purpose TEXT,
  notes TEXT,
  active INTEGER DEFAULT 1,
  reminder INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS medication_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  medication_id INTEGER NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
  taken_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS prescriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  mime_type TEXT,
  file_path TEXT NOT NULL,
  uploaded_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS diary_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  mood TEXT,
  energy INTEGER,
  title TEXT,
  content TEXT,
  symptoms TEXT,
  tags TEXT,
  created_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS weight_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  weight REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS kick_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  kicks_json TEXT DEFAULT '[]',
  started_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS contraction_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_time TEXT NOT NULL,
  end_time TEXT,
  duration_sec INTEGER
);

CREATE TABLE IF NOT EXISTS cycle_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_date TEXT NOT NULL,
  length INTEGER
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

-- Feature-usage counters only. Deliberately stores no free-text, no health
-- values, and no request metadata (IP, user agent) - just which feature was
-- used and when, so we can tell what people actually use.
CREATE TABLE IF NOT EXISTS analytics_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event TEXT NOT NULL,
  created_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_analytics_event ON analytics_events(event);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at);
`);

// CREATE TABLE IF NOT EXISTS only helps on a fresh database - it does nothing
// for columns added to the schema after a database already exists (e.g. an
// already-deployed instance). Add any such columns here, guarded by a check
// against the live schema so this stays a no-op once they're present.
const userColumns = new Set(db.prepare('PRAGMA table_info(users)').all().map((c) => c.name));
const userMigrations = [
  ['email_verified', "ALTER TABLE users ADD COLUMN email_verified INTEGER DEFAULT 0"],
  ['verification_token', "ALTER TABLE users ADD COLUMN verification_token TEXT"],
  ['verification_token_expires', "ALTER TABLE users ADD COLUMN verification_token_expires TEXT"]
];
for (const [column, statement] of userMigrations) {
  if (!userColumns.has(column)) db.exec(statement);
}

module.exports = db;
