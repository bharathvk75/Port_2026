/**
 * React Bits: Stepper Component Engine
 * Interactive Multi-Step Project Architecture Walkthrough with
 * animated connectors, dynamic transitions, and modal integration.
 */

(function () {
  'use strict';

  const PROJECT_STEPS_DATA = [
    {
      step: 1,
      id: 'synapse',
      title: 'SYNAPSE',
      subtitle: 'Multi-Agent Autonomous Code Reviewer',
      category: 'Multi-Agent Systems',
      highlight: 'LangGraph & AST',
      desc: 'Distributed multi-agent system executing parallel code review pipelines on enterprise PRs. Deconstructs pull requests into security, syntax, and performance tasks using AST extraction and LangGraph state machines.',
      pipeline: [
        'GitHub Webhook & AST parsing isolate diff context',
        'Planner agent delegates security & complexity checks',
        'Parallel LangGraph execution nodes review CWEs & coverage',
        'Consensus synthesis agent writes GitHub Markdown reports'
      ],
      tags: ['LangGraph', 'Python', 'FastAPI', 'GitHub Actions', 'AST', 'Docker']
    },
    {
      step: 2,
      id: 'deepxmed',
      title: 'DeepXMed',
      subtitle: 'AI Medicine Discovery & Verification Platform',
      category: 'Healthcare AI',
      highlight: 'Vision & RAG',
      desc: 'Intelligent healthcare platform for doctor prescription digitisation via OCR, active drug contraindication detection via semantic vector retrieval, and live nearby pharmacy inventory search.',
      pipeline: [
        'OpenCV preprocessing & Vision LLM prescription OCR',
        'pgvector semantic search cross-checks contraindications',
        'Geolocation algorithms calculate nearest pharmacy routes',
        'Cross-platform pricing intelligence table render'
      ],
      tags: ['OpenCV', 'GenAI', 'PostgreSQL', 'pgvector', 'FastAPI', 'React']
    },
    {
      step: 3,
      id: 'aegis',
      title: 'AEGIS',
      subtitle: 'Real-Time Edge Video Analytics System',
      category: 'Edge Computer Vision',
      highlight: 'Sub-18ms Latency',
      desc: 'High-performance edge-AI video analytics system applying state-of-the-art computer-vision models for real-time object detection, safety perimeter enforcement, and automated anomaly event streaming.',
      pipeline: [
        'RTSP stream decoding via OpenCV & NVIDIA TensorRT',
        'Quantized lightweight inference achieves sub-18ms loops',
        'Multi-class object tracking & safety perimeter alerts',
        'Asynchronous webhook event dispatch & boundary overlays'
      ],
      tags: ['PyTorch', 'TensorFlow', 'OpenCV', 'Edge AI', 'Python']
    },
    {
      step: 4,
      id: 'cablog',
      title: 'CabLog AI',
      subtitle: 'Agentic Document Processing & Fleet Operations',
      category: 'Agentic Automation',
      highlight: 'Vision LLMs & CDP',
      desc: 'Autonomous operations pipeline for logistics fleet management. Continuously watches incoming vehicle duty slips and receipts, extracts structured trip metrics with Vision LLMs, and drives headless browser automation to populate fleet enterprise portals.',
      pipeline: [
        'LocalSend & queue listeners watch incoming slip images',
        'Gemini 2.5 Flash extracts odometer, fuel, & driver logs',
        'Chrome DevTools Protocol (CDP:9222) automates web portal',
        'Formatted Excel trip logs (.xlsx) compiled with audit trail'
      ],
      tags: ['Vision LLMs', 'Gemini Flash', 'Browser-Use', 'CDP:9222', 'FastAPI', 'Python']
    }
  ];

  class StepperEngine {
    constructor(containerEl, options = {}) {
      if (!containerEl) return;
      this.container = containerEl;
      this.steps = options.steps || PROJECT_STEPS_DATA;
      this.currentStep = options.initialStep || 1;
      this.totalSteps = this.steps.length;
      this.direction = 1;

      this.init();
    }

    init() {
      this.render();
      this.attachEvents();
    }

    render() {
      this.container.innerHTML = `
        <div class="outer-container">
          <div class="step-circle-container">
            <!-- Step Indicators Row -->
            <div class="step-indicator-row" id="stepper-indicators">
              ${this.steps
                .map((s, idx) => {
                  const stepNumber = idx + 1;
                  const isNotLast = idx < this.totalSteps - 1;
                  const status =
                    this.currentStep === stepNumber
                      ? 'active'
                      : this.currentStep > stepNumber
                      ? 'complete'
                      : 'inactive';

                  return `
                    <div class="step-indicator ${status}" data-step="${stepNumber}" role="button" tabindex="0" aria-label="Step ${stepNumber}: ${s.title}">
                      <div class="step-indicator-inner">
                        ${
                          status === 'complete'
                            ? `<svg class="check-icon" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>`
                            : status === 'active'
                            ? `<div class="active-dot"></div>`
                            : `<span class="step-number">${stepNumber}</span>`
                        }
                      </div>
                      <span class="step-label">${s.title}</span>
                    </div>
                    ${
                      isNotLast
                        ? `
                        <div class="step-connector ${this.currentStep > stepNumber ? 'complete' : ''}" data-connector="${stepNumber}">
                          <div class="step-connector-inner" style="width: ${this.currentStep > stepNumber ? '100%' : '0%'}"></div>
                        </div>
                      `
                        : ''
                    }
                  `;
                })
                .join('')}
            </div>

            <!-- Step Content Wrapper -->
            <div class="step-content-default" id="stepper-content-wrapper">
              ${this.renderStepContent(this.currentStep, 'slide-enter-right')}
            </div>

            <!-- Footer Navigation -->
            <div class="footer-container">
              <div class="footer-nav">
                <button class="back-button ${this.currentStep === 1 ? 'inactive' : ''}" id="stepper-btn-back">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
                  <span>Previous Project</span>
                </button>
                <div style="font-size:0.8rem; font-family:var(--font-mono); color:var(--text-muted);">
                  Step <span id="stepper-current-label">${this.currentStep}</span> of ${this.totalSteps}
                </div>
                <button class="next-button" id="stepper-btn-next">
                  <span id="stepper-next-label">${this.currentStep === this.totalSteps ? 'Explore All (Grid)' : 'Next Project'}</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    renderStepContent(stepNumber, animationClass) {
      const p = this.steps[stepNumber - 1];
      if (!p) return '';

      return `
        <div class="step-default ${animationClass}" id="step-content-${stepNumber}">
          <div class="stepper-project-body">
            <div>
              <div class="stepper-project-badge-row">
                <span class="stepper-project-cat">${p.category}</span>
                <span style="font-size:0.75rem;font-family:var(--font-mono);color:var(--color-accent-cyan);font-weight:700;">${p.highlight}</span>
              </div>
              <h3 class="stepper-project-title">${p.title}</h3>
              <div class="stepper-project-subtitle">${p.subtitle}</div>
              <p class="stepper-project-desc">${p.desc}</p>
              
              <div style="display:flex;gap:0.4rem;flex-wrap:wrap;margin-bottom:1.4rem;">
                ${p.tags.map((t) => `<span class="tech-tag">${t}</span>`).join('')}
              </div>

              <div style="display:flex;gap:0.75rem;align-items:center;">
                <button class="btn-pill-link open-project-deepdive" data-project="${p.id}">
                  <span>Architecture Deep-Dive</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
                <a href="https://github.com/bharathvk75" target="_blank" class="btn-pill-link" aria-label="${p.title} on GitHub">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                  <span>GitHub</span>
                </a>
              </div>
            </div>

            <div class="stepper-architecture-card">
              <div class="stepper-arch-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                <span>Pipeline Architecture</span>
              </div>
              <ul class="stepper-pipeline-list">
                ${p.pipeline
                  .map(
                    (stepText) => `
                    <li class="stepper-pipeline-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      <span>${stepText}</span>
                    </li>
                  `
                  )
                  .join('')}
              </ul>
            </div>
          </div>
        </div>
      `;
    }

    goToStep(newStep) {
      if (newStep < 1 || newStep > this.totalSteps || newStep === this.currentStep) return;
      this.direction = newStep > this.currentStep ? 1 : -1;
      this.currentStep = newStep;

      // Update indicators
      const indicators = this.container.querySelectorAll('.step-indicator');
      indicators.forEach((ind) => {
        const sNum = Number(ind.getAttribute('data-step'));
        ind.classList.remove('active', 'complete', 'inactive');
        const inner = ind.querySelector('.step-indicator-inner');

        if (sNum === this.currentStep) {
          ind.classList.add('active');
          inner.innerHTML = '<div class="active-dot"></div>';
        } else if (sNum < this.currentStep) {
          ind.classList.add('complete');
          inner.innerHTML =
            '<svg class="check-icon" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        } else {
          ind.classList.add('inactive');
          inner.innerHTML = `<span class="step-number">${sNum}</span>`;
        }
      });

      // Update connectors
      const connectors = this.container.querySelectorAll('.step-connector');
      connectors.forEach((conn) => {
        const cNum = Number(conn.getAttribute('data-connector'));
        const inner = conn.querySelector('.step-connector-inner');
        if (this.currentStep > cNum) {
          conn.classList.add('complete');
          if (inner) inner.style.width = '100%';
        } else {
          conn.classList.remove('complete');
          if (inner) inner.style.width = '0%';
        }
      });

      // Update content
      const contentWrapper = this.container.querySelector('#stepper-content-wrapper');
      if (contentWrapper) {
        const animClass = this.direction > 0 ? 'slide-enter-right' : 'slide-enter-left';
        contentWrapper.innerHTML = this.renderStepContent(this.currentStep, animClass);
      }

      // Update footer controls
      const backBtn = this.container.querySelector('#stepper-btn-back');
      if (backBtn) {
        if (this.currentStep === 1) backBtn.classList.add('inactive');
        else backBtn.classList.remove('inactive');
      }

      const nextLabel = this.container.querySelector('#stepper-next-label');
      if (nextLabel) {
        nextLabel.textContent = this.currentStep === this.totalSteps ? 'Explore All (Grid)' : 'Next Project';
      }

      const currentLabel = this.container.querySelector('#stepper-current-label');
      if (currentLabel) {
        currentLabel.textContent = this.currentStep;
      }

      // Rebind modal button
      this.container.querySelectorAll('.open-project-deepdive').forEach((btn) => {
        btn.addEventListener('click', () => {
          const pKey = btn.getAttribute('data-project');
          if (window.openProjectModal) window.openProjectModal(pKey);
        });
      });
    }

    attachEvents() {
      // Step indicators click
      this.container.addEventListener('click', (e) => {
        const ind = e.target.closest('.step-indicator');
        if (ind) {
          const stepNum = Number(ind.getAttribute('data-step'));
          this.goToStep(stepNum);
          return;
        }

        const backBtn = e.target.closest('#stepper-btn-back');
        if (backBtn && this.currentStep > 1) {
          this.goToStep(this.currentStep - 1);
          return;
        }

        const nextBtn = e.target.closest('#stepper-btn-next');
        if (nextBtn) {
          if (this.currentStep < this.totalSteps) {
            this.goToStep(this.currentStep + 1);
          } else {
            // Switch to full grid view seamlessly
            if (window.switchProjectsView) {
              window.switchProjectsView('grid');
            }
            const grid = document.querySelector('.projects-grid');
            if (grid) {
              if (window.lenis) window.lenis.scrollTo(grid, { offset: -70 });
              else grid.scrollIntoView({ behavior: 'smooth' });
            }
          }
          return;
        }

        const deepdiveBtn = e.target.closest('.open-project-deepdive');
        if (deepdiveBtn) {
          const pKey = deepdiveBtn.getAttribute('data-project');
          if (window.openProjectModal) window.openProjectModal(pKey);
        }
      });

      // Keyboard arrow navigation when container is in focus
      this.container.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' && this.currentStep < this.totalSteps) {
          this.goToStep(this.currentStep + 1);
        } else if (e.key === 'ArrowLeft' && this.currentStep > 1) {
          this.goToStep(this.currentStep - 1);
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const mount = document.getElementById('projects-stepper-mount');
    if (mount) {
      window.projectStepper = new StepperEngine(mount, {
        steps: PROJECT_STEPS_DATA,
        initialStep: 1
      });
    }

    // Hook up Project View Switcher (Stepper vs Grid)
    const tabStepper = document.getElementById('tab-projects-stepper');
    const tabGrid = document.getElementById('tab-projects-grid');
    const stepperWrap = document.getElementById('projects-stepper-outer');
    const gridWrap = document.getElementById('projects-grid-wrap');

    function switchView(target) {
      if (target === 'stepper') {
        if (tabStepper) tabStepper.classList.add('active');
        if (tabGrid) tabGrid.classList.remove('active');
        if (stepperWrap) stepperWrap.classList.remove('is-hidden');
        if (gridWrap) gridWrap.classList.add('is-hidden');
      } else {
        if (tabStepper) tabStepper.classList.remove('active');
        if (tabGrid) tabGrid.classList.add('active');
        if (stepperWrap) stepperWrap.classList.add('is-hidden');
        if (gridWrap) gridWrap.classList.remove('is-hidden');
      }
    }

    if (tabStepper) tabStepper.addEventListener('click', () => switchView('stepper'));
    if (tabGrid) tabGrid.addEventListener('click', () => switchView('grid'));
    window.switchProjectsView = switchView;
  });

  window.StepperEngine = StepperEngine;
})();
