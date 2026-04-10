/**
 * Tech News Pulse — Main App Controller
 * Orchestrates all modules; wires up events; manages the data flow
 */

const App = {
  // ===========================
  // INITIALIZATION
  // ===========================

  init() {
    // 1. Load persisted state
    AppState.loadFromStorage();

    // 2. Initialize theme
    Theme.init();

    // 3. Initialize UI components
    initNavbarScroll();
    initBackToTop();
    initViewMode();

    // 4. Wire up delegated event listeners (save, share, sidebar removes)
    Saved.init();

    // 5. Bind all other events
    this._bindEvents();



    // 6. Update saved badge from storage
    updateSavedBadge();
    updateHeroStats();

    // 7. Load initial news
    this.loadNews();
  },

  // ===========================
  // NEWS LOADING
  // ===========================

  async loadNews(append = false) {
    const { apiKey, category, searchQuery, currentPage } = AppState.snapshot();

    if (!append) {
      AppState.set('isLoading', true);
      showStatePanel('loading');
    }

    // Fetch from API
    try {
      const { articles, totalResults } = await fetchArticles(
        category,
        searchQuery,
        currentPage,
        apiKey
      );

      if (append) {
        const existing = AppState.get('articles');
        AppState.update({
          articles: deduplicateArticles([...existing, ...articles]),
          totalResults,
          isLoading: false,
        });
      } else {
        AppState.update({
          articles,
          totalResults,
          currentPage: 1,
          isLoading: false,
        });
      }

      renderArticles(AppState.get('articles'));
    } catch (err) {
      AppState.set('isLoading', false);
      const msg = getErrorMessage(err);
      showStatePanel('error', msg);
      showToast(msg, 'error');
    }
  },

  async _loadDemoNews(searchQuery, category) {
    // Simulate minor delay for realism
    await new Promise((r) => setTimeout(r, 600));

    let articles = [...DEMO_ARTICLES];

    // Filter by search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      articles = articles.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          (a.description && a.description.toLowerCase().includes(q)) ||
          a.source.toLowerCase().includes(q)
      );
    }

    // Filter by category keywords (loose matching for demo)
    if (!searchQuery && category !== 'technology') {
      const catKeywords = {
        ai: ['ai', 'openai', 'neural', 'deepmind', 'gpt', 'claude', 'anthropic', 'llm', 'alphac'],
        crypto: ['bitcoin', 'crypto', 'ethereum', 'blockchain', 'layer-2', 'defi', 'btc'],
        gadgets: ['apple', 'samsung', 'sony', 'gpu', 'monitor', 'galaxy', 'iphone', 'nvidia'],
        startups: ['startup', 'series a', 'y combinator', 'funding', 'fda', 'robotic', 'raises'],
      };

      const keys = catKeywords[category] || [];
      articles = articles.filter((a) =>
        keys.some(
          (k) =>
            a.title.toLowerCase().includes(k) ||
            (a.description && a.description.toLowerCase().includes(k))
        )
      );
    }

    AppState.update({
      articles,
      totalResults: articles.length,
      currentPage: 1,
      isLoading: false,
    });

    renderArticles(articles);
  },

  // ===========================
  // CATEGORY CHANGE
  // ===========================

  changeCategory(category) {
    if (AppState.get('category') === category && !AppState.get('isLoading')) return;

    AppState.update({
      category,
      searchQuery: '',
      currentPage: 1,
    });

    // Clear search input
    const searchInput = document.getElementById('search-input');
    const searchMobile = document.getElementById('search-input-mobile');
    if (searchInput) searchInput.value = '';
    if (searchMobile) searchMobile.value = '';

    // Update active pill
    this._setActivePill(category);

    this.loadNews();
  },

  _setActivePill(category) {
    document.querySelectorAll('.pill').forEach((pill) => {
      const isActive = pill.dataset.category === category;
      pill.classList.toggle('active', isActive);
      pill.setAttribute('aria-selected', String(isActive));
    });
  },

  // ===========================
  // SEARCH
  // ===========================

  handleSearch(query) {
    const trimmed = query.trim();
    AppState.update({
      searchQuery: trimmed,
      currentPage: 1,
    });

    // Show/hide clear button
    const clearBtn = document.getElementById('search-clear-btn');
    if (clearBtn) clearBtn.hidden = !trimmed;

    this.loadNews();
  },

  clearSearch() {
    const searchInput = document.getElementById('search-input');
    const searchMobile = document.getElementById('search-input-mobile');
    const clearBtn = document.getElementById('search-clear-btn');

    if (searchInput) searchInput.value = '';
    if (searchMobile) searchMobile.value = '';
    if (clearBtn) clearBtn.hidden = true;

    AppState.update({ searchQuery: '', currentPage: 1 });
    this.loadNews();
  },

  // ===========================
  // RESET FILTERS
  // ===========================

  resetFilters() {
    this.clearSearch();
    this.changeCategory('technology');
  },

  // ===========================
  // REFRESH
  // ===========================

  refresh() {
    const btn = document.getElementById('refresh-btn');
    if (btn) {
      btn.classList.add('spinning');
      setTimeout(() => btn.classList.remove('spinning'), 1200);
    }

    AppState.update({ currentPage: 1 });
    this.loadNews();
    showToast('Refreshing news…', 'info');
  },

  // ===========================
  // LOAD MORE
  // ===========================

  async loadMore() {
    const btn = document.getElementById('load-more-btn');
    if (btn) {
      btn.classList.add('loading');
      btn.innerHTML = '<i class="fa-solid fa-spinner"></i> Loading…';
    }

    AppState.set('currentPage', AppState.get('currentPage') + 1);
    await this.loadNews(true);

    if (btn) {
      btn.classList.remove('loading');
      btn.innerHTML = '<i class="fa-solid fa-arrow-down"></i> Load More Articles';
    }
  },



  // ===========================
  // EVENT BINDINGS
  // ===========================

  _bindEvents() {
    const debouncedSearch = debounce((query) => this.handleSearch(query), CONFIG.SEARCH_DEBOUNCE_MS);

    // Theme toggle
    document.getElementById('theme-toggle')
      ?.addEventListener('click', () => Theme.toggle());

    // Refresh button
    document.getElementById('refresh-btn')
      ?.addEventListener('click', () => this.refresh());

    // Saved sidebar toggle
    document.getElementById('saved-btn')
      ?.addEventListener('click', () => Saved.toggleSidebar());

    document.getElementById('sidebar-close-btn')
      ?.addEventListener('click', () => Saved.toggleSidebar());

    // Clear all saved
    document.getElementById('clear-all-saved-btn')
      ?.addEventListener('click', () => Saved.clearAll());

    // Search inputs (desktop + mobile)
    const searchDesktop = document.getElementById('search-input');
    const searchMobile = document.getElementById('search-input-mobile');

    searchDesktop?.addEventListener('input', (e) => {
      debouncedSearch(e.target.value);
      // Sync mobile
      if (searchMobile) searchMobile.value = e.target.value;
    });

    searchMobile?.addEventListener('input', (e) => {
      debouncedSearch(e.target.value);
      // Sync desktop
      if (searchDesktop) searchDesktop.value = e.target.value;
    });

    // Clear search button
    document.getElementById('search-clear-btn')
      ?.addEventListener('click', () => this.clearSearch());

    // Category pills
    document.querySelectorAll('.pill[data-category]').forEach((pill) => {
      pill.addEventListener('click', () => {
        this.changeCategory(pill.dataset.category);
      });
    });

    // Clear filters button
    document.getElementById('clear-filters-btn')
      ?.addEventListener('click', () => this.resetFilters());

    // Load more
    document.getElementById('load-more-btn')
      ?.addEventListener('click', () => this.loadMore());



    // Mobile menu
    document.getElementById('mobile-menu-btn')
      ?.addEventListener('click', () => {
        const mobileSearch = document.getElementById('nav-mobile-search');
        const btn = document.getElementById('mobile-menu-btn');
        const icon = document.getElementById('mobile-menu-icon');
        if (!mobileSearch) return;

        const isOpen = mobileSearch.classList.toggle('open');
        btn?.setAttribute('aria-expanded', String(isOpen));
        if (icon) {
          icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
        }
      });

    // Logo click — scroll to top and reset
    document.getElementById('nav-logo-btn')
      ?.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.resetFilters();
      });
  },
};

// ===========================
// BOOT
// ===========================

document.addEventListener('DOMContentLoaded', () => App.init());
