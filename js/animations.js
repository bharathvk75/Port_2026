// ==========================================================================
// GSAP BUTTER-SMOOTH SCROLL & COMPONENT SCROLLTRIGGER
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. Butter-Smooth Native Scroll & Seamless Anchor Navigation
  // ------------------------------------------------------------------------
  // Connect Anchor Links to smooth native scrolling with header offset
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 72;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        const mobileNav = document.getElementById('mobile-nav');
        if (mobileNav && mobileNav.classList.contains('active')) {
          mobileNav.classList.remove('active');
        }
      }
    });
  });

  // High-Performance Scroll Optimization: Disable hover/pointer overhead during active scroll
  let scrollTimer = null;
  window.addEventListener('scroll', () => {
    if (!document.body.classList.contains('is-scrolling')) {
      document.body.classList.add('is-scrolling');
    }
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      document.body.classList.remove('is-scrolling');
    }, 80);
  }, { passive: true });

  // ------------------------------------------------------------------------
  // 2. GSAP ScrollTrigger Choreography for UI Components
  // ------------------------------------------------------------------------
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Hero Component Entrance
    const heroBadge = document.querySelector('.hero-badge');
    if (heroBadge) {
      gsap.from('.hero-badge, .hero-title, .hero-role-wrapper, .hero-bio, .hero-stats-row, .hero-cta-group', {
        y: 28,
        opacity: 0,
        stagger: 0.1,
        duration: 0.9,
        ease: 'power3.out',
        delay: 0.15
      });
    }

    // Section Headers
    gsap.utils.toArray('.section-header').forEach((header) => {
      gsap.from(header, {
        scrollTrigger: {
          trigger: header,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        y: 35,
        opacity: 0,
        duration: 0.85,
        ease: 'power3.out'
      });
    });

    // Experience Timeline Items
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 86%',
          toggleActions: 'play none none none'
        },
        x: i % 2 === 0 ? -35 : 35,
        opacity: 0,
        duration: 0.85,
        ease: 'power3.out'
      });
    });

    // Project Architecture Stepper Showcase
    const stepperWrap = document.querySelector('.projects-stepper-outer-wrap');
    if (stepperWrap) {
      gsap.from(stepperWrap, {
        scrollTrigger: {
          trigger: stepperWrap,
          start: 'top 86%',
          toggleActions: 'play none none none'
        },
        y: 36,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });
    }

    // Projects Grid Cards
    const projectsGrid = document.querySelector('.projects-grid');
    if (projectsGrid) {
      gsap.from('.project-card', {
        scrollTrigger: {
          trigger: projectsGrid,
          start: 'top 82%',
          toggleActions: 'play none none none'
        },
        y: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 0.95,
        ease: 'power3.out'
      });
    }

    // LogoLoop Ticker Banners
    gsap.utils.toArray('.logo-loop-banner-wrapper').forEach((banner) => {
      gsap.from(banner, {
        scrollTrigger: {
          trigger: banner,
          start: 'top 92%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 22,
        duration: 0.8,
        ease: 'power2.out'
      });
    });

    // DriftWall Showcase Container (Perspective Zoom Entrance)
    const driftWallWrap = document.querySelector('.drift-wall-showcase-wrapper');
    if (driftWallWrap) {
      gsap.from(driftWallWrap, {
        scrollTrigger: {
          trigger: driftWallWrap,
          start: 'top 86%',
          toggleActions: 'play none none none'
        },
        scale: 0.95,
        y: 32,
        opacity: 0,
        duration: 1.05,
        ease: 'power3.out'
      });
    }

    // Skills Category Cards
    const skillsGrid = document.querySelector('.skills-grid');
    if (skillsGrid) {
      gsap.from('.skill-category-card', {
        scrollTrigger: {
          trigger: skillsGrid,
          start: 'top 84%',
          toggleActions: 'play none none none'
        },
        y: 35,
        opacity: 0,
        stagger: 0.12,
        duration: 0.85,
        ease: 'power2.out'
      });
    }

    // Contact Cards & Form
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      gsap.from('.contact-card, .contact-form', {
        scrollTrigger: {
          trigger: contactSection,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        y: 35,
        opacity: 0,
        stagger: 0.15,
        duration: 0.9,
        ease: 'power3.out'
      });
    }
  }

  // ------------------------------------------------------------------------
  // 3. Dynamic Typing / Role Cycler
  // ------------------------------------------------------------------------
  const roleTextEl = document.getElementById('hero-role-cycler');
  const roles = [
    'AI & ML Engineer',
    'IT Automation Specialist',
    'Multi-Agent Architect',
    'RAG & LangGraph Specialist',
    'Model Context Protocol (MCP) Dev',
    'Computer Vision Developer'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typeSpeed = 90;

  function cycleRoles() {
    if (!roleTextEl) return;
    const currentRole = roles[roleIdx];

    if (isDeleting) {
      roleTextEl.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
      typeSpeed = 45;
    } else {
      roleTextEl.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
      typeSpeed = 85;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      isDeleting = true;
      typeSpeed = 2200; // Pause at end of word
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typeSpeed = 400; // Pause before typing new word
    }

    setTimeout(cycleRoles, typeSpeed);
  }
  cycleRoles();

  // ------------------------------------------------------------------------
  // 4. Scroll Progress & Back to Top (Throttled with rAF)
  // ------------------------------------------------------------------------
  const progressBar = document.querySelector('.scroll-progress-bar');
  const backToTop = document.querySelector('.back-to-top');
  const timeline = document.querySelector('.timeline-container');
  const timelineProgress = document.querySelector('.timeline-progress');

  let scrollProgressTicking = false;
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (backToTop) {
      if (scrollTop > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }

    // Timeline progress line
    if (timeline && timelineProgress) {
      const rect = timeline.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (rect.top < windowHeight && rect.bottom > 0) {
        const heightCovered = Math.min(Math.max((windowHeight - rect.top) / rect.height, 0), 1);
        timelineProgress.style.height = `${heightCovered * 100}%`;
      }
    }
    scrollProgressTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!scrollProgressTicking) {
      requestAnimationFrame(updateScrollProgress);
      scrollProgressTicking = true;
    }
  }, { passive: true });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      if (window.lenis) {
        window.lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
});
