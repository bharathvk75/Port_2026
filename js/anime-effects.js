// ==========================================================================
// ANIME.JS ENGINE: STRUCTURAL LAYOUT CHOREOGRAPHY & ELASTIC DYNAMICS
// ==========================================================================

(function initAnimeEffects() {
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof anime === 'undefined') {
      console.warn('Anime.js library not loaded');
      return;
    }

    // ------------------------------------------------------------------------
    // 1. Hero Kinetic Layout Entrance
    // ------------------------------------------------------------------------
    function animateHeroLayout() {
      // Split words in hero title for kinetic staggered reveal
      const heroTitle = document.querySelector('.hero-title');
      if (heroTitle && !heroTitle.dataset.animeSplit) {
        heroTitle.dataset.animeSplit = 'true';
        const nodes = Array.from(heroTitle.childNodes);
        heroTitle.innerHTML = '';
        nodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            const words = node.textContent.split(/(\s+)/);
            words.forEach((word) => {
              if (!word) return;
              if (/^\s+$/.test(word)) {
                heroTitle.appendChild(document.createTextNode(word));
              } else {
                const span = document.createElement('span');
                span.className = 'anime-word';
                span.style.display = 'inline-block';
                span.style.opacity = '0';
                span.style.transform = 'translateY(30px)';
                span.textContent = word;
                heroTitle.appendChild(span);
              }
            });
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            const wrapper = document.createElement('span');
            wrapper.className = 'anime-word';
            wrapper.style.display = 'inline-block';
            wrapper.style.opacity = '0';
            wrapper.style.transform = 'translateY(30px)';
            wrapper.appendChild(node);
            heroTitle.appendChild(wrapper);
          }
        });
      }

      const heroTl = anime.timeline({
        easing: 'easeOutExpo',
        duration: 900
      });

      heroTl
        // 1. Top Badges (Available for Roles / Bengaluru)
        .add({
          targets: ['.live-indicator', '.location-pill'],
          translateY: [-20, 0],
          opacity: [0, 1],
          scale: [0.85, 1],
          delay: anime.stagger(120),
          easing: 'easeOutBack',
          duration: 700
        }, 150)
        // 2. Kinetic Title Words Stagger
        .add({
          targets: '.hero-title .anime-word',
          translateY: [35, 0],
          opacity: [0, 1],
          rotateZ: [-2, 0],
          delay: anime.stagger(45, { start: 50 }),
          duration: 750,
          easing: 'easeOutQuart'
        }, '-=500')
        // 3. Hero Subtitle & Bio
        .add({
          targets: ['.hero-subtitle', '.hero-bio'],
          translateY: [20, 0],
          opacity: [0, 1],
          delay: anime.stagger(100),
          duration: 700
        }, '-=400')
        // 4. Hero Portrait Card 3D Entrance
        .add({
          targets: '.hero-portrait-card',
          translateY: [50, 0],
          scale: [0.92, 1],
          opacity: [0, 1],
          duration: 1100,
          easing: 'easeOutCubic'
        }, '-=600')
        // 5. CTAs Buttons
        .add({
          targets: '.hero-actions > *',
          translateY: [20, 0],
          opacity: [0, 1],
          scale: [0.95, 1],
          delay: anime.stagger(100),
          duration: 650,
          easing: 'easeOutBack'
        }, '-=600')
        // 6. Metrics Bar Items
        .add({
          targets: '.metric-item',
          translateY: [25, 0],
          opacity: [0, 1],
          scale: [0.88, 1],
          delay: anime.stagger(80),
          duration: 700,
          easing: 'easeOutBack'
        }, '-=400');
    }

    animateHeroLayout();

    // ------------------------------------------------------------------------
    // 2. Universal Section Header Scroll Observer
    // ------------------------------------------------------------------------
    const sectionHeaders = document.querySelectorAll('.section-header');
    const headerObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const header = entry.target;
          observer.unobserve(header);

          const tag = header.querySelector('.section-tag');
          const title = header.querySelector('.section-title');
          const desc = header.querySelector('.section-desc');

          const tl = anime.timeline({ easing: 'easeOutExpo' });
          if (tag) {
            tl.add({
              targets: tag,
              scale: [0.8, 1],
              opacity: [0, 1],
              duration: 550,
              easing: 'easeOutBack'
            });
          }
          if (title) {
            tl.add({
              targets: title,
              translateY: [30, 0],
              opacity: [0, 1],
              duration: 750
            }, '-=350');
          }
          if (desc) {
            tl.add({
              targets: desc,
              translateY: [20, 0],
              opacity: [0, 1],
              duration: 650
            }, '-=450');
          }
        }
      });
    }, { threshold: 0.2 });

    sectionHeaders.forEach((h) => headerObserver.observe(h));

    // ------------------------------------------------------------------------
    // 3. Projects Grid Staggered Entrance & Interactive Hover Physics
    // ------------------------------------------------------------------------
    const projectsGrid = document.querySelector('.projects-grid');
    if (projectsGrid) {
      const projectsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            const cards = entry.target.querySelectorAll('.project-card');

            anime({
              targets: cards,
              translateY: [60, 0],
              scale: [0.94, 1],
              opacity: [0, 1],
              delay: anime.stagger(140, { start: 100 }),
              duration: 950,
              easing: 'easeOutQuart'
            });

            // Stagger tags inside each card
            cards.forEach((card, idx) => {
              const tags = card.querySelectorAll('.tech-tag');
              anime({
                targets: tags,
                scale: [0.7, 1],
                opacity: [0, 1],
                delay: anime.stagger(35, { start: 300 + idx * 100 }),
                duration: 500,
                easing: 'easeOutBack'
              });
            });
          }
        });
      }, { threshold: 0.15 });

      projectsObserver.observe(projectsGrid);

      // Springy interactive hover physics on project cards
      const cards = projectsGrid.querySelectorAll('.project-card');
      cards.forEach((card) => {
        card.addEventListener('mouseenter', () => {
          anime.remove(card);
          anime({
            targets: card,
            translateY: -7,
            duration: 350,
            easing: 'easeOutCubic'
          });
        });
        card.addEventListener('mouseleave', () => {
          anime.remove(card);
          anime({
            targets: card,
            translateY: 0,
            duration: 450,
            easing: 'easeOutElastic(1, .6)'
          });
        });
      });
    }

    // ------------------------------------------------------------------------
    // 4. Experience Timeline Directional Wave Animation
    // ------------------------------------------------------------------------
    const timeline = document.querySelector('.timeline-container');
    if (timeline) {
      const timelineObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            const items = entry.target.querySelectorAll('.timeline-item');
            const dots = entry.target.querySelectorAll('.timeline-dot');

            anime({
              targets: items,
              translateX: (el, i) => (i % 2 === 0 ? [-40, 0] : [40, 0]),
              opacity: [0, 1],
              delay: anime.stagger(200, { start: 150 }),
              duration: 850,
              easing: 'easeOutCubic'
            });

            anime({
              targets: dots,
              scale: [0, 1.35, 1],
              delay: anime.stagger(200, { start: 250 }),
              duration: 600,
              easing: 'easeOutElastic(1, .5)'
            });
          }
        });
      }, { threshold: 0.2 });

      timelineObserver.observe(timeline);
    }

    // ------------------------------------------------------------------------
    // 5. Skills Grid Spatial Stagger (Center Outward Ripple)
    // ------------------------------------------------------------------------
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
      const skillsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            const categoryCards = entry.target.querySelectorAll('.skill-category-card');
            const pills = entry.target.querySelectorAll('.skill-pill');

            anime({
              targets: categoryCards,
              translateY: [40, 0],
              opacity: [0, 1],
              delay: anime.stagger(120),
              duration: 750,
              easing: 'easeOutCubic'
            });

            anime({
              targets: pills,
              scale: [0.65, 1],
              opacity: [0, 1],
              delay: anime.stagger(25, { from: 'center', start: 300 }),
              duration: 650,
              easing: 'easeOutBack'
            });
          }
        });
      }, { threshold: 0.15 });

      skillsObserver.observe(skillsSection);
    }

    // ------------------------------------------------------------------------
    // 6. Contact Section Cards & Form Stagger
    // ------------------------------------------------------------------------
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      const contactObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            const cards = entry.target.querySelectorAll('.contact-card');
            const form = entry.target.querySelector('.contact-form-card');

            if (cards.length) {
              anime({
                targets: cards,
                translateY: [35, 0],
                opacity: [0, 1],
                scale: [0.92, 1],
                delay: anime.stagger(120),
                duration: 800,
                easing: 'easeOutBack'
              });
            }

            if (form) {
              anime({
                targets: form,
                translateY: [45, 0],
                opacity: [0, 1],
                duration: 900,
                delay: 200,
                easing: 'easeOutCubic'
              });
            }
          }
        });
      }, { threshold: 0.2 });

      contactObserver.observe(contactSection);
    }

    // ------------------------------------------------------------------------
    // 7. Anime.js High-Precision Smooth Metric Counters
    // ------------------------------------------------------------------------
    const counterElements = document.querySelectorAll('.counter-val');
    let animeCountersDone = false;

    function runAnimeCounters() {
      if (animeCountersDone) return;
      const heroMetrics = document.querySelector('.hero-metrics-rail, .hero-metrics');
      if (!heroMetrics) return;

      const rect = heroMetrics.getBoundingClientRect();
      if (rect.top <= window.innerHeight && rect.bottom >= 0) {
        animeCountersDone = true;

        counterElements.forEach((el) => {
          const target = parseFloat(el.getAttribute('data-target'));
          const isDecimal = target % 1 !== 0;

          const obj = { val: 0 };
          anime({
            targets: obj,
            val: isDecimal ? target * 10 : target,
            round: 1,
            duration: 2000,
            easing: 'easeOutExpo',
            update: () => {
              el.textContent = isDecimal ? (obj.val / 10).toFixed(1) : obj.val;
            }
          });
        });
      }
    }

    window.addEventListener('scroll', runAnimeCounters, { passive: true });
    runAnimeCounters();

    // ------------------------------------------------------------------------
    // 8. Universal Elastic Button & Micro-Interactions
    // ------------------------------------------------------------------------
    const interactiveElements = document.querySelectorAll('button:not(.menu-toggle), .nav-resume-btn, .shiny-btn');
    interactiveElements.forEach((btn) => {
      btn.addEventListener('mousedown', () => {
        anime({
          targets: btn,
          scale: 0.94,
          duration: 120,
          easing: 'easeOutQuad'
        });
      });

      const releaseBtn = () => {
        anime({
          targets: btn,
          scale: 1,
          duration: 400,
          easing: 'easeOutElastic(1, .5)'
        });
      };

      btn.addEventListener('mouseup', releaseBtn);
      btn.addEventListener('mouseleave', releaseBtn);
    });

    // ------------------------------------------------------------------------
    // 9. Interactive Category Tab Pills Elastic Wave
    // ------------------------------------------------------------------------
    const certTabs = document.querySelectorAll('.cert-tab-btn');
    certTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        anime({
          targets: tab,
          scale: [0.92, 1.04, 1],
          duration: 380,
          easing: 'easeOutBack'
        });
      });
    });
  });
})();
