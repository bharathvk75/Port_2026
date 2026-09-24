// ==========================================================================
// MAIN CONTROLLER: CENTERED NAVBAR, CERTIFICATES MATRIX DECK, MODALS, TOASTS
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. Toast Notification System (Disabled per user requirement)
  // ------------------------------------------------------------------------
  window.showToast = function () {
    // Popup messages disabled
  };

  // ------------------------------------------------------------------------
  // 2. Individual Connected Capsule Navbar Active Link Tracking
  // ------------------------------------------------------------------------
  const navLinks = document.querySelectorAll('.nav-links .nav-link');
  let activeLink = navLinks[0];

  if (navLinks.length > 0) {
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.forEach((l) => l.classList.remove('active'));
        link.classList.add('active');
        activeLink = link;
      });
    });

    let navTicking = false;
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveSection() {
      const scrollY = window.scrollY;
      for (let i = 0; i < sections.length; i++) {
        const current = sections[i];
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 140;
        const sectionId = current.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          const correspondingLink = document.querySelector(`.nav-links a[href*="${sectionId}"]`);
          if (correspondingLink && correspondingLink !== activeLink) {
            navLinks.forEach((l) => l.classList.remove('active'));
            correspondingLink.classList.add('active');
            activeLink = correspondingLink;
          }
          break;
        }
      }
      navTicking = false;
    }

    window.addEventListener('scroll', () => {
      if (!navTicking) {
        requestAnimationFrame(updateActiveSection);
        navTicking = true;
      }
    }, { passive: true });
  }



  // ------------------------------------------------------------------------
  // 4. Project Architecture Deep-Dive Modal
  // ------------------------------------------------------------------------
  const projectModal = document.getElementById('project-modal');
  const closeProjectModalBtn = document.getElementById('close-project-modal-btn');
  const projectModalTitle = document.getElementById('project-modal-title');
  const projectModalBody = document.getElementById('project-modal-body');

  const PROJECT_DETAILS = {
    synapse: {
      title: 'SYNAPSE — Multi-Agent Code Reviewer',
      content: `
        <div style="display:flex;flex-direction:column;gap:1.25rem">
          <p>SYNAPSE is a multi-agent code-review system that analyzes repositories and pull requests for security, maintainability, performance, and coding-practice issues using specialized review agents.</p>
          
          <div style="background:var(--bg-secondary);padding:1.25rem;border-radius:var(--radius-md);border:1px solid var(--border-medium)">
            <h4 style="color:var(--color-primary);margin-bottom:0.5rem">Architecture & Evaluated Benchmarks:</h4>
            <ol style="margin-left:1.5rem;display:flex;flex-direction:column;gap:0.4rem;color:var(--text-secondary);font-size:0.92rem">
              <li><strong>Repository & PR Analysis:</strong> Specialized review agents analyze AST, code maintainability, performance, and security vulnerabilities.</li>
              <li><strong>Parallel Agent Execution:</strong> Concurrent agent review pipelines with GitHub workflow integration and automated Markdown reports.</li>
              <li><strong>Effort Reduction:</strong> Reduces manual review effort by <strong>~40%</strong> through structured review outputs.</li>
              <li><strong>Evaluation Benchmark:</strong> Evaluated across <strong>200+ PR/repository samples</strong>, achieving <strong>78% issue-detection accuracy</strong>.</li>
            </ol>
          </div>

          <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
            <span class="tech-tag">LangGraph</span>
            <span class="tech-tag">Python</span>
            <span class="tech-tag">FastAPI</span>
            <span class="tech-tag">GitHub Actions</span>
            <span class="tech-tag">AI Agents</span>
            <span class="tech-tag">REST APIs</span>
          </div>

          <a href="https://github.com/bharathvk75/SYNAPSE" target="_blank" class="shiny-btn" style="width:max-content">
            <span>View Source on GitHub</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          </a>
        </div>
      `
    },
    deepxmed: {
      title: 'DeepXMed — AI Medicine Discovery Platform',
      content: `
        <div style="display:flex;flex-direction:column;gap:1.25rem">
          <p>DeepXMed is an AI-assisted medicine discovery platform combining prescription OCR, medicine search, pharmacy discovery, and price comparison across multiple online sources.</p>
          
          <div style="background:var(--bg-secondary);padding:1.25rem;border-radius:var(--radius-md);border:1px solid var(--border-medium)">
            <h4 style="color:var(--color-accent-cyan);margin-bottom:0.5rem">Architecture & Evaluated Benchmarks:</h4>
            <ol style="margin-left:1.5rem;display:flex;flex-direction:column;gap:0.4rem;color:var(--text-secondary);font-size:0.92rem">
              <li><strong>Prescription Processing Pipeline:</strong> OpenCV preprocessing and Vision OCR tested across <strong>1,500+ prescription samples</strong>.</li>
              <li><strong>OCR Accuracy:</strong> Achieved <strong>~95% recognition accuracy</strong> on the project evaluation set.</li>
              <li><strong>Medicine Search & Pharmacy Discovery:</strong> Discovers nearby pharmacies and performs cross-store price comparison across multiple sources.</li>
              <li><strong>Production Stack:</strong> Integrated user authentication, search history, AI-assisted responses, and cloud-based data storage.</li>
            </ol>
          </div>

          <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
            <span class="tech-tag">OpenCV</span>
            <span class="tech-tag">PyTorch</span>
            <span class="tech-tag">OCR</span>
            <span class="tech-tag">FastAPI</span>
            <span class="tech-tag">PostgreSQL</span>
            <span class="tech-tag">Cloud Storage</span>
          </div>

          <a href="https://github.com/bharathvk75/DeepXmeD" target="_blank" class="shiny-btn" style="width:max-content">
            <span>View Source on GitHub</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          </a>
        </div>
      `
    },
    aegis: {
      title: 'AEGIS — Real-Time Edge Video Analytics',
      content: `
        <div style="display:flex;flex-direction:column;gap:1.25rem">
          <p>AEGIS is an edge-AI video analytics system for real-time object detection and event monitoring on security-camera video streams.</p>
          
          <div style="background:var(--bg-secondary);padding:1.25rem;border-radius:var(--radius-md);border:1px solid var(--border-medium)">
            <h4 style="color:var(--color-accent-purple);margin-bottom:0.5rem">Architecture & Evaluated Benchmarks:</h4>
            <ol style="margin-left:1.5rem;display:flex;flex-direction:column;gap:0.4rem;color:var(--text-secondary);font-size:0.92rem">
              <li><strong>Video Stream Ingestion:</strong> Hardware-optimized RTSP security camera stream decoding with OpenCV.</li>
              <li><strong>Throughput & Accuracy:</strong> Sustains <strong>~40 FPS</strong> while achieving <strong>80% detection accuracy</strong> on the project evaluation dataset.</li>
              <li><strong>Latency Optimization:</strong> Reduced average inference latency from <strong>39 ms to 24 ms</strong> through pipeline and inference optimizations.</li>
              <li><strong>Edge Deployment:</strong> Event monitoring and alert triggers containerized with Docker for edge runtime.</li>
            </ol>
          </div>

          <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
            <span class="tech-tag">PyTorch</span>
            <span class="tech-tag">TensorFlow</span>
            <span class="tech-tag">OpenCV</span>
            <span class="tech-tag">Edge AI</span>
            <span class="tech-tag">Docker</span>
          </div>

          <a href="https://github.com/bharathvk75/AEGIS" target="_blank" class="shiny-btn" style="width:max-content">
            <span>View Source on GitHub</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          </a>
        </div>
      `
    },
    cablog: {
      title: 'CabLog AI — Agentic Document Processing & Fleet Operations Pipeline',
      content: `
        <div style="display:flex;flex-direction:column;gap:1.25rem">
          <p>CabLog AI (IndeCabs) is an autonomous operations pipeline engineered for logistics fleet management. It continuously watches incoming vehicle duty slips and fuel receipts, executes multi-model Vision LLMs (Gemini 2.5 Flash / Vision NIM) to extract structured trip metrics, and drives headless browser automation via Chrome DevTools Protocol (CDP) to auto-fill fleet enterprise portals.</p>
          
          <div style="background:var(--bg-secondary);padding:1.25rem;border-radius:var(--radius-md);border:1px solid var(--border-medium)">
            <h4 style="color:var(--color-accent-blue);margin-bottom:0.5rem">Architecture Workflow:</h4>
            <ol style="margin-left:1.5rem;display:flex;flex-direction:column;gap:0.4rem;color:var(--text-secondary);font-size:0.92rem">
              <li><strong>Queue Ingestion:</strong> Asynchronously listens for incoming trip slip & receipt images via LocalSend and file system watchers.</li>
              <li><strong>Vision LLM Parsing:</strong> Multi-model extraction of vehicle registration, driver duty timings, odometer readings, and toll expenses.</li>
              <li><strong>CDP Browser Automation:</strong> Connects to Chrome via CDP:9222 to autonomously navigate, populate, and submit the IndeCabs enterprise portal.</li>
              <li><strong>Spreadsheet Reconciliation:</strong> Compiles structured Excel trip sheets (.xlsx) with automated anomaly checks and auditing.</li>
            </ol>
          </div>

          <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
            <span class="tech-tag">Vision LLMs</span>
            <span class="tech-tag">Gemini Flash</span>
            <span class="tech-tag">Browser-Use</span>
            <span class="tech-tag">CDP Automation</span>
            <span class="tech-tag">FastAPI</span>
            <span class="tech-tag">Python</span>
            <span class="tech-tag">React</span>
          </div>

          <a href="https://github.com/bharathvk75/CABLOGs" target="_blank" class="shiny-btn" style="width:max-content">
            <span>View Source on GitHub</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          </a>
        </div>
      `
    },
    arbor: {
      title: 'ARBOR — Tree-Search Reasoning & Heuristic Agent',
      content: `
        <div style="display:flex;flex-direction:column;gap:1.25rem">
          <p>ARBOR is an algorithmic planning and reasoning framework applying Monte Carlo Tree Search (MCTS) principles and heuristic branch pruning for complex multi-step reasoning, mathematical problem decomposition, and backtracking state trees.</p>
          
          <div style="background:var(--bg-secondary);padding:1.25rem;border-radius:var(--radius-md);border:1px solid var(--border-medium)">
            <h4 style="color:#10b981;margin-bottom:0.5rem">Architecture Workflow:</h4>
            <ol style="margin-left:1.5rem;display:flex;flex-direction:column;gap:0.4rem;color:var(--text-secondary);font-size:0.92rem">
              <li><strong>MCTS State Expansion:</strong> Explores tree nodes via Upper Confidence Bound applied to Trees (UCT).</li>
              <li><strong>Heuristic Evaluation Node:</strong> Verifies intermediate deduction steps and eliminates invalid computational branches.</li>
              <li><strong>Execution Trajectory Graph:</strong> Outputs structured execution traces for transparent model decision auditing.</li>
            </ol>
          </div>

          <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
            <span class="tech-tag">Python</span>
            <span class="tech-tag">MCTS</span>
            <span class="tech-tag">Tree Search</span>
            <span class="tech-tag">Algorithmic AI</span>
            <span class="tech-tag">Graph Planning</span>
          </div>

          <a href="https://github.com/bharathvk75/ARBOR" target="_blank" class="shiny-btn" style="width:max-content">
            <span>View Source on GitHub</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          </a>
        </div>
      `
    },
    expense_tracker: {
      title: 'Smart Expense Tracker API — Financial Analytics Backend',
      content: `
        <div style="display:flex;flex-direction:column;gap:1.25rem">
          <p>A production-ready financial analytics REST API engineered with FastAPI and SQLAlchemy. Provides automated transaction categorisation, recurring expense anomaly alerts, and monthly cashflow aggregation.</p>
          
          <div style="background:var(--bg-secondary);padding:1.25rem;border-radius:var(--radius-md);border:1px solid var(--border-medium)">
            <h4 style="color:#f59e0b;margin-bottom:0.5rem">Architecture Workflow:</h4>
            <ol style="margin-left:1.5rem;display:flex;flex-direction:column;gap:0.4rem;color:var(--text-secondary);font-size:0.92rem">
              <li><strong>Pydantic Data Schemas:</strong> Strict validation of inbound bank transaction payloads and ledger entries.</li>
              <li><strong>Analytics Engine:</strong> Aggregates historical burn rates and calculates moving-average spending projections.</li>
              <li><strong>JWT Security & RBAC:</strong> Secure token-based user authentication and segregated data privacy.</li>
            </ol>
          </div>

          <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
            <span class="tech-tag">FastAPI</span>
            <span class="tech-tag">Python</span>
            <span class="tech-tag">SQLAlchemy</span>
            <span class="tech-tag">PostgreSQL</span>
            <span class="tech-tag">JWT Auth</span>
          </div>

          <a href="https://github.com/bharathvk75/bharathvk75-smart-expense-tracker-api" target="_blank" class="shiny-btn" style="width:max-content">
            <span>View Source on GitHub</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          </a>
        </div>
      `
    },
    isolate: {
      title: 'ISOLATE — Android System Sandboxing & Hardware Security Enclave',
      content: `
        <div style="display:flex;flex-direction:column;gap:1.25rem">
          <p>ISOLATE is a security architecture exploring process isolation boundaries, encrypted Inter-Process Communication (IPC), Android Hardware KeyStore integration, and runtime tamper detection.</p>
          
          <div style="background:var(--bg-secondary);padding:1.25rem;border-radius:var(--radius-md);border:1px solid var(--border-medium)">
            <h4 style="color:#ef4444;margin-bottom:0.5rem">Architecture Workflow:</h4>
            <ol style="margin-left:1.5rem;display:flex;flex-direction:column;gap:0.4rem;color:var(--text-secondary);font-size:0.92rem">
              <li><strong>Secure IPC Enclave:</strong> Establishes authenticated cryptographic message exchanges across application sandboxes.</li>
              <li><strong>Hardware KeyStore:</strong> Manages asymmetric cryptographic keys inside hardware-backed secure elements.</li>
              <li><strong>Integrity Telemetry:</strong> Detects debugger attachment, memory injection, and signature alteration in real time.</li>
            </ol>
          </div>

          <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
            <span class="tech-tag">Kotlin</span>
            <span class="tech-tag">Android Security</span>
            <span class="tech-tag">Cryptographic Enclave</span>
            <span class="tech-tag">Hardware KeyStore</span>
          </div>

          <a href="https://github.com/bharathvk75/ISOLATE" target="_blank" class="shiny-btn" style="width:max-content">
            <span>View Source on GitHub</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          </a>
        </div>
      `
    }
  };

  function openProjectModal(key) {
    if (!projectModal || !PROJECT_DETAILS[key]) return;
    projectModalTitle.textContent = PROJECT_DETAILS[key].title;
    projectModalBody.innerHTML = PROJECT_DETAILS[key].content;
    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  window.openProjectModal = openProjectModal;

  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.open-project-deepdive').forEach((btn) => {
    btn.addEventListener('click', () => {
      const pKey = btn.getAttribute('data-project');
      openProjectModal(pKey);
    });
  });

  if (closeProjectModalBtn) closeProjectModalBtn.addEventListener('click', closeProjectModal);
  projectModal?.addEventListener('click', (e) => {
    if (e.target === projectModal) closeProjectModal();
  });

  // ------------------------------------------------------------------------
  // 5. One-Click Copy Contact Cards
  // ------------------------------------------------------------------------
  document.querySelectorAll('.copy-contact-card').forEach((card) => {
    card.addEventListener('click', () => {
      const copyVal = card.getAttribute('data-copy');
      if (copyVal && navigator.clipboard) {
        navigator.clipboard.writeText(copyVal);
      }
    });
  });

  // ------------------------------------------------------------------------
  // 6. Autonomous Collaboration & Dispatch Station Interactive Controller
  // ------------------------------------------------------------------------
  // Fast-Dispatch Direct Beacon Copy Buttons
  document.querySelectorAll('.copy-beacon-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const card = btn.closest('.beacon-card');
      const copyVal = card?.getAttribute('data-copy') || '';
      if (copyVal && navigator.clipboard) {
        navigator.clipboard.writeText(copyVal).then(() => {
          btn.textContent = 'Copied!';
          setTimeout(() => {
            btn.textContent = 'Copy';
          }, 2000);
        });
      }
    });
  });

  // Real Dispatch Transmitter Form Submission (100% Free FormSubmit Pipeline)
  const contactForm = document.getElementById('contact-form');
  const statusBanner = document.getElementById('dispatch-status-banner');
  const submitBtn = document.getElementById('dispatch-submit-btn');
  const btnText = document.getElementById('dispatch-btn-text');
  const nextInput = document.getElementById('contact-form-next');
  const subjectHidden = document.getElementById('form-subject-hidden');

  // Dynamically set _next redirect to current origin
  if (nextInput) {
    try {
      const returnUrl = window.location.origin + window.location.pathname + '?dispatched=true#contact';
      nextInput.value = returnUrl;
    } catch (_) {}
  }

  // Check if returning from a successful native form submission
  if (window.location.search.includes('dispatched=true') && statusBanner) {
    statusBanner.style.display = 'block';
    statusBanner.className = 'dispatch-status-banner success';
    statusBanner.innerHTML = '✓ Transmission Dispatched! Thank you. Your message has been routed directly to Bharath\'s inbox.';
    // Clean URL query without reload
    try {
      window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
    } catch (_) {}
    setTimeout(() => {
      statusBanner.style.display = 'none';
    }, 10000);
  }

  if (contactForm && submitBtn) {
    let isSubmittingNatively = false;

    contactForm.addEventListener('submit', async (e) => {
      if (isSubmittingNatively) return; // Allow native submit to continue

      e.preventDefault();
      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const subjectInput = document.getElementById('contact-subject');
      const messageInput = document.getElementById('contact-message');

      const name = nameInput?.value.trim() || 'Colleague';
      const email = emailInput?.value.trim() || '';
      const subject = subjectInput?.value.trim() || 'Direct Dispatch from Portfolio';
      const message = messageInput?.value.trim() || '';

      if (subjectHidden) {
        subjectHidden.value = `[Portfolio Dispatch] ${subject} - ${name}`;
      }

      submitBtn.disabled = true;
      if (btnText) btnText.textContent = 'Transmitting Message...';

      try {
        const formData = new FormData(contactForm);
        formData.set('_subject', `[Portfolio Dispatch] ${subject} - ${name}`);

        const response = await fetch('https://formsubmit.co/ajax/bharathvk75@gmail.com', {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: formData
        });

        const data = await response.json();

        if (response.ok && (data.success === 'true' || data.success === true || response.status === 200)) {
          if (statusBanner) {
            statusBanner.style.display = 'block';
            statusBanner.className = 'dispatch-status-banner success';
            statusBanner.innerHTML = `✓ Transmission Dispatched! Thank you, <strong>${name}</strong>. Your message has been routed directly to Bharath's inbox.`;
          }
          contactForm.reset();
        } else {
          // AJAX returned error or activation required — fallback to native browser POST
          isSubmittingNatively = true;
          contactForm.submit();
          return;
        }
      } catch (err) {
        // If fetch is blocked by browser CORS/ad-blocker, execute native form submission
        isSubmittingNatively = true;
        contactForm.submit();
        return;
      } finally {
        if (!isSubmittingNatively) {
          submitBtn.disabled = false;
          if (btnText) btnText.textContent = 'Transmit Dispatch to Bharath';
          setTimeout(() => {
            if (statusBanner && statusBanner.classList.contains('success')) {
              statusBanner.style.display = 'none';
            }
          }, 10000);
        }
      }
    });
  }

  // ------------------------------------------------------------------------
  // 7. Mobile Navigation Drawer
  // ------------------------------------------------------------------------
  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const closeMobileNavBtn = document.getElementById('close-mobile-nav');

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => mobileNav.classList.add('open'));
  }
  if (closeMobileNavBtn && mobileNav) {
    closeMobileNavBtn.addEventListener('click', () => mobileNav.classList.remove('open'));
  }
  document.querySelectorAll('.mobile-nav-link').forEach((l) => {
    l.addEventListener('click', () => mobileNav?.classList.remove('open'));
  });

  // ------------------------------------------------------------------------
  // 8. Global Keyboard Shortcuts
  // ------------------------------------------------------------------------
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectModal();
      mobileNav?.classList.remove('open');
    }
  });
});
