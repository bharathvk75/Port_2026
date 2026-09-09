/**
 * React Bits: GlassSurface Component Engine
 * Generates dynamic SVG displacement map with RGB chromatic dispersion
 * and binds optical refraction to the navbar container.
 */

(function () {
  'use strict';

  function supportsSVGFilters(filterId) {
    if (typeof window === 'undefined' || typeof document === 'undefined') return false;
    const isWebkit = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    const isFirefox = /Firefox/.test(navigator.userAgent);
    if (isWebkit || isFirefox) return false;

    const div = document.createElement('div');
    div.style.backdropFilter = `url(#${filterId})`;
    return div.style.backdropFilter !== '';
  }

  class GlassSurfaceEngine {
    constructor(element, options = {}) {
      if (!element) return;
      this.element = element;
      this.borderRadius = options.borderRadius || 26;
      this.borderWidth = options.borderWidth || 0.07;
      this.brightness = options.brightness || 50;
      this.opacity = options.opacity || 0.93;
      this.blur = options.blur || 11;
      this.displace = options.displace || 0.5;
      this.distortionScale = options.distortionScale || -180;
      this.redOffset = options.redOffset || 0;
      this.greenOffset = options.greenOffset || 10;
      this.blueOffset = options.blueOffset || 20;
      this.mixBlendMode = options.mixBlendMode || 'difference';

      this.filterId = 'glass-nav-filter';
      this.redGradId = 'red-grad-nav';
      this.blueGradId = 'blue-grad-nav';

      this.init();
    }

    init() {
      // Build hidden SVG Filter element in DOM
      let filterSvg = document.getElementById('glass-surface-svg-root');
      if (!filterSvg) {
        filterSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        filterSvg.id = 'glass-surface-svg-root';
        filterSvg.className = 'glass-surface__filter';
        filterSvg.setAttribute('aria-hidden', 'true');
        filterSvg.innerHTML = `
          <defs>
            <filter id="${this.filterId}" color-interpolation-filters="sRGB" x="0%" y="0%" width="100%" height="100%">
              <feImage id="fe-glass-image" x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />
              <feDisplacementMap id="fe-glass-red" in="SourceGraphic" in2="map" result="dispRed" scale="${this.distortionScale + this.redOffset}" xChannelSelector="R" yChannelSelector="G" />
              <feColorMatrix in="dispRed" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />
              <feDisplacementMap id="fe-glass-green" in="SourceGraphic" in2="map" result="dispGreen" scale="${this.distortionScale + this.greenOffset}" xChannelSelector="R" yChannelSelector="G" />
              <feColorMatrix in="dispGreen" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green" />
              <feDisplacementMap id="fe-glass-blue" in="SourceGraphic" in2="map" result="dispBlue" scale="${this.distortionScale + this.blueOffset}" xChannelSelector="R" yChannelSelector="G" />
              <feColorMatrix in="dispBlue" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue" />
              <feBlend in="red" in2="green" mode="screen" result="rg" />
              <feBlend in="rg" in2="blue" mode="screen" result="output" />
              <feGaussianBlur in="output" stdDeviation="0.7" />
            </filter>
          </defs>
        `;
        document.body.prepend(filterSvg);
      }

      this.feImageEl = document.getElementById('fe-glass-image');

      const isSvgSupported = supportsSVGFilters(this.filterId);
      this.element.classList.add('glass-surface');
      this.element.classList.add(isSvgSupported ? 'glass-surface--svg' : 'glass-surface--fallback');
      this.element.style.setProperty('--filter-id', `url(#${this.filterId})`);

      this.updateDisplacementMap();

      if (typeof ResizeObserver !== 'undefined') {
        const ro = new ResizeObserver(() => {
          this.updateDisplacementMap();
        });
        ro.observe(this.element);
      }
      window.addEventListener('resize', () => this.updateDisplacementMap());
    }

    generateDisplacementMap() {
      const rect = this.element.getBoundingClientRect();
      const actualWidth = Math.max(300, Math.ceil(rect.width || 800));
      const actualHeight = Math.max(40, Math.ceil(rect.height || 52));
      const edgeSize = Math.min(actualWidth, actualHeight) * (this.borderWidth * 0.5);

      const svgContent = `
        <svg viewBox="0 0 ${actualWidth} ${actualHeight}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="${this.redGradId}" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stop-color="#0000"/>
              <stop offset="100%" stop-color="red"/>
            </linearGradient>
            <linearGradient id="${this.blueGradId}" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#0000"/>
              <stop offset="100%" stop-color="blue"/>
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" fill="black"></rect>
          <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${this.borderRadius}" fill="url(#${this.redGradId})" />
          <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${this.borderRadius}" fill="url(#${this.blueGradId})" style="mix-blend-mode: ${this.mixBlendMode}" />
          <rect x="${edgeSize}" y="${edgeSize}" width="${actualWidth - edgeSize * 2}" height="${actualHeight - edgeSize * 2}" rx="${this.borderRadius}" fill="hsl(0 0% ${this.brightness}% / ${this.opacity})" style="filter:blur(${this.blur}px)" />
        </svg>
      `;

      return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
    }

    updateDisplacementMap() {
      if (this.feImageEl) {
        this.feImageEl.setAttribute('href', this.generateDisplacementMap());
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
      new GlassSurfaceEngine(navbar, {
        borderRadius: 26,
        borderWidth: 0.07,
        brightness: 50,
        opacity: 0.93,
        blur: 11,
        displace: 0.5,
        distortionScale: -180,
        redOffset: 0,
        greenOffset: 10,
        blueOffset: 20,
        mixBlendMode: 'screen'
      });
    }
  });

  window.GlassSurfaceEngine = GlassSurfaceEngine;
})();
