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
    const label = document.getElementById('theme-toggle-label');
    if (!themeIcon) return;
    if (theme === 'dark') {
      // In dark mode, show option to enter light world
      themeIcon.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
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
      if (label) label.textContent = 'Enter Light World';
    } else {
      // In light mode, show Enter Glass Dark World
      themeIcon.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
      if (label) label.textContent = 'Enter Glass Dark World';
    }
  }

  function triggerThemeTransition(clickEvent, nextTheme) {
    // Create expanding ripple effect originating from button or center
    const ripple = document.createElement('div');
    ripple.className = `theme-ripple to-${nextTheme}`;
    
    let x = window.innerWidth / 2;
    let y = 100;

    if (clickEvent && clickEvent.clientX) {
      x = clickEvent.clientX;
      y = clickEvent.clientY;
    } else if (themeToggleBtn) {
      const rect = themeToggleBtn.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    }

    const maxDim = Math.max(window.innerWidth, window.innerHeight) * 2.2;
    ripple.style.width = `${maxDim}px`;
    ripple.style.height = `${maxDim}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    document.body.appendChild(ripple);

    // Trigger animation via requestAnimationFrame
    requestAnimationFrame(() => {
      ripple.classList.add('animating');
    });

    // Remove element after transition completes
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 700);
  }

  function toggleTheme(event) {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    triggerThemeTransition(event, nextTheme);

    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('portfolio-theme', nextTheme);
    updateThemeIcon(nextTheme);

    // Notify window for Hyperspeed, OptionWheel, and canvas background
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: nextTheme } }));
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', (e) => toggleTheme(e));
    updateThemeIcon(document.documentElement.getAttribute('data-theme'));
  }

  // Keyboard shortcut 'T' to toggle theme
  window.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
    if (e.key === 't' || e.key === 'T') {
      e.preventDefault();
      toggleTheme(null);
    }
  });
});
