# TopOutils.IA — Site comparatif d'outils IA en français

Site statique premium qui compare 62 outils IA en 8 catégories. 100% HTML/CSS/JS vanilla, aucune dépendance npm côté client, déployable gratuitement sur Cloudflare Pages.

---

## Stack & philosophie

- **Pas de framework** : HTML/CSS/JS vanilla pur
- **Pas de build** côté client : tout est statique
- **Générateur Node.js** sans aucune dépendance npm (modules natifs uniquement)
- **Données dans des JSON** : `data/tools.json` (62 outils) + `data/articles.json` (10 articles)
- **Design "Dark Editorial Luxe"** : sombre + accents dorés
- **SEO complet** : schemas JSON-LD, sitemap, OG images SVG, meta tags
- **Performance** : fonts non-bloquantes, CSS critique, lazy loading

---

## Prérequis

- **Node.js ≥ 18** (uniquement pour le générateur, pas pour le site déployé)
- Un compte Cloudflare Pages (gratuit)

---

## Génération locale

```bash
node js/generate/generate.js
```

Cela génère :
- 8 pages catégorie (`pages/<categorie>/index.html`)
- 10 pages articles (`blog/<slug>/index.html`)
- 1 page index du blog (`blog/index.html`)
- 16+ images Open Graph SVG (`images/og/*.svg`)
- `sitemap.xml`

---

## Déploiement Cloudflare Pages

1. Pousse le projet sur GitHub
2. Sur [pages.cloudflare.com](https://pages.cloudflare.com), connecte ton repo
3. Configure le build :
   - **Build command** : `node js/generate/generate.js`
   - **Build output directory** : `/` (racine)
   - **Root directory** : `/`
   - **Environment variables** : aucune nécessaire
4. Déploie. Le site est en ligne sous `<projet>.pages.dev`
5. Ajoute ton domaine custom (`topoutils.ia`) dans Custom Domains

Le fichier `_headers` configure automatiquement les en-têtes de cache et sécurité.
Le fichier `_redirects` gère les redirections 301.

---

## Ajouter un nouvel outil

1. Édite `data/tools.json`
2. Ajoute un objet outil dans `tools` avec tous les champs (cf. exemples existants)
3. Régénère : `node js/generate/generate.js`

Champs obligatoires :
- `id`, `name`, `slug`, `category`, `tagline`, `description_short`, `description_long`
- `logo` (URL — `unavatar.io/<domaine>` est conseillé)
- `website`, `affiliate_link`, `commission_rate`, `commission_type`
- `pricing` (model, plans, has_free_trial, free_trial_days)
- `scores` (overall, quality_output, ease_of_use, value_for_money, french_support, api_quality, reliability)
- `pros`, `cons`, `best_for`, `not_ideal_for`
- `features` (api_available, commercial_use, free_plan, french_interface, mobile_app, team_collab, watermark_free)
- `tags`, `is_featured`, `is_recommended`, `badge_text`, `badge_type`, `rank_in_category`, `last_reviewed`

---

## Ajouter un article

1. Édite `data/articles.json`
2. Ajoute un objet dans `articles` avec :
   - `slug`, `title`, `h1`, `category`, `category_label`, `description`
   - `reading_time`, `date_published`, `date_modified`
   - `content` : HTML complet de l'article (utilise `<h2>`, `<h3>`, `<p>`, `<ul>`, `<table class="compare-table">`, `<div class="box-summary">`, `<div class="box-verdict">`)
   - `faqs` : tableau d'objets `{ q, a }`
   - `related_articles`, `related_category`
3. Régénère : `node js/generate/generate.js`

---

## Variables à configurer

### Newsletter Brevo

Dans `js/features/newsletter.js`, remplace :
```js
const BREVO_WEBHOOK_URL = ''; // TODO: configurer
```
par l'URL de ton webhook Brevo (ou autre fournisseur).

### Liens d'affiliation

Édite chaque `affiliate_link` dans `data/tools.json` avec ton lien personnel.

---

## Structure des fichiers

```
/
├── index.html                  # Accueil
├── about/index.html            # À propos
├── pages/[categorie]/index.html  # 8 pages catégorie (générées)
├── blog/[slug]/index.html      # 10 articles (générés)
├── blog/index.html             # Index blog (généré)
├── data/
│   ├── tools.json              # 62 outils
│   └── articles.json           # 10 articles
├── css/
│   ├── reset.css, tokens.css, typography.css, layout.css, animations.css
│   └── components/             # 8 composants
├── js/
│   ├── core/                   # utils, store
│   ├── ui/                     # cursor, particles, reveal, header, countup
│   ├── features/               # comparatif, newsletter, tracking, filters, search
│   └── generate/generate.js    # Générateur statique
├── images/og/                  # OG images SVG (générées)
├── sitemap.xml                 # (généré)
├── robots.txt
├── _headers                    # Cache Cloudflare
└── _redirects                  # Redirections 301
```

---

## Performance attendue

Cibles Core Web Vitals :
- **LCP** < 1.5s
- **FCP** < 0.8s
- **CLS** < 0.05
- **INP** < 100ms

---

## Crédits

Conception et développement : projet TopOutils.IA, mai 2026.
Polices : Cormorant Garamond, Outfit, JetBrains Mono (Google Fonts).
Logos d'outils : `unavatar.io` (favicons agrégés).
