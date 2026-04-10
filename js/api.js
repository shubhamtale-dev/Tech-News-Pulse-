/**
 * Tech News Pulse — API Layer
 * Centralized data fetching with error handling and normalization
 */

/**
 * Build the NewsAPI request URL
 * @param {string} category - key from CONFIG.CATEGORIES
 * @param {string} searchQuery - optional search term
 * @param {number} page - page number (1-indexed)
 * @returns {string} full URL
 */
function buildApiUrl(category, searchQuery, page) {
  const cat = CONFIG.CATEGORIES[category] || CONFIG.CATEGORIES.technology;
  const apiKey = AppState.get('apiKey');
  
  // Base query params
  const common = `&language=en&pageSize=${CONFIG.PAGE_SIZE}&page=${page}`;
  // Only add apiKey if it's set in state
  const auth = apiKey ? `&apiKey=${encodeURIComponent(apiKey)}` : '';

  if (searchQuery) {
    const q = encodeURIComponent(searchQuery);
    return `${CONFIG.API_BASE_URL}?endpoint=everything&q=${q}&sortBy=publishedAt${common}${auth}`;
  }

  const base = `${CONFIG.API_BASE_URL}?endpoint=${cat.endpoint}&`;
  const queryParts = Object.entries(cat.params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&');

  return `${base}${queryParts}${common}${auth}`;
}

/**
 * Fetch articles from NewsAPI
 * @param {string} category
 * @param {string} searchQuery
 * @param {number} page
 * @returns {Promise<{ articles: Array, totalResults: number }>}
 */
async function fetchArticles(category, searchQuery, page) {
  const url = buildApiUrl(category, searchQuery, page);

  const response = await fetch(url);
  const data = await response.json();

  if (data.status === 'error') {
    throw new ApiError(data.message || 'API returned an error', data.code);
  }

  const rawArticles = Array.isArray(data.articles) ? data.articles : [];

  // Filter and normalize
  const articles = deduplicateArticles(
    rawArticles
      .filter(isValidArticle)
      .map(normalizeArticle)
  );

  return {
    articles,
    totalResults: data.totalResults || 0,
  };
}

/**
 * Validate an API key by making a test request
 * @param {string} key
 * @returns {Promise<boolean>}
 */
async function validateApiKey(key) {
  if (!key) return false;
  
  try {
    const url = `${CONFIG.API_BASE_URL}?endpoint=top-headlines&category=technology&pageSize=1&apiKey=${encodeURIComponent(key)}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.status === 'ok';
  } catch (err) {
    console.error('API Key Validation Failed:', err);
    return false;
  }
}

/**
 * Custom API error class
 */
class ApiError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
  }
}

/**
 * Determine user-friendly error message
 * @param {Error} err
 * @returns {string}
 */
function getErrorMessage(err) {
  if (!navigator.onLine) {
    return "You're offline. Check your internet connection and try again.";
  }

  if (err instanceof ApiError) {
    switch (err.code) {
      case 'apiKeyInvalid':
      case 'apiKeyExhausted':
      case 'parameterInvalid': // NewsAPI sometimes returns this if key is weird
        return 'The API key provided is invalid or has expired. Please update it in settings.';
      case 'rateLimited':
        return "You've hit the rate limit. Please wait a moment before refreshing.";
      case 'sourcesTooMany':
        return 'Too many sources requested. Try a different category.';
      default:
        return `API error: ${err.message}`;
    }
  }

  return 'Something went wrong while fetching news. Please try again.';
}

