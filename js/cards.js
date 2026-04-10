/**
 * Tech News Pulse — Card Renderer
 * Builds featured, trending, and standard news cards.
 * Uses data-* attributes + event delegation — no inline onclick handlers.
 */

// ===========================
// MAIN RENDER ENTRY
// ===========================

/**
 * Render all article sections
 * @param {Array} articles - normalized articles
 */
function renderArticles(articles) {
  const skeletonGrid = document.getElementById('skeleton-grid');
  const cardsGrid    = document.getElementById('cards-grid');
  const statePanel   = document.getElementById('state-panel');

  if (skeletonGrid) skeletonGrid.hidden = true;
  if (statePanel)   statePanel.hidden   = true;
  if (cardsGrid)    cardsGrid.hidden    = false;

  if (!articles || articles.length === 0) {
    const q = AppState.get('searchQuery');
    showStatePanel(q ? 'no-results' : 'empty');
    toggleFeaturedSection(false);
    toggleTrendingSection(false);
    return;
  }

  let remaining = [...articles];

  // 1. Featured card (first article)
  if (CONFIG.SHOW_FEATURED && !AppState.get('searchQuery') && remaining.length > 0) {
    renderFeaturedCard(remaining[0]);
    toggleFeaturedSection(true);
    remaining = remaining.slice(1);
  } else {
    clearFeaturedCard();
    toggleFeaturedSection(false);
  }

  // 2. Trending strip (next N)
  if (!AppState.get('searchQuery') && remaining.length >= CONFIG.TRENDING_COUNT) {
    renderTrendingStrip(remaining.slice(0, CONFIG.TRENDING_COUNT));
    toggleTrendingSection(true);
    remaining = remaining.slice(CONFIG.TRENDING_COUNT);
  } else {
    clearTrendingStrip();
    toggleTrendingSection(false);
  }

  // 3. Main grid
  if (cardsGrid) renderCardsGrid(remaining, cardsGrid);

  // 4. Load More button
  updateLoadMoreButton();

  // 5. Update stats
  updateHeroStats();
  updateArticleCountLabel();
  updateLatestHeader();
}

// ===========================
// FEATURED CARD
// ===========================

function renderFeaturedCard(article) {
  const slot = document.getElementById('featured-card-slot');
  if (!slot) return;

  const readTime = estimateReadingTime(article.title, article.description);
  const time     = formatRelativeTime(article.publishedAt);
  const isSaved  = AppState.isSaved(article.url);

  const imgHtml = article.image
    ? `<img src="${article.image}" alt="" loading="lazy">`
    : `<div class="img-placeholder"><i class="fa-regular fa-image"></i></div>`;

  slot.innerHTML = `
    <article class="featured-card" data-url="${article.url}">
      <div class="featured-card-img">${imgHtml}
        <div style="position:absolute;top:0;left:0;right:0;bottom:0;" id="featured-img-wrap"></div>
      </div>
      <div class="featured-card-body">
        <div class="featured-label">
          <i class="fa-solid fa-star"></i> Featured Story
        </div>
        <h2 class="featured-title">${article.title}</h2>
        <p class="featured-desc">${article.description || 'No description available.'}</p>
        <div class="featured-meta">
          <span class="card-source">${article.source}</span>
          <span class="card-time"><i class="fa-regular fa-clock"></i> ${time}</span>
          <span class="card-read-time"><i class="fa-solid fa-book-open"></i> ${readTime} min read</span>
        </div>
        <div class="featured-actions">
          <a href="${article.url}" target="_blank" rel="noopener" class="btn btn-primary">
            Read Full Story <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
          <button
            class="btn btn-outline js-save-btn ${isSaved ? 'btn-saved-active' : ''}"
            data-url="${article.url}"
            aria-label="${isSaved ? 'Remove from saved' : 'Save article'}"
          >
            <i class="fa-${isSaved ? 'solid' : 'regular'} fa-bookmark"></i>
            <span class="save-label">${isSaved ? 'Saved' : 'Save'}</span>
          </button>
          <button
            class="btn btn-outline js-share-btn"
            data-url="${article.url}"
            data-title="${article.title}"
            aria-label="Share article"
          >
            <i class="fa-solid fa-share-nodes"></i>
          </button>
        </div>
      </div>
    </article>
  `;

  // Store article in the slot's dataset for retrieval
  slot.querySelector('.featured-card').dataset.article = JSON.stringify(article);

  // Fix image error handling
  const img = slot.querySelector('img');
  if (img) {
    img.onerror = () => {
      img.parentElement.innerHTML = '<div class="img-placeholder"><i class="fa-regular fa-image"></i></div>';
    };
  }
}

