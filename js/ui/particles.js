/**
 * particles.js — réseau de particules canvas 2D
 */
(function () {
  'use strict';
  const T = window.TopOutils;
  if (!T || !T.utils) return;
  if (T.utils.prefersReducedMotion()) return;

  class ParticleNetwork {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.points = [];
      this.mouse = { x: -1000, y: -1000 };
      this.maxDistance = 130;
      this.count = 70;
      this.running = true;
      this.handleResize = this.handleResize.bind(this);
      this.animate = this.animate.bind(this);
      this.init();
    }
    init() {
      this.handleResize();
      window.addEventListener('resize', T.utils.debounce(this.handleResize, 250));
      window.addEventListener('mousemove', e => {
        const r = this.canvas.getBoundingClientRect();
        this.mouse.x = (e.clientX - r.left);
        this.mouse.y = (e.clientY - r.top);
      }, { passive: true });
      this.observeVisibility();
      requestAnimationFrame(this.animate);
    }
    handleResize() {
      const r = this.canvas.getBoundingClientRect();
      this.width = r.width;
      this.height = r.height;
      this.canvas.width = r.width * this.dpr;
      this.canvas.height = r.height * this.dpr;
      this.ctx.scale(this.dpr, this.dpr);
      this.makePoints();
    }
    makePoints() {
      this.points = [];
      const adjusted = Math.max(30, Math.floor(this.width * this.height / 16000));
      const finalCount = Math.min(this.count, adjusted);
      for (let i = 0; i < finalCount; i++) {
        this.points.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: 1.2 + Math.random() * 1.6,
          alpha: 0.4 + Math.random() * 0.4,
        });
      }
    }
    observeVisibility() {
      if (!('IntersectionObserver' in window)) return;
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => { this.running = e.isIntersecting; });
      }, { threshold: 0 });
      io.observe(this.canvas);
    }
    animate() {
      if (this.running && this.ctx) {
        this.ctx.clearRect(0, 0, this.width, this.height);
        for (const p of this.points) {
          // Mouse repulsion
          const dx = p.x - this.mouse.x;
          const dy = p.y - this.mouse.y;
          const md = Math.hypot(dx, dy);
          if (md < 100) {
            const f = (100 - md) / 100 * 0.3;
            p.x += dx / md * f;
            p.y += dy / md * f;
          }
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > this.width) p.vx *= -1;
          if (p.y < 0 || p.y > this.height) p.vy *= -1;
          p.x = T.utils.clamp(p.x, 0, this.width);
          p.y = T.utils.clamp(p.y, 0, this.height);

          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          this.ctx.fillStyle = `rgba(232, 200, 120, ${p.alpha})`;
          this.ctx.fill();
        }
        this.drawConnections();
      }
      requestAnimationFrame(this.animate);
    }
    drawConnections() {
      const max = this.maxDistance;
      for (let i = 0; i < this.points.length; i++) {
        for (let j = i + 1; j < this.points.length; j++) {
          const a = this.points[i], b = this.points[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < max) {
            const op = (1 - d / max) * 0.18;
            this.ctx.beginPath();
            this.ctx.strokeStyle = `rgba(232, 200, 120, ${op})`;
            this.ctx.lineWidth = 0.6;
            this.ctx.moveTo(a.x, a.y);
            this.ctx.lineTo(b.x, b.y);
            this.ctx.stroke();
          }
        }
      }
    }
  }

  T.utils.onReady(() => {
    const canvas = document.getElementById('hero-particles');
    if (canvas) new ParticleNetwork(canvas);
  });
})();
