/**
 * header.js — header sticky avec blur au scroll + dropdown
 */
(function () {
  'use strict';
  const T = window.TopOutils;
  if (!T || !T.utils) return;

  T.utils.onReady(() => {
    const header = T.utils.qs('.site-header');
    if (header) {
      const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 16);
      onScroll();
      window.addEventListener('scroll', T.utils.throttle(onScroll, 80), { passive: true });
    }
    // Dropdowns
    T.utils.qsa('.nav-dropdown').forEach(dd => {
      const trigger = dd.querySelector('.nav-dropdown-trigger');
      if (!trigger) return;
      const close = (e) => {
        if (!dd.contains(e.target)) dd.classList.remove('open');
      };
      trigger.addEventListener('click', e => {
        e.stopPropagation();
        dd.classList.toggle('open');
        document.addEventListener('click', close, { once: true });
      });
      dd.addEventListener('mouseleave', () => dd.classList.remove('open'));
      trigger.addEventListener('mouseenter', () => dd.classList.add('open'));
    });

    // Anchor links smooth scroll with header offset
    T.utils.qsa('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href').slice(1);
        if (!id) return;
        const target = document.getElementById(id);
        if (target) {
          e.preventDefault();
          const top = target.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  });
})();
