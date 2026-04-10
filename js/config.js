/**
 * Tech News Pulse — Config / Constants
 * Central configuration — edit API, categories, and feature flags here
 */

const CONFIG = {
  // Local proxy settings for NewsAPI
  API_BASE_URL: '/api/news',
  PAGE_SIZE: 18,          // articles per page
  MAX_PAGES: 3,           // max pages loadable

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
      endpoint: 'everything',
      params: { q: 'artificial intelligence OR ChatGPT OR OpenAI OR LLM OR Gemini', sortBy: 'publishedAt' },
      color: '#A855F7',
    },
    crypto: {
      label: 'Crypto',
      icon: 'fa-bitcoin',
      endpoint: 'everything',
      params: { q: 'bitcoin OR cryptocurrency OR ethereum OR blockchain OR DeFi', sortBy: 'publishedAt' },
      color: '#F59E0B',
    },
    gadgets: {
      label: 'Gadgets',
      icon: 'fa-mobile-screen',
      endpoint: 'everything',
      params: { q: 'gadgets OR smartphone OR laptop OR wearable OR Apple OR Samsung', sortBy: 'publishedAt' },
      color: '#22D3EE',
    },
    startups: {
      label: 'Startups',
      icon: 'fa-rocket',
      endpoint: 'everything',
      params: { q: 'startup OR funding OR "venture capital" OR "Series A" OR Y Combinator', sortBy: 'publishedAt' },
      color: '#10B981',
    },
  },
};
