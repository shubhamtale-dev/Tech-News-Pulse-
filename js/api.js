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
  
  // Currents common query params
  const common = `&language=en&page_number=${page}&apiKey=${encodeURIComponent(apiKey || '')}`;

  if (searchQuery) {
    const q = encodeURIComponent(searchQuery);
    return `${CONFIG.API_BASE_URL}/search?keywords=${q}${common}`;
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

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok || data.status === 'error') {
      console.warn("API limit or issue detected, falling back to polished demo mode.");
      throw new Error("api_error");
    }

    const rawArticles = Array.isArray(data.news) ? data.news : [];

    const articles = deduplicateArticles(
      rawArticles
        .filter(isValidArticle)
        .map(normalizeArticle)
    );

    return {
      articles,
      totalResults: articles.length || 0,
    };
  } catch (err) {
    console.error('Fetch failed, falling back to JSON data:', err);
    // Silent fallback to demo data if deployment API causes issues
    let articles = [...(typeof DEMO_ARTICLES !== 'undefined' ? DEMO_ARTICLES : [])];
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      articles = articles.filter((a) =>
        a.title.toLowerCase().includes(q) ||
        (a.description && a.description.toLowerCase().includes(q))
      );
    }
    
    return {
      articles: articles.slice(0, CONFIG.PAGE_SIZE),
      totalResults: articles.length,
    };
  }
}

/**
 * Validate an API key by making a test request
 * @param {string} key
 * @returns {Promise<boolean>}
 */
async function validateApiKey(key) {
  if (!key) return false;
  
  try {
    const url = `${CONFIG.API_BASE_URL}/latest-news?category=technology&language=en&apiKey=${encodeURIComponent(key)}`;
    const response = await fetch(url);
    const data = await response.json();
    return response.ok && data.status !== 'error';
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

