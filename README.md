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

## Usage Analytics

The app records which features get used, to guide what to build next. This is
deliberately minimal and first-party:

- **Stays in your own database.** Events go to `/api/analytics` on this server —
  no third-party analytics provider, no external requests.
- **Event names only.** Each row stores a user id, an event name from a fixed
  allowlist (`server/routes/analytics.js`), and a timestamp. No free text, no
  health values, no IP address, no user agent. An event name outside the
  allowlist is rejected rather than stored.
- **Aggregate reads only.** `GET /api/analytics/summary` returns per-feature
  totals and unique-user counts — it never exposes individual users' activity.
- **Deleted with the account.** Events are removed via `ON DELETE CASCADE` when
  a user deletes their account.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org) 22.5 or later (for the built-in `node:sqlite` module)

### Setup

```bash
npm install --prefix server
npm install --prefix web
npm run build --prefix web   # builds the landing page into client/landing
npm start --prefix server
```

Open `http://localhost:3000`. You'll land on the marketing page; **Get started** takes
you to registration. The server serves the landing page, the app, and the API from one
process, and a SQLite database is created automatically on first run.

If you skip the `web` build the server still runs — it just serves the app directly at
`/` and logs a warning, so the backend is usable without the frontend toolchain.

| Route | Serves |
|---|---|
| `/` | React landing page |
| `/login` | Login / registration (`#register` opens the sign-up tab) |
| `/dashboard.html` | The app |
| `/health` | Health check |
| `/api/*` | REST API |

### Working on the landing page

```bash
npm run dev --prefix web
```

Vite serves it at `http://localhost:5173` with hot reload, proxying `/api` to the
Express server on port 3000 — run both side by side.

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

## Deployment

A [`render.yaml`](render.yaml) is included for deploying to [Render](https://render.com):

1. Push this repo to GitHub (already done if you cloned it from there).
2. In Render, go to **New → Blueprint** and connect the repository. Render reads
   `render.yaml` and pre-fills the service configuration.
3. Set `ANTHROPIC_API_KEY` in the dashboard under **Environment** (it's marked
   `sync: false` in the blueprint so it's never committed to git). Skip this if
   you don't want the AI chat.
4. Deploy. Render polls `/health` to confirm the service is up.

**The persistent disk is required, not optional.** This app stores its SQLite
database and uploaded prescription files on the filesystem, so without a disk
both are wiped on every restart and redeploy — meaning every user account
disappears. Render only offers disks on paid instances (~$7/mo), which is why
the blueprint specifies `plan: starter` rather than `free`.

To remove that constraint, [#7](../../issues/7) (move to Postgres) and
[#9](../../issues/9) (move uploads to object storage) would need to be done
first — after which the app becomes stateless and can run on a free tier.

### Deploying elsewhere

The app is a standard Node server with no platform-specific code. On any other
host, the requirements are:

- Node.js 22.5+
- Persistent storage mounted somewhere, with `DATA_DIR` pointed at it
- `JWT_SECRET` set to a fixed value (if unset, one is generated at startup —
  fine locally, but it would change on every restart and invalidate everyone's
  login sessions)

## Project Structure

```
web/                    React landing page (Vite)
├── index.html
└── src/
    ├── App.jsx
    ├── content.js       Page copy, kept out of the components
    ├── styles.css
    └── components/      Nav, Hero, StorySection, PrivacySection, FinalCta, Footer, MockVisuals

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
| `DATA_DIR` | `server/` | Where the SQLite DB, uploads, and JWT secret are stored. Point at a persistent disk in production. |
| `JWT_SECRET` | auto-generated, stored in `$DATA_DIR/.jwt_secret` | Signs auth tokens. Set explicitly in production. |
| `ANTHROPIC_API_KEY` | none | Enables the AI companion chat |
| `ANTHROPIC_CHAT_MODEL` | `claude-opus-5` | Model used for chat |

## Tech Stack

- **Landing page** — React 18 + Vite, in `web/`
- **App frontend** — HTML, CSS, vanilla JavaScript (React migration in progress)
- **Backend** — Node.js, Express
- **Database** — SQLite via the built-in `node:sqlite` module
- **Auth** — bcrypt password hashing, JWT sessions
- **AI** — Claude API (`@anthropic-ai/sdk`)
