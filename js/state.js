/**
 * Tech News Pulse — Application State
 * Single source of truth for all app state with localStorage persistence
 */

const AppState = (() => {
  // Private state
  let _state = {
    theme: 'light',
    category: 'technology',
    searchQuery: '',
    articles: [],
    savedArticles: [],
    totalResults: 0,
    currentPage: 1,
    isLoading: false,
    viewMode: 'grid',        // 'grid' | 'list'
    sidebarOpen: false,
  };

  // Subscribers
  const _subscribers = {};

  /** Notify subscribers of a key change */
  function _notify(key) {
    if (_subscribers[key]) {
      _subscribers[key].forEach((fn) => fn(_state[key], _state));
    }
    if (_subscribers['*']) {
      _subscribers['*'].forEach((fn) => fn(key, _state[key], _state));
    }
  }

  return {
    /** Read a state value */
    get(key) {
      return _state[key];
    },

    /** Read the full state snapshot */
    snapshot() {
      return { ..._state };
    },

    /** Set a state value and notify subscribers */
    set(key, value) {
      _state[key] = value;
      _notify(key);
    },

    /** Update multiple keys at once */
    update(patch) {
      Object.assign(_state, patch);
      Object.keys(patch).forEach(_notify);
    },

    /** Subscribe to a key change (or '*' for any) */
    subscribe(key, fn) {
      if (!_subscribers[key]) _subscribers[key] = [];
      _subscribers[key].push(fn);
      return () => {
        _subscribers[key] = _subscribers[key].filter((f) => f !== fn);
      };
    },

    // ===== PERSISTENCE =====

    /** Load all persisted values from localStorage */
    loadFromStorage() {
      try {
        const theme = localStorage.getItem(CONFIG.STORAGE_THEME) || 'light';
        const raw = localStorage.getItem(CONFIG.STORAGE_SAVED);
        const saved = raw ? JSON.parse(raw) : [];
        const viewMode = localStorage.getItem(CONFIG.STORAGE_VIEW_MODE) || 'grid';

        _state.theme = theme;
        _state.savedArticles = Array.isArray(saved) ? saved : [];
        _state.viewMode = viewMode;
      } catch (_) {
        // Ignore parse errors
      }
    },



    /** Save theme to localStorage */
    persistTheme(theme) {
      _state.theme = theme;
      localStorage.setItem(CONFIG.STORAGE_THEME, theme);
    },

    /** Toggle theme */
    toggleTheme() {
      const next = _state.theme === 'light' ? 'dark' : 'light';
      this.persistTheme(next);
      return next;
    },

    /** Save article to saved list */
    saveArticle(article) {
      if (_state.savedArticles.some((a) => a.url === article.url)) return false;
      _state.savedArticles = [article, ..._state.savedArticles];
      this._persistSaved();
      _notify('savedArticles');
      return true;
    },

    /** Remove article from saved list */
    unsaveArticle(url) {
      const prev = _state.savedArticles.length;
      _state.savedArticles = _state.savedArticles.filter((a) => a.url !== url);
      if (_state.savedArticles.length !== prev) {
        this._persistSaved();
        _notify('savedArticles');
        return true;
      }
      return false;
    },

    /** Check if URL is saved */
    isSaved(url) {
      return _state.savedArticles.some((a) => a.url === url);
    },

    /** Clear all saved articles */
    clearAllSaved() {
      _state.savedArticles = [];
      this._persistSaved();
      _notify('savedArticles');
    },

    /** Persist saved articles */
    _persistSaved() {
      try {
        localStorage.setItem(CONFIG.STORAGE_SAVED, JSON.stringify(_state.savedArticles));
      } catch (_) {
        // Storage may be full
      }
    },

    /** Toggle view mode */
    setViewMode(mode) {
      _state.viewMode = mode;
      localStorage.setItem(CONFIG.STORAGE_VIEW_MODE, mode);
    },
  };
})();
