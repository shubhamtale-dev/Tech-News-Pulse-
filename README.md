# Tech News Pulse 🚀

A **premium, production-quality** tech news dashboard built with vanilla HTML, CSS, and modular JavaScript. Aggregates the latest technology, AI, crypto, gadgets, and startup news in a beautifully designed interface.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🗞️ Live News Feed | Real-time articles via NewsAPI |
| 🏷️ Category Filters | All Tech, AI, Crypto, Gadgets, Startups |
| 🔍 Smart Search | Debounced keyword search with live results |
| 💾 Save for Later | Bookmark articles in a persistent slide-in sidebar |
| 🌓 Dark / Light Mode | Full theme with localStorage persistence |
| 🦴 Skeleton Loader | Shimmer loading cards while fetching |
| 🔔 Toast Notifications | Contextual feedback for every user action |
| 📋 Demo Mode | 12 rich sample articles shown when no API key is set |
| ⏱️ Relative Timestamps | "2 hours ago" style dates |
| 📖 Reading Time | Estimated reading time per article |
| 🔗 Share Button | Web Share API + clipboard fallback |
| ♿ Accessible | ARIA roles, focus states, reduced motion |
| 📱 Responsive | Mobile-first design for all screen sizes |

---

## 🛠️ Project Structure

```
news_project/
├── index.html              # Main HTML — semantic, SEO-optimized
├── css/
│   ├── variables.css       # Design tokens (colors, spacing, shadows)
│   ├── base.css            # Reset, typography, button system
│   ├── navbar.css          # Sticky glassmorphism navbar
│   ├── hero.css            # Animated hero section
│   ├── filters.css         # Category pills, view toggle
│   ├── cards.css           # Featured, trending, grid/list cards
│   ├── sidebar.css         # Saved articles panel
│   ├── states.css          # Loading / error / empty states
│   ├── apikey.css          # API key setup section
│   ├── toast.css           # Toast notification system
│   ├── footer.css          # Premium footer
│   ├── animations.css      # Keyframe animations
│   └── responsive.css      # Breakpoints (desktop → 360px)
├── js/
│   ├── config.js           # Constants, categories, API config
│   ├── utils.js            # Pure helper functions (debounce, format, sanitize)
│   ├── demo-data.js        # 12 rich sample articles for demo mode
│   ├── api.js              # NewsAPI fetching, URL builder, error handling
│   ├── state.js            # Reactive app state (pub/sub + localStorage)
│   ├── ui.js               # DOM helpers, toasts, state panels, hero stats
│   ├── cards.js            # Featured, trending, and grid card builders
│   ├── saved.js            # Save/unsave, sidebar, share functionality
│   ├── theme.js            # Dark/light theme module
│   └── app.js              # Main controller — init, events, news loading
├── assets/                 # (add custom SVGs / icons here)
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### Option A — Open directly (easiest)

```bash
open index.html
```

> ⚠️ **Note:** NewsAPI blocks browser-side requests from localhost in their free tier. You'll see **Demo Mode** with 12 sample articles — which is beautiful and fully functional.
>
> To get live news, you need a paid NewsAPI plan OR deploy to a backend proxy.

### Option B — Run with a local server

```bash
# Using Python
python3 -m http.server 8080
# Then open http://localhost:8080

# Using Node.js
npx serve .
# Then open http://localhost:3000

# Using VS Code
# Install "Live Server" extension, right-click index.html → Open with Live Server
```

---

## 🔑 API Key Setup

1. Go to [newsapi.org](https://newsapi.org) and sign up (free)
2. Copy your API key from your account dashboard
3. Open the app — click **"API Key"** in the navbar
4. Paste your key and click **"Activate Key"**
5. Your key is saved in `localStorage` — never sent anywhere externally

> **Developer note:** NewsAPI's free tier restricts browser-based requests to `localhost` — in production you'll need a backend proxy. The app gracefully shows demo content when the API is unavailable.

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary Accent | `#6C63FF` (Indigo) |
| Secondary Accent | `#A855F7` (Purple) |
| Tertiary Accent | `#22D3EE` (Cyan) |
| Dark Background | `#0D0D14` |
| Light Background | `#F8F8FC` |
| Font Body | Inter |
| Font Display | Space Grotesk |

---

## 🏗️ Architecture

The app uses a clean **modular vanilla JS** architecture:

- **State** — Single reactive store (`AppState`) with pub/sub notifications and localStorage sync
- **API** — Isolated fetch layer with normalization, deduplication, and typed error handling
- **UI** — Separated DOM mutation layer (toasts, skeletons, state panels)
- **Cards** — Declarative card builders for featured, trending, and grid layouts
- **Config** — All magic strings and settings live in `config.js`

---

## 📦 Git Setup

```bash
cd news_project
git init
git add .
git commit -m "feat: initial premium rebuild of Tech News Pulse"
git remote add origin <your-github-repo-url>
git push -u origin main
```

---

## 📝 License

MIT — free for personal and commercial use.
