/**
 * Tech News Pulse — API Layer
 * Centralized data fetching with error handling and normalization
 */

/**
 * Build the NewsAPI request URL
 * @param {string} category - key from CONFIG.CATEGORIES
 * @param {string} searchQuery - optional search term
 * @param {number} page - page number (1-indexed)
 * @param {string} apiKey
 * @returns {string} full URL
 */
function buildApiUrl(category, searchQuery, page, apiKey) {
  const cat = CONFIG.CATEGORIES[category] || CONFIG.CATEGORIES.technology;
  const common = `&language=en&pageSize=${CONFIG.PAGE_SIZE}&page=${page}&apiKey=${apiKey}`;

  if (searchQuery) {
    const q = encodeURIComponent(searchQuery);
    return `${CONFIG.API_BASE_URL}/everything?q=${q}&sortBy=publishedAt${common}`;
  }

  const base = `${CONFIG.API_BASE_URL}/${cat.endpoint}?`;
  const queryParts = Object.entries(cat.params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&');

  return `${base}${queryParts}${common}`;
}

/**
 * Fetch articles from NewsAPI
 * @param {string} category
 * @param {string} searchQuery
 * @param {number} page
 * @param {string} apiKey
 * @returns {Promise<{ articles: Array, totalResults: number }>}
 */
async function fetchArticles(category, searchQuery, page, apiKey) {
  const url = buildApiUrl(category, searchQuery, page, apiKey);

  const response = await fetch(url);

  // NewsAPI returns 200 even for errors; check status field
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
        return 'Your API key appears to be invalid or exhausted. Please check it and try again.';
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
