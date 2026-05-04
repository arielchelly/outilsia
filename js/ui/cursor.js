/**
 * cursor.js — curseur custom (desktop uniquement)
 */
(function () {
  'use strict';
  const T = window.TopOutils;
  if (!T || !T.utils) return;
  if (T.utils.isTouch()) return;
  if (T.utils.prefersReducedMotion()) return;

  class CustomCursor {
    constructor() {
      this.dot = document.createElement('div');
      this.ring = document.createElement('div');
      this.dot.className = 'cursor-dot';
      this.ring.className = 'cursor-ring';
      Object.assign(this.dot.style, {
        position: 'fixed', top: 0, left: 0, width: '6px', height: '6px',
        borderRadius: '50%', background: 'var(--gold)', pointerEvents: 'none',
        zIndex: 9998, transform: 'translate(-50%, -50%)',
        transition: 'opacity 0.25s ease, background 0.2s ease',
      });
      Object.assign(this.ring.style, {
        position: 'fixed', top: 0, left: 0, width: '36px', height: '36px',
        borderRadius: '50%', border: '1px solid var(--gold)', pointerEvents: 'none',
        zIndex: 9998, transform: 'translate(-50%, -50%)',
        transition: 'width 0.25s var(--ease-out-expo), height 0.25s var(--ease-out-expo), background 0.25s ease, opacity 0.25s ease',
        opacity: 0.6, mixBlendMode: 'screen',
      });
      document.body.appendChild(this.dot);
      document.body.appendChild(this.ring);

      this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      this.ringPos = { x: this.mouse.x, y: this.mouse.y };
      this.bindEvents();
      this.animate = this.animate.bind(this);
      requestAnimationFrame(this.animate);
    }
    bindEvents() {
      window.addEventListener('mousemove', e => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
        this.dot.style.left = e.clientX + 'px';
        this.dot.style.top = e.clientY + 'px';
      }, { passive: true });

      document.addEventListener('mouseover', e => {
        if (e.target.closest('a, button, .btn, .cat-card, .article-card, .tool-card, input, [role="button"]')) {
          this.ring.style.width = '52px';
          this.ring.style.height = '52px';
          this.ring.style.background = 'var(--gold-glow)';
        }
      });
      document.addEventListener('mouseout', e => {
        if (e.target.closest('a, button, .btn, .cat-card, .article-card, .tool-card, input, [role="button"]')) {
          this.ring.style.width = '36px';
          this.ring.style.height = '36px';
          this.ring.style.background = 'transparent';
        }
      });

      window.addEventListener('mouseleave', () => { this.dot.style.opacity = 0; this.ring.style.opacity = 0; });
      window.addEventListener('mouseenter', () => { this.dot.style.opacity = 1; this.ring.style.opacity = 0.6; });
    }
    animate() {
      this.ringPos.x = T.utils.lerp(this.ringPos.x, this.mouse.x, 0.18);
      this.ringPos.y = T.utils.lerp(this.ringPos.y, this.mouse.y, 0.18);
      this.ring.style.left = this.ringPos.x + 'px';
      this.ring.style.top = this.ringPos.y + 'px';
      requestAnimationFrame(this.animate);
    }
  }

  T.utils.onReady(() => new CustomCursor());
})();
