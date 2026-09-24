/**
 * React Bits: TiltedCard Component Engine
 * High-performance Vanilla JavaScript implementation of React Bits <TiltedCard />
 * Featuring exact Framer Motion spring physics (stiffness, damping, mass),
 * 3D multi-axis perspective tilt, and cursor-following tooltip caption with velocity tilt.
 */

(function () {
  'use strict';

  // Exact 2nd-order damped harmonic oscillator spring model (matching Framer Motion useSpring)
  class SpringValue {
    constructor(initialValue = 0, { stiffness = 100, damping = 30, mass = 2 } = {}) {
      this.current = initialValue;
      this.target = initialValue;
      this.velocity = 0;
      this.stiffness = stiffness;
      this.damping = damping;
      this.mass = mass;
    }

    set(target) {
      this.target = target;
    }

    jump(val) {
      this.current = val;
      this.target = val;
      this.velocity = 0;
    }

    step(dt) {
      const subDt = Math.min(dt, 0.05); // Prevent instability on frame drops
      const force = -this.stiffness * (this.current - this.target) - this.damping * this.velocity;
      const accel = force / this.mass;
      this.velocity += accel * subDt;
      this.current += this.velocity * subDt;
      return this.current;
    }

    isAtRest(epsilon = 0.001) {
      return Math.abs(this.current - this.target) < epsilon && Math.abs(this.velocity) < epsilon;
    }
  }

  class TiltedCard {
    constructor(elementOrSelector, options = {}) {
      const el = typeof elementOrSelector === 'string'
        ? document.querySelector(elementOrSelector)
        : elementOrSelector;

      if (!el) return;

      this.container = el;
      this.options = Object.assign({
        imageSrc: 'assets/bharath-photo.webp',
        altText: 'Bharath Abhinesh A - AI & ML Engineer',
        captionText: 'Bharath Abhinesh A • AI / ML Engineer',
        containerHeight: 'auto',
        containerWidth: '100%',
        imageHeight: 'auto',
        imageWidth: '100%',
        scaleOnHover: 1.08,
        rotateAmplitude: 14,
        showMobileWarning: false,
        showTooltip: true,
        displayOverlayContent: false,
        overlayContent: null
      }, options);

      // Springs matching React Bits defaults
      this.rotateX = new SpringValue(0, { stiffness: 100, damping: 30, mass: 2 });
      this.rotateY = new SpringValue(0, { stiffness: 100, damping: 30, mass: 2 });
      this.scale = new SpringValue(1, { stiffness: 100, damping: 30, mass: 2 });
      this.opacity = new SpringValue(0, { stiffness: 200, damping: 25, mass: 1 });
      this.captionX = new SpringValue(0, { stiffness: 160, damping: 22, mass: 1 });
      this.captionY = new SpringValue(0, { stiffness: 160, damping: 22, mass: 1 });
      this.rotateFigcaption = new SpringValue(0, { stiffness: 350, damping: 30, mass: 1 });

      this.lastY = 0;
      this.isHovering = false;
      this.rafId = null;
      this.lastTime = performance.now();

      this.initDOM();
      this.bindEvents();
    }

    initDOM() {
      // Check if DOM is already pre-rendered
      let figure = this.container.classList.contains('tilted-card-figure')
        ? this.container
        : this.container.querySelector('.tilted-card-figure');

      if (!figure) {
        figure = document.createElement('figure');
        figure.className = 'tilted-card-figure';
        if (this.options.containerHeight !== 'auto') figure.style.height = this.options.containerHeight;
        if (this.options.containerWidth !== '100%') figure.style.width = this.options.containerWidth;

        // Mobile Alert
        if (this.options.showMobileWarning) {
          const alert = document.createElement('div');
          alert.className = 'tilted-card-mobile-alert';
          alert.textContent = 'This effect is not optimized for mobile. Check on desktop.';
          figure.appendChild(alert);
        }

        // Inner 3D Container
        const inner = document.createElement('div');
        inner.className = 'tilted-card-inner';

        // Image with WebP picture fallback
        const picture = document.createElement('picture');
        if (this.options.imageSrc && this.options.imageSrc.endsWith('.webp')) {
          const source = document.createElement('source');
          source.srcset = this.options.imageSrc;
          source.type = 'image/webp';
          picture.appendChild(source);
        }

        const img = document.createElement('img');
        img.src = this.options.imageSrc ? this.options.imageSrc.replace('.webp', '.jpg') : 'assets/bharath-photo.jpg';
        img.alt = this.options.altText;
        img.className = 'tilted-card-img';
        img.loading = 'eager';
        img.decoding = 'async';
        picture.appendChild(img);
        inner.appendChild(picture);

        // Overlay Content
        if (this.options.displayOverlayContent && this.options.overlayContent) {
          const overlay = document.createElement('div');
          overlay.className = 'tilted-card-overlay';
          if (typeof this.options.overlayContent === 'string') {
            overlay.innerHTML = this.options.overlayContent;
          } else if (this.options.overlayContent instanceof HTMLElement) {
            overlay.appendChild(this.options.overlayContent);
          }
          inner.appendChild(overlay);
        }

        figure.appendChild(inner);

        // Tooltip Figcaption
        if (this.options.showTooltip && this.options.captionText) {
          const caption = document.createElement('figcaption');
          caption.className = 'tilted-card-caption';
          caption.textContent = this.options.captionText;
          figure.appendChild(caption);
        }

        this.container.appendChild(figure);
      }

      this.figure = figure;
      this.inner = figure.querySelector('.tilted-card-inner');
      this.caption = figure.querySelector('.tilted-card-caption');
    }

    bindEvents() {
      if (!this.figure) return;

      this.handleMouseMove = this.onMouseMove.bind(this);
      this.handleMouseEnter = this.onMouseEnter.bind(this);
      this.handleMouseLeave = this.onMouseLeave.bind(this);

      this.figure.addEventListener('mousemove', this.handleMouseMove);
      this.figure.addEventListener('mouseenter', this.handleMouseEnter);
      this.figure.addEventListener('mouseleave', this.handleMouseLeave);
    }

    onMouseMove(e) {
      if (!this.figure) return;

      const rect = this.figure.getBoundingClientRect();
      const offsetX = e.clientX - rect.left - rect.width / 2;
      const offsetY = e.clientY - rect.top - rect.height / 2;

      const rotationX = (offsetY / (rect.height / 2)) * -this.options.rotateAmplitude;
      const rotationY = (offsetX / (rect.width / 2)) * this.options.rotateAmplitude;

      this.rotateX.set(rotationX);
      this.rotateY.set(rotationY);

      // Tooltip position (relative to figure)
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (!this.isHovering) {
        this.captionX.jump(mouseX);
        this.captionY.jump(mouseY);
      } else {
        this.captionX.set(mouseX);
        this.captionY.set(mouseY);
      }

      // Velocity-based rotation tilt
      const velocityY = offsetY - this.lastY;
      this.rotateFigcaption.set(-velocityY * 0.6);
      this.lastY = offsetY;

      this.startLoop();
    }

    onMouseEnter() {
      this.isHovering = true;
      this.scale.set(this.options.scaleOnHover);
      this.opacity.set(1);
      this.startLoop();
    }

    onMouseLeave() {
      this.isHovering = false;
      this.opacity.set(0);
      this.scale.set(1);
      this.rotateX.set(0);
      this.rotateY.set(0);
      this.rotateFigcaption.set(0);
      this.startLoop();
    }

    startLoop() {
      if (!this.rafId) {
        this.lastTime = performance.now();
        this.rafId = requestAnimationFrame(this.render.bind(this));
      }
    }

    render(time) {
      const dt = (time - this.lastTime) / 1000;
      this.lastTime = time;

      // Step springs
      const curRotX = this.rotateX.step(dt);
      const curRotY = this.rotateY.step(dt);
      const curScale = this.scale.step(dt);
      const curOpacity = this.opacity.step(dt);
      const curCapX = this.captionX.step(dt);
      const curCapY = this.captionY.step(dt);
      const curCapRot = this.rotateFigcaption.step(dt);

      // Apply 3D inner transform
      if (this.inner) {
        this.inner.style.transform = `perspective(800px) rotateX(${curRotX.toFixed(2)}deg) rotateY(${curRotY.toFixed(2)}deg) scale(${curScale.toFixed(3)}) translateZ(0)`;
      }

      // Apply Tooltip Figcaption transform & opacity
      if (this.caption) {
        this.caption.style.transform = `translate3d(${curCapX.toFixed(1)}px, ${curCapY.toFixed(1)}px, 0) translate(-50%, -130%) rotate(${curCapRot.toFixed(2)}deg)`;
        this.caption.style.opacity = Math.max(0, Math.min(1, curOpacity)).toFixed(3);
      }

      // Check if all springs have come to rest
      const isRest = !this.isHovering
        && this.rotateX.isAtRest()
        && this.rotateY.isAtRest()
        && this.scale.isAtRest()
        && this.opacity.isAtRest()
        && this.rotateFigcaption.isAtRest();

      if (isRest) {
        if (this.inner) {
          this.inner.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1) translateZ(0)';
        }
        if (this.caption) {
          this.caption.style.opacity = '0';
        }
        this.rafId = null;
      } else {
        this.rafId = requestAnimationFrame(this.render.bind(this));
      }
    }

    destroy() {
      if (this.rafId) cancelAnimationFrame(this.rafId);
      if (this.figure) {
        this.figure.removeEventListener('mousemove', this.handleMouseMove);
        this.figure.removeEventListener('mouseenter', this.handleMouseEnter);
        this.figure.removeEventListener('mouseleave', this.handleMouseLeave);
      }
    }
  }

  // Export to window
  window.TiltedCard = TiltedCard;

  // Auto-initialize on DOMContentLoaded if element #hero-tilted-card is present
  function initHeroTiltedCard() {
    const el = document.getElementById('hero-tilted-card');
    if (el && !el._tiltedCardInstance) {
      el._tiltedCardInstance = new TiltedCard(el, {
        imageSrc: 'assets/bharath-photo.webp',
        altText: 'Bharath Abhinesh A - AI & ML Engineer',
        captionText: 'Bharath Abhinesh A • AI / ML',
        scaleOnHover: 1.08,
        rotateAmplitude: 14,
        showMobileWarning: false,
        showTooltip: true
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroTiltedCard);
  } else {
    initHeroTiltedCard();
  }
})();
