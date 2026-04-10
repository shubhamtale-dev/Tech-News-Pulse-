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
  const apiKey = CONFIG.API_KEY || AppState.get('apiKey');
  
  // GNews common query params
  const common = `&lang=en&country=us&max=${CONFIG.PAGE_SIZE}&page=${page}&apikey=${encodeURIComponent(apiKey)}`;

  if (searchQuery) {
    const q = encodeURIComponent(searchQuery);
    return `${CONFIG.API_BASE_URL}/search?q=${q}${common}`;
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
 * @returns {Promise<{ articles: Array, totalResults: number }>}
 */
async function fetchArticles(category, searchQuery, page) {
  const url = buildApiUrl(category, searchQuery, page);

  const response = await fetch(url);
  const data = await response.json();

  if (data.errors) {
    const msg = Array.isArray(data.errors) ? data.errors[0] : 'API returned an error';
    if (msg.toLowerCase().includes('limit') || msg.toLowerCase().includes('quota') || response.status === 429 || response.status === 403) {
      throw new ApiError('You have reached the 100 requests API limit', 'rateLimited');
    }
    throw new ApiError(msg, response.status);
  }

  if (!response.ok) {
    if (response.status === 429 || response.status === 403) {
      throw new ApiError('You have reached the 100 requests API limit', 'rateLimited');
    }
    throw new ApiError('API returned an error', response.status);
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
    totalResults: data.totalArticles || 0,
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
    const url = `${CONFIG.API_BASE_URL}/top-headlines?category=technology&max=1&apikey=${encodeURIComponent(key)}`;
    const response = await fetch(url);
    const data = await response.json();
    return !data.errors && response.ok;
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
      case 'parameterInvalid':
        return 'The API key provided is invalid or has expired. Please update it in settings.';
      case 'rateLimited':
        return "Daily API limit (100 requests) has been reached. Please check back tomorrow or try a different key!";
      case 'sourcesTooMany':
        return 'Too many sources requested. Try a different category.';
      default:
        return `API error: ${err.message}`;
    }
  }

  return 'Something went wrong while fetching news. Please try again.';
}

