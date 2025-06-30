# 🚀 FocusFlow: Pomodoro & Distraction Blocker with Session Analytics

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="src/assets/focusflow-logo-dark.svg">
    <img alt="FocusFlow Logo" src="src/assets/focusflow-logo.svg" width="300">
  </picture>
</p>

<p align="center">
  
<img src="https://img.shields.io/github/license/deepakpatil26/focus-flow?style=flat-square" alt="GitHub License"/>
<img src="https://img.shields.io/badge/deployment-live-brightgreen?style=flat-square" alt="Deployment Status"/>
<img src="https://img.shields.io/badge/build-passing-brightgreen?style=flat-square" alt="Build Status"/>

</p>

## Stay Focused, Stay Productive

FocusFlow is a powerful productivity tool designed to help you master your focus using the Pomodoro technique. With customizable timers, distraction blocking, and insightful analytics, FocusFlow empowers you to take control of your work sessions and achieve your goals.

## 🌐 Live Deployment

**🔗 Access the application:** [Go Live](https://focus-flow-three-psi.vercel.app/)

### Deployment Information

- **Hosting Platform:** Netlify
- **Deployment Type:** Static Site Deployment
- **Build Command:** `npm run build`
- **Publish Directory:** `dist`
- **Domain:** Custom Netlify subdomain
- **SSL:** Enabled (HTTPS)
- **CDN:** Global edge network for fast loading

### How to Access

1. **Direct Access:** Click the live deployment link above
2. **Mobile Friendly:** The application is fully responsive and works on all devices
3. **Browser Compatibility:** Works on all modern browsers (Chrome, Firefox, Safari, Edge)
4. **No Installation Required:** Access instantly through your web browser

### Deployment Features

- ✅ **Automatic Deployments:** Connected to GitHub for continuous deployment
- ✅ **HTTPS Security:** All traffic encrypted with SSL certificates
- ✅ **Global CDN:** Fast loading times worldwide
- ✅ **Mobile Optimized:** Responsive design for all screen sizes
- ✅ **Progressive Web App:** Can be installed on mobile devices

---

## Scenario

Modern knowledge workers are constantly battling distractions—endless browser tabs, relentless notifications, and digital noise—making staying focused harder than ever.

## 🎯 Objective

**Build a next-generation productivity tool** that empowers users to:

- Master their focus with the Pomodoro technique
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
- Manual "Abort" option with reason capture

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

## 💡 Additional Features

- **Streaks & Achievements:** Motivate users with daily streaks and achievement badges
- **Quick Notes:** Jot down thoughts or to-dos during breaks
- **Cloud Sync:** All data is securely stored and synced via the Firebase backend
- **Admin Dashboard:** Comprehensive user management and analytics for administrators

---

## 🛠️ Tech Stack

- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** Firebase (Auth, Firestore, Hosting)
- **Deployment:** Netlify
- **Browser Extension:** Chrome Extension for website blocking

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm
- Modern web browser

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/deepakpatil26/focus-flow.git
   cd focus-flow
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**

   ```bash
   http://localhost:5173
   ```

### Building for Production

```bash
npm run build
```

## 📱 Browser Extension

FocusFlow includes a Chrome browser extension for website blocking functionality:

1. Navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `extension` folder
4. The extension will integrate with the web application automatically

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<<<<<<< HEAD
<p align="center">
  Built with ❤️ for productivity enthusiasts  
  <a href="https://symphonious-entremet-8fb176.netlify.app">🌐 Live Demo</a> •
  <a href="#-getting-started">📖 Documentation</a> •
  <a href="https://github.com/deepakpatil26/focus-flow/issues">🐛 Report Bug</a>
</p>
=======
<div align="center">
  <p>Built with ❤️ for productivity enthusiasts</p>
  <p>
    <a href="https://symphonious-entremet-8fb176.netlify.app">🌐 Live Demo</a> •
    <a href="#-getting-started">📖 Documentation</a> •
    <a href="https://github.com/deepakpatil26/focus-flow/issues">🐛 Report Bug</a>
  </p>
</div>
>>>>>>> 530730b3c4bc0b2211e7ecb1f29064ec82cf4bea
