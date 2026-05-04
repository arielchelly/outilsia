#!/usr/bin/env node
/**
 * generate.js — Générateur de pages statiques TopOutils.IA
 * Usage : node js/generate/generate.js
 *
 * Aucune dépendance npm. Utilise uniquement les modules natifs Node.js.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');

const SITE_URL = 'https://topoutils.ia';

// ────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────
const readJSON = (file) => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', file), 'utf-8'));
const writeFile = (rel, content) => {
  const full = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf-8');
  console.log(`  ✓ ${rel}`);
};
const escapeHTML = (s='') => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const escapeAttr = escapeHTML;

const CATEGORY_META = {
  'image-ia': {
    label: 'Image IA',
    title: 'Génération d\'images',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>',
    intro: 'Tous les meilleurs outils IA pour générer des images en 2026 : Midjourney, DALL-E, Stable Diffusion, Adobe Firefly et plus.',
    keywords: 'midjourney, dall-e, stable diffusion, adobe firefly, generation image ia, ia image francais',
  },
  'video-ia': {
    label: 'Vidéo IA',
    title: 'Génération de vidéos',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>',
    intro: 'Les meilleurs outils IA pour générer des vidéos en 2026 : Sora, Runway, Pika, Kling, HeyGen, Synthesia.',
    keywords: 'sora, runway, pika, kling, heygen, synthesia, video ia',
  },
  'copywriting-ia': {
    label: 'Copywriting IA',
    title: 'Rédaction et copywriting',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
    intro: 'Les meilleurs outils IA de copywriting et rédaction en français : Claude, ChatGPT, Jasper, Copy.ai et plus.',
    keywords: 'copywriting ia, claude, chatgpt, jasper, redaction ia francais',
  },
  'traduction-ia': {
    label: 'Traduction IA',
    title: 'Traduction',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 8l6 6"/><path d="M4 14l6-6 2-3"/><path d="M2 5h12"/><path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/></svg>',
    intro: 'Les meilleurs outils IA de traduction en 2026 : DeepL, Google Translate, Reverso, Lara et plus.',
    keywords: 'deepl, google translate, reverso, lara, traduction ia',
  },
  'chatbot-ia': {
    label: 'Chatbot IA',
    title: 'Chatbots et assistants conversationnels',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/></svg>',
    intro: 'Les meilleurs chatbots IA en français : Claude, ChatGPT, Gemini, Mistral, Perplexity et plus.',
    keywords: 'claude, chatgpt, gemini, mistral, perplexity, chatbot ia',
  },
  'seo-ia': {
    label: 'SEO IA',
    title: 'SEO et content marketing',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    intro: 'Les meilleurs outils IA pour le SEO en 2026 : Semrush, Ahrefs, Surfer, NeuronWriter, MarketMuse et plus.',
    keywords: 'semrush, ahrefs, surfer seo, neuronwriter, seo ia',
  },
  'code-ia': {
    label: 'Code IA',
    title: 'Assistants de programmation',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    intro: 'Les meilleurs outils IA pour développeurs : GitHub Copilot, Cursor, Claude Code, Codeium et plus.',
    keywords: 'github copilot, cursor, claude code, codeium, code ia',
  },
  'automatisation-ia': {
    label: 'Automatisation IA',
    title: 'Automatisation no-code',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>',
    intro: 'Les meilleurs outils IA d\'automatisation no-code : Make, Zapier, n8n, ActivePieces et plus.',
    keywords: 'make, zapier, n8n, activepieces, automatisation ia',
  },
};

const FAQ_DEFAULT = [
  { q: 'Quel est le meilleur outil de cette catégorie en 2026 ?', a: 'Notre recommandation principale est listée en première position. Mais le meilleur outil dépend de votre cas d\'usage : consultez notre guide d\'achat pour identifier celui qui correspond à votre profil.' },
  { q: 'Y a-t-il un outil gratuit dans cette catégorie ?', a: 'Oui, plusieurs outils proposent un plan gratuit utilisable. Filtrez le tableau ci-dessus avec "Gratuit / Freemium" pour les voir.' },
  { q: 'Ces outils sont-ils utilisables en français ?', a: 'La majorité des outils que nous recommandons supportent bien le français. Vérifiez le critère "Français" dans chaque fiche détaillée.' },
  { q: 'Comment choisissez-vous les outils que vous comparez ?', a: 'Nous testons les outils les plus populaires du marché ainsi que les pépites moins connues. Chaque outil est testé pendant au moins 30 jours d\'utilisation réelle avant publication.' },
  { q: 'Les avis sont-ils sponsorisés ?', a: 'Non. Nous percevons des commissions d\'affiliation lorsque vous souscrivez via nos liens, mais aucun éditeur ne peut acheter une bonne note. Voir notre page À propos pour notre charte éthique.' },
];

// ────────────────────────────────────────────────────────
// Star renderer
// ────────────────────────────────────────────────────────
function starsSVG(score) {
  const full = Math.floor(score);
  const half = (score - full) >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  const star = (cls) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path class="${cls}" d="M12 2l2.9 6.9L22 10l-5.5 4.7L18.2 22 12 18.3 5.8 22l1.7-7.3L2 10l7.1-1.1z"/></svg>`;
  let html = '';
  for (let i = 0; i < full; i++) html += star('star-fill');
  if (half) html += star('star-fill') + ''; // simplified for inline rendering
  for (let i = 0; i < empty; i++) html += star('star-empty');
  return `<span class="stars">${html}</span>`;
}

function priceLabel(tool) {
  if (tool.pricing.model === 'gratuit') return 'Gratuit';
  const minPlan = tool.pricing.plans.find(p => p.price_eur > 0);
  if (!minPlan) return 'Gratuit';
  return `${minPlan.price_eur}€/${minPlan.period}`;
}

function badgeClass(t) {
  return ({ gold: 'badge-gold', electric: 'badge-electric', new: 'badge-new', free: 'badge-free' })[t] || 'badge-soft';
}

// ────────────────────────────────────────────────────────
// Templates
// ────────────────────────────────────────────────────────
function globalHead(opts) {
  const {
    title, description, canonical, image = '/images/og/home.svg',
    type = 'article', extraSchema = '', keywords = ''
  } = opts;
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#080B14">
<title>${escapeHTML(title)}</title>
<meta name="description" content="${escapeAttr(description)}">
${keywords ? `<meta name="keywords" content="${escapeAttr(keywords)}">` : ''}
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
<link rel="canonical" href="${canonical}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="dns-prefetch" href="https://unavatar.io">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
<noscript><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"></noscript>
<meta property="og:type" content="${type}">
<meta property="og:title" content="${escapeAttr(title)}">
<meta property="og:description" content="${escapeAttr(description)}">
<meta property="og:image" content="${SITE_URL}${image}">
<meta property="og:locale" content="fr_FR">
<meta property="og:url" content="${canonical}">
<meta name="twitter:card" content="summary_large_image">
<link rel="stylesheet" href="/css/reset.css">
<link rel="stylesheet" href="/css/tokens.css">
<link rel="stylesheet" href="/css/typography.css">
<link rel="stylesheet" href="/css/layout.css">
<link rel="stylesheet" href="/css/animations.css">
<link rel="stylesheet" href="/css/components/header.css">
<link rel="stylesheet" href="/css/components/footer.css">
<link rel="stylesheet" href="/css/components/cards.css">
<link rel="stylesheet" href="/css/components/table.css">
<link rel="stylesheet" href="/css/components/buttons.css">
<link rel="stylesheet" href="/css/components/badges.css">
<link rel="stylesheet" href="/css/components/scores.css">
<link rel="stylesheet" href="/css/components/forms.css">
${extraSchema}
</head>
<body>`;
}

function globalHeader() {
  return `<header class="site-header">
  <div class="container">
    <a href="/" class="brand"><span class="brand-dot"></span>TopOutils<span style="color:var(--text-muted)">.</span>IA</a>
    <nav class="nav-main">
      <div class="nav-dropdown">
        <button class="nav-dropdown-trigger">Comparatifs</button>
        <div class="dropdown-panel">
          ${Object.entries(CATEGORY_META).map(([slug, m]) =>
            `<a class="dropdown-item" href="/pages/${slug}/"><span class="dropdown-item-icon">${m.icon}</span><span class="dropdown-item-text"><span class="dropdown-item-title">${m.label}</span></span></a>`
          ).join('')}
        </div>
      </div>
      <a href="/blog/">Blog</a>
      <a href="/about/">À propos</a>
    </nav>
  </div>
</header>`;
}

function globalFooter() {
  return `<footer class="site-footer">
  <div class="container">
    <div class="affiliate-disclaimer">
      <strong>Transparence :</strong> TopOutils.IA participe à des programmes d'affiliation. Certains liens peuvent générer une commission, sans surcoût pour vous. Nos évaluations restent 100% indépendantes — aucune marque ne peut acheter une bonne note.
    </div>
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="/" class="brand"><span class="brand-dot"></span>TopOutils<span style="color:var(--text-muted)">.</span>IA</a>
        <p>Le comparatif de référence des outils IA en français.</p>
      </div>
      <div class="footer-col">
        <h4>Comparatifs</h4>
        <ul>
          ${Object.entries(CATEGORY_META).map(([slug, m]) => `<li><a href="/pages/${slug}/">${m.label}</a></li>`).join('')}
        </ul>
      </div>
      <div class="footer-col">
        <h4>Ressources</h4>
        <ul>
          <li><a href="/blog/">Blog</a></li>
          <li><a href="/about/">À propos</a></li>
          <li><a href="/about/#contact">Contact</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Légal</h4>
        <ul>
          <li><a href="/about/#mentions">Mentions légales</a></li>
          <li><a href="/about/#cookies">Cookies</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2026 TopOutils.IA</p>
      <p>Fait avec soin en 🇫🇷</p>
    </div>
  </div>
</footer>
<script src="/js/core/utils.js" defer></script>
<script src="/js/core/store.js" defer></script>
<script src="/js/ui/cursor.js" defer></script>
<script src="/js/ui/reveal.js" defer></script>
<script src="/js/ui/header.js" defer></script>
<script src="/js/ui/countup.js" defer></script>
<script src="/js/features/comparatif.js" defer></script>
<script src="/js/features/filters.js" defer></script>
<script src="/js/features/newsletter.js" defer></script>
<script src="/js/features/tracking.js" defer></script>
</body>
</html>`;
}

function breadcrumb(items) {
  const html = items.map((it, i) => {
    const last = i === items.length - 1;
    return last
      ? `<span style="color:var(--text-primary);">${escapeHTML(it.label)}</span>`
      : `<a href="${it.href}" style="color:var(--text-secondary);">${escapeHTML(it.label)}</a>`;
  }).join('<span style="color:var(--text-muted); margin: 0 0.5rem;">/</span>');
  return `<nav aria-label="Fil d'Ariane" class="text-muted" style="font-size: 0.85rem; margin-bottom: 1.5rem;">${html}</nav>`;
}

function planList(tool) {
  return tool.pricing.plans.map(p => {
    const price = p.price_eur === 0 ? 'Gratuit' : `${p.price_eur}€`;
    return `<div style="padding: 0.5rem 0; border-bottom:1px solid var(--border-subtle); display:flex; justify-content:space-between; gap:1rem;"><span><strong style="color:var(--text-primary)">${escapeHTML(p.name)}</strong> <span style="color:var(--text-muted); font-size:0.85rem;">${escapeHTML(p.detail || '')}</span></span><span class="text-gold">${price}<span style="color:var(--text-muted); font-size:0.85rem;">/${escapeHTML(p.period)}</span></span></div>`;
  }).join('');
}

function toolCard(tool, idx) {
  const isRec = tool.is_recommended;
  const badge = tool.badge_text ? `<span class="badge ${badgeClass(tool.badge_type)}">${escapeHTML(tool.badge_text)}</span>` : '';
  const features = tool.features || {};
  const featureBadges = [
    features.api_available ? '<span class="badge badge-soft">API</span>' : '',
    features.commercial_use ? '<span class="badge badge-soft">Usage commercial</span>' : '',
    features.french_interface ? '<span class="badge badge-soft">Interface FR</span>' : '',
    features.mobile_app ? '<span class="badge badge-soft">App mobile</span>' : '',
    features.team_collab ? '<span class="badge badge-soft">Équipe</span>' : '',
  ].filter(Boolean).join(' ');

  return `<article class="tool-card ${isRec ? 'is-recommended' : ''}" id="${tool.slug}">
    <div class="tool-card-header">
      <div class="tool-card-logo"><img src="${escapeAttr(tool.logo)}" alt="" loading="lazy" onerror="this.style.display='none';this.parentElement.textContent='${escapeAttr(tool.name.charAt(0))}'"></div>
      <div class="tool-card-title">
        <h2>#${idx + 1} — ${escapeHTML(tool.name)} ${badge}</h2>
        <p class="tagline">${escapeHTML(tool.tagline || '')}</p>
        <div class="tool-card-rating">
          ${starsSVG(tool.scores.overall)}
          <span class="score-num">${tool.scores.overall.toFixed(1)} / 5</span>
          <span class="badge badge-${tool.pricing.model === 'gratuit' ? 'free' : tool.pricing.model === 'freemium' ? 'freemium' : 'paid'}">${tool.pricing.model === 'gratuit' ? 'Gratuit' : tool.pricing.model === 'freemium' ? 'Freemium' : 'Payant'}</span>
        </div>
      </div>
    </div>
    <div class="tool-card-body">
      <p class="description">${escapeHTML(tool.description_long || tool.description_short || '')}</p>
      <div class="tool-meta-grid">
        <div class="tool-meta-item">
          <span class="label">Prix d'entrée</span>
          <span class="value">${priceLabel(tool)}</span>
        </div>
        <div class="tool-meta-item">
          <span class="label">Essai gratuit</span>
          <span class="value">${tool.pricing.has_free_trial ? `✓ ${tool.pricing.free_trial_days ? tool.pricing.free_trial_days + ' jours' : 'oui'}` : '✕ Non'}</span>
        </div>
        <div class="tool-meta-item">
          <span class="label">Commission</span>
          <span class="value">${escapeHTML(tool.commission_rate || '—')}${tool.commission_type === 'recurring' ? ' récurrent' : ''}</span>
        </div>
      </div>
      <div class="tool-pros-cons">
        <ul class="tool-pros">
          ${(tool.pros || []).map(p => `<li>${escapeHTML(p)}</li>`).join('')}
        </ul>
        <ul class="tool-cons">
          ${(tool.cons || []).map(c => `<li>${escapeHTML(c)}</li>`).join('')}
        </ul>
      </div>
      <div>
        <span class="label">Plans tarifaires</span>
        <div style="margin-top: 0.5rem;">${planList(tool)}</div>
      </div>
      <div class="tool-best-for">
        <span class="label">Pour qui :</span>
        ${(tool.best_for || []).map(b => `<span class="badge badge-soft">${escapeHTML(b)}</span>`).join(' ')}
      </div>
      ${featureBadges ? `<div class="tool-best-for"><span class="label">Caractéristiques :</span>${featureBadges}</div>` : ''}
      <div class="tool-cta-block">
        <a href="${escapeAttr(tool.affiliate_link)}" rel="sponsored noopener" target="_blank" class="btn btn-affiliate btn-block" data-track-affiliate data-tool-id="${escapeAttr(tool.id)}" data-tool-name="${escapeAttr(tool.name)}" data-category="${escapeAttr(tool.category)}" data-position="category-card">Essayer ${escapeHTML(tool.name)} gratuitement</a>
      </div>
    </div>
  </article>`;
}

function topThreeSection(tools) {
  return `<section style="background: var(--bg-surface); border-top:1px solid var(--border-subtle); border-bottom:1px solid var(--border-subtle);">
    <div class="container">
      <div class="section-header reveal">
        <span class="eyebrow">Top 3 éditorial</span>
        <h2>Notre <span class="italic text-gold">podium</span></h2>
      </div>
      <div class="flex flex-col gap-md">
        ${tools.slice(0, 3).map((t, i) => `
          <article class="top-tool-card ${i === 0 ? 'is-first' : ''} reveal reveal-delay-${i}">
            <div class="rank-bg">${String(i + 1).padStart(2, '0')}</div>
            <div class="top-tool-info">
              <div class="top-tool-logo"><img src="${escapeAttr(t.logo)}" alt="" loading="lazy" onerror="this.style.display='none';this.parentElement.textContent='${escapeAttr(t.name.charAt(0))}'"></div>
              <div class="top-tool-meta">
                <h3>${escapeHTML(t.name)} ${t.badge_text ? `<span class="badge ${badgeClass(t.badge_type)}" style="margin-left:0.5rem;">${escapeHTML(t.badge_text)}</span>` : ''}</h3>
                <p class="tagline">${escapeHTML(t.tagline || '')}</p>
              </div>
            </div>
            <ul class="top-tool-pros">
              ${(t.pros || []).slice(0, 3).map(p => `<li>${escapeHTML(p)}</li>`).join('')}
            </ul>
            <div class="top-tool-cta">
              ${starsSVG(t.scores.overall)}
              <span class="score-num">${t.scores.overall.toFixed(1)} / 5</span>
              <a href="${escapeAttr(t.affiliate_link)}" rel="sponsored noopener" target="_blank" class="btn btn-affiliate" data-track-affiliate data-tool-id="${escapeAttr(t.id)}" data-tool-name="${escapeAttr(t.name)}" data-position="category-top3">Essayer ${escapeHTML(t.name)}</a>
            </div>
          </article>
        `).join('')}
      </div>
    </div>
  </section>`;
}

function comparativeTable(tools, cat) {
  return `<section>
    <div class="container">
      <div class="section-header reveal">
        <span class="eyebrow">Comparaison rapide</span>
        <h2>Tableau <span class="italic text-gold">comparatif</span></h2>
        <p>Triez, filtrez, comparez les ${tools.length} outils de la catégorie en un coup d'œil.</p>
      </div>
      <div class="reveal" data-comparatif data-category="${escapeAttr(cat)}"></div>
    </div>
  </section>`;
}

function buyingGuide(cat, tools) {
  const meta = CATEGORY_META[cat];
  const top = tools[0];
  const free = tools.find(t => t.pricing.model === 'gratuit' || t.pricing.model === 'freemium');
  const valueDeal = tools.slice().sort((a,b) => b.scores.value_for_money - a.scores.value_for_money)[0];
  return `<section style="background: var(--bg-surface); border-top:1px solid var(--border-subtle);">
    <div class="container-narrow">
      <div class="section-header reveal">
        <span class="eyebrow">Guide d'achat</span>
        <h2>Comment <span class="italic text-gold">choisir</span> votre outil ${escapeHTML(meta.label)}</h2>
      </div>
      <div class="reveal" style="font-size: 1.02rem; line-height: 1.8; color: var(--text-secondary);">
        <p>Choisir un outil dans la catégorie <strong>${escapeHTML(meta.label)}</strong> dépend de plusieurs critères : votre niveau d'expertise, votre budget mensuel, votre cas d'usage spécifique et la sécurité juridique requise. Voici les questions à vous poser avant de souscrire à n'importe quel plan payant.</p>

        <h3 style="font-family: var(--font-display); font-weight: 400; font-size: 1.6rem; color: var(--text-primary); margin: 2rem 0 1rem;">Les 5 critères qui comptent</h3>
        <p><strong>1. La qualité brute du rendu.</strong> Tous les outils ne se valent pas en sortie. Notre note "Qualité de production" reflète des tests réels sur des cas d'usage variés. Pour ${escapeHTML(meta.label)}, ${escapeHTML(top.name)} obtient ${top.scores.quality_output.toFixed(1)}/5, la meilleure note de cette catégorie en 2026.</p>
        <p><strong>2. Le support du français.</strong> Beaucoup d'outils sont anglophones par défaut. Nous évaluons l'interface, la qualité de génération en français et la documentation. Privilégiez ce critère si vous travaillez majoritairement en français.</p>
        <p><strong>3. Le rapport qualité-prix.</strong> Un outil à 100€/mois n'est pas forcément 5 fois meilleur qu'un outil à 20€. Notre meilleur rapport qualité-prix dans cette catégorie est <a class="link" href="#${escapeAttr(valueDeal.slug)}">${escapeHTML(valueDeal.name)}</a> avec ${valueDeal.scores.value_for_money.toFixed(1)}/5.</p>
        <p><strong>4. L'écosystème et les intégrations.</strong> Un outil isolé est moins utile qu'un outil intégré à votre stack existante. Vérifiez la disponibilité d'API, mobile, extensions navigateur, intégrations tierces.</p>
        <p><strong>5. Le programme d'affiliation (si vous êtes créateur de contenu).</strong> Pour les blogueurs, YouTubers et affiliés, le pourcentage de commission et la durée de cookie sont des critères stratégiques.</p>

        <h3 style="font-family: var(--font-display); font-weight: 400; font-size: 1.6rem; color: var(--text-primary); margin: 2rem 0 1rem;">Quel outil pour qui ?</h3>
        <table class="compare-table" style="margin: 1.5rem 0;">
          <thead><tr><th>Profil</th><th>Outil recommandé</th></tr></thead>
          <tbody>
            <tr><td>Vous voulez le meilleur sans compromis</td><td><strong class="text-gold">${escapeHTML(top.name)}</strong></td></tr>
            ${free ? `<tr><td>Vous voulez tester gratuitement</td><td><strong class="text-electric">${escapeHTML(free.name)}</strong></td></tr>` : ''}
            <tr><td>Vous cherchez le meilleur rapport prix</td><td><strong>${escapeHTML(valueDeal.name)}</strong></td></tr>
          </tbody>
        </table>

        <h3 style="font-family: var(--font-display); font-weight: 400; font-size: 1.6rem; color: var(--text-primary); margin: 2rem 0 1rem;">Pièges à éviter</h3>
        <p><strong>Le piège du "tout-en-un".</strong> Un outil qui fait tout fait souvent tout moyennement. Préférez 2-3 outils spécialisés à 1 outil polyvalent médiocre.</p>
        <p><strong>Le piège des promesses marketing.</strong> "L'IA la plus puissante du marché" est rarement vraie. Lisez les notes détaillées par critère plutôt que les tagline marketing.</p>
        <p><strong>Le piège de l'engagement annuel.</strong> Commencez toujours par un mois pour tester réellement. Engagez-vous à l'année seulement quand vous êtes sûr.</p>
      </div>
    </div>
  </section>`;
}

function faqSection(faqs) {
  return `<section>
    <div class="container-narrow">
      <div class="section-header reveal">
        <span class="eyebrow">Questions fréquentes</span>
        <h2>FAQ</h2>
      </div>
      <div class="reveal" style="display: flex; flex-direction: column; gap: 0.75rem;">
        ${faqs.map(f => `<details style="background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.25rem 1.5rem;">
          <summary style="cursor: pointer; font-weight: 500; color: var(--text-primary); font-size: 1.02rem;">${escapeHTML(f.q)}</summary>
          <p style="margin-top: 0.75rem; color: var(--text-secondary); line-height: 1.7;">${escapeHTML(f.a)}</p>
        </details>`).join('')}
      </div>
    </div>
  </section>`;
}

function categoryPage(cat, tools) {
  const meta = CATEGORY_META[cat];
  const ranked = tools.slice().sort((a,b) => (a.rank_in_category || 99) - (b.rank_in_category || 99));
  const top3 = ranked.slice(0, 3);
  const valueDeal = ranked.slice().sort((a,b) => b.scores.value_for_money - a.scores.value_for_money)[0];
  const free = ranked.find(t => t.pricing.model === 'gratuit' || t.pricing.model === 'freemium');

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `Meilleur outil IA ${meta.label.toLowerCase()} 2026 : Comparatif & Avis`,
    "author": { "@type": "Organization", "name": "TopOutils.IA" },
    "publisher": { "@type": "Organization", "name": "TopOutils.IA", "logo": { "@type": "ImageObject", "url": `${SITE_URL}/images/og/home.svg` } },
    "datePublished": "2026-01-15",
    "dateModified": "2026-05-01",
    "image": `${SITE_URL}/images/og/${cat}.svg`
  };
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Top outils IA ${meta.label}`,
    "numberOfItems": tools.length,
    "itemListElement": tools.map((t, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": t.name,
      "url": `${SITE_URL}/pages/${cat}/#${t.slug}`,
      "description": t.tagline
    }))
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQ_DEFAULT.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Accueil", "item": SITE_URL + "/" },
      { "@type": "ListItem", "position": 2, "name": "Comparatifs", "item": SITE_URL + "/" },
      { "@type": "ListItem", "position": 3, "name": meta.label, "item": `${SITE_URL}/pages/${cat}/` }
    ]
  };
  const extraSchema = `
<script type="application/ld+json">${JSON.stringify(articleSchema)}</script>
<script type="application/ld+json">${JSON.stringify(itemListSchema)}</script>
<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
<script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>`;

  return globalHead({
    title: `Meilleur outil IA ${meta.label.toLowerCase()} 2026 : Comparatif & Avis | TopOutils.IA`,
    description: meta.intro.slice(0, 155),
    canonical: `${SITE_URL}/pages/${cat}/`,
    image: `/images/og/${cat}.svg`,
    keywords: meta.keywords,
    extraSchema,
  }) + globalHeader() + `

<main style="padding-top: var(--header-height);">
  <section style="padding-top: 4rem; padding-bottom: 3rem; position: relative; overflow: hidden;">
    <div class="hero-glow" aria-hidden="true"></div>
    <div class="container-narrow" style="position:relative;">
      ${breadcrumb([{ label: 'Accueil', href: '/' }, { label: 'Comparatifs', href: '/' }, { label: meta.label }])}
      <div class="text-center">
        <div class="hero-badge" style="margin-bottom: 1.5rem;"><span class="dot"></span>${tools.length} outils testés • Mai 2026</div>
        <h1 style="margin-bottom: 1rem;">Meilleur outil IA <br><span class="italic text-gold">${escapeHTML(meta.title.toLowerCase())}</span> en 2026</h1>
        <p class="lead">${escapeHTML(meta.intro)}</p>
      </div>
    </div>
  </section>

  <section class="compact" style="border-top: 1px solid var(--border-subtle); border-bottom: 1px solid var(--border-subtle); background: var(--bg-surface);">
    <div class="container-narrow">
      <div class="reveal" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; text-align: center;">
        <div><div class="serif text-gold" style="font-size: 1.4rem;">🥇 Meilleur global</div><div style="margin-top: 0.5rem;"><a class="link" href="#${escapeAttr(top3[0].slug)}">${escapeHTML(top3[0].name)}</a></div></div>
        <div><div class="serif text-gold" style="font-size: 1.4rem;">💰 Meilleur prix</div><div style="margin-top: 0.5rem;"><a class="link" href="#${escapeAttr(valueDeal.slug)}">${escapeHTML(valueDeal.name)}</a></div></div>
        <div><div class="serif text-gold" style="font-size: 1.4rem;">🆓 Meilleur gratuit</div><div style="margin-top: 0.5rem;">${free ? `<a class="link" href="#${escapeAttr(free.slug)}">${escapeHTML(free.name)}</a>` : '<span class="text-muted">Aucun</span>'}</div></div>
      </div>
    </div>
  </section>

  ${topThreeSection(ranked)}
  ${comparativeTable(tools, cat)}

  <section>
    <div class="container-narrow">
      <div class="section-header reveal">
        <span class="eyebrow">Fiches détaillées</span>
        <h2>Les <span class="italic text-gold">${tools.length}</span> outils ${escapeHTML(meta.label)}</h2>
        <p>Description, avantages, inconvénients, tarifs et notre verdict pour chaque outil.</p>
      </div>
      <div class="reveal">
        ${ranked.map((t, i) => toolCard(t, i)).join('')}
      </div>
    </div>
  </section>

  ${buyingGuide(cat, ranked)}
  ${faqSection(FAQ_DEFAULT)}

  <section>
    <div class="container">
      <div class="newsletter-box reveal">
        <div class="newsletter-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
        <h2>Recevez nos prochains <span class="italic text-gold">comparatifs</span></h2>
        <p>1 email/mois. Les nouveaux outils testés, les bons plans, nos analyses. 0 spam.</p>
        <form class="newsletter-form" novalidate>
          <input type="email" name="email" placeholder="vous@email.com" required>
          <button type="submit" class="btn btn-primary">S'abonner</button>
        </form>
        <p class="newsletter-disclaimer">Conforme RGPD. Désabonnement en un clic.</p>
        <p class="newsletter-status" aria-live="polite"></p>
      </div>
    </div>
  </section>
</main>

` + globalFooter();
}

// ────────────────────────────────────────────────────────
// Article page
// ────────────────────────────────────────────────────────
function articlePage(article) {
  const meta = CATEGORY_META[article.category] || { label: article.category_label || 'Article' };
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "author": { "@type": "Organization", "name": "TopOutils.IA" },
    "publisher": { "@type": "Organization", "name": "TopOutils.IA", "logo": { "@type": "ImageObject", "url": `${SITE_URL}/images/og/home.svg` } },
    "datePublished": article.date_published,
    "dateModified": article.date_modified,
    "image": `${SITE_URL}/images/og/${article.slug}.svg`,
    "description": article.description
  };
  const faqSchema = article.faqs && article.faqs.length ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": article.faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  } : null;
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Accueil", "item": SITE_URL + "/" },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": SITE_URL + "/blog/" },
      { "@type": "ListItem", "position": 3, "name": article.title, "item": `${SITE_URL}/blog/${article.slug}/` }
    ]
  };
  const extraSchema = `
<script type="application/ld+json">${JSON.stringify(articleSchema)}</script>
${faqSchema ? `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>` : ''}
<script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>`;

  return globalHead({
    title: `${article.title} | TopOutils.IA`,
    description: article.description,
    canonical: `${SITE_URL}/blog/${article.slug}/`,
    image: `/images/og/${article.slug}.svg`,
    extraSchema,
  }) + globalHeader() + `

<main style="padding-top: var(--header-height);">
  <article>
    <header style="padding: 4rem 0 2rem; position: relative; overflow: hidden;">
      <div class="hero-glow" aria-hidden="true"></div>
      <div class="container-narrow" style="position: relative;">
        ${breadcrumb([{ label: 'Accueil', href: '/' }, { label: 'Blog', href: '/blog/' }, { label: article.title }])}
        <span class="eyebrow">${escapeHTML(meta.label || article.category_label || 'Article')}</span>
        <h1 style="margin: 0.75rem 0 1.5rem;">${escapeHTML(article.h1)}</h1>
        <div style="display:flex; align-items:center; gap:1.5rem; flex-wrap:wrap; color: var(--text-muted); font-size: 0.9rem;">
          <span>📅 ${escapeHTML(article.date_modified)}</span>
          <span>⏱ ${article.reading_time} min de lecture</span>
        </div>
      </div>
    </header>

    <div class="container-narrow" style="font-size: 1.05rem; line-height: 1.8; padding-bottom: 4rem;">
      <div class="article-content">
        ${article.content}
      </div>

      ${article.faqs && article.faqs.length ? `
        <section style="margin-top: 4rem;">
          <h2 style="margin-bottom: 1.5rem;">Questions fréquentes</h2>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${article.faqs.map(f => `<details style="background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.25rem 1.5rem;">
              <summary style="cursor: pointer; font-weight: 500; color: var(--text-primary); font-size: 1.02rem;">${escapeHTML(f.q)}</summary>
              <p style="margin-top: 0.75rem; color: var(--text-secondary);">${escapeHTML(f.a)}</p>
            </details>`).join('')}
          </div>
        </section>
      ` : ''}

      ${article.related_category ? `
        <div style="margin-top: 4rem; text-align: center;">
          <a href="/pages/${article.related_category}/" class="btn btn-primary">Voir le comparatif ${escapeHTML(CATEGORY_META[article.related_category]?.label || '')} →</a>
        </div>
      ` : ''}
    </div>
  </article>

  <section style="background: var(--bg-surface); border-top: 1px solid var(--border-subtle); padding: 4rem 0;">
    <div class="container">
      <div class="newsletter-box">
        <div class="newsletter-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
        <h2>Le digest <span class="italic text-gold">mensuel</span></h2>
        <p>1 email/mois. Les nouveaux articles, les bons plans, nos analyses.</p>
        <form class="newsletter-form" novalidate>
          <input type="email" name="email" placeholder="vous@email.com" required>
          <button type="submit" class="btn btn-primary">S'abonner</button>
        </form>
        <p class="newsletter-status" aria-live="polite"></p>
      </div>
    </div>
  </section>
</main>

<style>
.article-content h2 { font-family: var(--font-display); font-weight: 400; font-size: 2rem; color: var(--text-primary); margin: 2.5rem 0 1rem; }
.article-content h3 { font-family: var(--font-body); font-weight: 600; font-size: 1.25rem; color: var(--text-primary); margin: 2rem 0 0.75rem; }
.article-content p { margin-bottom: 1.25rem; color: var(--text-secondary); }
.article-content ul, .article-content ol { padding-left: 1.5rem; margin-bottom: 1.5rem; }
.article-content ul li { list-style: disc; color: var(--text-secondary); margin-bottom: 0.5rem; }
.article-content ol li { list-style: decimal; color: var(--text-secondary); margin-bottom: 0.5rem; }
.article-content strong { color: var(--text-primary); }
.article-content a { color: var(--sky); text-decoration: underline; text-underline-offset: 3px; }
.article-content a:hover { color: var(--gold); }
.article-content table { margin: 1.5rem 0; }
</style>

` + globalFooter();
}

function blogIndex(articles) {
  const sorted = articles.slice().sort((a, b) => new Date(b.date_published) - new Date(a.date_published));
  return globalHead({
    title: 'Blog — Tous les articles | TopOutils.IA',
    description: 'Articles, guides et comparatifs sur les outils IA en français.',
    canonical: `${SITE_URL}/blog/`,
  }) + globalHeader() + `

<main style="padding-top: var(--header-height);">
  <section style="padding: 4rem 0 2rem;">
    <div class="container-narrow text-center">
      <span class="eyebrow">Notre journal</span>
      <h1>Le <span class="italic text-gold">blog</span></h1>
      <p class="lead" style="margin-top: 1rem;">Guides, comparatifs et analyses sur l'IA en français — toujours à jour.</p>
    </div>
  </section>
  <section>
    <div class="container">
      <div class="grid grid-3">
        ${sorted.map(a => `<a class="article-card" href="/blog/${escapeAttr(a.slug)}/">
          <div class="article-card-image">
            <svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g${a.slug.slice(0,4)}" x1="0" x2="1"><stop offset="0%" stop-color="#161B27"/><stop offset="100%" stop-color="#0D1117"/></linearGradient></defs><rect width="800" height="450" fill="url(#g${a.slug.slice(0,4)})"/><text x="400" y="245" font-family="Georgia,serif" font-size="48" font-weight="300" fill="#E8C878" text-anchor="middle">${escapeHTML((a.category_label || a.category).slice(0,30))}</text></svg>
          </div>
          <div class="article-card-body">
            <span class="article-card-cat">${escapeHTML(a.category_label || a.category)}</span>
            <h3>${escapeHTML(a.title)}</h3>
            <p>${escapeHTML(a.description)}</p>
            <div class="article-card-meta">
              <span>${escapeHTML(a.date_published)}</span>
              <span>•</span>
              <span>${a.reading_time} min</span>
              <span class="read-link">Lire →</span>
            </div>
          </div>
        </a>`).join('')}
      </div>
    </div>
  </section>
</main>

` + globalFooter();
}

function ogImageSVG(title, category) {
  const t = title.length > 60 ? title.slice(0, 57) + '…' : title;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#0D1117"/>
      <stop offset="100%" stop-color="#080B14"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="20%" r="60%">
      <stop offset="0%" stop-color="#E8C878" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#E8C878" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <text x="80" y="120" font-family="Outfit, sans-serif" font-size="22" letter-spacing="6" fill="#E8C878" text-transform="uppercase">TOPOUTILS.IA</text>
  <text x="80" y="335" font-family="Cormorant Garamond, Georgia, serif" font-weight="300" font-size="68" fill="#F0F4FF">
    ${escapeHTML(t).match(/.{1,40}(\s|$)/g) ? escapeHTML(t).match(/.{1,40}(\s|$)/g).slice(0, 3).map((line, i) => `<tspan x="80" dy="${i === 0 ? 0 : 80}">${line.trim()}</tspan>`).join('') : `<tspan x="80">${escapeHTML(t)}</tspan>`}
  </text>
  <text x="80" y="560" font-family="Outfit, sans-serif" font-size="22" fill="#8892A4">Comparatif indépendant • Mai 2026</text>
  <circle cx="1100" cy="100" r="4" fill="#E8C878"/>
</svg>`;
}

function generateSitemap(urls) {
  const today = new Date().toISOString().slice(0, 10);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${SITE_URL}${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
}

// ────────────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────────────
function main() {
  console.log('\n🚀 TopOutils.IA — Génération des pages\n' + '─'.repeat(42));

  const { tools } = readJSON('tools.json');
  const { articles } = readJSON('articles.json');

  // Group tools by category
  const byCategory = tools.reduce((acc, t) => {
    (acc[t.category] = acc[t.category] || []).push(t);
    return acc;
  }, {});

  // Category pages
  for (const [cat, catTools] of Object.entries(byCategory)) {
    writeFile(`pages/${cat}/index.html`, categoryPage(cat, catTools));
    writeFile(`images/og/${cat}.svg`, ogImageSVG((CATEGORY_META[cat] && CATEGORY_META[cat].label) || cat, cat));
  }

  // Article pages
  for (const article of articles) {
    writeFile(`blog/${article.slug}/index.html`, articlePage(article));
    writeFile(`images/og/${article.slug}.svg`, ogImageSVG(article.title, article.category));
  }

  // Blog index
  writeFile('blog/index.html', blogIndex(articles));

  // Home OG image
  writeFile('images/og/home.svg', ogImageSVG('Le comparatif de référence des outils IA en français', 'home'));

  // Sitemap
  const urls = [
    { loc: '/', priority: '1.0', changefreq: 'weekly' },
    { loc: '/about/', priority: '0.5', changefreq: 'yearly' },
    ...Object.keys(byCategory).map(cat => ({ loc: `/pages/${cat}/`, priority: '0.9', changefreq: 'monthly' })),
    { loc: '/blog/', priority: '0.8', changefreq: 'weekly' },
    ...articles.map(a => ({ loc: `/blog/${a.slug}/`, priority: '0.7', changefreq: 'monthly' })),
  ];
  writeFile('sitemap.xml', generateSitemap(urls));

  console.log('\n' + '─'.repeat(42));
  console.log(`📊 Résumé :`);
  console.log(`   ${tools.length} outils indexés`);
  console.log(`   ${Object.keys(byCategory).length} catégories`);
  console.log(`   ${articles.length} articles`);
  console.log(`   ${urls.length} URLs dans le sitemap`);
  console.log('\n🎯 Déploie avec : git push (Cloudflare Pages build : node js/generate/generate.js)\n');
}

main();