function clearFeaturedCard() {
  const slot = document.getElementById('featured-card-slot');
  if (slot) slot.innerHTML = '';
}

// ===========================
// TRENDING STRIP
// ===========================

function renderTrendingStrip(articles) {
  const strip = document.getElementById('trending-strip');
  const count = document.getElementById('trending-count');
  if (!strip) return;

  if (count) count.textContent = `${articles.length} stories`;

  strip.innerHTML = articles.map((art, i) => {
    const imgHtml = art.image
      ? `<img class="trending-card-img" src="${art.image}" alt="" loading="lazy">`
      : `<div class="trending-card-img placeholder"><i class="fa-regular fa-image"></i></div>`;

    return `
      <a
        href="${art.url}"
        target="_blank"
        rel="noopener"
        class="trending-card"
        title="${art.title}"
        style="animation-delay:${i * 0.08}s"
      >
        ${imgHtml}
        <div class="trending-card-body">
          <p class="card-source">${art.source}</p>
          <p class="trending-card-title">${art.title}</p>
        </div>
      </a>
    `;
  }).join('');

  // Fix image error handlers
  strip.querySelectorAll('img.trending-card-img').forEach((img) => {
    img.onerror = () => {
      img.outerHTML = '<div class="trending-card-img placeholder"><i class="fa-regular fa-image"></i></div>';
    };
  });
}

function clearTrendingStrip() {
  const strip = document.getElementById('trending-strip');
  if (strip) strip.innerHTML = '';
}

// ===========================
// STANDARD GRID
// ===========================

/**
 * Render standard article cards into a grid container
 * @param {Array} articles
 * @param {HTMLElement} container
 * @param {boolean} append
 */
function renderCardsGrid(articles, container, append = false) {
  if (!container) return;
  if (!append) container.innerHTML = '';

  const category = AppState.get('category');
  articles.forEach((article, index) => {
    const card = buildCard(article, category, index);
    container.appendChild(card);
  });
}

// ===========================
// SINGLE CARD BUILDER
// ===========================

/**
 * Build a single news card element using data-* attributes
 * (no inline onclick — events handled via delegation in saved.js)
 */
