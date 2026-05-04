/**
 * utils.js — fonctions utilitaires partagées (vanilla, ES2020+)
 */
window.TopOutils = window.TopOutils || {};

(function (T) {
  'use strict';

  T.utils = {
    qs: (sel, root = document) => root.querySelector(sel),
    qsa: (sel, root = document) => Array.from(root.querySelectorAll(sel)),

    on: (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts),

    debounce(fn, wait = 200) {
      let t;
      return function (...args) {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), wait);
      };
    },

    throttle(fn, limit = 100) {
      let inThrottle;
      return function (...args) {
        if (!inThrottle) {
          fn.apply(this, args);
          inThrottle = true;
          setTimeout(() => (inThrottle = false), limit);
        }
      };
    },

    lerp: (a, b, t) => a + (b - a) * t,

    clamp: (n, min, max) => Math.max(min, Math.min(max, n)),

    isTouch: () => window.matchMedia('(pointer: coarse)').matches,

    prefersReducedMotion: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,

    formatPrice(price, period) {
      if (!price || price === 0) return 'Gratuit';
      return `${price}€${period ? '/' + period : ''}`;
    },

    starsSVG(score) {
      const full = Math.floor(score);
      const half = (score - full) >= 0.5 ? 1 : 0;
      const empty = 5 - full - half;
      const star = (cls) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path class="${cls}" d="M12 2l2.9 6.9L22 10l-5.5 4.7L18.2 22 12 18.3 5.8 22l1.7-7.3L2 10l7.1-1.1z"/></svg>`;
      const halfStar = `<svg viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="hg${Math.random().toString(36).slice(2,7)}" x1="0" x2="1"><stop offset="50%" stop-color="var(--gold)"/><stop offset="50%" stop-color="rgba(74,85,104,0.5)"/></linearGradient></defs><path fill="url(#hg)" d="M12 2l2.9 6.9L22 10l-5.5 4.7L18.2 22 12 18.3 5.8 22l1.7-7.3L2 10l7.1-1.1z"/></svg>`;
      let html = '';
      for (let i = 0; i < full; i++) html += star('star-fill');
      if (half) html += halfStar;
      for (let i = 0; i < empty; i++) html += star('star-empty');
      return `<span class="stars">${html}</span>`;
    },

    fetchJSON(url) {
      return fetch(url, { cache: 'no-cache' }).then(r => {
        if (!r.ok) throw new Error('Fetch failed: ' + r.status);
        return r.json();
      });
    },

    onReady(fn) {
      if (document.readyState !== 'loading') fn();
      else document.addEventListener('DOMContentLoaded', fn);
    }
  };
})(window.TopOutils);
