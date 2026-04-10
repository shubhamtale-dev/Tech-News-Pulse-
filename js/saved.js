/**
 * Tech News Pulse — Saved Articles Module
 * Handles save/unsave, sidebar rendering, and share functionality.
 *
 * Uses event DELEGATION on #app — no inline onclick handlers needed.
 * Article data is read from the nearest ancestor's data-article attribute.
 */

const Saved = {

  // ===========================
  // INIT — WIRE UP DELEGATION
  // ===========================

  /**
   * Attach delegated listeners to #app.
   * Call once during App.init().
   */
  init() {
    const app = document.getElementById('app');
    if (!app) return;

    app.addEventListener('click', (e) => {
      // ---- Save / Unsave ----
      const saveBtn = e.target.closest('.js-save-btn');
      if (saveBtn) {
        e.preventDefault();
        e.stopPropagation();
        this._handleSave(saveBtn);
        return;
      }

      // ---- Share ----
      const shareBtn = e.target.closest('.js-share-btn');
      if (shareBtn) {
        e.preventDefault();
        e.stopPropagation();
        const url   = shareBtn.dataset.url   || '';
        const title = shareBtn.dataset.title || '';
        this.share(url, title);
        return;
      }

      // ---- Sidebar remove btn ----
      const removeBtn = e.target.closest('.saved-item-remove');
      if (removeBtn) {
        e.preventDefault();
        e.stopPropagation();
        const url = removeBtn.dataset.url || '';
        this._removeSaved(url);
        return;
      }
    });
  },

  // ===========================
  // SAVE HANDLER
  // ===========================

  _handleSave(btn) {
    const url = btn.dataset.url;
    if (!url) return;

    // Find article data from nearest ancestor with data-article
    const articleEl = btn.closest('[data-article]');
    let article     = null;

    if (articleEl) {
      try {
        article = JSON.parse(articleEl.dataset.article);
      } catch (_) { /* ignore */ }
    }

    if (!article) {
      // Fallback: reconstruct minimal article from DOM
      const card  = btn.closest('.news-card, .featured-card');
      const title = card?.querySelector('.card-title, .featured-title')?.textContent?.trim() || '';
      const src   = card?.querySelector('.card-source')?.textContent?.trim() || 'Unknown';
      const img   = card?.querySelector('img')?.src || null;
      article = { url, title, source: src, image: img, description: '', publishedAt: null };
    }

    const wasSaved = AppState.isSaved(url);

    if (wasSaved) {
      AppState.unsaveArticle(url);
      showToast('Removed from saved.', 'info');
    } else {
      AppState.saveArticle(article);
      showToast('Article saved! ✓', 'success');
    }

    // Refresh every save button for this URL
    refreshSaveButtonsForUrl(url, !wasSaved);

    // Refresh sidebar + global badge / stats
    this.renderSidebar();
    updateSavedBadge();
    updateHeroStats();
  },

  // ===========================
  // SHARE
  // ===========================

  async share(url, title) {
    if (!url) return;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (_) { /* cancelled or not supported */ }
    }

    const ok = await copyToClipboard(url);
    showToast(ok ? 'Link copied to clipboard!' : 'Could not copy link.', ok ? 'success' : 'error');
  },

  // ===========================
  // INTERNAL REMOVE
  // ===========================

  _removeSaved(url) {
    if (!url) return;
    AppState.unsaveArticle(url);
    showToast('Removed from saved.', 'info');
    refreshSaveButtonsForUrl(url, false);
    this.renderSidebar();
    updateSavedBadge();
    updateHeroStats();
  },

  // ===========================
  // SIDEBAR TOGGLE
  // ===========================

  toggleSidebar() {
    const sidebar = document.getElementById('saved-sidebar');
    if (!sidebar) return;

    const willOpen = sidebar.hidden;
    sidebar.hidden = !willOpen;
    AppState.set('sidebarOpen', willOpen);

    if (willOpen) {
      this.renderSidebar();
    }
  },

  // ===========================
  // SIDEBAR RENDERER
  // ===========================

  renderSidebar() {
    const sidebar      = document.getElementById('saved-sidebar');
    if (!sidebar || sidebar.hidden) return;

    const savedList    = document.getElementById('saved-list');
    const emptyState   = document.getElementById('saved-empty-state');
    const countEl      = document.getElementById('sidebar-saved-count');
    const footerEl     = document.getElementById('sidebar-footer');

    const saved = AppState.get('savedArticles');

    if (countEl) countEl.textContent = saved.length;

    if (saved.length === 0) {
      if (savedList)  savedList.innerHTML = '';
      if (emptyState) emptyState.hidden   = false;
      if (footerEl)   footerEl.hidden     = true;
      return;
    }

    if (emptyState) emptyState.hidden = true;
    if (footerEl)   footerEl.hidden   = false;
    if (!savedList) return;

    savedList.innerHTML = saved.map((art) => {
      const imgHtml = art.image
        ? `<img class="saved-item-img" src="${art.image}" alt="" loading="lazy">`
        : `<div class="saved-item-img placeholder"><i class="fa-regular fa-image"></i></div>`;

      return `
        <div class="saved-item" data-url="${art.url}">
          ${imgHtml}
          <div class="saved-item-body">
            <span class="saved-item-source">${art.source || 'Unknown'}</span>
            <p class="saved-item-title">${art.title}</p>
            <div class="saved-item-actions">
              <a href="${art.url}" target="_blank" rel="noopener" class="saved-item-link">
                <i class="fa-solid fa-arrow-up-right-from-square"></i> Read
              </a>
              <button
                class="saved-item-remove"
                data-url="${art.url}"
                aria-label="Remove from saved"
                title="Remove"
              >
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Fix image error handlers in sidebar
    savedList.querySelectorAll('img.saved-item-img').forEach((img) => {
      img.onerror = () => {
        img.outerHTML = '<div class="saved-item-img placeholder"><i class="fa-regular fa-image"></i></div>';
      };
    });
  },

  // ===========================
  // CLEAR ALL
  // ===========================

  clearAll() {
    if (AppState.get('savedArticles').length === 0) return;
    AppState.clearAllSaved();
    this.renderSidebar();
    updateSavedBadge();
    updateHeroStats();
    showToast('All saved articles cleared.', 'info');
  },
};
