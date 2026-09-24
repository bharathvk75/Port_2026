/**
 * Systems Architecture Studio: Interactive Showcase Component Engine
 * Features:
 * - Domain Filtering (Multi-Agent, Vision, Automation, Backend)
 * - Flagship Interactive Architecture Studio with live Flowchart Blueprint
 * - Interactive System Selector Dock with active beam indicator
 * - Studio Spotlight vs Matrix Grid view toggle
 * - Deep-dive architecture modal integration
 */

(function () {
  'use strict';

  const SYSTEMS_DATA = [
    {
      id: 'synapse',
      title: 'SYNAPSE',
      category: 'Multi-Agent System',
      domain: 'agentic',
      status: '78% Detection Accuracy',
      statusColor: '#38bdf8',
      subtitle: 'Multi-Agent Code Reviewer',
      desc: 'A multi-agent code-review system that analyzes repositories and pull requests for security, maintainability, performance, and coding-practice issues using specialized review agents.',
      features: [
        'Multi-agent code-review system analyzing repos & PRs for security, maintainability, performance, and coding practices',
        'Parallel agent execution, GitHub workflow integration, structured review outputs, and automated Markdown reports, reducing manual review effort by ~40%',
        'Evaluated across 200+ PR/repository samples, achieving 78% issue-detection accuracy against the defined evaluation set'
      ],
      tags: ['LangGraph', 'Python', 'FastAPI', 'GitHub Actions', 'AI Agents', 'REST APIs'],
      github: 'https://github.com/bharathvk75/SYNAPSE',
      blueprint: {
        nodes: [
          { num: '01', label: 'PR Ingestion', sub: 'GitHub App / AST Parser' },
          { num: '02', label: 'Agent Team', sub: 'Parallel Specialized Agents' },
          { num: '03', label: 'Security Audit', sub: 'CWE / OWASP Vulnerability Check' },
          { num: '04', label: 'Triage Delivery', sub: 'Automated PR Markdown Review' }
        ],
        benchmarks: [
          { label: 'Review Effort', val: '~40% Saved' },
          { label: 'PR Samples', val: '200+ PRs' },
          { label: 'Accuracy', val: '78%' }
        ]
      }
    },
    {
      id: 'deepxmed',
      title: 'DeepXMed',
      category: 'Healthcare & Vision AI',
      domain: 'vision',
      status: '~95% Recognition Accuracy',
      statusColor: '#06b6d4',
      subtitle: 'AI Medicine Discovery Platform',
      desc: 'An AI-assisted medicine discovery platform combining prescription OCR, medicine search, pharmacy discovery, and price comparison across multiple online sources.',
      features: [
        'Prescription-processing pipeline evaluated on 1,500+ prescription samples, achieving ~95% recognition accuracy',
        'Medicine discovery combining prescription OCR, medicine search, pharmacy discovery, and price comparison across multiple online sources',
        'Integrated authentication, search history, AI-assisted responses, and cloud-based data storage for core user workflows'
      ],
      tags: ['OpenCV', 'PyTorch', 'FastAPI', 'PostgreSQL', 'OCR', 'Cloud Storage'],
      github: 'https://github.com/bharathvk75/DeepXmeD',
      blueprint: {
        nodes: [
          { num: '01', label: 'Prescription Upload', sub: 'Doctor Prescription Capture' },
          { num: '02', label: 'Vision Processing', sub: 'OpenCV Preprocessing & OCR' },
          { num: '03', label: 'Medicine Search', sub: 'Drug Discovery & Comparison' },
          { num: '04', label: 'Geo & Storage', sub: 'Cloud Data & Multi-Source Pricing' }
        ],
        benchmarks: [
          { label: 'OCR Accuracy', val: '~95%' },
          { label: 'Evaluated Samples', val: '1,500+' },
          { label: 'Comparison', val: 'Multi-Source' }
        ]
      }
    },
    {
      id: 'aegis',
      title: 'AEGIS',
      category: 'Edge Computer Vision',
      domain: 'vision',
      status: '24ms Latency | ~40 FPS',
      statusColor: '#a855f7',
      subtitle: 'Real-Time Edge Video Analytics',
      desc: 'An edge-AI video analytics system for real-time object detection and event monitoring on a security-camera video stream.',
      features: [
        'Real-time object detection and event monitoring on security-camera video streams',
        'Optimized inference pipeline sustaining ~40 FPS while achieving 80% detection accuracy on evaluation dataset',
        'Reduced average inference latency from 39 ms to 24 ms through pipeline and inference optimizations'
      ],
      tags: ['PyTorch', 'TensorFlow', 'OpenCV', 'Edge AI', 'Docker'],
      github: 'https://github.com/bharathvk75/AEGIS',
      blueprint: {
        nodes: [
          { num: '01', label: 'RTSP Video Stream', sub: 'Security Camera Video Ingestion' },
          { num: '02', label: 'Pipeline Optimize', sub: 'Quantized & Optimized Runtime' },
          { num: '03', label: 'Perimeter Engine', sub: 'Object Detection & Event Tracking' },
          { num: '04', label: 'Event Telemetry', sub: 'Real-Time Monitoring Stream' }
        ],
        benchmarks: [
          { label: 'Inference Latency', val: '24ms (from 39ms)' },
          { label: 'Framerate', val: '~40 FPS' },
          { label: 'Accuracy', val: '80%' }
        ]
      }
    },
    {
      id: 'cablog',
      title: 'CabLog AI',
      category: 'Autonomous Automation',
      domain: 'automation',
      status: 'Vision LLMs & CDP',
      statusColor: '#3b82f6',
      subtitle: 'Agentic Document Processing & Fleet Operations',
      desc: 'Autonomous operations pipeline for logistics fleet management. Continuously monitors incoming vehicle duty slips & receipts, extracts structured trip metrics with Vision LLMs, and drives headless browser automation via Chrome DevTools Protocol.',
      features: [
        'Vision LLM multi-document parsing with Gemini 2.5 Flash',
        'Autonomous CDP browser filling for enterprise IndeCabs portal',
        'Automated Excel trip reconciliation with validation auditing'
      ],
      tags: ['Gemini Vision', 'CDP:9222', 'FastAPI', 'Excel Engine', 'Python'],
      github: 'https://github.com/bharathvk75/CABLOGs',
      blueprint: {
        nodes: [
          { num: '01', label: 'Document Slips', sub: 'Fleet Duty Slips & Fuel Receipts' },
          { num: '02', label: 'Gemini 2.5 Vision', sub: 'Structured JSON Metric Extraction' },
          { num: '03', label: 'CDP:9222 Browser', sub: 'Headless Chrome Automation' },
          { num: '04', label: 'Ledger Audit', sub: 'Automated Excel Reconciliation' }
        ],
        benchmarks: [
          { label: 'Headless Mode', val: '100% Autonomous' },
          { label: 'Speed / Slip', val: '3.2s' },
          { label: 'Protocol', val: 'Chrome CDP:9222' }
        ]
      }
    },
    {
      id: 'arbor',
      title: 'ARBOR',
      category: 'Algorithmic Reasoning',
      domain: 'agentic',
      status: 'MCTS Tree Search',
      statusColor: '#10b981',
      subtitle: 'Tree-Search Reasoning & Heuristic Agent',
      desc: 'Algorithmic agent architecture leveraging Monte Carlo Tree Search (MCTS) principles and heuristic branch pruning for complex multi-step reasoning, mathematical problem decomposition, and backtracking state trees.',
      features: [
        'MCTS heuristic state expansion and trajectory evaluation',
        'Graph execution visualizer for step-by-step decision validation',
        'Apache 2.0 open-source modular Python implementation'
      ],
      tags: ['Python 3.12', 'MCTS Algorithms', 'AI Planning', 'Graph Reasoning'],
      github: 'https://github.com/bharathvk75/ARBOR',
      blueprint: {
        nodes: [
          { num: '01', label: 'Goal Definition', sub: 'Multi-Step Problem Definition' },
          { num: '02', label: 'MCTS Expansion', sub: 'Stochastic Branch Generation' },
          { num: '03', label: 'Heuristic Pruning', sub: 'Value Scoring & Dead-End Drop' },
          { num: '04', label: 'Optimal Plan', sub: 'Step-by-Step Validated Graph' }
        ],
        benchmarks: [
          { label: 'Search Strategy', val: 'MCTS + Heuristic' },
          { label: 'Reasoning Depth', val: '12 Trajectories' },
          { label: 'License', val: 'Apache 2.0' }
        ]
      }
    },
    {
      id: 'expense_tracker',
      title: 'Expense Tracker API',
      category: 'High-Throughput Backend',
      domain: 'backend',
      status: 'FastAPI Async REST',
      statusColor: '#f59e0b',
      subtitle: 'High-Throughput Financial Analytics Backend',
      desc: 'High-performance personal and business finance backend API engineered with FastAPI. Automatically processes transactional streams, computes burn rates, detects recurring anomalies, and aggregates monthly cashflow.',
      features: [
        'Asynchronous RESTful endpoints with strict Pydantic v2 schemas',
        'Secure JWT authentication & role-based transaction auditing',
        'Automated category classification & monthly reporting metrics'
      ],
      tags: ['FastAPI', 'Pydantic v2', 'PostgreSQL', 'JWT Auth', 'Redis'],
      github: 'https://github.com/bharathvk75/bharathvk75-smart-expense-tracker-api',
      blueprint: {
        nodes: [
          { num: '01', label: 'Transaction Event', sub: 'REST / WebSocket Payload' },
          { num: '02', label: 'Schema Validation', sub: 'Pydantic v2 Strict Typing' },
          { num: '03', label: 'Async ORM Core', sub: 'PostgreSQL Connection Pooling' },
          { num: '04', label: 'Analytics Engine', sub: 'Burn Rate & Anomaly Stream' }
        ],
        benchmarks: [
          { label: 'Throughput', val: '8,500 req/s' },
          { label: 'P99 Latency', val: '< 12ms' },
          { label: 'Validation', val: 'Strict Pydantic v2' }
        ]
      }
    },
    {
      id: 'isolate',
      title: 'ISOLATE',
      category: 'Edge Security',
      domain: 'backend',
      status: 'GPL-3.0 Security',
      statusColor: '#ec4899',
      subtitle: 'Mobile Process Sandbox & Enclave Container',
      desc: 'High-security Android runtime architecture built in Kotlin. Implements strict sandbox isolation, memory boundary enforcement, and hardware-backed cryptographic credential containment for untrusted mobile computing tasks.',
      features: [
        'Process boundary isolation & encrypted IPC communication',
        'Hardware KeyStore security & zero-trust token storage',
        'Real-time tamper detection & sandbox violation telemetry'
      ],
      tags: ['Kotlin', 'Android Security', 'Hardware KeyStore', 'IPC Enclave'],
      github: 'https://github.com/bharathvk75/ISOLATE',
      blueprint: {
        nodes: [
          { num: '01', label: 'Untrusted Process', sub: 'Untrusted Mobile Workload' },
          { num: '02', label: 'Boundary Guard', sub: 'Strict Memory Barrier & Enclave' },
          { num: '03', label: 'Hardware KeyStore', sub: 'Hardware-Backed Cryptography' },
          { num: '04', label: 'Tamper Telemetry', sub: 'Zero-Trust Telemetry Dispatch' }
        ],
        benchmarks: [
          { label: 'Isolation Model', val: 'Hardware Enclave' },
          { label: 'KeyStore Type', val: 'Hardware-Backed' },
          { label: 'License', val: 'GPL-3.0' }
        ]
      }
    }
  ];

  class SystemsArchitectureStudio {
    constructor() {
      this.currentSystemId = 'synapse';
      this.currentDomain = 'all';
      this.viewMode = 'studio';

      this.stageContainer = document.getElementById('studio-stage-container');
      this.dockRail = document.getElementById('studio-dock-rail');
      this.matrixGrid = document.getElementById('studio-matrix-grid');
      this.filterTabs = document.querySelectorAll('.studio-tab-btn');
      this.btnStudio = document.getElementById('view-mode-studio');
      this.btnMatrix = document.getElementById('view-mode-matrix');

      if (!this.stageContainer || !this.dockRail) return;

      this.init();
    }

    init() {
      this.renderDock();
      this.renderStage(this.currentSystemId);
      this.renderMatrixGrid();
      this.attachEvents();
    }

    renderDock() {
      this.dockRail.innerHTML = '';

      const filtered = this.getFilteredSystems();

      filtered.forEach((sys, idx) => {
        const isActive = sys.id === this.currentSystemId;
        const dockCard = document.createElement('button');
        dockCard.className = `studio-dock-card ${isActive ? 'active' : ''}`;
        dockCard.setAttribute('data-id', sys.id);
        dockCard.setAttribute('aria-label', `Select ${sys.title}`);

        dockCard.innerHTML = `
          <div class="dock-card-top">
            <span class="dock-card-index">0${idx + 1}</span>
            <span class="dock-card-dot" style="background:${sys.statusColor}; box-shadow:0 0 8px ${sys.statusColor};"></span>
          </div>
          <div class="dock-card-title">${sys.title}</div>
          <div class="dock-card-tag">${sys.category}</div>
        `;

        dockCard.addEventListener('click', () => {
          this.switchSystem(sys.id);
        });

        this.dockRail.appendChild(dockCard);
      });
    }

    renderStage(systemId) {
      const sys = SYSTEMS_DATA.find((s) => s.id === systemId) || SYSTEMS_DATA[0];
      if (!sys) return;

      this.stageContainer.innerHTML = `
        <div class="studio-flagship-card spotlight-card border-beam-card" data-id="${sys.id}">
          
          <!-- Left Spec Panel -->
          <div class="studio-spec-panel">
            <div class="studio-header-meta">
              <span class="project-category-pill">${sys.category}</span>
              <span class="studio-status-pill" style="color:${sys.statusColor}; border-color:${sys.statusColor}40;">
                <span class="studio-live-dot" style="background:${sys.statusColor};"></span>
                ${sys.status}
              </span>
            </div>

            <h3 class="studio-title">${sys.title}</h3>
            <div class="studio-subtitle">${sys.subtitle}</div>

            <p class="studio-desc">${sys.desc}</p>

            <div class="studio-features-block">
              <div class="studio-features-title">Architectural Innovations:</div>
              <ul class="studio-features-list">
                ${sys.features
                  .map(
                    (f) => `
                  <li class="studio-feature-item">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${sys.statusColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>${f}</span>
                  </li>
                `
                  )
                  .join('')}
              </ul>
            </div>

            <div class="studio-tags-row">
              ${sys.tags.map((t) => `<span class="tech-tag">${t}</span>`).join('')}
            </div>

            <div class="studio-actions-row">
              <button class="btn-pill-link open-project-deepdive studio-deepdive-btn" data-project="${sys.id}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                <span>Architecture Deep-Dive</span>
              </button>

              <a href="${sys.github}" target="_blank" rel="noreferrer noopener" class="btn-pill-link studio-github-btn" aria-label="View on GitHub">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                <span>GitHub Repository ↗</span>
              </a>
            </div>
          </div>

          <!-- Right Interactive Architecture Blueprint Flowchart -->
          <div class="studio-blueprint-panel">
            <div class="blueprint-card-header">
              <div class="blueprint-header-left">
                <span class="blueprint-pulse"></span>
                <span class="blueprint-code">TOPOLOGY // DATA FLOW BLUEPRINT</span>
              </div>
              <span class="blueprint-sys-tag">${sys.id.toUpperCase()}</span>
            </div>

            <!-- Flowchart Nodes Sequence -->
            <div class="blueprint-nodes-flow">
              ${sys.blueprint.nodes
                .map(
                  (node, i) => `
                <div class="blueprint-node-item">
                  <div class="blueprint-node-index">${node.num}</div>
                  <div class="blueprint-node-content">
                    <div class="blueprint-node-label">${node.label}</div>
                    <div class="blueprint-node-sub">${node.sub}</div>
                  </div>
                  ${
                    i < sys.blueprint.nodes.length - 1
                      ? `<div class="blueprint-connector">
                           <div class="connector-line"></div>
                           <div class="connector-arrow">▼</div>
                         </div>`
                      : ''
                  }
                </div>
              `
                )
                .join('')}
            </div>

            <!-- Telemetry Benchmarks Bar -->
            <div class="blueprint-telemetry-bar">
              ${sys.blueprint.benchmarks
                .map(
                  (b) => `
                <div class="blueprint-telemetry-col">
                  <span class="telemetry-col-label">${b.label}</span>
                  <span class="telemetry-col-val">${b.val}</span>
                </div>
              `
                )
                .join('')}
            </div>
          </div>

        </div>
      `;

      // Wire up deep-dive button click
      const deepdiveBtn = this.stageContainer.querySelector('.studio-deepdive-btn');
      if (deepdiveBtn) {
        deepdiveBtn.addEventListener('click', () => {
          const pKey = deepdiveBtn.getAttribute('data-project');
          if (typeof window.openProjectModal === 'function') {
            window.openProjectModal(pKey);
          } else {
            const modal = document.getElementById('project-deepdive-modal');
            if (modal) modal.classList.add('active');
          }
        });
      }
    }

    renderMatrixGrid() {
      if (!this.matrixGrid) return;
      this.matrixGrid.innerHTML = '';

      const filtered = this.getFilteredSystems();

      filtered.forEach((sys) => {
        const card = document.createElement('div');
        card.className = 'project-card tilt-card spotlight-card border-beam-card';
        card.innerHTML = `
          <div>
            <div class="project-header">
              <span class="project-category-pill">${sys.category}</span>
              <span style="font-size:0.75rem;font-family:var(--font-mono);color:${sys.statusColor};font-weight:700;">${sys.status}</span>
            </div>
            <h3>${sys.title}</h3>
            <div class="project-subtitle">${sys.subtitle}</div>
            <p class="project-desc">${sys.desc}</p>
            <ul class="project-features">
              ${sys.features
                .map(
                  (f) => `
                <li class="project-feature-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span>${f}</span>
                </li>
              `
                )
                .join('')}
            </ul>
          </div>
          <div class="project-footer">
            <div class="badge-tags">
              ${sys.tags.slice(0, 3).map((t) => `<span class="tech-tag">${t}</span>`).join('')}
            </div>
            <div class="project-links">
              <button class="btn-pill-link open-project-deepdive" data-project="${sys.id}">
                <span>Architecture</span>
              </button>
              <a href="${sys.github}" target="_blank" rel="noreferrer noopener" class="btn-pill-link" aria-label="${sys.title} on GitHub">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                <span>GitHub</span>
              </a>
            </div>
          </div>
        `;

        // Wire modal button
        const btn = card.querySelector('.open-project-deepdive');
        if (btn) {
          btn.addEventListener('click', () => {
            if (typeof window.openProjectModal === 'function') {
              window.openProjectModal(sys.id);
            }
          });
        }

        this.matrixGrid.appendChild(card);
      });
    }

    switchSystem(systemId) {
      if (this.currentSystemId === systemId) return;
      this.currentSystemId = systemId;

      // Update dock cards active state
      this.dockRail.querySelectorAll('.studio-dock-card').forEach((card) => {
        card.classList.toggle('active', card.getAttribute('data-id') === systemId);
      });

      // Smooth transition on stage
      this.stageContainer.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      this.stageContainer.style.opacity = '0.35';
      this.stageContainer.style.transform = 'translateY(4px)';

      setTimeout(() => {
        this.renderStage(systemId);
        this.stageContainer.style.opacity = '1';
        this.stageContainer.style.transform = 'translateY(0)';
      }, 160);
    }

    getFilteredSystems() {
      if (!this.currentDomain || this.currentDomain === 'all') {
        return SYSTEMS_DATA;
      }
      return SYSTEMS_DATA.filter((s) => s.domain === this.currentDomain);
    }

    filterDomain(domainKey) {
      this.currentDomain = domainKey;
      const filtered = this.getFilteredSystems();

      // If current system is not in filtered list, switch to first available
      if (!filtered.some((s) => s.id === this.currentSystemId) && filtered.length > 0) {
        this.currentSystemId = filtered[0].id;
      }

      this.renderDock();
      this.renderStage(this.currentSystemId);
      this.renderMatrixGrid();
    }

    attachEvents() {
      // Domain filter tabs
      this.filterTabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          this.filterTabs.forEach((t) => {
            const isMatch = t === tab;
            t.classList.toggle('active', isMatch);
            t.setAttribute('aria-selected', isMatch ? 'true' : 'false');
          });

          const domain = tab.getAttribute('data-domain');
          this.filterDomain(domain);
        });
      });

      // View mode toggles
      if (this.btnStudio && this.btnMatrix) {
        this.btnStudio.addEventListener('click', () => {
          this.viewMode = 'studio';
          this.btnStudio.classList.add('active');
          this.btnMatrix.classList.remove('active');
          this.stageContainer.style.display = 'block';
          this.dockRail.style.display = 'grid';
          this.matrixGrid.style.display = 'none';
        });

        this.btnMatrix.addEventListener('click', () => {
          this.viewMode = 'matrix';
          this.btnMatrix.classList.add('active');
          this.btnStudio.classList.remove('active');
          this.stageContainer.style.display = 'none';
          this.dockRail.style.display = 'none';
          this.matrixGrid.style.display = 'grid';
        });
      }
    }
  }

  // Mount on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.systemsStudioInstance = new SystemsArchitectureStudio();
    });
  } else {
    window.systemsStudioInstance = new SystemsArchitectureStudio();
  }
})();
