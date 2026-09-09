// ==========================================================================
// ELEGANT LIGHT TRAIL (LIGHTWEIGHT LUMINOUS CURSOR TRAIL)
// ==========================================================================

(function initLightTrail() {
  document.addEventListener('DOMContentLoaded', () => {
    // Only activate on pointer-fine devices
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'light-trail-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '99999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    // Trail points history
    const points = [];
    const MAX_AGE = 260; // ms lifetime of light trail

    let isRunning = false;

    window.addEventListener('pointermove', (e) => {
      points.push({
        x: e.clientX,
        y: e.clientY,
        time: performance.now()
      });
      if (!isRunning) {
        isRunning = true;
        requestAnimationFrame(render);
      }
    }, { passive: true });

    function getColors() {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      return {
        isDark,
        glowColor: isDark ? 'rgba(56, 189, 248, 0.8)' : 'rgba(37, 99, 235, 0.7)',
        coreColor: isDark ? 'rgba(255, 255, 255, 0.95)' : 'rgba(59, 130, 246, 0.9)',
        shadowColor: isDark ? '#38bdf8' : '#2563eb'
      };
    }

    let colors = getColors();
    window.addEventListener('themeChanged', () => {
      colors = getColors();
    });

    function render(now) {
      // Remove points older than MAX_AGE
      while (points.length > 0 && now - points[0].time > MAX_AGE) {
        points.shift();
      }

      ctx.clearRect(0, 0, width, height);

      if (points.length >= 2) {
        // Draw trailing segments with progressive tapering
        for (let i = 1; i < points.length; i++) {
          const p0 = points[i - 1];
          const p1 = points[i];

          const progress = i / points.length; // 0 (oldest tail) to 1 (newest head)
          const age = now - p1.time;
          const life = Math.max(0, 1 - age / MAX_AGE);

          const alpha = life * progress;
          const lineWidth = Math.max(0.6, progress * 4.5);

          // 1. Soft Outer Light Halo
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.strokeStyle = colors.glowColor.replace(/[\d\.]+\)$/, `${(alpha * 0.45).toFixed(3)})`);
          ctx.lineWidth = lineWidth * 2.8;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.shadowBlur = 10 * progress;
          ctx.shadowColor = colors.shadowColor;
          ctx.stroke();

          // 2. Bright Inner Light Core
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.strokeStyle = colors.coreColor.replace(/[\d\.]+\)$/, `${(alpha * 0.9).toFixed(3)})`);
          ctx.lineWidth = lineWidth;
          ctx.shadowBlur = 4;
          ctx.shadowColor = '#fff';
          ctx.stroke();
        }

        // Head Light Spark
        const head = points[points.length - 1];
        ctx.beginPath();
        ctx.arc(head.x, head.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = colors.isDark ? '#ffffff' : '#2563eb';
        ctx.shadowBlur = 12;
        ctx.shadowColor = colors.shadowColor;
        ctx.fill();

        requestAnimationFrame(render);
      } else {
        points.length = 0;
        isRunning = false;
      }
    }
  });
})();
