/**
 * filters.js — placeholder pour filtres complémentaires hors tableau (déjà gérés dans comparatif.js)
 */
(function () {
  'use strict';
  // Cookie banner
  const T = window.TopOutils;
  T.utils.onReady(() => {
    const consent = localStorage.getItem('consent');
    if (!consent) {
      const banner = document.createElement('div');
      banner.className = 'cookie-banner';
      banner.innerHTML = `
        <p>Nous utilisons <strong>Plausible Analytics</strong> (anonymisé, conforme RGPD) pour comprendre l'usage du site. Aucune donnée personnelle n'est collectée.</p>
        <div class="cookie-banner-actions">
          <button class="btn btn-ghost btn-sm" data-cookie="reject">Refuser</button>
          <button class="btn btn-primary btn-sm" data-cookie="accept">Accepter</button>
        </div>
      `;
      document.body.appendChild(banner);
      requestAnimationFrame(() => banner.classList.add('is-visible'));
      banner.addEventListener('click', e => {
        const b = e.target.closest('[data-cookie]');
        if (!b) return;
        localStorage.setItem('consent', b.dataset.cookie === 'accept' ? 'accepted' : 'rejected');
        banner.classList.remove('is-visible');
        setTimeout(() => banner.remove(), 600);
      });
    }
  });
})();
