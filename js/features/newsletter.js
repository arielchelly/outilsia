/**
 * newsletter.js — soumission newsletter
 */
(function () {
  'use strict';
  const T = window.TopOutils;
  if (!T || !T.utils) return;

  const BREVO_WEBHOOK_URL = ''; // TODO: configurer

  const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  T.utils.onReady(() => {
    T.utils.qsa('.newsletter-form').forEach(form => {
      const status = form.parentElement.querySelector('.newsletter-status') || (() => {
        const s = document.createElement('p');
        s.className = 'newsletter-status';
        form.parentElement.appendChild(s);
        return s;
      })();
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]').value.trim();
        if (!isValidEmail(email)) {
          status.textContent = 'Adresse email invalide.';
          status.className = 'newsletter-status error';
          return;
        }
        const btn = form.querySelector('button');
        btn.disabled = true;
        const originalText = btn.textContent;
        btn.textContent = 'Envoi…';
        status.textContent = '';
        status.className = 'newsletter-status';

        try {
          if (BREVO_WEBHOOK_URL) {
            const r = await fetch(BREVO_WEBHOOK_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, source: 'topoutils.ia', date: new Date().toISOString() })
            });
            if (!r.ok) throw new Error('Webhook fail');
          } else {
            await new Promise(res => setTimeout(res, 700));
          }
          status.textContent = '✓ Inscription confirmée. À très vite !';
          status.className = 'newsletter-status success';
          form.reset();
        } catch (err) {
          status.textContent = 'Erreur. Réessayez dans quelques instants.';
          status.className = 'newsletter-status error';
        } finally {
          btn.disabled = false;
          btn.textContent = originalText;
        }
      });
    });
  });
})();