function buildCard(article, category, index) {
  const card = document.createElement('article');
  card.className = 'news-card';
  card.style.animationDelay = `${Math.min(index * 0.06, 0.5)}s`;

  // Store article data safely on the element
  card.dataset.url     = article.url;
  card.dataset.article = JSON.stringify(article);

  const isSaved  = AppState.isSaved(article.url);
  const readTime = estimateReadingTime(article.title, article.description);
  const time     = formatRelativeTime(article.publishedAt);
  const chipClass = `chip-${category}`;

  // Image
  const imgInner = article.image
    ? `<img class="card-img" src="${article.image}" alt="" loading="lazy">`
    : `<div class="card-img-placeholder"><i class="fa-regular fa-image"></i><span>No Image</span></div>`;

  card.innerHTML = `
    <div class="card-img-wrapper">
      ${imgInner}
      <span class="card-category-chip ${chipClass}">${CONFIG.CATEGORIES[category]?.label || 'Tech'}</span>
      <button
        class="card-save-overlay js-save-btn ${isSaved ? 'saved' : ''}"
        data-url="${article.url}"
        aria-label="${isSaved ? 'Remove from saved' : 'Save article'}"
        title="${isSaved ? 'Remove from saved' : 'Save for later'}"
      >
        <i class="fa-${isSaved ? 'solid' : 'regular'} fa-bookmark"></i>
      </button>
    </div>

    <div class="card-body">
      <div class="card-meta">
        <span class="card-source" title="${article.source}">${article.source}</span>
        <span class="card-time"><i class="fa-regular fa-clock"></i> ${time}</span>
      </div>

      <h3 class="card-title">${article.title}</h3>

      ${article.description
        ? `<p class="card-desc">${truncate(article.description, 130)}</p>`
        : ''}

      <span class="card-read-time">
        <i class="fa-solid fa-book-open-reader"></i>
        ${readTime} min read
      </span>

      <div class="card-footer">
        <a
          href="${article.url}"
          target="_blank"
          rel="noopener"
          class="card-read-btn"
          aria-label="Read full article from ${article.source}"
        >
          Read More <i class="fa-solid fa-arrow-right"></i>
        </a>

        <div class="card-action-group">
          <button
            class="card-action-btn js-save-btn ${isSaved ? 'active' : ''}"
            data-url="${article.url}"
            aria-label="${isSaved ? 'Unsave' : 'Save'} article"
            title="${isSaved ? 'Remove from saved' : 'Save for later'}"
          >
            <i class="fa-${isSaved ? 'solid' : 'regular'} fa-bookmark"></i>
          </button>
          <button
            class="card-action-btn js-share-btn"
            data-url="${article.url}"
            data-title="${article.title}"
            aria-label="Share article"
            title="Share or copy link"
          >
            <i class="fa-solid fa-share-nodes"></i>
          </button>
        </div>
      </div>
    </div>
  `;

  // Fix image error handler
  const img = card.querySelector('img.card-img');
  if (img) {
    img.onerror = () => {
      img.parentElement.innerHTML =
        '<div class="card-img-placeholder"><i class="fa-regular fa-image"></i><span>No Image</span></div>';
    };
  }

  return card;
}

// ===========================
// LOAD MORE BUTTON
// ===========================

function updateLoadMoreButton() {
  const row = document.getElementById('load-more-row');
  if (!row) return;

  const { totalResults, currentPage, articles, isDemoMode } = AppState.snapshot();
  const loaded  = articles.length
    + (CONFIG.SHOW_FEATURED ? 1 : 0)
    + CONFIG.TRENDING_COUNT;
  const hasMore = !isDemoMode
    && currentPage < CONFIG.MAX_PAGES
    && loaded < totalResults;

  row.hidden = !hasMore;
}

// ===========================
// REFRESH SAVE-BUTTON STATES
// ===========================

/**
 * Update all save buttons site-wide for a given URL
 * @param {string} url
 * @param {boolean} isSaved
 */
function refreshSaveButtonsForUrl(url, isSaved) {
  // Select every save button that references this URL
  document.querySelectorAll(`.js-save-btn[data-url="${CSS.escape(url)}"]`).forEach((btn) => {
    const icon = btn.querySelector('i');

    if (btn.classList.contains('card-save-overlay')) {
      btn.classList.toggle('saved', isSaved);
      if (icon) icon.className = `fa-${isSaved ? 'solid' : 'regular'} fa-bookmark`;
      btn.setAttribute('aria-label', isSaved ? 'Remove from saved' : 'Save article');
    } else if (btn.classList.contains('card-action-btn')) {
      btn.classList.toggle('active', isSaved);
      if (icon) icon.className = `fa-${isSaved ? 'solid' : 'regular'} fa-bookmark`;
    } else {
      // Featured card / generic save button
      const label = btn.querySelector('.save-label');
      if (label) label.textContent = isSaved ? 'Saved' : 'Save';
      if (icon)  icon.className   = `fa-${isSaved ? 'solid' : 'regular'} fa-bookmark`;
      btn.classList.toggle('btn-saved-active', isSaved);
    }
  });
}
