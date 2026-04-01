# ⚡ Tech News Pulse

> A modern, premium-grade tech news aggregator built with vanilla HTML, CSS, and JavaScript.

![Tech News Pulse](assets/preview.png)

---

## ✨ Features

| Feature | Description |
|---|---|
| 📰 Live Headlines | Fetches top tech & startup news via NewsAPI |
| 🏷️ Category Filters | Browse by All Tech, AI, Crypto, Gadgets, Startups |
| 🔍 Search | Keyword search with instant filtering |
| 🔖 Save Articles | Bookmark articles for later — persisted in `localStorage` |
| 🌙 Night / Light Mode | Toggle with theme state saved via `localStorage` |
| 🖼️ Image Fallback | Graceful placeholder for articles with no thumbnail |
| 📱 Responsive | Fully optimised for desktop and mobile |
| 🎭 Demo Mode | Works without an API key using 8 curated sample articles |

---

## 🚀 Getting Started

### 1. Clone or Download

```bash
git clone https://github.com/yourusername/tech-news-pulse.git
cd tech-news-pulse
```

### 2. Get a Free NewsAPI Key

1. Go to [https://newsapi.org/](https://newsapi.org/)
2. Sign up for a free account
3. Copy your API key from the dashboard

### 3. Open the App

Simply open `index.html` in your browser — no build step required.

```bash
open index.html        # macOS
start index.html       # Windows
xdg-open index.html   # Linux
```

### 4. Enter Your API Key

When the app loads, an API key banner will appear.  
Paste your key and click **Save & Load** — the app fetches live news immediately.  
Your key is saved in `localStorage` so you only need to do this once.

> ⚠️ **Note:** Free NewsAPI keys only work on `localhost`. To deploy publicly, you'll need a paid plan or a backend proxy.

---

## 📁 Folder Structure

```
news_project/
│
├── index.html      ← App structure & markup
├── style.css       ← Design system & all styles
├── script.js       ← API, rendering, state, events
├── assets/         ← Images and static files
└── README.md       ← This file
```

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `/` | Focus the search bar |
| `Enter` | Trigger search |
| `Esc` | Close saved panel / blur search |

---

## 🛠️ Tech Stack

- **HTML5** — Semantic markup with accessibility attributes
- **CSS3** — Custom properties, Grid, Flexbox, animations
- **Vanilla JS (ES6+)** — No frameworks, no dependencies
- **[NewsAPI](https://newsapi.org/)** — Free tier news data
- **[Lucide Icons](https://lucide.dev/)** — Lightweight SVG icon set
- **Google Fonts** — Inter + Space Grotesk

---

## 📖 Learning Concepts Covered

- REST API consumption with `fetch()`
- Dynamic DOM rendering from JSON data
- LocalStorage for state persistence (theme + saved articles)
- Debounced search input
- CSS custom properties for theming
- Responsive layout with CSS Grid
- Graceful error handling and fallback UI

---

## 📜 License

MIT — free to use for learning and portfolio projects.
