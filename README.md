# Women's Health & Pregnancy Tracker

A full-stack web app for tracking menstrual cycles, pregnancy, and day-to-day health — with a real backend, not just browser storage.

## Features

**Cycle & pregnancy**
- Dashboard with cycle day/phase or pregnancy week, next appointment, and daily insights
- Interactive calendar with period, fertile window, and ovulation days, plus predictions based on your logged cycle history
- Pregnancy tracker with due date, baby size, weekly development, weight tracking, and milestones
- Kick counter and contraction timer for late pregnancy

**Health tracking**
- Medication tracker with prescription upload and daily dose reminders
- Mood & symptom diary with filtering and a weekly mood chart
- Personalized diet and exercise recommendations by cycle phase or trimester, plus your own dietary notes
- Appointment scheduling and emergency contacts

**AI companion**
- Chat with an AI assistant (Claude) for health questions or just to talk, with conversation history saved per account
- Voice input on longer text fields via the browser's built-in speech recognition

**Resources**
- Curated parenting books and links to real, verified support organizations (Postpartum Support International, La Leche League, and others)

**Account & appearance**
- Real accounts with hashed passwords and JWT auth — your data lives in a database, not `localStorage`
- Light and dark themes, data export/import, and account deletion

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org) 22.5 or later (for the built-in `node:sqlite` module)

### Setup

```bash
cd server
npm install
npm start
```

Open `http://localhost:3000` and register an account. The server serves the frontend and the API from one process; a SQLite database is created automatically at `server/data.sqlite` on first run.

### Enabling the AI companion (optional)

The chat feature needs an Anthropic API key. Copy the example env file and add your key:

```bash
cp server/.env.example server/.env
```

Then edit `server/.env`:

```
ANTHROPIC_API_KEY=your-key-here
```

Get a key at [console.anthropic.com](https://console.anthropic.com/). Without it, the rest of the app works normally — the chat tab just shows a message explaining it isn't configured.

## Project Structure

```
client/                 Static frontend
├── index.html          Login / registration
├── dashboard.html       Main app
├── css/style.css
└── js/
    ├── api.js           Fetch wrapper with auth
    ├── app.js            Core dashboard logic
    ├── calendar.js       Cycle calendar
    ├── pregnancy.js       Pregnancy tracker
    ├── features.js        Medications, diary, kicks, contractions
    ├── chat.js             AI companion
    ├── speech.js           Voice-to-text
    └── data.js             Static content (quotes, books, diet plans)

server/                 Express API + SQLite
├── server.js            Entry point
├── db.js                 Schema
├── config.js              Env / secrets
├── middleware/auth.js       JWT auth
├── serializers.js            DB row → API JSON
└── routes/                    One file per resource
```

## Environment Variables

All optional except the AI key, which only gates the chat feature.

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `3000` | Server port |
| `JWT_SECRET` | auto-generated, stored in `server/.jwt_secret` | Signs auth tokens |
| `ANTHROPIC_API_KEY` | none | Enables the AI companion chat |
| `ANTHROPIC_CHAT_MODEL` | `claude-opus-5` | Model used for chat |

## Tech Stack

- **Frontend** — HTML, CSS, vanilla JavaScript
- **Backend** — Node.js, Express
- **Database** — SQLite via the built-in `node:sqlite` module
- **Auth** — bcrypt password hashing, JWT sessions
- **AI** — Claude API (`@anthropic-ai/sdk`)
