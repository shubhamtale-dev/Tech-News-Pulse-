/**
 * Tech News Pulse — Utility Functions
 * Pure helper functions with no DOM or state dependencies
 */

/**
 * Debounce a function call
 * @param {Function} fn
 * @param {number} delay - milliseconds
 * @returns {Function}
 */
function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Format a date string to relative time (e.g. "2 hours ago")
 * @param {string} dateStr - ISO 8601 date string
 * @returns {string}
 */
function formatRelativeTime(dateStr) {
  if (!dateStr) return 'Unknown date';

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Unknown date';

  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Estimate reading time in minutes
 * @param {string} title
 * @param {string} description
 * @returns {number} - minutes
 */
function estimateReadingTime(title, description) {
  const WORDS_PER_MINUTE = 200;
  const text = [title, description].filter(Boolean).join(' ');
  const words = text.trim().split(/\s+/).length;
  // Assume ~3x the snippet for full article length
  return Math.max(1, Math.round((words * 3) / WORDS_PER_MINUTE));
}

/**
 * Truncate text to a max length
 * @param {string} text
 * @param {number} maxLen
 * @returns {string}
 */
function truncate(text, maxLen = 160) {
  if (!text || text.length <= maxLen) return text || '';
  return text.slice(0, maxLen).trimEnd() + '…';
}

/**
 * Sanitize a string to prevent XSS (basic)
 * @param {string} str
 * @returns {string}
 */
function sanitize(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Normalize and clean an article object coming from the API
 * @param {Object} raw - raw API article
 * @returns {Object} - clean article
 */
function normalizeArticle(raw) {
  return {
    title: sanitize(raw.title) || 'Untitled',
    description: sanitize(raw.description) || '',
    url: raw.url || '#',
    image: raw.image || null,
    source: sanitize(raw.author || raw.source?.name) || 'Unknown',
    publishedAt: raw.published || raw.publishedAt || null,
    content: raw.content || '',
  };
}

/**
 * Deduplicate articles by URL
 * @param {Array} articles
 * @returns {Array}
 */
function deduplicateArticles(articles) {
  const seen = new Set();
  return articles.filter((art) => {
    if (!art.url || seen.has(art.url)) return false;
    seen.add(art.url);
    return true;
  });
}

/**
 * Filter out removed/invalid articles
 * @param {Object} raw - raw article
 * @returns {boolean}
 */
function isValidArticle(raw) {
  return (
    raw.title &&
    raw.title !== '[Removed]' &&
    raw.url &&
    raw.url !== 'https://removed.com'
  );
}

/**
 * Copy text to clipboard
 * @param {string} text
 * @returns {Promise<boolean>}
 */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (_) {
    // Fallback
    try {
      const el = document.createElement('textarea');
      el.value = text;
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      return true;
    } catch (_) {
      return false;
    }
  }
}

/**
 * Mask an API key for display (show first 4, last 4 chars)
 * @param {string} key
 * @returns {string}
 */
function maskApiKey(key) {
  if (!key || key.length < 10) return '••••••••';
  return key.slice(0, 4) + '••••••••' + key.slice(-4);
}

/**
 * Get a unique ID
 * @returns {string}
 */
function uid() {
  return Math.random().toString(36).slice(2, 9);
}

/**
 * Count unique sources from an article array
 * @param {Array} articles
 * @returns {number}
 */
function countSources(articles) {
  const sources = new Set(articles.map((a) => a.source).filter(Boolean));
  return sources.size;
}
