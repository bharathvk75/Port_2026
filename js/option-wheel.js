/**
 * React Bits: OptionWheel Component
 * Vanilla JavaScript Implementation
 * Curved option picker that spins via scroll, drag, or arrow keys,
 * fading and tilting items along a 3D arc away from the active selection.
 */

(function () {
  'use strict';

  class OptionWheelEngine {
    constructor(containerEl, options = {}) {
      if (!containerEl) return;
      this.rootEl = containerEl;

      this.items = options.items || [
        { label: 'AI & Multi-Agent Architecture', key: 'agentic' },
        { label: 'Machine Learning & Vision', key: 'ml' },
        { label: 'High-Throughput Backend & Data', key: 'backend' },
        { label: 'Cloud Infrastructure & DevOps', key: 'cloud' }
      ];

      this.defaultSelected = options.defaultSelected !== undefined ? options.defaultSelected : 0;
      this.onChange = typeof options.onChange === 'function' ? options.onChange : null;
      this.textColor = options.textColor || '#64748b';
      this.activeColor = options.activeColor || '#000000';
      this.side = options.side || 'right';
      this.fontSize = options.fontSize || 1.35; // in rem
      this.spacing = options.spacing || 1.45;
      this.curve = options.curve !== undefined ? options.curve : 1.2;
      this.tilt = options.tilt !== undefined ? options.tilt : 7.5;
      this.blur = options.blur !== undefined ? options.blur : 1.5;
      this.fade = options.fade !== undefined ? options.fade : 0.28;
      this.minOpacity = options.minOpacity !== undefined ? options.minOpacity : 0.12;
      this.smoothing = options.smoothing || 180;
      this.inset = options.inset !== undefined ? options.inset : 24;
      this.loop = options.loop || false;
      this.draggable = options.draggable !== false;

      this.itemEls = [];
      this.pos = this.defaultSelected;
      this.target = this.defaultSelected;
      this.selectedIndex = this.defaultSelected;
      this.rafId = null;
      this.lastTime = 0;
      this.wheelTimer = null;
      this.dragState = null;
      this.dragMoved = false;

      this.init();
    }

    init() {
      this.remPx = typeof window !== 'undefined' ? parseFloat(getComputedStyle(document.documentElement).fontSize) || 16 : 16;
      this.rowH = Math.max(this.fontSize * this.spacing * this.remPx, 38);

      this.render();
      this.attachEvents();
      this.applyTarget(this.defaultSelected, false);
    }

    render() {
      this.rootEl.innerHTML = '';
      this.rootEl.setAttribute('role', 'listbox');
      this.rootEl.setAttribute('tabindex', '0');
      this.rootEl.setAttribute('aria-label', 'Technical Stack Selector Wheel');
      this.rootEl.className = `option-wheel${this.side === 'right' ? ' option-wheel--right' : ''}`;

      this.rootEl.style.setProperty('--ow-text-color', this.textColor);
      this.rootEl.style.setProperty('--ow-active-color', this.activeColor);
      this.rootEl.style.setProperty('--ow-font-size', `${this.fontSize}rem`);
      this.rootEl.style.setProperty('--ow-inset', `${this.inset}px`);

      this.itemEls = [];
      this.items.forEach((item, index) => {
        const itemEl = document.createElement('div');
        itemEl.setAttribute('role', 'option');
        itemEl.setAttribute('aria-selected', index === this.selectedIndex ? 'true' : 'false');
        itemEl.className = `option-wheel__item${index === this.selectedIndex ? ' option-wheel__item--selected' : ''}`;

        const labelText = typeof item === 'string' ? item : item.label;

        itemEl.innerHTML = `<span class="option-wheel__label">${labelText}</span>`;
        itemEl.addEventListener('click', () => this.handleItemClick(index));

        this.rootEl.appendChild(itemEl);
        this.itemEls.push(itemEl);
      });
    }

    applyTarget(value, snap = true) {
      let v = value;
      const count = this.items.length;
      if (!this.loop) {
        v = Math.min(Math.max(v, 0), Math.max(count - 1, 0));
      }
      if (snap) {
        v = Math.round(v);
      }
      this.target = v;

      const idx = ((Math.round(v) % count) + count) % count;
      if (idx !== this.selectedIndex) {
        this.selectedIndex = idx;
        this.itemEls.forEach((el, i) => {
          const isSel = i === idx;
          el.setAttribute('aria-selected', isSel ? 'true' : 'false');
          el.classList.toggle('option-wheel__item--selected', isSel);
        });
        if (this.onChange) {
          this.onChange(idx, this.items[idx]);
        }
      }

      this.startLoop();
    }

    startLoop() {
      if (this.rafId !== null) {
        cancelAnimationFrame(this.rafId);
      }
      this.lastTime = performance.now();
      this.runFrame = this.runFrame.bind(this);
      this.rafId = requestAnimationFrame(this.runFrame);
    }

    runFrame(now) {
      const dt = Math.min((now - this.lastTime) / 1000, 0.05);
      this.lastTime = now;

      const tau = Math.max(this.smoothing, 1) / 1000;
      const k = 1 - Math.exp(-dt / tau);

      const target = this.target;
      const cur = this.pos;
      let next = cur + (target - cur) * k;
      const settled = Math.abs(target - next) < 0.001;
      if (settled) next = target;
      this.pos = next;

      const els = this.itemEls;
      const n = this.items.length;
      const mirror = this.side === 'right' ? -1 : 1;
      const tiltRad = (this.tilt * Math.PI) / 180;
      const R = tiltRad > 0.0005 ? this.rowH / tiltRad : 0;

      for (let i = 0; i < n; i++) {
        const el = els[i];
        if (!el) continue;
        let d = i - next;
        if (this.loop && n > 1) {
          d = ((d % n) + n) % n;
          if (d > n / 2) d -= n;
        }
        const dist = Math.abs(d);
        let x = 0;
        let y = d * this.rowH;
        let rot = 0;
        if (R > 0) {
          const ang = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, d * tiltRad));
          y = R * Math.sin(ang);
          x = -mirror * R * (1 - Math.cos(ang)) * this.curve;
          rot = (mirror * ang * 180) / Math.PI;
        }

        el.style.transform = `translate(${x.toFixed(2)}px, calc(${y.toFixed(2)}px - 50%)) rotate(${rot.toFixed(3)}deg)`;
        el.style.opacity = String(Math.max(this.minOpacity, 1 - dist * this.fade));
        el.style.filter = this.blur > 0 ? `blur(${(dist * this.blur).toFixed(2)}px)` : 'none';
        el.style.setProperty('--ow-p', Math.max(0, 1 - Math.min(dist, 1)).toFixed(4));
      }

      if (!settled) {
        this.rafId = requestAnimationFrame(this.runFrame);
      } else {
        this.rafId = null;
      }
    }

    handleItemClick(index) {
      if (this.dragMoved) return;
      const n = this.items.length;
      const cur = this.target;
      let d = index - (((cur % n) + n) % n);
      if (this.loop && n > 1) {
        if (d > n / 2) d -= n;
        else if (d < -n / 2) d += n;
      }
      this.applyTarget(cur + d, true);
    }

    attachEvents() {
      // Mouse / Touchpad Wheel
      const onWheel = (e) => {
        e.preventDefault();
        const delta = e.deltaMode === 1 ? e.deltaY * 24 : e.deltaY;
        const step = Math.max(-1, Math.min(1, delta / this.rowH));
        this.applyTarget(this.target + step, false);
        if (this.wheelTimer) clearTimeout(this.wheelTimer);
        this.wheelTimer = setTimeout(() => this.applyTarget(this.target, true), 140);
      };
      this.rootEl.addEventListener('wheel', onWheel, { passive: false });

      // Pointer Dragging
      if (this.draggable) {
        this.rootEl.addEventListener('pointerdown', (e) => {
          this.dragState = { y: e.clientY, start: this.target, id: e.pointerId };
          this.dragMoved = false;
          this.rootEl.classList.add('option-wheel--dragging');
        });

        this.rootEl.addEventListener('pointermove', (e) => {
          if (!this.dragState) return;
          const dy = e.clientY - this.dragState.y;
          if (!this.dragMoved && Math.abs(dy) > 4) {
            this.dragMoved = true;
            this.rootEl.setPointerCapture?.(this.dragState.id);
          }
          if (this.dragMoved) {
            this.applyTarget(this.dragState.start - dy / this.rowH, false);
          }
        });

        const onPointerEnd = () => {
          if (!this.dragState) return;
          this.dragState = null;
          this.rootEl.classList.remove('option-wheel--dragging');
          if (this.dragMoved) {
            this.applyTarget(this.target, true);
          }
        };

        this.rootEl.addEventListener('pointerup', onPointerEnd);
        this.rootEl.addEventListener('pointercancel', onPointerEnd);
      }

      // Keyboard arrow keys
      this.rootEl.addEventListener('keydown', (e) => {
        let delta = null;
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') delta = -1;
        else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') delta = 1;
        if (delta !== null) {
          e.preventDefault();
          this.applyTarget(Math.round(this.target) + delta, true);
        }
      });

      // Window resize
      window.addEventListener('resize', () => {
        this.remPx = typeof window !== 'undefined' ? parseFloat(getComputedStyle(document.documentElement).fontSize) || 16 : 16;
        this.rowH = Math.max(this.fontSize * this.spacing * this.remPx, 38);
        this.applyTarget(this.target, true);
      });
    }

    select(index, animate = true) {
      this.applyTarget(index, animate);
    }
  }

  // Export to global scope
  window.OptionWheelEngine = OptionWheelEngine;
})();
