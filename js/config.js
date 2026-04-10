/**
 * Tech News Pulse — Config / Constants
 * Central configuration — edit API, categories, and feature flags here
 */

const CONFIG = {
  // GNews API settings
  API_BASE_URL: 'https://gnews.io/api/v4',
  API_KEY: '9d513748ff9895b685f205d06dc82711',
  PAGE_SIZE: 10,          // max articles per request allowed on free tier
  MAX_PAGES: 1,           // free tier typically restricts deep pagination

  // LocalStorage keys
  STORAGE_API_KEY: 'tnp_api_key',
  STORAGE_THEME: 'tnp_theme',
  STORAGE_SAVED: 'tnp_saved_articles',
  STORAGE_VIEW_MODE: 'tnp_view_mode',

  // Search debounce delay (ms)
  SEARCH_DEBOUNCE_MS: 450,

  // Toast duration (ms)
  TOAST_DURATION: 3500,

  // Featured: show top article as featured
  SHOW_FEATURED: true,
  // Trending: show next 4 articles in horizontal strip
  TRENDING_COUNT: 4,

  // Category definitions
  CATEGORIES: {
    technology: {
      label: 'All Tech',
      icon: 'fa-microchip',
      endpoint: 'top-headlines',
      params: { category: 'technology' },
      color: '#6C63FF',
    },
    ai: {
      label: 'AI',
      icon: 'fa-brain',
      endpoint: 'search',
      params: { q: 'artificial intelligence OR AI OR OpenAI OR ChatGPT OR LLM' },
      color: '#A855F7',
    },
    crypto: {
      label: 'Crypto',
      icon: 'fa-bitcoin',
      endpoint: 'search',
      params: { q: 'crypto OR bitcoin OR cryptocurrency OR blockchain OR ethereum' },
      color: '#F59E0B',
    },
    gadgets: {
      label: 'Gadgets',
      icon: 'fa-mobile-screen',
      endpoint: 'search',
      params: { q: 'gadgets OR smartphone OR tablet OR hardware OR apple OR samsung' },
      color: '#22D3EE',
    },
    startups: {
      label: 'Startups',
      icon: 'fa-rocket',
      endpoint: 'search',
      params: { q: 'startup OR founder OR venture capital OR y combinator OR funding' },
      color: '#10B981',
    },
  },
};
