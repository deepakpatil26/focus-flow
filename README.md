# 🚀 FocusFlow: Pomodoro & Distraction Blocker with Session Analytics

## Scenario

Modern knowledge workers are constantly battling distractions—endless browser tabs, relentless notifications, and digital noise—making staying focused harder than ever.

## 🎯 Objective

**Build a next-generation productivity tool** that empowers users to:

- Run customizable Pomodoro timers
- Block distracting websites/apps during work sessions
- Log and analyse focus sessions
- Gain actionable insights from session analytics

---

## 👤 User Role

- Each user manages their focus settings and session history for a personalised experience.

## 🔐 Authentication & Authorization

- Secure email/password signup & login
- All features (settings, sessions, analytics) require authentication

---

## 🧱 Core Modules

### ⏲️ Timer & Workflow

- Start/stop Pomodoro cycles (default: 25 min work + 5 min break)
- Fully customizable intervals to suit individual workflows

### 🚫 Distraction Blocklist (**Key Feature**)

- Users specify domains/apps to block during active work sessions
- Blocking is enforced only while the timer is running; everything is unblocked during breaks

### 📝 Session Logging

- Automatic logging of session start/end, interruptions, and breaks
- Manual “Abort” option with reason capture

### 📊 Analytics Dashboard

- Track total Pomodoros per day/week
- View average focus time
- Analyse interrupted vs. completed session ratios
- Visualise focus trends with line/bar charts

### 🔔 Notifications & Sounds

- In-app or desktop alerts for session start/end
- Mute and volume controls for a distraction-free experience

### 🌙 Dark Mode (**Bonus Feature**)

- Seamless dark mode for comfortable use, day or night

---

## 💡 Additional Suggestions

- **Streaks & Achievements:** Motivate users with daily streaks and achievement badges
- **Quick Notes:** Jot down thoughts or to-dos during breaks
- **Cloud Sync:** All data is securely stored and synced via the Firebase backend

---

## 🛠️ Tech Stack

- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** Firebase (Auth, Firestore, Hosting)

This is the problem statement: make a complete app for it using vite, TypeScript and Tailwind CSS. We will use Firebase for the backend.
Also, after the new tailwind and vite update, whenever I try to install the new vite project, I am unable to setup the tailwind CSS so if there is any ready-to-go starter pack which contains vite, tailwind, both included and working, we will go with that.
