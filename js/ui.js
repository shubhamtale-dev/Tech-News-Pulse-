/**
 * Tech News Pulse — UI Module
 * DOM-manipulation helpers, toast system, state panels, skeleton loader
 */

// ===========================
// TOAST NOTIFICATIONS
// ===========================

/**
 * Show a toast notification
 * @param {string} message
 * @param {'success'|'error'|'info'|'warning'} type
 */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const iconMap = {
    success: 'fa-check',
    error: 'fa-xmark',
    info: 'fa-circle-info',
    warning: 'fa-triangle-exclamation',
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.setAttribute('role', 'alert');
  toast.innerHTML = `
    <div class="toast-icon"><i class="fa-solid ${iconMap[type] || 'fa-circle-info'}"></i></div>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Auto-remove
  setTimeout(() => {
    toast.classList.add('toast-exit');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
    setTimeout(() => toast.remove(), 400);
  }, CONFIG.TOAST_DURATION);
}

// ===========================
// STATE PANEL
// ===========================

/**
 * Show a content state (loading, error, empty, no-results)
 * @param {'loading'|'error'|'empty'|'no-results'|'demo'|null} type
 * @param {string} [customMessage]
 */
function showStatePanel(type, customMessage) {
  const panel = document.getElementById('state-panel');
  const skeletonGrid = document.getElementById('skeleton-grid');
  const cardsGrid = document.getElementById('cards-grid');
  const loadMoreRow = document.getElementById('load-more-row');

  if (!panel) return;

  if (type === null) {
    panel.hidden = true;
    return;
  }

  panel.hidden = false;
  loadMoreRow.hidden = true;

  const states = {
    loading: {
      icon: 'fa-spinner',
      iconClass: 'loading-icon',
      title: 'Fetching latest news…',
      msg: 'Pulling fresh articles from across the web.',
    },
    error: {
      icon: 'fa-triangle-exclamation',
      iconClass: 'error-icon',
      title: 'Something went wrong',
      msg: customMessage || 'Failed to load articles. Check your API key and internet connection.',
      actions: `
        <button class="btn btn-primary" onclick="App.refresh()">
          <i class="fa-solid fa-rotate-right"></i> Try Again
        </button>
      `,
    },
    empty: {
      icon: 'fa-newspaper',
      iconClass: 'empty-icon',
      title: 'No articles found',
      msg: 'There are no articles matching your current filters. Try resetting or switching to a different category.',
      actions: `
        <button class="btn btn-primary" onclick="App.resetFilters()">
          <i class="fa-solid fa-filter-circle-xmark"></i> Reset Filters
        </button>
      `,
    },
    'no-results': {
      icon: 'fa-magnifying-glass',
      iconClass: 'empty-icon',
      title: `No results for "${AppState.get('searchQuery')}"`,
      msg: 'Try different keywords or clear the search to browse all articles.',
      actions: `
        <button class="btn btn-primary" onclick="App.clearSearch()">
          <i class="fa-solid fa-xmark"></i> Clear Search
        </button>
      `,
    },
  };

  const cfg = states[type] || states.empty;

  panel.innerHTML = `
    <div class="state-icon ${cfg.iconClass}">
      <i class="fa-solid ${cfg.icon}"></i>
    </div>
    <h3 class="state-title">${cfg.title}</h3>
    <p class="state-msg">${cfg.msg}</p>
    ${cfg.actions ? `<div class="state-actions">${cfg.actions}</div>` : ''}
  `;

  // Hide cards if showing a state
  if (type === 'loading') {
    cardsGrid.hidden = true;
    skeletonGrid.hidden = false;
    panel.hidden = true; // show skeletons instead
    renderSkeletons();
  } else {
    skeletonGrid.hidden = true;
    cardsGrid.hidden = false;
    cardsGrid.innerHTML = '';
  }
}

// ===========================
// SKELETON LOADER
// ===========================

function renderSkeletons(count = 6) {
  const grid = document.getElementById('skeleton-grid');
  if (!grid) return;

  grid.innerHTML = Array.from({ length: count }, () => `
    <div class="skeleton-card">
      <div class="skeleton skeleton-img"></div>
      <div class="skeleton-body">
        <div class="skeleton skeleton-line short"></div>
        <div class="skeleton skeleton-line long" style="height:16px; margin-top:4px;"></div>
        <div class="skeleton skeleton-line full" style="height:16px;"></div>
        <div class="skeleton skeleton-line medium"></div>
        <div class="skeleton skeleton-line short" style="margin-top:8px;"></div>
      </div>
    </div>
  `).join('');
}

// ===========================
// HERO STATS
// ===========================

/**
 * Update the hero section statistics
 */
function updateHeroStats() {
  const articles = AppState.get('articles');
  const saved = AppState.get('savedArticles');

  const statArticles = document.getElementById('stat-articles');
  const statSources = document.getElementById('stat-sources');
  const statSaved = document.getElementById('stat-saved');

  if (statArticles) statArticles.textContent = articles.length || '—';
  if (statSources) statSources.textContent = countSources(articles) || '—';
  if (statSaved) statSaved.textContent = saved.length;
}

// ===========================
// SAVED BADGE (NAVBAR)
// ===========================

function updateSavedBadge() {
  const count = AppState.get('savedArticles').length;
  const badge = document.getElementById('saved-badge');
  if (!badge) return;

  if (count > 0) {
    badge.textContent = count > 99 ? '99+' : count;
    badge.hidden = false;
  } else {
    badge.hidden = true;
  }
}

// ===========================
// ARTICLE COUNT LABEL
// ===========================

function updateArticleCountLabel() {
  const el = document.getElementById('article-count-label');
  const articles = AppState.get('articles');
  if (!el) return;
  el.textContent = articles.length > 0 ? `${articles.length} articles` : '';
}

// ===========================
// LATEST HEADER LABEL
// ===========================

function updateLatestHeader() {
  const el = document.getElementById('latest-header-label');
  const q = AppState.get('searchQuery');
  if (!el) return;
  el.textContent = q ? `Results for "${q}"` : 'Latest News';
}

// ===========================
// API KEY PANEL
// ===========================

/**
 * Render the API key input or managed state
 * @param {boolean} forceShow - whether to force show the input even if key exists
 */
function renderApiKeySection(forceShow = false) {
  const container = document.getElementById('api-key-container');
  if (!container) return;

  const apiKey = AppState.get('apiKey');
  
  // If key exists and we're not forcing show, render the "Managed" state or nothing
  if (apiKey && !forceShow) {
    // If you want it completely hidden when set:
    container.innerHTML = '';
    return;
    
    /* 
       Alternatively, render a small SUCCESS badge:
       container.innerHTML = `
         <section class="api-key-section">
           <div class="api-key-managed">
             <i class="fa-solid fa-circle-check"></i>
             <span>API Key is active</span>
             <span class="key-preview">${apiKey.substring(0, 4)}••••${apiKey.substring(apiKey.length - 4)}</span>
             <div class="key-actions">
               <button onclick="handleApiKeyReset()" title="Remove API Key">Change Key</button>
             </div>
           </div>
         </section>
       `;
       return;
    */
  }

  // Render the Input state
  container.innerHTML = `
    <section class="api-key-section">
      <div class="api-key-inner">
        <div class="api-key-icon">
          <i class="fa-solid fa-key"></i>
        </div>
        <div class="api-key-content">
          <h3 class="api-key-title">Personalize Your Experience</h3>
          <p class="api-key-desc">
            To fetch real-time news, please enter your <a href="https://gnews.io/" target="_blank">GNews.io</a> key. 
            It's free for developers and takes 30 seconds to get. 
            <strong>Your key is saved locally in your browser.</strong>
          </p>
          
          <form class="api-key-form" id="api-key-form">
            <div class="api-input-wrapper">
              <i class="fa-solid fa-lock input-icon"></i>
              <input 
                type="password" 
                id="api-key-input" 
                placeholder="Enter your API key here…" 
                required
                autocomplete="off"
                value="${apiKey}"
              />
              <button type="button" class="input-eye" id="toggle-key-visibility" title="Toggle visibility">
                <i class="fa-solid fa-eye"></i>
              </button>
            </div>
            <button type="submit" class="btn btn-primary" id="api-save-btn">
              <span>Save Key</span>
            </button>
            <a href="https://gnews.io/" target="_blank" class="btn btn-outline">
              <i class="fa-solid fa-external-link"></i> Get API Key
            </a>
          </form>
          
          <div id="api-validation-msg" class="api-key-demo-note" hidden></div>
        </div>
        
        ${apiKey ? `
          <button class="api-key-dismiss" onclick="renderApiKeySection(false)" title="Hide">
            <i class="fa-solid fa-xmark"></i>
          </button>
        ` : ''}
      </div>
    </section>
  `;

  // Attach inner event listeners
  const form = document.getElementById('api-key-form');
  const visibilityBtn = document.getElementById('toggle-key-visibility');
  const input = document.getElementById('api-key-input');

  form?.addEventListener('submit', handleApiKeySubmit);
  
  visibilityBtn?.addEventListener('click', () => {
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    visibilityBtn.innerHTML = `<i class="fa-solid fa-${isPassword ? 'eye-slash' : 'eye'}"></i>`;
  });
}

/**
 * Handle API key form submission
 */
async function handleApiKeySubmit(e) {
  e.preventDefault();
  const input = document.getElementById('api-key-input');
  const btn = document.getElementById('api-save-btn');
  const msgEl = document.getElementById('api-validation-msg');
  const key = input.value.trim();

  if (!key) return;

  // Loading state
  btn.disabled = true;
  const originalBtnText = btn.innerHTML;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Validating…';
  msgEl.hidden = true;

  try {
    const isValid = await validateApiKey(key);
    
    if (isValid) {
      AppState.persistApiKey(key);
      showToast('API Key saved successfully!', 'success');
      renderApiKeySection(false);
      // Trigger a fresh load
      if (typeof App !== 'undefined' && App.init) {
        App.init(); 
      } else {
        window.location.reload(); // Fallback
      }
    } else {
      msgEl.innerHTML = '<i class="fa-solid fa-circle-xmark" style="color:var(--color-error)"></i> Invalid API key. Please check and try again.';
      msgEl.hidden = false;
      showToast('Invalid API Key. Please try again.', 'error');
    }
  } catch (err) {
    msgEl.innerHTML = '<i class="fa-solid fa-triangle-exclamation" style="color:var(--color-warning)"></i> Validation failed. Check your connection.';
    msgEl.hidden = false;
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalBtnText;
  }
}

/**
 * Reset/Change API key
 */
function handleApiKeyReset() {
  if (confirm('Are you sure you want to change or remove your API key?')) {
    AppState.clearApiKey();
    renderApiKeySection(true);
    showToast('API Key removed.', 'info');
  }
}

// ===========================
// SECTION VISIBILITY
// ===========================

function toggleFeaturedSection(show) {
  const header = document.getElementById('featured-header');
  if (header) header.hidden = !show;
}

function toggleTrendingSection(show) {
  const header = document.getElementById('trending-header');
  const strip = document.getElementById('trending-strip');
  if (header) header.hidden = !show;
  if (strip) strip.hidden = !show;
}

// ===========================
// NAVBAR SCROLL BEHAVIOR
// ===========================

function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

// ===========================
// BACK TO TOP
// ===========================

function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.hidden = window.scrollY < 400;
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===========================
// VIEW MODE TOGGLE
// ===========================

function initViewMode() {
  const gridBtn = document.getElementById('view-grid-btn');
  const listBtn = document.getElementById('view-list-btn');
  const grid = document.getElementById('cards-grid');

  function apply(mode) {
    if (!grid) return;
    if (mode === 'list') {
      grid.classList.add('list-view');
      gridBtn.classList.remove('active');
      listBtn.classList.add('active');
    } else {
      grid.classList.remove('list-view');
      gridBtn.classList.add('active');
      listBtn.classList.remove('active');
    }
  }

  gridBtn?.addEventListener('click', () => {
    AppState.setViewMode('grid');
    apply('grid');
  });

  listBtn?.addEventListener('click', () => {
    AppState.setViewMode('list');
    apply('list');
  });

  // Apply saved mode
  apply(AppState.get('viewMode'));
}
