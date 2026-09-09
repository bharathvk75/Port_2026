// ==========================================================================
// INTERACTIVE NEURAL CONSTELLATION CANVAS BACKGROUND
// ==========================================================================

(function initNeuralCanvas() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouse = {
    x: width / 2,
    y: height / 2,
    radius: 130,
    active: false
  };

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 25000), 40);

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 1.8 + 1.1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse repulsion/interaction
      if (mouse.active) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distSq = dx * dx + dy * dy;
        const rSq = mouse.radius * mouse.radius;

        if (distSq < rSq) {
          const dist = Math.sqrt(distSq);
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 2;
          this.y -= Math.sin(angle) * force * 2;
        }
      }
    }

    draw(particleColor) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = particleColor;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function getColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      particle: isDark ? 'rgba(56, 189, 248, 0.45)' : 'rgba(59, 130, 246, 0.35)',
      line: isDark ? 'rgba(56, 189, 248, 0.08)' : 'rgba(71, 85, 105, 0.1)'
    };
  }

  let animationFrameId;
  let colors = getColors();

  window.addEventListener('themeChanged', () => {
    colors = getColors();
  });

  const maxDist = 125;
  const maxDistSq = maxDist * maxDist;

  function render() {
    if (document.hidden) {
      animationFrameId = requestAnimationFrame(render);
      return;
    }

    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines with squared distance check
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distSq = dx * dx + dy * dy;

        if (distSq < maxDistSq) {
          const dist = Math.sqrt(distSq);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = colors.line;
          ctx.lineWidth = 1 - dist / maxDist;
          ctx.stroke();
        }
      }
    }

    // Update and draw particles
    particles.forEach((p) => {
      p.update();
      p.draw(colors.particle);
    });

    animationFrameId = requestAnimationFrame(render);
  }

  render();

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });
})();
