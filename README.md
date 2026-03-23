# Tech News Pulse

Tech News Pulse is a modern web app that aggregates the latest technology and startup news in one place. It is designed as a student-friendly project to practice working with APIs, search, filtering, saved items, image fallbacks, and theme persistence using `localStorage`.

## Features

- Browse latest tech and startup news
- Filter news by category
  - AI
  - Crypto
  - Gadgets
- Search for articles by keyword
- "Read More" links for full article access
- Save articles for later reading
- Image fallback for articles with missing thumbnails
- Night Mode toggle
- Persistent theme using `localStorage`
- Responsive UI for desktop and mobile

## Tech Stack

- HTML
- CSS
- JavaScript
- NewsAPI

## Project Goal

This project was built to improve practical frontend skills by working with:

- API integration
- Dynamic rendering of fetched data
- Search and category-based filtering
- State handling for saved articles
- Theme switching with persistence
- Error handling and missing image fallback logic

## Demo Idea

Users can:

1. Open the app and view top technology headlines
2. Filter articles by category such as AI, Crypto, or Gadgets
3. Search for specific topics
4. Save interesting articles for later
5. Switch between Light Mode and Night Mode
6. Return later and still see their preferred theme because it is stored in `localStorage`

## API Used

This project uses the following public API:

**NewsAPI**  
`https://newsapi.org/`

> Note: You need your own API key from NewsAPI to run this project properly.

## Folder Structure

```bash
Tech-News-Pulse/
│
├── index.html
├── style.css
├── script.js
├── assets/
└── README.md
