# 🌸 Women's Health & Pregnancy Tracker

A comprehensive web-based application for tracking menstrual cycles, pregnancy progress, and overall women's health.

## ✨ Features

- 📊 **Comprehensive Dashboard** - Track cycles, pregnancy, and health metrics
- 📅 **Interactive Calendar** - Visual cycle tracking with fertile windows
- 💊 **Symptom Logger** - Track daily symptoms and patterns
- 🥗 **Personalized Plans** - Diet and exercise recommendations
- 🏥 **Appointment Reminders** - Never miss a doctor's visit
- 🚨 **Emergency Contacts** - Quick access to important numbers
- 📚 **Parenting Resources** - Curated book recommendations
- 👥 **Support Groups** - Connect with other mothers
- 💬 **Daily Motivation** - Inspirational quotes for mental well-being

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org) 22.5+ (for the built-in `node:sqlite` module)

### Installation

```bash
cd server
npm install
npm start
```

Then open `http://localhost:3000` in your browser and register a new account.

The server serves both the API and the frontend from one process, backed by
a real SQLite database at `server/data.sqlite` (created automatically on
first run).

## 📱 Usage

### First Time Setup
1. **Register** with your email and password
2. **Enter health information**:
   - Last menstrual period date
   - Average cycle length
   - Pregnancy status
   - Doctor information
   - Emergency contacts

### Daily Use
1. **Check Dashboard** - View cycle day, phase, and insights
2. **Log Symptoms** - Track how you're feeling
3. **View Calendar** - See predictions for upcoming cycles
4. **Check Diet Plan** - Get personalized nutrition advice
5. **Manage Appointments** - Add and track doctor visits

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla), served from `client/`
- **Backend**: Node.js + Express, in `server/`
- **Database**: SQLite (via the built-in `node:sqlite` module) — real accounts
  with hashed passwords (bcrypt) and JWT-based auth, not localStorage
- **Design**: Responsive, mobile-first approach, with light/dark themes

## 📂 Project Structure

```
client/     static frontend (HTML/CSS/JS)
server/     Express API + SQLite database
```