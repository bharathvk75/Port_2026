/**
 * React Bits: DriftWall Component
 * High-performance Vanilla JavaScript Engine
 * 3D Infinite Drifting Wall with Perspective, Pointer Parallax, & Hover Lift
 */

(function () {
  'use strict';

  // SVG Thumbnail Generator for Verified Credentials
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

    // Split title into 2 lines if needed
    const words = escapedTitle.split(' ');
    let line1 = words.slice(0, Math.ceil(words.length / 2)).join(' ');
    let line2 = words.slice(Math.ceil(words.length / 2)).join(' ');
    if (words.length <= 2) {
      line1 = escapedTitle;
      line2 = '';
    }

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 276" width="420" height="276">
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0e1322" />
            <stop offset="50%" stop-color="#141c30" />
            <stop offset="100%" stop-color="#090d18" />
          </linearGradient>
          <radialGradient id="glow" cx="80%" cy="20%" r="70%">
            <stop offset="0%" stop-color="${color}" stop-opacity="0.35" />
            <stop offset="60%" stop-color="${color}" stop-opacity="0.08" />
            <stop offset="100%" stop-color="${color}" stop-opacity="0" />
          </radialGradient>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1" />
          </pattern>
          <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${color}" stop-opacity="0.8" />
            <stop offset="50%" stop-color="rgba(255,255,255,0.2)" />
            <stop offset="100%" stop-color="${color}" stop-opacity="0.5" />
          </linearGradient>
        </defs>

        <!-- Base Background Card -->
        <rect width="420" height="276" rx="14" fill="url(#bgGrad)" />
        <rect width="420" height="276" rx="14" fill="url(#grid)" />
        <rect width="420" height="276" rx="14" fill="url(#glow)" />
        
        <!-- Luxury Border -->
        <rect x="1.5" y="1.5" width="417" height="273" rx="13" fill="none" stroke="url(#borderGrad)" stroke-width="2" />
        <rect x="7" y="7" width="406" height="262" rx="10" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1" />

        <!-- Header: Issuer Badge -->
        <g transform="translate(24, 22)">
          <rect width="138" height="30" rx="15" fill="${color}" fill-opacity="0.28" stroke="${color}" stroke-opacity="0.85" stroke-width="1.5" />
          <circle cx="15" cy="15" r="5" fill="${color}" />
          <text x="28" y="19" fill="#ffffff" font-family="'Plus Jakarta Sans', -apple-system, sans-serif" font-size="11.5" font-weight="800" letter-spacing="0.8">${escapedBadge.toUpperCase()}</text>
        </g>

        <!-- Year Pill -->
        <g transform="translate(328, 22)">
          <rect width="68" height="30" rx="15" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.22)" stroke-width="1" />
          <text x="34" y="19" fill="#e2e8f0" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="700">${cert.year}</text>
        </g>

        <!-- Issuer Subtitle -->
        <text x="24" y="86" fill="${color}" font-family="'JetBrains Mono', monospace" font-size="12.5" font-weight="700" letter-spacing="0.8">${escapedIssuer.toUpperCase()}</text>

        <!-- Certificate Title -->
        <text x="24" y="122" fill="#ffffff" font-family="'Plus Jakarta Sans', -apple-system, sans-serif" font-size="20" font-weight="800" letter-spacing="-0.3">
          <tspan x="24" dy="0">${line1}</tspan>
          ${line2 ? `<tspan x="24" dy="28">${line2}</tspan>` : ''}
        </text>

        <!-- Bottom Verified Credential Seal -->
        <g transform="translate(24, 220)">
          <!-- Seal Icon -->
          <circle cx="12" cy="12" r="11" fill="${color}" fill-opacity="0.3" stroke="${color}" stroke-width="1.8" />
          <path d="M7 12 L10.5 15.5 L17 8.5" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
          <text x="32" y="16" fill="#cbd5e1" font-family="'JetBrains Mono', monospace" font-size="10.5" font-weight="600" letter-spacing="0.6">VERIFIED CREDENTIAL</text>
        </g>

        <!-- Clickable Action Badge -->
        <g transform="translate(346, 218)">
          <rect width="50" height="26" rx="13" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.25)" stroke-width="1" />
          <text x="25" y="17" fill="#ffffff" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="700">PDF ↗</text>
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

      // Extract options with matching React Bits defaults
      this.rawItems = options.items || [];
      this.columns = options.columns || (window.innerWidth < 640 ? 3 : window.innerWidth < 1024 ? 4 : 5);
      this.tileWidth = options.tileWidth || (window.innerWidth < 640 ? 155 : window.innerWidth < 1024 ? 180 : 210);
      this.tileHeight = options.tileHeight || (window.innerWidth < 640 ? 102 : window.innerWidth < 1024 ? 118 : 138);
      this.gap = options.gap || 18;
      this.radius = options.radius || 14;
      this.tilt = options.tilt !== undefined ? options.tilt : 16;
      this.turn = options.turn !== undefined ? options.turn : -14;
      this.roll = options.roll || 0;
      this.perspective = options.perspective || 1200;
      this.depth = options.depth || 120;
      this.speed = options.speed || 42;
      this.direction = options.direction || 'up';
      this.variance = options.variance !== undefined ? options.variance : 0.45;
      this.parallax = options.parallax !== undefined ? options.parallax : 0.6;
      this.pauseOnHover = options.pauseOnHover || false;
      this.lift = options.lift || 64;
      this.fade = options.fade !== undefined ? options.fade : 0.6;
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
      this.pointer = { x: 0, y: 0 };
      this.pointerDamped = { x: 0, y: 0 };
      this.lastTs = null;
      this.containerHeight = 600;
      this.activeId = null;
      this.reduced = prefersReducedMotion();

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

      this.render();
      this.calculateDimensions();
      this.attachEvents();
      this.setupObserver();
    }

    calculateDimensions() {
      this.containerHeight = this.containerEl ? this.containerEl.offsetHeight || 600 : 600;
      const unit = this.tileHeight + this.gap;

      this.columnMeta = this.columnItems.map((col) => {
        const copyHeight = Math.max(unit, col.length * unit);
        const copies = Math.max(2, Math.ceil((this.containerHeight * 1.6) / copyHeight) + 1);
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

      // Build Columns & Tracks
      this.rebuildTracks();
      container.appendChild(plane);

      // Active Tile Inspection Pill (floating indicator on hover)
      const activePill = document.createElement('div');
      activePill.className = 'drift-wall-active-pill';
      activePill.style.opacity = '0';
      activePill.innerHTML = `
        <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#10b981;"></span>
        <span class="drift-wall-active-text" style="font-weight:600;">Hover over any tile</span>
        <span style="font-size:0.75rem;opacity:0.7;margin-left:4px;">↗ Click to open PDF</span>
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

        const copiesCount = 3;
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
            tileLink.addEventListener('click', () => {
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
      if (this.currentCategory === categoryKey) return;
      this.currentCategory = categoryKey;

      if (this.containerEl) {
        this.containerEl.style.transition = 'opacity 0.22s cubic-bezier(0.4, 0, 0.2, 1), transform 0.22s cubic-bezier(0.4, 0, 0.2, 1)';
        this.containerEl.style.opacity = '0.35';
        this.containerEl.style.transform = 'scale(0.985)';
      }

      setTimeout(() => {
        let filtered = this.rawItems;
        if (categoryKey && categoryKey !== 'all') {
          filtered = this.rawItems.filter((it) => {
            if (categoryKey === 'genai') return it.category === 'genai';
            if (categoryKey === 'ml') return it.category === 'ml';
            if (categoryKey === 'python') return it.category === 'python';
            if (categoryKey === 'cloud') return it.category === 'cloud' || it.category === 'software' || it.category === 'systems';
            if (categoryKey === 'data') return it.category === 'data' || it.category === 'business';
            return it.category === categoryKey;
          });
          while (filtered.length < 15 && filtered.length > 0) {
            filtered = [...filtered, ...filtered];
          }
        }

        this.items = filtered.map((cert, index) => ({
          id: cert.id || index + 1,
          title: cert.title,
          issuer: cert.issuer,
          year: cert.year,
          badge: cert.badge,
          color: cert.color,
          file: cert.file,
          image: generateCertThumbnail(cert),
          href: `Certifications/${encodeURIComponent(cert.file)}`
        }));

        this.columnItems = Array.from({ length: this.columns }, () => []);
        this.items.forEach((item, i) => {
          this.columnItems[i % this.columns].push(item);
        });
        this.columnItems = this.columnItems.map((col) => (col.length ? col : this.items.slice(0, 1)));

        this.rebuildTracks();
        this.calculateDimensions();

        if (this.containerEl) {
          this.containerEl.style.opacity = '1';
          this.containerEl.style.transform = 'scale(1)';
        }
      }, 200);
    }

    applyPlaneTransform(px, py) {
      if (!this.planeEl) return;
      this.planeEl.style.transform =
        `translate(-50%, -50%) scale(1.18) ` +
        `rotateX(${this.tilt + py}deg) rotateY(${this.turn + px}deg) rotateZ(${this.roll}deg) ` +
        `translateZ(${-this.depth}px)`;
    }

    activate(tile, item) {
      if (!tile || tile === this.activeTileEl) return;
      if (this.activeTileEl) {
        this.activeTileEl.classList.remove('is-active');
      }
      this.activeTileEl = tile;
      tile.classList.add('is-active');

      // Update inspection pill
      if (this.activePillEl && item) {
        const textSpan = this.activePillEl.querySelector('.drift-wall-active-text');
        if (textSpan) {
          textSpan.textContent = `${item.title} • ${item.issuer} (${item.year})`;
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

      if (this.activePillEl) {
        this.activePillEl.style.opacity = '0';
        this.activePillEl.style.transform = 'translateX(-50%) translateY(6px)';
      }
    }

    attachEvents() {
      if (!this.containerEl) return;

      // Smooth pointer parallax tracking without synchronous layout reflows
      let pointerTicking = false;
      this.containerEl.addEventListener('pointermove', (e) => {
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

      // Fast, lag-free tile hover using event delegation (NO elementFromPoint!)
      this.containerEl.addEventListener('pointerover', (e) => {
        const tile = e.target.closest('.drift-wall__tile');
        if (tile) {
          const certId = parseInt(tile.getAttribute('data-cert-id'), 10);
          const matchedItem = this.items.find((it) => it.id === certId);
          this.activate(tile, matchedItem);
        }
      }, { passive: true });

      this.containerEl.addEventListener('pointerout', (e) => {
        const related = e.relatedTarget;
        if (!related || !this.containerEl.contains(related)) {
          this.release();
        }
      }, { passive: true });

      this.containerEl.addEventListener('pointerenter', () => {
        this.wallHovered = true;
      }, { passive: true });

      this.containerEl.addEventListener('pointerleave', () => {
        this.wallHovered = false;
        this.pointer = { x: 0, y: 0 };
        this.release();
      }, { passive: true });

      // ResizeObserver
      if (typeof ResizeObserver !== 'undefined') {
        const ro = new ResizeObserver(([entry]) => {
          const newHeight = entry.contentRect.height || 600;
          if (newHeight !== this.containerHeight) {
            this.containerHeight = newHeight;
            this.calculateDimensions();
          }
        });
        ro.observe(this.containerEl);
      }

      // Responsive window resize
      window.addEventListener('resize', () => {
        const targetCols = window.innerWidth < 640 ? 3 : window.innerWidth < 1024 ? 4 : window.innerWidth < 1400 ? 5 : 6;
        if (targetCols !== this.columns) {
          this.columns = targetCols;
          this.tileWidth = window.innerWidth < 640 ? 155 : window.innerWidth < 1024 ? 180 : window.innerWidth < 1400 ? 210 : 224;
          this.tileHeight = window.innerWidth < 640 ? 102 : window.innerWidth < 1024 ? 118 : window.innerWidth < 1400 ? 138 : 148;
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
            this.startLoop();
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

            const paused = this.wallHovered && this.pauseOnHover;
            const factor = paused || this.hoveredCol === c ? 0 : 1;
            const target = this.baseVelocities[c] * factor;

            const ease = 1 - Math.exp(-dt / (target === 0 ? 0.16 : 0.28));
            this.velocities[c] += (target - this.velocities[c]) * ease;

            let next = (this.offsets[c] ?? 0) + this.velocities[c] * dt;
            next = ((next % meta.copyHeight) + meta.copyHeight) % meta.copyHeight;
            this.offsets[c] = next;

            const el = this.trackEls[c];
            if (el) {
              el.style.transform = `translate3d(0, ${-next}px, 0)`;
            }
          }
        } else {
          for (let c = 0; c < this.trackEls.length; c++) {
            const el = this.trackEls[c];
            const meta = this.columnMeta[c];
            if (el && meta) {
              el.style.transform = `translate3d(0, ${-(this.offsets[c] ?? 0)}px, 0)`;
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
      columns: window.innerWidth < 640 ? 3 : window.innerWidth < 1024 ? 4 : window.innerWidth < 1400 ? 5 : 6,
      tileWidth: window.innerWidth < 640 ? 155 : window.innerWidth < 1024 ? 180 : window.innerWidth < 1400 ? 210 : 224,
      tileHeight: window.innerWidth < 640 ? 102 : window.innerWidth < 1024 ? 118 : window.innerWidth < 1400 ? 138 : 148,
      gap: 18,
      radius: 14,
      tilt: 16,
      turn: -14,
      roll: 0,
      perspective: 1200,
      depth: 120,
      speed: 42,
      direction: 'up',
      variance: 0.45,
      parallax: 0.6,
      pauseOnHover: false,
      lift: 64,
      fade: 0.6,
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
