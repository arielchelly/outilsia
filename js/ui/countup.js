/**
 * countup.js — animation count-up déclenchée à l'entrée dans le viewport
 * Usage : <span data-countup="47" data-suffix="" data-duration="1800">0</span>
 */
(function () {
  'use strict';
  const T = window.TopOutils;
  if (!T || !T.utils) return;

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function animate(el) {
    const target = parseFloat(el.dataset.countup);
    const duration = parseInt(el.dataset.duration || '1800', 10);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const start = performance.now();
    function step(now) {
      const t = Math.min(1, (now - start) / duration);
      const v = easeOutExpo(t) * target;
      el.textContent = prefix + (decimals ? v.toFixed(decimals) : Math.floor(v)).toLocaleString('fr-FR') + suffix;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  T.utils.onReady(() => {
    const items = T.utils.qsa('[data-countup]');
    if (!items.length) return;
    if (!('IntersectionObserver' in window)) { items.forEach(animate); return; }
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animate(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    items.forEach(el => io.observe(el));
  });
})();
