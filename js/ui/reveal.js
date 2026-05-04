/**
 * reveal.js — apparition au scroll via IntersectionObserver
 */
(function () {
  'use strict';
  const T = window.TopOutils;
  if (!T || !T.utils) return;

  T.utils.onReady(() => {
    if (!('IntersectionObserver' in window)) {
      T.utils.qsa('.reveal').forEach(el => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    T.utils.qsa('.reveal').forEach(el => io.observe(el));
  });
})();
