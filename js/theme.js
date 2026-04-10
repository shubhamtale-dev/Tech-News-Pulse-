/**
 * Tech News Pulse — Theme Module
 * Handles dark/light theme toggle with smooth transition
 */

const Theme = {
  /** Apply a theme to the document */
  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this._updateIcon(theme);
  },

  /** Toggle theme and persist */
  toggle() {
    const next = AppState.toggleTheme();
    this.apply(next);
    showToast(
      next === 'dark' ? '🌙 Dark mode enabled' : '☀️ Light mode enabled',
      'info'
    );
  },

  /** Sync icon with theme */
  _updateIcon(theme) {
    const icon = document.getElementById('theme-icon');
    if (!icon) return;
    icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  },

  /** Initialize from persisted state */
  init() {
    const theme = AppState.get('theme');
    this.apply(theme);
  },
};
