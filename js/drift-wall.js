/**
 * React Bits: DriftWall Component
 * High-performance Vanilla JavaScript Engine
 * 3D Infinite Drifting Wall with Perspective, Pointer Parallax, & Hover Lift
 */

(function () {
  'use strict';

  // SVG Thumbnail Generator for Verified Credentials with High Legibility (Year removed per design specs)
  function generateCertThumbnail(cert) {
    const color = cert.color || '#6366f1';
    const escapedTitle = cert.title
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    const escapedIssuer = cert.issuer
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    const escapedBadge = (cert.badge || 'VERIFIED')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Split title into 2 lines if needed for optimal card presentation
    const words = escapedTitle.split(' ');
    let line1 = words.slice(0, Math.ceil(words.length / 2)).join(' ');
    let line2 = words.slice(Math.ceil(words.length / 2)).join(' ');
    if (words.length <= 2) {
      line1 = escapedTitle;
      line2 = '';
    }

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 288" width="440" height="288">
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0a0e1a" />
            <stop offset="50%" stop-color="#111827" />
            <stop offset="100%" stop-color="#070a12" />
          </linearGradient>
          <radialGradient id="glow" cx="82%" cy="18%" r="75%">
            <stop offset="0%" stop-color="${color}" stop-opacity="0.4" />
            <stop offset="55%" stop-color="${color}" stop-opacity="0.1" />
            <stop offset="100%" stop-color="${color}" stop-opacity="0" />
          </radialGradient>
          <pattern id="grid" width="22" height="22" patternUnits="userSpaceOnUse">
            <path d="M 22 0 L 0 0 0 22" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1" />
          </pattern>
          <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${color}" stop-opacity="0.9" />
            <stop offset="50%" stop-color="rgba(255,255,255,0.25)" />
            <stop offset="100%" stop-color="${color}" stop-opacity="0.6" />
          </linearGradient>
        </defs>

        <!-- Base Background Card -->
        <rect width="440" height="288" rx="16" fill="url(#bgGrad)" />
        <rect width="440" height="288" rx="16" fill="url(#grid)" />
        <rect width="440" height="288" rx="16" fill="url(#glow)" />
        
        <!-- Luxury Dual Borders -->
        <rect x="2" y="2" width="436" height="284" rx="15" fill="none" stroke="url(#borderGrad)" stroke-width="2.5" />
        <rect x="8" y="8" width="424" height="272" rx="11" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1" />

        <!-- Header: Issuer Badge -->
        <g transform="translate(24, 24)">
          <rect width="146" height="32" rx="16" fill="${color}" fill-opacity="0.32" stroke="${color}" stroke-opacity="0.95" stroke-width="1.8" />
          <circle cx="16" cy="16" r="5" fill="${color}" />
          <text x="30" y="21" fill="#ffffff" font-family="'Plus Jakarta Sans', -apple-system, sans-serif" font-size="12.5" font-weight="800" letter-spacing="0.8">${escapedBadge.toUpperCase()}</text>
        </g>

        <!-- Issuer Subtitle -->
        <text x="24" y="88" fill="${color}" font-family="'JetBrains Mono', monospace" font-size="13.5" font-weight="800" letter-spacing="0.8">${escapedIssuer.toUpperCase()}</text>

        <!-- Certificate Title (Large & Readable) -->
        <text x="24" y="126" fill="#ffffff" font-family="'Plus Jakarta Sans', -apple-system, sans-serif" font-size="23" font-weight="800" letter-spacing="-0.3">
          <tspan x="24" dy="0">${line1}</tspan>
          ${line2 ? `<tspan x="24" dy="30" font-size="22">${line2}</tspan>` : ''}
        </text>

        <!-- Bottom Verified Credential Seal -->
        <g transform="translate(24, 230)">
          <circle cx="13" cy="13" r="12" fill="${color}" fill-opacity="0.35" stroke="${color}" stroke-width="2" />
          <path d="M7.5 13 L11.5 17 L18.5 9.5" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
          <text x="35" y="17.5" fill="#e2e8f0" font-family="'JetBrains Mono', monospace" font-size="11.5" font-weight="700" letter-spacing="0.6">VERIFIED CREDENTIAL</text>
        </g>

        <!-- Clickable Action Badge -->
        <g transform="translate(356, 226)">
          <rect width="60" height="30" rx="15" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="1.2" />
          <text x="30" y="19.5" fill="#ffffff" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="800">PDF ↗</text>
        </g>
      </svg>
    `.trim();

    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  const prefersReducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const columnFactor = (index, variance) => {
    const pseudo = ((index * 0.6180339887 + 0.35) % 1) * 2 - 1;
    return 1 + variance * pseudo;
  };

  class DriftWallEngine {
    constructor(mountEl, options = {}) {
      if (!mountEl) return;
      this.mountEl = mountEl;

      // Extract options with matching React Bits defaults (strictly 3 columns for balanced full-width showcase)
      this.rawItems = options.items || [];
      this.columns = 3;
      this.tileWidth = options.tileWidth || (window.innerWidth < 420 ? 150 : window.innerWidth < 680 ? 175 : window.innerWidth < 1024 ? 230 : 310);
      this.tileHeight = options.tileHeight || (window.innerWidth < 420 ? 98 : window.innerWidth < 680 ? 115 : window.innerWidth < 1024 ? 152 : 200);
      this.gap = options.gap || (window.innerWidth < 420 ? 10 : window.innerWidth < 680 ? 14 : window.innerWidth < 1024 ? 18 : 24);
      this.radius = options.radius || 16;
      this.tilt = options.tilt !== undefined ? options.tilt : 8;
      this.turn = options.turn !== undefined ? options.turn : 0;
      this.roll = options.roll || 0;
      this.perspective = options.perspective || 1400;
      this.depth = options.depth || 0;
      this.speed = options.speed || 38;
      this.direction = options.direction || 'up';
      this.variance = options.variance !== undefined ? options.variance : 0.35;
      this.parallax = options.parallax !== undefined ? options.parallax : 0.4;
      this.pauseOnHover = options.pauseOnHover !== undefined ? options.pauseOnHover : true;
      this.lift = options.lift || 65;
      this.fade = options.fade !== undefined ? options.fade : 0.5;
      this.dim = options.dim !== undefined ? options.dim : 0.65;
      this.grayscale = options.grayscale || false;
      this.overlayColor = options.overlayColor || '#060010';

      // State & tracking
      this.trackEls = [];
      this.rafId = null;
      this.offsets = [];
      this.velocities = [];
      this.hoveredCol = -1;
      this.wallHovered = false;
      this.isBoxHovered = false;
      this.isPointerMoving = false;
      this.pointerMoveTimer = null;
      this.pointer = { x: 0, y: 0 };
      this.pointerDamped = { x: 0, y: 0 };
      this.lastTs = null;
      this.containerHeight = 680;
      this.activeTileEl = null;
      this.reduced = prefersReducedMotion();
      this.currentCategory = 'all';

      this.activePillEl = null;

      this.init();
    }

    init() {
      // Build items with SVG visuals
      this.items = this.rawItems.map((cert, index) => {
        return {
          id: cert.id || index + 1,
          title: cert.title,
          issuer: cert.issuer,
          year: cert.year,
          badge: cert.badge,
          color: cert.color,
          file: cert.file,
          image: generateCertThumbnail(cert),
          href: `Certifications/${encodeURIComponent(cert.file)}`
        };
      });

      // Prepare columns
      this.columnItems = Array.from({ length: this.columns }, () => []);
      this.items.forEach((item, i) => {
        this.columnItems[i % this.columns].push(item);
      });
      this.columnItems = this.columnItems.map((col) => (col.length ? col : this.items.slice(0, 1)));

      this.calculateDimensions();
      this.render();
      this.attachEvents();
      this.setupObserver();
    }

    calculateDimensions() {
      this.containerHeight = this.containerEl ? this.containerEl.offsetHeight || 680 : 680;
      const unit = this.tileHeight + this.gap;

      // Dynamic calculation to ensure zero missing boxes during 3D perspective scroll:
      this.columnMeta = this.columnItems.map((col) => {
        const copyHeight = Math.max(unit, col.length * unit);
        const copies = Math.max(6, Math.ceil((this.containerHeight * 5) / copyHeight) + 2);
        return { copyHeight, copies };
      });

      const dirSign = this.direction === 'up' ? 1 : -1;
      this.baseVelocities = this.columnItems.map((_, c) => {
        const altSign = c % 2 === 0 ? 1 : -1;
        return this.speed * columnFactor(c, variance(this.variance)) * dirSign * altSign;
      });

      this.offsets = this.columnMeta.map((meta, c) => meta.copyHeight * ((c * 0.37) % 1));
      this.velocities = this.columnItems.map(() => 0);
    }

    render() {
      this.mountEl.innerHTML = '';

      // Create main DriftWall container
      const container = document.createElement('div');
      container.className = `drift-wall ${this.reduced ? 'drift-wall--reduced' : ''}`;
      container.setAttribute('role', 'group');
      container.setAttribute('aria-label', '3D Drifting Wall of Verified Credentials');

      // Set CSS Variables
      container.style.setProperty('--dw-tile-w', `${this.tileWidth}px`);
      container.style.setProperty('--dw-tile-h', `${this.tileHeight}px`);
      container.style.setProperty('--dw-gap', `${this.gap}px`);
      container.style.setProperty('--dw-radius', `${this.radius}px`);
      container.style.setProperty('--dw-perspective', `${this.perspective}px`);
      container.style.setProperty('--dw-lift', `${this.lift}px`);
      container.style.setProperty('--dw-dim', this.dim);
      container.style.setProperty('--dw-gray', this.grayscale ? 1 : 0);
      container.style.setProperty('--dw-overlay', this.overlayColor);
      container.style.setProperty('--dw-edge', `${Math.max(0, (1 - this.fade) * 100)}%`);

      // 3D Plane
      const plane = document.createElement('div');
      plane.className = 'drift-wall__plane';
      this.planeEl = plane;

      // Build Columns & Tracks with sufficient copies to prevent disappearance
      this.rebuildTracks();
      container.appendChild(plane);

      // Active Tile Inspection Pill (floating indicator on hover)
      const activePill = document.createElement('div');
      activePill.className = 'drift-wall-active-pill';
      activePill.style.opacity = '0';
      activePill.innerHTML = `
        <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#10b981;box-shadow:0 0 10px #10b981;"></span>
        <span class="drift-wall-active-text" style="font-weight:600;">Hover over any tile</span>
        <span style="font-size:0.75rem;opacity:0.75;margin-left:4px;">↗ Click to open PDF</span>
      `;
      container.appendChild(activePill);

      this.mountEl.appendChild(container);
      this.containerEl = container;
      this.planeEl = plane;
      this.activePillEl = activePill;
    }

    rebuildTracks() {
      if (!this.planeEl) return;
      this.planeEl.innerHTML = '';
      this.trackEls = [];

      this.columnItems.forEach((col, c) => {
        const colEl = document.createElement('div');
        colEl.className = 'drift-wall__col';

        const trackEl = document.createElement('div');
        trackEl.className = 'drift-wall__track';

        const meta = this.columnMeta ? this.columnMeta[c] : null;
        const copiesCount = meta ? meta.copies : 6;

        for (let copyIdx = 0; copyIdx < copiesCount; copyIdx++) {
          col.forEach((item, itemIdx) => {
            const tileId = `${c}-${copyIdx}-${itemIdx}`;
            const tileLink = document.createElement('a');
            tileLink.className = 'drift-wall__tile';
            tileLink.setAttribute('data-tile-id', tileId);
            tileLink.setAttribute('data-col', c);
            tileLink.setAttribute('data-cert-id', item.id);
            tileLink.setAttribute('href', item.href);
            tileLink.setAttribute('target', '_blank');
            tileLink.setAttribute('rel', 'noreferrer noopener');
            tileLink.setAttribute('title', `${item.title} (${item.issuer}) - Click to view PDF`);
            tileLink.setAttribute('aria-label', `${item.title} by ${item.issuer}`);

            const inner = document.createElement('span');
            inner.className = 'drift-wall__inner';

            const img = document.createElement('img');
            img.src = item.image;
            img.alt = item.title;
            img.loading = 'lazy';
            img.decoding = 'async';
            img.draggable = false;

            const overlay = document.createElement('span');
            overlay.className = 'drift-wall__overlay';
            overlay.setAttribute('aria-hidden', 'true');

            inner.appendChild(img);
            inner.appendChild(overlay);
            tileLink.appendChild(inner);

            tileLink.addEventListener('focus', () => this.activate(tileLink, item));
            tileLink.addEventListener('blur', () => this.release());

            // Track pointer interaction to guarantee click even while track is translating
            let pDownX = 0;
            let pDownY = 0;
            let pDownTime = 0;

            tileLink.addEventListener('pointerdown', (e) => {
              pDownX = e.clientX;
              pDownY = e.clientY;
              pDownTime = Date.now();
            });

            tileLink.addEventListener('pointerup', (e) => {
              const dist = Math.hypot(e.clientX - pDownX, e.clientY - pDownY);
              const elapsed = Date.now() - pDownTime;
              if (elapsed < 500 && dist < 24) {
                e.preventDefault();
                e.stopPropagation();
                window.open(item.href, '_blank', 'noopener,noreferrer');
                if (window.showToast) {
                  window.showToast(`Opening Credential: ${item.title} (${item.issuer})`);
                }
              }
            });

            tileLink.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              window.open(item.href, '_blank', 'noopener,noreferrer');
              if (window.showToast) {
                window.showToast(`Opening Credential: ${item.title} (${item.issuer})`);
              }
            });

            trackEl.appendChild(tileLink);
          });
        }

        colEl.appendChild(trackEl);
        this.planeEl.appendChild(colEl);
        this.trackEls.push(trackEl);
      });
    }

    filterCategory(categoryKey) {
      this.currentCategory = categoryKey || 'all';

      const driftMount = document.getElementById('drift-wall-mount');
      const categoryDeck = document.getElementById('certs-category-deck');

      if (categoryKey === 'all') {
        // Mode 1: All Credentials (25) -> Continuous 3D Rolling Wall
        if (categoryDeck) {
          categoryDeck.style.display = 'none';
          categoryDeck.innerHTML = '';
        }
        if (driftMount) {
          driftMount.style.display = 'block';
        }
        this.startLoop();
      } else {
        // Mode 2: Specific Category -> Dedicated Single-Instance Showcase Deck (Zero duplicates)
        this.stopLoop();
        if (driftMount) {
          driftMount.style.display = 'none';
        }

        if (categoryDeck) {
          categoryDeck.style.display = 'grid';
          categoryDeck.innerHTML = '';

          // Filter matching certificates from the raw 25 items catalog (each shown exactly ONCE, year removed)
          const matches = this.rawItems.filter((cert) => {
            if (categoryKey === 'genai') return cert.category === 'genai';
            if (categoryKey === 'ml') return cert.category === 'ml';
            if (categoryKey === 'python') return cert.category === 'python';
            if (categoryKey === 'cloud') return cert.category === 'cloud' || cert.category === 'software' || cert.category === 'systems';
            if (categoryKey === 'data') return cert.category === 'data' || cert.category === 'business';
            return cert.category === categoryKey;
          });

          if (matches.length === 0) {
            categoryDeck.innerHTML = `
              <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-secondary);">
                <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">No verified credentials found for this category.</p>
                <button class="certs-nav-btn active" style="margin: 0 auto;" onclick="document.querySelector('.certs-nav-btn[data-category=all]').click()">View All 25 Credentials</button>
              </div>
            `;
            return;
          }

          matches.forEach((cert) => {
            const card = document.createElement('div');
            card.className = 'cert-deck-card liquid-glass-card';
            card.style.setProperty('--card-accent', cert.color || '#6366f1');

            card.innerHTML = `
              <div class="cert-deck-header">
                <span class="cert-deck-badge" style="--card-accent: ${cert.color || '#6366f1'};">
                  <span class="cert-deck-dot"></span>
                  ${cert.badge || 'VERIFIED'}
                </span>
              </div>

              <h3 class="cert-deck-title">${cert.title}</h3>
              <div class="cert-deck-issuer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                <span>${cert.issuer}</span>
              </div>

              <div class="cert-deck-footer">
                <div class="cert-deck-seal">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span>VERIFIED CREDENTIAL</span>
                </div>
                <a href="Certifications/${encodeURIComponent(cert.file)}" target="_blank" rel="noreferrer noopener" class="cert-deck-action liquid-glass-btn" title="Open verification PDF for ${cert.title}">
                  <span>View PDF</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                </a>
              </div>
            `;

            card.style.cursor = 'pointer';
            card.addEventListener('click', (e) => {
              if (!e.target.closest('.cert-deck-action')) {
                window.open(`Certifications/${encodeURIComponent(cert.file)}`, '_blank', 'noopener,noreferrer');
              }
              if (window.showToast) {
                window.showToast(`Opening Credential: ${cert.title} (${cert.issuer})`);
              }
            });

            categoryDeck.appendChild(card);
          });
        }
      }
    }

    applyPlaneTransform(px = 0, py = 0) {
      if (!this.planeEl) return;
      this.planeEl.style.transform =
        `translate(-50%, -50%) ` +
        `rotateX(${this.tilt + py}deg) rotateY(${this.turn + px}deg) rotateZ(${this.roll}deg)`;
    }

    activate(tile, item) {
      if (!tile || tile === this.activeTileEl) return;
      if (this.activeTileEl) {
        this.activeTileEl.classList.remove('is-active');
      }
      this.activeTileEl = tile;
      tile.classList.add('is-active');

      // Update inspection pill (without year per design specs)
      if (this.activePillEl && item) {
        const textSpan = this.activePillEl.querySelector('.drift-wall-active-text');
        if (textSpan) {
          textSpan.textContent = `${item.title} • ${item.issuer}`;
        }
        this.activePillEl.style.opacity = '1';
        this.activePillEl.style.transform = 'translateX(-50%) translateY(0)';
      }
    }

    release() {
      if (this.activeTileEl) {
        this.activeTileEl.classList.remove('is-active');
        this.activeTileEl = null;
      }
      this.hoveredCol = -1;
      this.isBoxHovered = false;

      if (this.activePillEl) {
        this.activePillEl.style.opacity = '0';
        this.activePillEl.style.transform = 'translateX(-50%) translateY(6px)';
      }
    }

    attachEvents() {
      if (!this.containerEl) return;

      // Smooth pointer parallax tracking with movement detection
      let pointerTicking = false;
      this.containerEl.addEventListener('pointermove', (e) => {
        // When cursor moves, animation starts moving again!
        this.isPointerMoving = true;
        if (this.pointerMoveTimer) clearTimeout(this.pointerMoveTimer);
        this.pointerMoveTimer = setTimeout(() => {
          this.isPointerMoving = false;
        }, 220);

        if (this.parallax <= 0 || this.reduced) return;
        if (!pointerTicking) {
          requestAnimationFrame(() => {
            const rect = this.containerEl.getBoundingClientRect();
            if (rect && rect.width > 0 && rect.height > 0) {
              this.pointer.x = (e.clientX - rect.left) / rect.width - 0.5;
              this.pointer.y = (e.clientY - rect.top) / rect.height - 0.5;
            }
            pointerTicking = false;
          });
          pointerTicking = true;
        }
      }, { passive: true });

      // Fast, lag-free tile hover: pause scrolling when resting on the box
      this.containerEl.addEventListener('pointerover', (e) => {
        const tile = e.target.closest('.drift-wall__tile');
        if (tile) {
          this.isBoxHovered = true;
          const certId = parseInt(tile.getAttribute('data-cert-id'), 10);
          const matchedItem = this.items.find((it) => it.id === certId);
          this.activate(tile, matchedItem);
        }
      }, { passive: true });

      this.containerEl.addEventListener('pointerout', (e) => {
        const related = e.relatedTarget;
        if (!related || !this.containerEl.contains(related)) {
          this.isBoxHovered = false;
          this.release();
        } else if (!related.closest('.drift-wall__tile')) {
          this.isBoxHovered = false;
          this.release();
        }
      }, { passive: true });

      this.containerEl.addEventListener('pointerenter', () => {
        this.wallHovered = true;
      }, { passive: true });

      this.containerEl.addEventListener('pointerleave', () => {
        this.wallHovered = false;
        this.isBoxHovered = false;
        this.isPointerMoving = false;
        if (this.pointerMoveTimer) clearTimeout(this.pointerMoveTimer);
        this.pointer = { x: 0, y: 0 };
        this.release();
      }, { passive: true });

      // ResizeObserver for dynamic height adjustments
      if (typeof ResizeObserver !== 'undefined') {
        const ro = new ResizeObserver(([entry]) => {
          const newHeight = entry.contentRect.height || 680;
          if (newHeight !== this.containerHeight) {
            this.containerHeight = newHeight;
            this.calculateDimensions();
          }
        });
        ro.observe(this.containerEl);
      }

      // Responsive window resize (strictly maintains 3 columns)
      window.addEventListener('resize', () => {
        this.columns = 3;
        const newW = window.innerWidth < 420 ? 150 : window.innerWidth < 680 ? 175 : window.innerWidth < 1024 ? 230 : 310;
        const newH = window.innerWidth < 420 ? 98 : window.innerWidth < 680 ? 115 : window.innerWidth < 1024 ? 152 : 200;
        const newG = window.innerWidth < 420 ? 10 : window.innerWidth < 680 ? 14 : window.innerWidth < 1024 ? 18 : 24;
        if (newW !== this.tileWidth || newH !== this.tileHeight) {
          this.tileWidth = newW;
          this.tileHeight = newH;
          this.gap = newG;
          this.init();
        }
      });

      // Reactive theme styling
      window.addEventListener('themeChanged', (e) => {
        const theme = e.detail?.theme || document.documentElement.getAttribute('data-theme');
        if (this.containerEl) {
          this.containerEl.style.setProperty('--dw-overlay', theme === 'light' ? '#c8d8ec' : '#060010');
          this.containerEl.style.setProperty('--dw-dim', theme === 'light' ? '0.85' : '0.65');
        }
      });
    }

    toggleDirection() {
      this.direction = this.direction === 'up' ? 'down' : 'up';
      const dirSign = this.direction === 'up' ? 1 : -1;
      this.baseVelocities = this.columnItems.map((_, c) => {
        const altSign = c % 2 === 0 ? 1 : -1;
        return this.speed * columnFactor(c, variance(this.variance)) * dirSign * altSign;
      });
      return this.direction;
    }

    setupObserver() {
      if ('IntersectionObserver' in window) {
        this.observer = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) {
            if (this.currentCategory === 'all') {
              this.startLoop();
            }
          } else {
            this.stopLoop();
          }
        }, { rootMargin: '150px 0px' });
        this.observer.observe(this.mountEl);
      } else {
        this.startLoop();
      }
    }

    startLoop() {
      if (this.isRunning) return;
      this.isRunning = true;
      this.lastTs = null;

      const animate = (ts) => {
        if (!this.isRunning) return;
        if (this.lastTs === null) this.lastTs = ts;
        const dt = Math.min(0.05, Math.max(0, ts - this.lastTs) / 1000);
        this.lastTs = ts;

        // Pointer damping for buttery smooth parallax
        const maxTilt = this.parallax * 8;
        const targetX = this.pointer.x * maxTilt;
        const targetY = -this.pointer.y * maxTilt;
        const damp = 1 - Math.exp(-dt / 0.12);

        this.pointerDamped.x += (targetX - this.pointerDamped.x) * damp;
        this.pointerDamped.y += (targetY - this.pointerDamped.y) * damp;
        this.applyPlaneTransform(this.pointerDamped.x, this.pointerDamped.y);

        if (!this.reduced) {
          for (let c = 0; c < this.trackEls.length; c++) {
            const meta = this.columnMeta[c];
            if (!meta) continue;

            // When cursor is resting on the box, scrolling down/up stops. When cursor moves, it moves again!
            const boxStopped = this.isBoxHovered && !this.isPointerMoving;
            const factor = boxStopped ? 0 : 1;
            const target = this.baseVelocities[c] * factor;

            const ease = 1 - Math.exp(-dt / (target === 0 ? 0.12 : 0.28));
            this.velocities[c] += (target - this.velocities[c]) * ease;

            let next = (this.offsets[c] ?? 0) + this.velocities[c] * dt;
            next = ((next % meta.copyHeight) + meta.copyHeight) % meta.copyHeight;
            this.offsets[c] = next;

            const el = this.trackEls[c];
            if (el) {
              // Offset by 2 full copy heights to prevent disappearing edge tiles during tilt
              const startBuffer = 2 * meta.copyHeight;
              el.style.transform = `translate3d(0, ${-(startBuffer + next)}px, 0)`;
            }
          }
        } else {
          for (let c = 0; c < this.trackEls.length; c++) {
            const el = this.trackEls[c];
            const meta = this.columnMeta[c];
            if (el && meta) {
              const startBuffer = 2 * meta.copyHeight;
              el.style.transform = `translate3d(0, ${-(startBuffer + (this.offsets[c] ?? 0))}px, 0)`;
            }
          }
        }

        this.rafId = requestAnimationFrame(animate);
      };

      this.rafId = requestAnimationFrame(animate);
    }

    stopLoop() {
      this.isRunning = false;
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    }

    destroy() {
      this.stopLoop();
      if (this.observer) this.observer.disconnect();
      this.mountEl.innerHTML = '';
    }
  }

  function variance(v) {
    return v !== undefined ? v : 0.45;
  }

  // Initialize DriftWall once DOM and CERTIFICATIONS_DATA are available
  function initDriftWall() {
    const mount = document.getElementById('drift-wall-mount');
    if (!mount) return;

    const certs = typeof CERTIFICATIONS_DATA !== 'undefined' ? CERTIFICATIONS_DATA : [];

    const driftWallInstance = new DriftWallEngine(mount, {
      items: certs,
      columns: 3,
      tileWidth: window.innerWidth < 420 ? 150 : window.innerWidth < 680 ? 175 : window.innerWidth < 1024 ? 230 : 310,
      tileHeight: window.innerWidth < 420 ? 98 : window.innerWidth < 680 ? 115 : window.innerWidth < 1024 ? 152 : 200,
      gap: window.innerWidth < 420 ? 10 : window.innerWidth < 680 ? 14 : window.innerWidth < 1024 ? 18 : 24,
      radius: 16,
      tilt: 8,
      turn: 0,
      roll: 0,
      perspective: 1400,
      depth: 0,
      speed: 38,
      direction: 'up',
      variance: 0.35,
      parallax: 0.4,
      pauseOnHover: true,
      lift: 65,
      fade: 0.5,
      dim: 0.65,
      grayscale: false
    });

    window.driftWall = driftWallInstance;

    // Top Mini Navbar for Section-Wise Credentials
    const certNavBtns = document.querySelectorAll('.certs-nav-btn');
    const navIndicator = document.getElementById('certs-nav-indicator');

    function updateIndicator(targetBtn) {
      if (!targetBtn || !navIndicator) return;
      navIndicator.style.left = `${targetBtn.offsetLeft}px`;
      navIndicator.style.width = `${targetBtn.offsetWidth}px`;
    }

    if (certNavBtns.length > 0 && navIndicator) {
      const initialActive = document.querySelector('.certs-nav-btn.active') || certNavBtns[0];
      setTimeout(() => updateIndicator(initialActive), 120);

      window.addEventListener('resize', () => {
        const active = document.querySelector('.certs-nav-btn.active');
        if (active) updateIndicator(active);
      });

      certNavBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          certNavBtns.forEach((b) => {
            const isMatch = b === btn;
            b.classList.toggle('active', isMatch);
            b.setAttribute('aria-selected', isMatch ? 'true' : 'false');
          });

          updateIndicator(btn);

          const category = btn.getAttribute('data-category');
          driftWallInstance.filterCategory(category);
        });
      });
    }

    // Hook up Direction Toggle Button
    const toggleBtn = document.getElementById('drift-wall-toggle-direction');
    const labelSpan = document.getElementById('drift-dir-label');
    if (toggleBtn && labelSpan) {
      toggleBtn.addEventListener('click', () => {
        const newDir = driftWallInstance.toggleDirection();
        labelSpan.textContent = newDir === 'up' ? 'Direction: ↑ Up' : 'Direction: ↓ Down';
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDriftWall);
  } else {
    initDriftWall();
  }
})();
