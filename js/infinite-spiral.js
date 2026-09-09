/**
 * React Bits: InfiniteSpiral Component Engine
 * Variant: Vanilla JavaScript + CSS
 * 
 * Creates a high-performance 3D helix gallery of skill icons and titles.
 * Supports auto-rotation, pointer dragging, page scroll velocity coupling,
 * responsive cylindrical projection, depth scaling, edge blur, and pause on hover.
 * 
 * Section-Wise Filtering: Supports category filtering (agentic, ml, backend, cloud)
 * synced with interactive category tabs and side-by-side competency cards.
 */

(function () {
  'use strict';

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const modulo = (value, divisor) => ((value % divisor) + divisor) % divisor;
  const smoothstep = (min, max, value) => {
    const x = clamp((value - min) / (max - min || 1), 0, 1);
    return x * x * (3 - 2 * x);
  };

  // Curated SVG Icons for Technical Skills
  const SKILL_ICONS = {
    python: `<svg viewBox="0 0 128 128"><path fill="#3776AB" d="M63.7 3.5c-30.8 0-29 13.4-29 13.4l.1 13.9h29.5v4.2H23.8s-19.3 2.2-19.3 29.1c0 26.8 16.9 25.8 16.9 25.8h10.1V75.6s-.5-17.2 16.9-17.2h28.9s16.3.3 16.3-15.8V19.3s2.3-15.8-29.9-15.8zm-16 9c3.1 0 5.6 2.5 5.6 5.6s-2.5 5.6-5.6 5.6-5.6-2.5-5.6-5.6 2.5-5.6 5.6-5.6z"/><path fill="#FFD43B" d="M64.3 124.5c30.8 0 29-13.4 29-13.4l-.1-13.9H63.7V93h40.5s19.3-2.2 19.3-29.1c0-26.8-16.9-25.8-16.9-25.8h-10.1v14.3s.5 17.2-16.9 17.2H50.7s-16.3-.3-16.3 15.8v23.3s-2.3 15.8 29.9 15.8zm16-9c-3.1 0-5.6-2.5-5.6-5.6s2.5-5.6 5.6-5.6 5.6 2.5 5.6 5.6-2.5 5.6-5.6 5.6z"/></svg>`,
    pytorch: `<svg viewBox="0 0 128 128"><path fill="#EE4C2C" d="M64 14.5a39.4 39.4 0 0 0-27.9 67.2l8.3-8.3a27.6 27.6 0 0 1 19.6-47.1c15.2 0 27.6 12.4 27.6 27.6a27.5 27.5 0 0 1-8.1 19.5l8.3 8.3A39.3 39.3 0 0 0 64 14.5zm24.2 13.9a5.9 5.9 0 1 0 0-11.8 5.9 5.9 0 0 0 0 11.8zM61.4 75.7l5.2-18.4 5.2 18.4h-10.4zm-14.8 37.8h40.8v-8.2H46.6v8.2z"/></svg>`,
    langgraph: `<svg viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><circle cx="12" cy="12" r="2"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line><line x1="8.8" y1="12" x2="10.2" y2="12"></line></svg>`,
    langchain: `<svg viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`,
    mcp: `<svg viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2"><rect x="2" y="2" width="8" height="8" rx="2"></rect><rect x="14" y="2" width="8" height="8" rx="2"></rect><rect x="8" y="14" width="8" height="8" rx="2"></rect><line x1="6" y1="10" x2="12" y2="14"></line><line x1="18" y1="10" x2="12" y2="14"></line></svg>`,
    claude: `<svg viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path></svg>`,
    fastapi: `<svg viewBox="0 0 24 24" fill="none" stroke="#009688" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
    docker: `<svg viewBox="0 0 24 24" fill="#2496ed"><path d="M22.5 10.5c-.3-.2-1.3-.3-2.1.2-.2-.6-.7-1.1-1.3-1.4-.8-.4-1.9-.3-2.6.2-.2-.5-.6-.9-1.2-1.2-.9-.4-2-.2-2.7.4H2.4c-.2 0-.4.2-.4.4v4.5c0 3.2 2.6 6.8 6.5 6.8h7.2c4.4 0 7.9-2.8 7.9-7.2 0-.9-.3-1.8-.8-2.5l-.3-.2zm-15.6.3H5.1V9.2h1.8v1.6zm2.7 0H7.8V9.2h1.8v1.6zm2.7 0h-1.8V9.2h1.8v1.6zm2.7 0h-1.8V9.2h1.8v1.6zm-5.4-2.7H7.8V6.5h1.8v1.6zm2.7 0h-1.8V6.5h1.8v1.6zm2.7 0h-1.8V6.5h1.8v1.6z"/></svg>`,
    opencv: `<svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2"><circle cx="12" cy="7" r="4"></circle><circle cx="6.5" cy="16.5" r="4"></circle><circle cx="17.5" cy="16.5" r="4"></circle></svg>`,
    tensorflow: `<svg viewBox="0 0 24 24" fill="#ff6f00"><path d="M12 2L2 7.8v8.4l4.5-2.6V9l5.5-3.2 5.5 3.2v4.6l4.5 2.6V7.8L12 2zm-1 9.4L6.5 14v4.6L11 16v-4.6zm2 0v4.6l4.5 2.6V14L13 11.4z"/></svg>`,
    postgresql: `<svg viewBox="0 0 24 24" fill="none" stroke="#336791" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2"></rect><rect x="2" y="14" width="20" height="8" rx="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>`,
    kubernetes: `<svg viewBox="0 0 24 24" fill="none" stroke="#326ce5" stroke-width="2"><polygon points="12 2 21 7.5 21 16.5 12 22 3 16.5 3 7.5 12 2"></polygon><circle cx="12" cy="12" r="3"></circle></svg>`,
    redis: `<svg viewBox="0 0 24 24" fill="#dc382d"><path d="M12 2L2 7.5l10 5.5 10-5.5L12 2zm-8.2 8.3L2 11.5l10 5.5 10-5.5-1.8-1.2L12 15 3.8 10.3zm0 4L2 15.5l10 5.5 10-5.5-1.8-1.2L12 19 3.8 14.3z"/></svg>`,
    aws: `<svg viewBox="0 0 24 24" fill="none" stroke="#ff9900" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>`,
    typescript: `<svg viewBox="0 0 24 24" fill="#3178c6"><rect x="2" y="2" width="20" height="20" rx="4"></rect><path fill="#fff" d="M11 9H6v2h2v7h2v-7h2V9zm4 0h3c1 0 2 1 2 2v1c0 .8-.5 1.5-1.2 1.8.8.3 1.2 1 1.2 1.8v1.4c0 1-1 2-2 2h-3V9zm2 3.5h1c.3 0 .5-.2.5-.5s-.2-.5-.5-.5h-1v1zm0 4.5h1c.3 0 .5-.2.5-.5v-.5c0-.3-.2-.5-.5-.5h-1v1.5z"/></svg>`,
    scikit: `<svg viewBox="0 0 24 24" fill="none" stroke="#f89939" stroke-width="2"><circle cx="12" cy="12" r="8"></circle><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line></svg>`,
    react: `<svg viewBox="0 0 24 24" fill="none" stroke="#00d8ff" stroke-width="2"><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(0 12 12)"></ellipse><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"></ellipse><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"></ellipse><circle cx="12" cy="12" r="1.5" fill="#00d8ff"></circle></svg>`,
    nextjs: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm3.8 14.2l-5.6-7.4v7.4H8.4V7.8h2.1l5.4 7.2V7.8h1.8v8.4z"/></svg>`,
    tailwind: `<svg viewBox="0 0 24 24" fill="#38bdf8"><path d="M12 6c-2.4 0-3.9 1.2-4.5 3.6 1-.8 2-.9 3-.4.6.3 1 1 1.5 1.7C12.8 12.1 14 13.5 17 13.5c2.4 0 3.9-1.2 4.5-3.6-1 .8-2 .9-3 .4-.6-.3-1-1-1.5-1.7C16.2 7.4 15 6 12 6zM7 12c-2.4 0-3.9 1.2-4.5 3.6 1-.8 2-.9 3-.4.6.3 1 1 1.5 1.7C7.8 18.1 9 19.5 12 19.5c2.4 0 3.9-1.2 4.5-3.6-1 .8-2 .9-3 .4-.6-.3-1-1-1.5-1.7C11.2 13.4 10 12 7 12z"/></svg>`,
    chromadb: `<svg viewBox="0 0 24 24" fill="none" stroke="#f43f5e" stroke-width="2"><circle cx="7" cy="7" r="4"></circle><circle cx="17" cy="7" r="4"></circle><circle cx="12" cy="17" r="4"></circle><line x1="7" y1="7" x2="12" y2="17"></line><line x1="17" y1="7" x2="12" y2="17"></line></svg>`
  };

  // Core Technical Skills in Spiral with Section Categories (Resume Aligned)
  const SKILL_ITEMS = [
    // Frontend & Interactive UI
    { id: 'react', label: 'React', sub: 'Interactive UI', icon: SKILL_ICONS.react, color: '#00d8ff', category: 'frontend' },
    { id: 'typescript', label: 'TypeScript', sub: 'Typed Web APIs', icon: SKILL_ICONS.typescript, color: '#3178c6', category: 'frontend' },
    { id: 'tailwind', label: 'Tailwind CSS', sub: 'Responsive UI', icon: SKILL_ICONS.tailwind, color: '#38bdf8', category: 'frontend' },
    { id: 'nextjs', label: 'Next.js', sub: 'SSR & Edge', icon: SKILL_ICONS.nextjs, color: '#ffffff', category: 'frontend' },

    // Agentic & AI Architecture
    { id: 'langgraph', label: 'LangGraph', sub: 'Multi-Agent Core', icon: SKILL_ICONS.langgraph, color: '#38bdf8', category: 'agentic' },
    { id: 'mcp', label: 'Claude MCP', sub: 'Tool Protocol', icon: SKILL_ICONS.mcp, color: '#a855f7', category: 'agentic' },
    { id: 'claude', label: 'Claude 3.7', sub: 'Frontier Reasoning', icon: SKILL_ICONS.claude, color: '#d97706', category: 'agentic' },
    { id: 'langchain', label: 'LangChain', sub: 'RAG & Memory', icon: SKILL_ICONS.langchain, color: '#10b981', category: 'agentic' },
    
    // Machine Learning & Computer Vision
    { id: 'pytorch', label: 'PyTorch', sub: 'Deep Learning', icon: SKILL_ICONS.pytorch, color: '#ee4c2c', category: 'ml' },
    { id: 'opencv', label: 'OpenCV', sub: 'Computer Vision', icon: SKILL_ICONS.opencv, color: '#6366f1', category: 'ml' },
    { id: 'tensorflow', label: 'TensorFlow', sub: 'Inference Models', icon: SKILL_ICONS.tensorflow, color: '#ff6f00', category: 'ml' },
    { id: 'scikit', label: 'Scikit-Learn', sub: 'ML Analytics', icon: SKILL_ICONS.scikit, color: '#f89939', category: 'ml' },

    // High-Throughput Backend & APIs
    { id: 'python', label: 'Python 3.12', sub: 'AI Core Lang', icon: SKILL_ICONS.python, color: '#3b82f6', category: 'backend' },
    { id: 'fastapi', label: 'FastAPI', sub: 'Async Microservices', icon: SKILL_ICONS.fastapi, color: '#009688', category: 'backend' },

    // Databases & Vector Stores
    { id: 'postgresql', label: 'PostgreSQL', sub: 'pgvector RAG', icon: SKILL_ICONS.postgresql, color: '#336791', category: 'database' },
    { id: 'redis', label: 'Redis', sub: 'Cache & State', icon: SKILL_ICONS.redis, color: '#dc382d', category: 'database' },
    { id: 'chromadb', label: 'ChromaDB', sub: 'Vector Embeddings', icon: SKILL_ICONS.chromadb, color: '#f43f5e', category: 'database' },

    // Cloud Infrastructure & DevOps
    { id: 'docker', label: 'Docker', sub: 'Containerization', icon: SKILL_ICONS.docker, color: '#2496ed', category: 'cloud' },
    { id: 'kubernetes', label: 'Kubernetes', sub: 'Cluster Scaling', icon: SKILL_ICONS.kubernetes, color: '#326ce5', category: 'cloud' },
    { id: 'aws', label: 'AWS Cloud', sub: 'Infrastructure', icon: SKILL_ICONS.aws, color: '#ff9900', category: 'cloud' }
  ];

  class InfiniteSpiralEngine {
    constructor(containerEl, options = {}) {
      if (!containerEl) return;
      this.container = containerEl;
      this.allItems = options.items || SKILL_ITEMS;
      this.items = [...this.allItems];
      this.activeCategory = 'all';

      this.speed = options.speed !== undefined ? options.speed : 0.55;
      this.direction = options.direction || 'up';
      this.animationMode = options.animationMode || 'all';
      this.radius = options.radius !== undefined ? options.radius : 160;
      this.cardWidth = options.cardWidth || 108;
      this.cardHeight = options.cardHeight || 108;
      this.verticalSpacing = options.verticalSpacing || 58;
      this.perspective = options.perspective || 900;
      this.cardsPerTurn = options.cardsPerTurn || 6;
      this.rotation = options.rotation || 0;
      this.cardTilt = options.cardTilt || 0;
      this.cardRadius = options.cardRadius || 15;
      this.centerScale = options.centerScale !== undefined ? options.centerScale : 1.22;
      this.edgeFade = options.edgeFade !== undefined ? options.edgeFade : 0.35;
      this.edgeBlur = options.edgeBlur !== undefined ? options.edgeBlur : 4;
      this.pauseOnHover = options.pauseOnHover !== undefined ? options.pauseOnHover : true;

      this.progress = 0;
      this.targetProgress = 0;
      this.autoSpeed = 0;
      this.isHovered = false;
      this.isVisible = true;
      this.isDragging = false;
      this.lastPointerY = 0;
      this.dragMoved = false;
      this.lastScrollY = window.scrollY;
      this.previousTime = performance.now();
      this.rafId = null;
      this.cardRefs = [];

      this.init();
    }

    init() {
      // Build DOM structure
      this.root = document.createElement('div');
      this.root.className = 'infinite-spiral';
      this.root.style.perspective = `${this.perspective}px`;
      this.root.style.setProperty('--infinite-spiral-card-width', `${this.cardWidth}px`);
      this.root.style.setProperty('--infinite-spiral-card-height', `${this.cardHeight}px`);
      this.root.style.setProperty('--infinite-spiral-card-radius', `${this.cardRadius}px`);

      const dragEnabled = this.animationMode === 'drag' || this.animationMode === 'all';
      this.root.style.cursor = dragEnabled ? 'grab' : 'default';
      this.root.style.touchAction = dragEnabled ? 'pan-x' : 'auto';
      this.root.style.userSelect = dragEnabled ? 'none' : 'auto';

      this.stage = document.createElement('div');
      this.stage.className = 'infinite-spiral__stage';
      this.stage.setAttribute('role', 'list');
      this.stage.setAttribute('aria-label', 'Interactive 3D skills spiral helix');

      this.rebuildCards();

      this.root.appendChild(this.stage);
      this.container.innerHTML = '';
      this.container.appendChild(this.root);

      this.bounds = this.root.getBoundingClientRect();
      this.setupObservers();
      this.attachEvents();
      this.startLoop();
    }

    rebuildCards() {
      if (!this.stage) return;
      this.stage.innerHTML = '';
      this.cardRefs = [];

      this.items.forEach((item) => {
        const card = document.createElement('div');
        card.className = 'infinite-spiral__item';
        card.style.width = `${this.cardWidth}px`;
        card.style.height = `${this.cardHeight}px`;
        card.style.borderRadius = `${this.cardRadius}px`;
        card.setAttribute('role', 'listitem');
        card.setAttribute('aria-label', `${item.label} - ${item.sub}`);
        card.setAttribute('data-category', item.category || 'all');
        card.setAttribute('data-skill-id', item.id);

        // Radial glow matching skill color
        const glow = document.createElement('div');
        glow.className = 'infinite-spiral__glow';
        glow.style.background = item.color || '#3b82f6';
        card.appendChild(glow);

        // Icon
        const iconWrap = document.createElement('div');
        iconWrap.className = 'infinite-spiral__icon';
        iconWrap.innerHTML = item.icon || '';
        card.appendChild(iconWrap);

        // Text labels
        const info = document.createElement('div');
        info.className = 'infinite-spiral__info';
        info.innerHTML = `
          <span class="infinite-spiral__label">${item.label}</span>
          <span class="infinite-spiral__sub">${item.sub}</span>
        `;
        card.appendChild(info);

        this.stage.appendChild(card);
        this.cardRefs.push(card);
      });

      this.progress = 0;
      this.targetProgress = 0;
    }

    filterCategory(categoryKey) {
      this.activeCategory = categoryKey;
      if (!categoryKey || categoryKey === 'all') {
        this.items = [...this.allItems];
      } else {
        const filtered = this.allItems.filter((item) => item.category === categoryKey);
        // Duplicate when items count is small to keep the 3D helix rich and continuous
        this.items = filtered.length < 8 ? [...filtered, ...filtered] : filtered;
      }
      this.rebuildCards();
    }

    setupObservers() {
      if (typeof ResizeObserver !== 'undefined') {
        this.resizeObserver = new ResizeObserver(() => {
          this.bounds = this.root.getBoundingClientRect();
        });
        this.resizeObserver.observe(this.root);
      }

      if ('IntersectionObserver' in window) {
        this.intersectionObserver = new IntersectionObserver(([entry]) => {
          this.isVisible = entry.isIntersecting;
        }, { threshold: 0.02 });
        this.intersectionObserver.observe(this.root);
      }
    }

    attachEvents() {
      const dragEnabled = this.animationMode === 'drag' || this.animationMode === 'all';
      const scrollEnabled = this.animationMode === 'scroll' || this.animationMode === 'all';
      const scrollSpeedMultiplier = Math.max(this.speed, 0) / 0.55;

      this.root.addEventListener('mouseenter', () => {
        this.isHovered = true;
      });

      this.root.addEventListener('mouseleave', () => {
        this.isHovered = false;
      });

      const handleScroll = () => {
        const nextScrollY = window.scrollY;
        const scrollDelta = nextScrollY - this.lastScrollY;
        this.lastScrollY = nextScrollY;
        if (!scrollEnabled || !this.isVisible || scrollDelta === 0) return;
        this.targetProgress += clamp(
          (scrollDelta * scrollSpeedMultiplier) / Math.max(this.verticalSpacing * 2, 1),
          -1.5,
          1.5
        );
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
      this._scrollHandler = handleScroll;

      // Pointer dragging
      const stopDragging = (event) => {
        if (!this.isDragging) return;
        this.isDragging = false;
        if (event.currentTarget.hasPointerCapture && event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
        event.currentTarget.style.cursor = dragEnabled ? 'grab' : 'default';
      };

      this.root.addEventListener('pointerdown', (event) => {
        if (!dragEnabled || event.button !== 0) return;
        this.isDragging = true;
        this.dragMoved = false;
        this.lastPointerY = event.clientY;
        this.targetProgress = this.progress;
        if (event.currentTarget.setPointerCapture) {
          event.currentTarget.setPointerCapture(event.pointerId);
        }
        event.currentTarget.style.cursor = 'grabbing';
      });

      this.root.addEventListener('pointermove', (event) => {
        if (!this.isDragging) return;
        const pointerDelta = event.clientY - this.lastPointerY;
        this.lastPointerY = event.clientY;
        if (Math.abs(pointerDelta) > 0.5) this.dragMoved = true;
        this.targetProgress -= pointerDelta / Math.max(this.verticalSpacing, 1);
      });

      this.root.addEventListener('pointerup', stopDragging);
      this.root.addEventListener('pointercancel', stopDragging);

      this.root.addEventListener('click', (event) => {
        if (!this.dragMoved) return;
        event.preventDefault();
        event.stopPropagation();
        this.dragMoved = false;
      }, true);
    }

    startLoop() {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

      const render = (time) => {
        const delta = Math.min((time - this.previousTime) / 1000, 0.05);
        this.previousTime = time;

        const autoEnabled = this.animationMode === 'auto' || this.animationMode === 'all';
        const motionPaused = this.isDragging || (this.pauseOnHover && this.isHovered);
        const directionMultiplier = this.direction === 'down' ? -1 : 1;
        const desiredAutoSpeed =
          autoEnabled && this.isVisible && !reducedMotion.matches && !motionPaused
            ? this.speed * directionMultiplier
            : 0;

        const speedBlend = 1 - Math.exp(-delta * 7);
        this.autoSpeed += (desiredAutoSpeed - this.autoSpeed) * speedBlend;
        this.targetProgress += this.autoSpeed * delta;

        const followBlend = 1 - Math.exp(-delta * (this.isDragging ? 22 : 11));
        this.progress += (this.targetProgress - this.progress) * followBlend;

        const count = this.items.length;
        const half = count / 2;
        const width = Math.max(this.bounds.width || 500, 1);
        const height = Math.max(this.bounds.height || 540, 1);
        const fit = Math.min(1, width / (this.cardWidth * 2.7), height / (this.cardHeight * 2.35));
        const responsiveRadius = Math.min(this.radius, Math.max(68, width * 0.35)) * fit;
        const fadeStart = clamp(1 - this.edgeFade, 0, 0.98);
        const turnSize = Math.max(this.cardsPerTurn, 1);

        this.cardRefs.forEach((card, index) => {
          if (!card) return;
          let offset = index - this.progress;
          offset = modulo(offset + half, count) - half;

          const edge = Math.min(Math.abs(offset) / Math.max(half, 1), 1);
          const opacity = 1 - smoothstep(fadeStart, 1, edge);
          const focus = 1 - Math.min(Math.abs(offset) / Math.max(turnSize * 0.65, 1), 1);
          const scale = (1 + (this.centerScale - 1) * focus) * fit;
          const angle = offset * (360 / turnSize) + this.rotation;
          const angleRadians = (angle * Math.PI) / 180;
          const x = Math.sin(angleRadians) * responsiveRadius;
          const z = Math.cos(angleRadians) * responsiveRadius;
          const depthScale = clamp(this.perspective / Math.max(this.perspective - z, 1), 0.72, 1.45);
          const visualScale = scale * depthScale;
          const depth = (z / Math.max(responsiveRadius, 1) + 1) / 2;
          const blur = this.edgeBlur * smoothstep(0.35, 1, edge);

          card.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(2)}px, ${(offset * this.verticalSpacing * fit).toFixed(2)}px, 0) rotateZ(${this.cardTilt}deg) scale(${visualScale.toFixed(3)})`;
          card.style.opacity = opacity.toFixed(3);
          card.style.filter = blur > 0.01 ? `blur(${blur.toFixed(2)}px)` : 'none';
          card.style.zIndex = String(Math.round(depth * 100000) + index);
          card.style.pointerEvents = opacity > 0.25 ? 'auto' : 'none';
        });

        this.rafId = requestAnimationFrame(render);
      };

      this.rafId = requestAnimationFrame(render);
    }

    setDirection(dir) {
      this.direction = dir;
    }

    destroy() {
      if (this.rafId) cancelAnimationFrame(this.rafId);
      if (this.resizeObserver) this.resizeObserver.disconnect();
      if (this.intersectionObserver) this.intersectionObserver.disconnect();
      if (this._scrollHandler) window.removeEventListener('scroll', this._scrollHandler);
      this.container.innerHTML = '';
    }
  }

  // Auto-mount on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    const mountEl = document.getElementById('infinite-spiral-mount');
    if (mountEl) {
      const isMobile = window.innerWidth < 640;
      const isTablet = window.innerWidth < 1024;

      const spiral = new InfiniteSpiralEngine(mountEl, {
        items: SKILL_ITEMS,
        speed: 0.55,
        direction: 'up',
        animationMode: 'all',
        radius: isMobile ? 120 : isTablet ? 140 : 160,
        cardWidth: isMobile ? 96 : 108,
        cardHeight: isMobile ? 96 : 108,
        verticalSpacing: isMobile ? 50 : 58,
        perspective: 900,
        cardsPerTurn: 6,
        cardRadius: 15,
        centerScale: 1.22,
        edgeFade: 0.35,
        edgeBlur: 4,
        pauseOnHover: true
      });

      window.infiniteSpiralInstance = spiral;

      // Category filter tabs & right-side boxless resume display bi-directional sync
      const catBtns = document.querySelectorAll('.spiral-cat-btn');
      const wheelMount = document.getElementById('skills-option-wheel');

      const RESUME_SKILL_SECTIONS = [
        {
          key: 'frontend',
          label: 'Frontend & UI Engineering',
          title: 'Frontend & Interactive UI Engineering',
          desc: 'Engineering fluid, accessible interfaces with modern CSS systems, component-driven layouts, and reactive client state.',
          chips: [
            { name: 'React', desc: 'Component Architecture' },
            { name: 'TypeScript', desc: 'Strict Typed UI' },
            { name: 'Next.js', desc: 'SSR & Edge Routing' },
            { name: 'Modern CSS3', desc: 'Vanilla & Responsive Design' },
            { name: 'Tailwind CSS', desc: 'Utility Design System' },
            { name: 'HTML5 Semantic Web', desc: 'Accessible Standards' }
          ]
        },
        {
          key: 'backend',
          label: 'Backend & Microservices',
          title: 'Backend & High-Throughput Microservices',
          desc: 'Constructing resilient asynchronous microservices, RESTful interfaces, event streaming, and background queue workers.',
          chips: [
            { name: 'Python 3.12', desc: 'Asynchronous Core' },
            { name: 'FastAPI', desc: 'High-Throughput ASGI' },
            { name: 'Node.js / Express', desc: 'API Gateways' },
            { name: 'REST & GraphQL', desc: 'Contract Design' },
            { name: 'Pydantic v2', desc: 'Schema Validation' },
            { name: 'Celery / Redis Queues', desc: 'Task Orchestration' }
          ]
        },
        {
          key: 'agentic',
          label: 'AI & Multi-Agent Architecture',
          title: 'AI & Multi-Agent Architecture',
          desc: 'Designing autonomous multi-agent graphs, dynamic tool calling via Claude MCP, and human-in-the-loop reasoning workflows.',
          chips: [
            { name: 'LangGraph', desc: 'Cyclic Agent Graphs' },
            { name: 'Claude MCP', desc: 'Model Context Protocol' },
            { name: 'Claude 3.7 Sonnet', desc: 'Frontier Reasoning' },
            { name: 'LangChain', desc: 'RAG Pipelines & Memory' },
            { name: 'Multi-Agent Swarms', desc: 'Cooperative Orchestration' },
            { name: 'Function Calling', desc: 'Dynamic Tool Execution' }
          ]
        },
        {
          key: 'ml',
          label: 'Machine Learning & Vision',
          title: 'Machine Learning & Computer Vision',
          desc: 'Developing deep learning architectures for edge computer vision, real-time spatial tracking, OCR pipelines, and tabular models.',
          chips: [
            { name: 'PyTorch', desc: 'Deep Learning & Tensors' },
            { name: 'OpenCV', desc: 'Spatial Edge Vision' },
            { name: 'TensorFlow / Keras', desc: 'Neural Inference' },
            { name: 'Scikit-Learn', desc: 'Classical ML Algorithms' },
            { name: 'Tesseract & PaddleOCR', desc: 'Document Extraction' },
            { name: 'NumPy & Pandas', desc: 'Vectorized Analytics' }
          ]
        },
        {
          key: 'cloud',
          label: 'Cloud Infrastructure & DevOps',
          title: 'Cloud Infrastructure & DevOps',
          desc: 'Containerizing distributed microservices and deploying reproducible CI/CD pipelines across AWS cloud and container clusters.',
          chips: [
            { name: 'Docker', desc: 'Multi-Stage Containerization' },
            { name: 'Kubernetes', desc: 'Container Orchestration' },
            { name: 'AWS (EC2, S3, Lambda)', desc: 'Cloud Infrastructure' },
            { name: 'CI/CD Pipelines', desc: 'Automated GitHub Actions' },
            { name: 'Linux / Bash', desc: 'POSIX Systems' },
            { name: 'Nginx', desc: 'Reverse Proxy & TLS' }
          ]
        },
        {
          key: 'database',
          label: 'Databases & Vector Stores',
          title: 'Databases & Vector Retrieval',
          desc: 'Architecting high-performance relational databases, memory caches, and vector databases for enterprise semantic search.',
          chips: [
            { name: 'PostgreSQL', desc: 'Relational ACID Core' },
            { name: 'pgvector', desc: 'Native Vector Embeddings' },
            { name: 'ChromaDB', desc: 'Lightweight Vector Index' },
            { name: 'Redis', desc: 'In-Memory Cache & PubSub' },
            { name: 'Pinecone / Qdrant', desc: 'Distributed Similarity Search' },
            { name: 'SQLAlchemy 2.0', desc: 'Async ORM Layer' }
          ]
        }
      ];

      let optionWheel = null;
      if (wheelMount && window.OptionWheelEngine) {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        optionWheel = new window.OptionWheelEngine(wheelMount, {
          items: RESUME_SKILL_SECTIONS,
          side: 'right',
          defaultSelected: 0,
          fontSize: window.innerWidth < 640 ? 1.05 : window.innerWidth < 900 ? 1.25 : 1.45,
          spacing: 1.45,
          curve: 1.25,
          tilt: 8,
          fade: 0.35,
          blur: 1.5,
          textColor: isLight ? '#475569' : '#94a3b8',
          activeColor: isLight ? '#000000' : '#ffffff',
          onChange: (index, item) => {
            if (!item) return;
            const categoryKey = item.key;

            // 1. Filter 3D swirl on the left
            spiral.filterCategory(categoryKey);

            // 2. Sync category buttons on the left
            catBtns.forEach(b => {
              const isTarget = b.getAttribute('data-category') === categoryKey;
              b.classList.toggle('active', isTarget);
              b.setAttribute('aria-selected', isTarget ? 'true' : 'false');
            });
          }
        });
        window.skillsOptionWheelInstance = optionWheel;

        // Theme switch listener for OptionWheel
        window.addEventListener('themeChanged', (e) => {
          const theme = e.detail?.theme || document.documentElement.getAttribute('data-theme') || 'light';
          const isLightMode = theme === 'light';
          if (optionWheel && optionWheel.rootEl) {
            optionWheel.rootEl.style.setProperty('--ow-text-color', isLightMode ? '#475569' : '#94a3b8');
            optionWheel.rootEl.style.setProperty('--ow-active-color', isLightMode ? '#000000' : '#ffffff');
          }
        });
      }

      catBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const category = btn.getAttribute('data-category');
          
          catBtns.forEach(b => {
            const isTarget = b === btn;
            b.classList.toggle('active', isTarget);
            b.setAttribute('aria-selected', isTarget ? 'true' : 'false');
          });

          spiral.filterCategory(category);

          // Synchronize OptionWheel on right
          if (category !== 'all') {
            const wheelIdx = RESUME_SKILL_SECTIONS.findIndex(d => d.key === category);
            if (wheelIdx !== -1 && optionWheel) {
              optionWheel.select(wheelIdx);
            }
          }
        });
      });

      // Interactive Direction Toggle Button if present
      const toggleDirBtn = document.getElementById('spiral-toggle-direction');
      const dirLabel = document.getElementById('spiral-dir-label');
      if (toggleDirBtn && dirLabel) {
        let currentDir = 'up';
        toggleDirBtn.addEventListener('click', () => {
          currentDir = currentDir === 'up' ? 'down' : 'up';
          spiral.setDirection(currentDir);
          dirLabel.textContent = currentDir === 'up' ? 'Direction: ↑ Up' : 'Direction: ↓ Down';
        });
      }
    }
  });

  window.InfiniteSpiralEngine = InfiniteSpiralEngine;
})();
