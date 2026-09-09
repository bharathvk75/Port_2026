// ==========================================================================
// MAIN CONTROLLER: CENTERED NAVBAR, CERTIFICATES MATRIX DECK, MODALS, TOASTS
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. Toast Notification System
  // ------------------------------------------------------------------------
  const toastContainer = document.getElementById('toast-container');

  window.showToast = function (message, duration = 3000) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(15px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  };

  // ------------------------------------------------------------------------
  // 2. Liquid Glass Navbar with Smooth Sliding Active Glass Indicator
  // ------------------------------------------------------------------------
  const glassNav = document.getElementById('navbar');
  const activeGlass = document.getElementById('active-glass');
  const navLinks = document.querySelectorAll('.nav-links .nav-link');

  let activeLink = navLinks[0];

  function moveGlassTo(element) {
    if (!element || !activeGlass || !glassNav) return;
    const navRect = glassNav.getBoundingClientRect();
    const linkRect = element.getBoundingClientRect();

    const left = Math.round(linkRect.left - navRect.left);
    const width = Math.round(linkRect.width);

    activeGlass.style.left = `${left}px`;
    activeGlass.style.width = `${width}px`;
    activeGlass.style.opacity = '1';
  }

  if (glassNav && activeGlass && navLinks.length > 0) {
    setTimeout(() => moveGlassTo(activeLink), 150);

    window.addEventListener('resize', () => {
      moveGlassTo(activeLink);
    });

    navLinks.forEach((link) => {
      link.addEventListener('mouseenter', () => moveGlassTo(link));
      link.addEventListener('click', () => {
        navLinks.forEach((l) => l.classList.remove('active'));
        link.classList.add('active');
        activeLink = link;
        moveGlassTo(link);
      });
    });

    glassNav.addEventListener('mouseleave', () => {
      moveGlassTo(activeLink);
    });

    // Update active link on scroll with rAF throttling and passive listener
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
            moveGlassTo(correspondingLink);
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
      title: 'SYNAPSE — Multi-Agent Autonomous Code Reviewer',
      content: `
        <div style="display:flex;flex-direction:column;gap:1.25rem">
          <p>SYNAPSE is a distributed multi-agent system designed for automated code health, security auditing, and performance profiling on enterprise pull requests.</p>
          
          <div style="background:var(--bg-secondary);padding:1.25rem;border-radius:var(--radius-md);border:1px solid var(--border-medium)">
            <h4 style="color:var(--color-primary);margin-bottom:0.5rem">Architecture Workflow:</h4>
            <ol style="margin-left:1.5rem;display:flex;flex-direction:column;gap:0.4rem;color:var(--text-secondary);font-size:0.92rem">
              <li><strong>GitHub Webhook Ingestion:</strong> Triggers AST parsing and changed file diff isolation.</li>
              <li><strong>Planner Agent:</strong> Deconstructs code modifications into security, syntax, and performance tasks.</li>
              <li><strong>Parallel Execution Nodes (LangGraph):</strong> Concurrent evaluation of CWE vulnerabilities, cyclomatic complexity, and unit test coverage.</li>
              <li><strong>Consensus Engine:</strong> Resolves conflicting suggestions and outputs structured GitHub Markdown review comments.</li>
            </ol>
          </div>

          <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
            <span class="tech-tag">LangGraph</span>
            <span class="tech-tag">Python</span>
            <span class="tech-tag">FastAPI</span>
            <span class="tech-tag">GitHub Actions</span>
            <span class="tech-tag">AST</span>
            <span class="tech-tag">Docker</span>
          </div>

          <a href="https://github.com/bharathvk75" target="_blank" class="shiny-btn" style="width:max-content">
            <span>View Source on GitHub</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          </a>
        </div>
      `
    },
    deepxmed: {
      title: 'DeepXMed — AI Medicine Discovery & Verification',
      content: `
        <div style="display:flex;flex-direction:column;gap:1.25rem">
          <p>DeepXMed streamlines pharmaceutical discovery, doctor prescription digitisation, drug interaction safety checks, and live inventory lookup across pharmacies.</p>
          
          <div style="background:var(--bg-secondary);padding:1.25rem;border-radius:var(--radius-md);border:1px solid var(--border-medium)">
            <h4 style="color:var(--color-accent-cyan);margin-bottom:0.5rem">Architecture Workflow:</h4>
            <ol style="margin-left:1.5rem;display:flex;flex-direction:column;gap:0.4rem;color:var(--text-secondary);font-size:0.92rem">
              <li><strong>OCR Pipeline:</strong> Preprocesses handwriting and clinical stamps via OpenCV, extracting text via vision LLMs.</li>
              <li><strong>Medical RAG Engine:</strong> Cross-references active compounds against known contraindication databases in PostgreSQL with pgvector.</li>
              <li><strong>Pharmacy Discovery:</strong> Geolocation distance calculation and real-time pricing comparison across localized dispensaries.</li>
            </ol>
          </div>

          <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
            <span class="tech-tag">Generative AI</span>
            <span class="tech-tag">OpenCV</span>
            <span class="tech-tag">OCR</span>
            <span class="tech-tag">PostgreSQL</span>
            <span class="tech-tag">FastAPI</span>
            <span class="tech-tag">React</span>
          </div>

          <a href="https://github.com/bharathvk75" target="_blank" class="shiny-btn" style="width:max-content">
            <span>View Source on GitHub</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          </a>
        </div>
      `
    },
    aegis: {
      title: 'AEGIS — Real-Time Edge Video Analytics System',
      content: `
        <div style="display:flex;flex-direction:column;gap:1.25rem">
          <p>AEGIS provides low-latency intelligent video analytics for perimeter security, industrial safety compliance, and anomaly detection at the edge.</p>
          
          <div style="background:var(--bg-secondary);padding:1.25rem;border-radius:var(--radius-md);border:1px solid var(--border-medium)">
            <h4 style="color:var(--color-accent-purple);margin-bottom:0.5rem">Architecture Workflow:</h4>
            <ol style="margin-left:1.5rem;display:flex;flex-direction:column;gap:0.4rem;color:var(--text-secondary);font-size:0.92rem">
              <li><strong>RTSP Video Ingestion:</strong> Hardware-accelerated decoding using OpenCV and NVIDIA TensorRT.</li>
              <li><strong>Edge Inference:</strong> Quantized lightweight model execution achieving sub-18ms latency.</li>
              <li><strong>Event Dispatch:</strong> Instant event triggers, bounding box overlays, and asynchronous webhook reporting.</li>
            </ol>
          </div>

          <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
            <span class="tech-tag">Computer Vision</span>
            <span class="tech-tag">PyTorch</span>
            <span class="tech-tag">TensorFlow</span>
            <span class="tech-tag">OpenCV</span>
            <span class="tech-tag">Edge AI</span>
            <span class="tech-tag">Python</span>
          </div>

          <a href="https://github.com/bharathvk75" target="_blank" class="shiny-btn" style="width:max-content">
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

          <a href="https://github.com/bharathvk75" target="_blank" class="shiny-btn" style="width:max-content">
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
      if (copyVal) {
        navigator.clipboard.writeText(copyVal).then(() => {
          showToast(`📋 Copied to clipboard: ${copyVal}`);
        });
      }
    });
  });

  // ------------------------------------------------------------------------
  // 6. Interactive Contact Form Submission
  // ------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const origText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Transmitting Message...</span>`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origText;
        contactForm.reset();
        showToast('🚀 Message Sent! Bharath will reach back out soon.');
      }, 900);
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
