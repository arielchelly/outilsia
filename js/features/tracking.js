/**
 * tracking.js — suivi des clics affiliés
 */
(function () {
  'use strict';
  const T = window.TopOutils;
  if (!T || !T.utils) return;

  const isLocal = ['localhost', '127.0.0.1', ''].includes(location.hostname);

  function trackClick(payload) {
    if (typeof window.plausible === 'function') {
      window.plausible('Affiliate Click', { props: payload });
    }
    try {
      const key = 'topoutils_affiliate_clicks';
      const list = JSON.parse(sessionStorage.getItem(key) || '[]');
      list.push({ ...payload, ts: Date.now() });
      sessionStorage.setItem(key, JSON.stringify(list.slice(-50)));
    } catch (_) {}
    if (isLocal) console.log('[track]', payload);
  }

  T.utils.onReady(() => {
    document.addEventListener('click', e => {
      const a = e.target.closest('[data-track-affiliate], .btn-affiliate');
      if (!a) return;
      const payload = {
        toolId: a.dataset.toolId || '',
        toolName: a.dataset.toolName || '',
        category: a.dataset.category || '',
        position: a.dataset.position || '',
        page: location.pathname,
      };
      trackClick(payload);
    });
  });
})();
