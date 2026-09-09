/**
 * React Bits: LogoLoop Component Engine
 * High-performance Vanilla JavaScript ticker with exponential speed damping,
 * dynamic copy calculation, edge fade gradients, and interactive hover pause.
 */

(function () {
  'use strict';

  const ANIMATION_CONFIG = { SMOOTH_TAU: 0.25, MIN_COPIES: 2, COPY_HEADROOM: 2 };

  class LogoLoopEngine {
    constructor(containerEl, options = {}) {
      if (!containerEl) return;
      this.container = containerEl;
      this.logos = options.logos || [];
      this.speed = options.speed !== undefined ? options.speed : 90;
      this.direction = options.direction || 'left';
      this.logoHeight = options.logoHeight || 28;
      this.gap = options.gap || 32;
      this.hoverSpeed = options.hoverSpeed !== undefined ? options.hoverSpeed : 0;
      this.scaleOnHover = options.scaleOnHover !== undefined ? options.scaleOnHover : true;
      this.fadeOut = options.fadeOut !== undefined ? options.fadeOut : true;
      this.fadeOutColor = options.fadeOutColor || null;
      this.ariaLabel = options.ariaLabel || 'Technology partners ticker';

      this.isVertical = this.direction === 'up' || this.direction === 'down';
      this.seqWidth = 0;
      this.seqHeight = 0;
      this.copyCount = ANIMATION_CONFIG.MIN_COPIES;
      this.isHovered = false;
      this.offset = 0;
      this.velocity = 0;
      this.lastTimestamp = null;
      this.rafId = null;

      this.init();
    }

    init() {
      this.container.classList.add('logoloop');
      this.container.classList.add(this.isVertical ? 'logoloop--vertical' : 'logoloop--horizontal');
      if (this.fadeOut) this.container.classList.add('logoloop--fade');
      if (this.scaleOnHover) this.container.classList.add('logoloop--scale-hover');

      this.container.style.setProperty('--logoloop-gap', `${this.gap}px`);
      this.container.style.setProperty('--logoloop-logoHeight', `${this.logoHeight}px`);
      if (this.fadeOutColor) {
        this.container.style.setProperty('--logoloop-fadeColor', this.fadeOutColor);
      }
      this.container.setAttribute('role', 'region');
      this.container.setAttribute('aria-label', this.ariaLabel);

      // Create Track
      this.track = document.createElement('div');
      this.track.className = 'logoloop__track';
      this.container.appendChild(this.track);

      this.renderLists();
      this.updateDimensions();
      this.attachEvents();
      this.setupObserver();
    }

    renderLists() {
      this.track.innerHTML = '';
      this.lists = [];

      for (let i = 0; i < this.copyCount; i++) {
        const ul = document.createElement('ul');
        ul.className = 'logoloop__list';
        ul.setAttribute('role', 'list');
        if (i > 0) ul.setAttribute('aria-hidden', 'true');

        this.logos.forEach((item, itemIdx) => {
          const li = document.createElement('li');
          li.className = 'logoloop__item';
          li.setAttribute('role', 'listitem');

          let content;
          if (item.node) {
            content = document.createElement('span');
            content.className = 'logoloop__node';
            content.innerHTML = item.node;
          } else if (item.src) {
            const img = document.createElement('img');
            img.src = item.src;
            img.alt = item.alt || item.title || '';
            img.loading = 'lazy';
            img.decoding = 'async';
            img.draggable = false;
            content = img;
          } else if (item.title) {
            content = document.createElement('span');
            content.className = 'logoloop__node';
            if (item.badge) {
              content.innerHTML = `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${item.color || '#3b82f6'};box-shadow:0 0 8px ${item.color || '#3b82f6'};"></span><span>${item.title}</span>`;
            } else {
              content.textContent = item.title;
            }
          }

          if (item.href) {
            const a = document.createElement('a');
            a.className = 'logoloop__link';
            a.href = item.href;
            a.target = '_blank';
            a.rel = 'noreferrer noopener';
            a.setAttribute('aria-label', item.title || item.alt || 'technology link');
            a.appendChild(content);
            li.appendChild(a);
          } else {
            li.appendChild(content);
          }

          ul.appendChild(li);
        });

        this.track.appendChild(ul);
        this.lists.push(ul);
      }
    }

    updateDimensions() {
      const firstList = this.lists[0];
      if (!firstList) return;

      const containerWidth = this.container.clientWidth || window.innerWidth;
      const sequenceRect = firstList.getBoundingClientRect();
      const sequenceWidth = sequenceRect.width || 0;
      const sequenceHeight = sequenceRect.height || 0;

      if (this.isVertical) {
        if (sequenceHeight > 0) {
          this.seqHeight = Math.ceil(sequenceHeight);
          const parentHeight = this.container.clientHeight || 200;
          const copiesNeeded = Math.ceil(parentHeight / sequenceHeight) + ANIMATION_CONFIG.COPY_HEADROOM;
          const newCopyCount = Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded);
          if (newCopyCount !== this.copyCount) {
            this.copyCount = newCopyCount;
            this.renderLists();
          }
        }
      } else if (sequenceWidth > 0) {
        this.seqWidth = Math.ceil(sequenceWidth);
        const copiesNeeded = Math.ceil(containerWidth / sequenceWidth) + ANIMATION_CONFIG.COPY_HEADROOM;
        const newCopyCount = Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded);
        if (newCopyCount !== this.copyCount) {
          this.copyCount = newCopyCount;
          this.renderLists();
        }
      }
    }

    attachEvents() {
      this.track.addEventListener('mouseenter', () => {
        this.isHovered = true;
      });

      this.track.addEventListener('mouseleave', () => {
        this.isHovered = false;
      });

      if (typeof ResizeObserver !== 'undefined') {
        const ro = new ResizeObserver(() => {
          this.updateDimensions();
        });
        ro.observe(this.container);
        if (this.lists[0]) ro.observe(this.lists[0]);
      } else {
        window.addEventListener('resize', () => this.updateDimensions());
      }
    }

    getTargetVelocity() {
      const magnitude = Math.abs(this.speed);
      let directionMultiplier;
      if (this.isVertical) {
        directionMultiplier = this.direction === 'up' ? 1 : -1;
      } else {
        directionMultiplier = this.direction === 'left' ? 1 : -1;
      }
      const speedMultiplier = this.speed < 0 ? -1 : 1;
      return magnitude * directionMultiplier * speedMultiplier;
    }

    setupObserver() {
      if ('IntersectionObserver' in window) {
        this.observer = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) {
            this.startLoop();
          } else {
            this.stopLoop();
          }
        }, { rootMargin: '100px 0px' });
        this.observer.observe(this.container);
      } else {
        this.startLoop();
      }
    }

    startLoop() {
      if (this.isRunning) return;
      this.isRunning = true;
      this.lastTimestamp = null;

      const animate = (timestamp) => {
        if (!this.isRunning) return;
        if (this.lastTimestamp === null) {
          this.lastTimestamp = timestamp;
        }

        const deltaTime = Math.max(0, timestamp - this.lastTimestamp) / 1000;
        this.lastTimestamp = timestamp;

        const target = this.isHovered ? this.hoverSpeed : this.getTargetVelocity();
        const easingFactor = 1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU);
        this.velocity += (target - this.velocity) * easingFactor;

        const seqSize = this.isVertical ? this.seqHeight : this.seqWidth;

        if (seqSize > 0) {
          let nextOffset = this.offset + this.velocity * deltaTime;
          nextOffset = ((nextOffset % seqSize) + seqSize) % seqSize;
          this.offset = nextOffset;

          const transformValue = this.isVertical
            ? `translate3d(0, ${-this.offset}px, 0)`
            : `translate3d(${-this.offset}px, 0, 0)`;
          this.track.style.transform = transformValue;
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
      this.container.innerHTML = '';
    }
  }

  // Preset Datasets
  const CORE_TECH_LOGOS = [
    { title: 'Python', color: '#3b82f6', badge: true, href: 'https://python.org' },
    { title: 'PyTorch', color: '#ee4c2c', badge: true, href: 'https://pytorch.org' },
    { title: 'LangGraph', color: '#38bdf8', badge: true, href: 'https://langchain-ai.github.io/langgraph' },
    { title: 'LangChain', color: '#10b981', badge: true, href: 'https://langchain.com' },
    { title: 'Anthropic Claude', color: '#d97706', badge: true, href: 'https://anthropic.com' },
    { title: 'Model Context Protocol (MCP)', color: '#a855f7', badge: true, href: 'https://modelcontextprotocol.io' },
    { title: 'OpenAI GPT-4o', color: '#10a37f', badge: true, href: 'https://openai.com' },
    { title: 'FastAPI', color: '#009688', badge: true, href: 'https://fastapi.tiangolo.com' },
    { title: 'PostgreSQL & pgvector', color: '#336791', badge: true, href: 'https://postgresql.org' },
    { title: 'Docker', color: '#2496ed', badge: true, href: 'https://docker.com' },
    { title: 'TensorFlow', color: '#ff6f00', badge: true, href: 'https://tensorflow.org' },
    { title: 'OpenCV', color: '#5c3ee8', badge: true, href: 'https://opencv.org' },
    { title: 'Hugging Face', color: '#ffd21e', badge: true, href: 'https://huggingface.co' },
    { title: 'React 19', color: '#61dafb', badge: true, href: 'https://react.dev' },
    { title: 'Redis', color: '#dc382d', badge: true, href: 'https://redis.io' },
    { title: 'Linux / Bash', color: '#f59e0b', badge: true, href: 'https://kernel.org' },
    { title: 'AWS Cloud', color: '#ff9900', badge: true, href: 'https://aws.amazon.com' },
    { title: 'Kubernetes', color: '#326ce5', badge: true, href: 'https://kubernetes.io' }
  ];

  const PARTNERS_LOGOS = [
    { title: 'Anthropic', color: '#d97706', badge: true, href: 'https://anthropic.com' },
    { title: 'LangChain Academy', color: '#06b6d4', badge: true, href: 'https://academy.langchain.com' },
    { title: 'Cisco Networking Academy', color: '#10b981', badge: true, href: 'https://netacad.com' },
    { title: 'Amazon Web Services', color: '#ff9900', badge: true, href: 'https://aws.amazon.com' },
    { title: 'Imperial College London', color: '#f59e0b', badge: true, href: 'https://imperial.ac.uk' },
    { title: 'Infosys Springboard', color: '#0284c7', badge: true, href: 'https://infosys.com' },
    { title: 'Hewlett Packard Enterprise', color: '#059669', badge: true, href: 'https://hpe.com' },
    { title: 'Deloitte', color: '#84cc16', badge: true, href: 'https://deloitte.com' },
    { title: 'BCG X', color: '#10b981', badge: true, href: 'https://bcg.com' },
    { title: 'Forage Simulations', color: '#6366f1', badge: true, href: 'https://theforage.com' }
  ];

  const AI_MODELS_LOGOS = [
    { title: 'Claude 3.7 Sonnet', color: '#d97706', badge: true },
    { title: 'DeepSeek R1', color: '#3b82f6', badge: true },
    { title: 'Llama 3.3 70B', color: '#06b6d4', badge: true },
    { title: 'Qdrant Vector DB', color: '#ec4899', badge: true },
    { title: 'ChromaDB', color: '#a855f7', badge: true },
    { title: 'Pinecone', color: '#10b981', badge: true },
    { title: 'Ollama Edge', color: '#f59e0b', badge: true },
    { title: 'vLLM Engine', color: '#38bdf8', badge: true },
    { title: 'LangSmith Observability', color: '#6366f1', badge: true },
    { title: 'n8n Workflow Automation', color: '#ea580c', badge: true }
  ];

  // Auto-initialize loops when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Sub-Hero Core Tech Stack Loop
    const heroLoopEl = document.getElementById('hero-tech-loop');
    if (heroLoopEl) {
      new LogoLoopEngine(heroLoopEl, {
        logos: CORE_TECH_LOGOS,
        speed: 80,
        direction: 'left',
        logoHeight: 30,
        gap: 36,
        hoverSpeed: 0,
        scaleOnHover: true,
        fadeOut: true,
        ariaLabel: 'Core Technology Stack Ticker'
      });
    }

    // 2. Certifications Accredited Partners Loop
    const certsLoopEl = document.getElementById('certs-partners-loop');
    if (certsLoopEl) {
      new LogoLoopEngine(certsLoopEl, {
        logos: PARTNERS_LOGOS,
        speed: 70,
        direction: 'left',
        logoHeight: 28,
        gap: 32,
        hoverSpeed: 0,
        scaleOnHover: true,
        fadeOut: true,
        ariaLabel: 'Accredited Certification Partners Ticker'
      });
    }

    // 3. Skills Models & Infrastructure Loop (reverse direction for dynamic counterpoint)
    const skillsLoopEl = document.getElementById('skills-models-loop');
    if (skillsLoopEl) {
      new LogoLoopEngine(skillsLoopEl, {
        logos: AI_MODELS_LOGOS,
        speed: 65,
        direction: 'right',
        logoHeight: 28,
        gap: 32,
        hoverSpeed: 0,
        scaleOnHover: true,
        fadeOut: true,
        ariaLabel: 'AI Models and Vector Infrastructure Ticker'
      });
    }
  });

  window.LogoLoopEngine = LogoLoopEngine;
})();
