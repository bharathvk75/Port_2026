// ==========================================================================
// THEME CONTROLLER: Dual Living Video & True Glass Theme Engine
// ==========================================================================

(function initTheme() {
  const savedTheme = localStorage.getItem('portfolio-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Default to light mode (studio metallic titanium), or respect saved
  const initialTheme = savedTheme ? savedTheme : (systemPrefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', initialTheme);
})();

document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    if (theme === 'dark') {
      // Show sun icon to switch to light
      themeIcon.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      `;
    } else {
      // Show moon icon to switch to dark
      themeIcon.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
    }
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('portfolio-theme', nextTheme);
    updateThemeIcon(nextTheme);

    // Notify window for canvas redraw and any reactive elements
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: nextTheme } }));
    syncBackgroundVideos(nextTheme);
  }

  function syncBackgroundVideos(theme) {
    const current = theme || document.documentElement.getAttribute('data-theme') || 'light';
    const videoDark = document.getElementById('hero-bg-video-dark');
    const videoLight = document.getElementById('hero-bg-video-light');
    if (!videoDark || !videoLight) return;

    if (current === 'dark') {
      videoLight.pause();
      const playPromise = videoDark.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } else {
      videoDark.pause();
      const playPromise = videoLight.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
    updateThemeIcon(document.documentElement.getAttribute('data-theme'));
  }

  // Initialize videos once DOM is ready
  syncBackgroundVideos();

  // Retry video play on first user interaction in case browser autoplay was restricted
  const unlockAutoplay = () => {
    syncBackgroundVideos();
    window.removeEventListener('click', unlockAutoplay);
    window.removeEventListener('scroll', unlockAutoplay);
    window.removeEventListener('keydown', unlockAutoplay);
  };
  window.addEventListener('click', unlockAutoplay, { once: true });
  window.addEventListener('scroll', unlockAutoplay, { once: true });
  window.addEventListener('keydown', unlockAutoplay, { once: true });

  // Handle visibility changes to keep background running smoothly
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      syncBackgroundVideos();
    }
  });

  // Keyboard shortcut 'T' to toggle theme
  window.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
    if (e.key === 't' || e.key === 'T') {
      e.preventDefault();
      toggleTheme();
    }
  });
});
