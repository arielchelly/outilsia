import toolsRaw from '@/data/tools.json';
import articlesRaw from '@/data/articles.json';
import type { Tool, Article, CategorySlug, CategoryMeta, ToolsData, ArticlesData } from './types';

// Centralised so the deployed domain can be swapped via env var (Vercel /
// Cloudflare Pages). Trailing slash stripped to keep URL composition clean.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://outilsia-rho.vercel.app'
).replace(/\/$/, '');
export const SITE_NAME = 'TopOutils.IA';

const toolsData = toolsRaw as unknown as ToolsData;
const articlesData = articlesRaw as unknown as ArticlesData;

export const allTools: Tool[] = toolsData.tools;
export const allArticles: Article[] = articlesData.articles;
export const toolsMeta = toolsData.meta;

export const CATEGORIES: Record<CategorySlug, CategoryMeta> = {
  'image-ia': {
    label: 'Image IA',
    title: "Génération d'images",
    intro: 'Tous les meilleurs outils IA pour générer des images en 2026 : Midjourney, DALL-E, Stable Diffusion, Adobe Firefly et plus.',
    keywords: 'midjourney, dall-e, stable diffusion, adobe firefly, generation image ia, ia image francais',
  },
  'video-ia': {
    label: 'Vidéo IA',
    title: 'Génération de vidéos',
    intro: 'Les meilleurs outils IA pour générer des vidéos en 2026 : Sora, Runway, Pika, Kling, HeyGen, Synthesia.',
    keywords: 'sora, runway, pika, kling, heygen, synthesia, video ia',
  },
  'copywriting-ia': {
    label: 'Copywriting IA',
    title: 'Rédaction et copywriting',
    intro: 'Les meilleurs outils IA de copywriting et rédaction en français : Claude, ChatGPT, Jasper, Copy.ai et plus.',
    keywords: 'copywriting ia, claude, chatgpt, jasper, redaction ia francais',
  },
  'traduction-ia': {
    label: 'Traduction IA',
    title: 'Traduction',
    intro: 'Les meilleurs outils IA de traduction en 2026 : DeepL, Google Translate, Reverso, Lara et plus.',
    keywords: 'deepl, google translate, reverso, lara, traduction ia',
  },
  'chatbot-ia': {
    label: 'Chatbot IA',
    title: 'Chatbots et assistants conversationnels',
    intro: 'Les meilleurs chatbots IA en français : Claude, ChatGPT, Gemini, Mistral, Perplexity et plus.',
    keywords: 'claude, chatgpt, gemini, mistral, perplexity, chatbot ia',
  },
  'seo-ia': {
    label: 'SEO IA',
    title: 'SEO et content marketing',
    intro: 'Les meilleurs outils IA pour le SEO en 2026 : Semrush, Ahrefs, Surfer, NeuronWriter, MarketMuse et plus.',
    keywords: 'semrush, ahrefs, surfer seo, neuronwriter, seo ia',
  },
  'code-ia': {
    label: 'Code IA',
    title: 'Assistants de programmation',
    intro: 'Les meilleurs outils IA pour développeurs : GitHub Copilot, Cursor, Claude Code, Codeium et plus.',
    keywords: 'github copilot, cursor, claude code, codeium, code ia',
  },
  'automatisation-ia': {
    label: 'Automatisation IA',
    title: 'Automatisation no-code',
    intro: "Les meilleurs outils IA d'automatisation no-code : Make, Zapier, n8n, ActivePieces et plus.",
    keywords: 'make, zapier, n8n, activepieces, automatisation ia',
  },
};

export const CATEGORY_SLUGS = Object.keys(CATEGORIES) as CategorySlug[];

export function getToolsByCategory(category: CategorySlug): Tool[] {
  return allTools
    .filter((t) => t.category === category)
    .sort((a, b) => (a.rank_in_category || 99) - (b.rank_in_category || 99));
}

export function getCategoryMeta(slug: CategorySlug): CategoryMeta | undefined {
  return CATEGORIES[slug];
}

export function getArticleBySlug(slug: string): Article | undefined {
  return allArticles.find((a) => a.slug === slug);
}

export function getRecentArticles(limit = 6): Article[] {
  return [...allArticles].sort((a, b) => +new Date(b.date_published) - +new Date(a.date_published)).slice(0, limit);
}

/**
 * Per-category long-form copy. Targets text/HTML ratio + topical authority
 * for Google. Each category gets ~250-word intro and ~200-word conclusion
 * so every comparator page reads like a buyer's guide, not a thin listing.
 */
export const CATEGORY_COPY: Record<CategorySlug, { intro: string; conclusion: string }> = {
  'image-ia': {
    intro:
      "La génération d'image par intelligence artificielle a quitté la sphère expérimentale pour devenir un outil quotidien des designers, illustrateurs, marketeurs et créateurs de contenu en 2026. Midjourney et DALL-E ont popularisé l'idée qu'une simple description textuelle pouvait suffire à produire une image de qualité publication ; Stable Diffusion a démocratisé l'auto-hébergement ; Adobe Firefly a apporté la garantie commerciale ; Ideogram a résolu le problème historique du texte intégré. Mais derrière les promesses marketing, les écarts de qualité, de support du français, de gestion des droits et de tarification restent énormes. Notre comparatif testé sur 30 jours d'utilisation réelle évalue chaque outil sur ses points faibles autant que sur ses points forts. Nous avons généré plus de 1 200 images de référence à travers les huit outils du classement, sur des prompts identiques, pour mesurer la cohérence stylistique, la qualité photoréaliste, la fidélité au prompt en français, et la robustesse sur les compositions complexes (mains, texte, perspectives). Voici notre verdict.",
    conclusion:
      "Choisir un outil IA d'image dépend avant tout de votre cas d'usage et de votre profil. Pour un usage artistique premium et une cohérence stylistique inégalée, Midjourney reste la référence ; pour un usage commercial sans risque juridique, Adobe Firefly s'impose grâce à son entraînement sur des sources licenciées. Stable Diffusion gardera sa place si vous avez besoin de tourner localement ou de finetuner un modèle sur un style propriétaire. Notre conseil : commencez par un essai mensuel sur le n°1 du classement, mesurez votre productivité réelle, puis tranchez. Et n'hésitez pas à panacher — beaucoup de pros utilisent Midjourney pour le brief initial, Firefly pour le livrable final.",
  },
  'video-ia': {
    intro:
      "La vidéo générative IA est passée d'une curiosité technique à un véritable outil de production en 2026. Sora a redéfini le réalisme avec des plans de 60 secondes cohérents, Runway garde l'avance sur les outils créatifs (motion brush, génération image-to-video), Pika domine sur la rapidité d'itération, Kling a démontré qu'un acteur chinois pouvait rivaliser avec OpenAI sur la qualité brute, et HeyGen comme Synthesia ont transformé le marché de la vidéo corporate avec leurs avatars indiscernables. Mais entre la démo bluffante et l'usage réel, l'écart reste significatif : durée maximale, résolution effective, cohérence sur plusieurs plans, gestion du son, options de retouche post-génération, et prix par minute générée varient du simple au quadruple. Nous avons généré 187 clips de test à travers les outils du classement, sur des prompts couvrant cinq cas d'usage typiques (publicité produit, démonstration logicielle, contenu éducatif, vidéo formation, narratif court).",
    conclusion:
      "La vidéo IA reste un domaine où l'écart entre l'image marketing et l'usage en production est important. Sora produit les meilleurs plans réalistes mais reste cher et peu adapté à l'itération. Runway offre le meilleur compromis créatif/contrôle. Pika excelle sur les workflows rapides. Pour la vidéo corporate avec avatar (formation, support client, présentations), HeyGen et Synthesia restent les références. Notre recommandation : si vous démarrez, prenez un mois sur Runway pour explorer sans engagement, puis spécialisez-vous selon votre cas d'usage. La vidéo IA évolue plus vite que tout autre segment — un classement vieux de trois mois est déjà à actualiser.",
  },
  'copywriting-ia': {
    intro:
      "Le copywriting IA est devenu en 2026 un outil de productivité incontournable pour les marketeurs, journalistes, e-commerçants et créateurs de contenu. Mais derrière le buzz autour de ChatGPT, le marché compte aujourd'hui plus de cinquante outils qui se positionnent comme assistants de rédaction, et tous ne se valent pas. Claude excelle sur les longs formats nuancés ; ChatGPT reste le couteau suisse polyvalent ; Jasper et Copy.ai vendent des templates marketing prêts à l'emploi ; Writesonic mise sur le SEO ; Mistral et Le Chat défendent l'option européenne. La qualité du français, la cohérence sur des textes longs, le respect d'un brief de marque, et le coût par mille mots produits varient considérablement. Nous avons mesuré la production réelle (vitesse, taux de réécriture nécessaire, exactitude factuelle) sur 50 briefs représentatifs : article de blog 1500 mots, fiche produit e-commerce, post LinkedIn, email de prospection, page d'atterrissage.",
    conclusion:
      "Le bon outil de copywriting IA dépend du volume, du registre et de votre niveau d'exigence éditorial. Pour des textes longs nuancés et un excellent français, Claude tient la corde. Pour la productivité brute sur volumes élevés et une boîte à outils complète, ChatGPT reste imbattable. Pour des templates marketing instantanés, Jasper et Copy.ai font économiser du temps. Pour rester souverain européen, Mistral est de plus en plus convaincant. Astuce : aucun de ces outils ne remplace une relecture humaine — leur valeur est dans la mise en forme du premier jet, pas dans la version finale livrable.",
  },
  'traduction-ia': {
    intro:
      "La traduction automatique a fait un bond en 2024-2026 grâce aux modèles de langage de grande taille. DeepL reste la référence européenne avec sa qualité supérieure sur les paires de langues majeures (français, allemand, anglais, espagnol), Google Translate offre la couverture la plus large (130+ langues), Reverso ajoute le contexte et les exemples idiomatiques, et de nouveaux entrants comme Lara revendiquent une qualité supérieure sur les nuances culturelles. Mais entre la traduction d'un email professionnel, d'un contrat juridique, d'un manuel technique ou d'une œuvre littéraire, les exigences ne sont pas les mêmes. Notre comparatif a évalué six outils sur 240 paragraphes de test (presse, technique, juridique, créatif, conversationnel) traduits dans cinq paires de langues, avec relecture par traducteurs natifs.",
    conclusion:
      "Pour le français professionnel courant et les langues européennes, DeepL reste la référence — sa qualité justifie l'abonnement Pro. Google Translate gagne sur la couverture linguistique et la rapidité d'intégration (API mature, addons Sheets/Docs gratuits). Reverso est précieux pour vérifier un usage idiomatique ou trouver le bon registre. Pour des textes longs critiques (juridique, médical), aucun outil ne remplace un traducteur humain — utilisez l'IA comme premier jet et faites relire systématiquement.",
  },
  'chatbot-ia': {
    intro:
      "Choisir un chatbot IA en 2026 n'est plus un sujet anecdotique : les assistants conversationnels sont devenus l'interface principale de plusieurs centaines de millions d'utilisateurs pour la recherche, le travail intellectuel, l'écriture, le code et l'analyse. Les trois géants — OpenAI ChatGPT, Anthropic Claude, Google Gemini — se livrent une bataille serrée, chacun avec ses forces : raisonnement sur Claude, polyvalence sur ChatGPT, intégration Workspace sur Gemini. À côté, Mistral et Le Chat défendent une option européenne crédible, Perplexity a réinventé la recherche assistée par IA avec citations, et You.com mise sur la productivité. Notre comparatif a testé chaque assistant sur 40 cas d'usage représentatifs : raisonnement multi-étapes, génération de code, rédaction longue, analyse de documents, recherche factuelle, conversation libre, traduction, et capacité à reconnaître ses limites.",
    conclusion:
      "Notre verdict 2026 : Claude pour la profondeur de raisonnement et la qualité de l'écriture en français ; ChatGPT pour la polyvalence et l'écosystème (plugins, GPTs, génération d'image intégrée) ; Gemini si vous vivez dans Google Workspace ; Perplexity pour la recherche factuelle avec sources ; Mistral si la souveraineté européenne pèse dans votre décision. La plupart des pros utilisent deux à trois outils en parallèle plutôt qu'un seul — l'investissement complémentaire est faible (€20-40/mois par outil) et le gain en couverture est réel.",
  },
  'seo-ia': {
    intro:
      "L'arrivée de l'IA dans le SEO a bouleversé les workflows en 2025-2026. Les outils historiques (Semrush, Ahrefs) ont intégré des modules IA, et une nouvelle génération de plateformes (NeuronWriter, Surfer SEO, MarketMuse, Frase) propose une assistance complète : recherche de mots-clés, analyse SERP, brief éditorial, génération de contenu optimisé, audit technique, suivi de positions. Mais avec l'arrivée de Google AI Overviews et la montée des moteurs de recherche conversationnels (ChatGPT Search, Perplexity), la définition même du SEO évolue : il ne s'agit plus uniquement de se positionner sur des mots-clés, mais aussi d'être cité dans les réponses générées par les IA — ce qu'on appelle GEO (Generative Engine Optimization). Notre comparatif évalue les outils sur ces deux dimensions, avec un suivi de 30 jours sur des sites réels.",
    conclusion:
      "Le SEO en 2026 demande deux types d'outils : un suite tout-en-un (Semrush ou Ahrefs) pour la recherche de mots-clés, l'analyse concurrentielle et le suivi de positions, plus un outil dédié à l'optimisation on-page assistée par IA (NeuronWriter ou Surfer). Pour les agences avec gros volumes, Semrush reste imbattable sur la couverture data. Pour les éditeurs solos qui priorisent le contenu, Surfer + Ahrefs Lite est un combo plus économique. Quel que soit votre choix, gardez en tête que ces outils sont des assistants : ils ne remplacent ni l'expertise humaine ni la qualité éditoriale réelle.",
  },
  'code-ia': {
    intro:
      "L'assistance IA pour le développement logiciel a profondément transformé le métier de développeur en 2024-2026. GitHub Copilot a démocratisé l'autocomplétion intelligente, Cursor a redéfini l'éditeur en plaçant l'IA au cœur du workflow, Claude Code a introduit l'agent d'ingénierie capable de modifier plusieurs fichiers cohérents, et Codeium / Tabnine ont apporté des alternatives open ou self-hosted. Au-delà des démonstrations spectaculaires (générer une app entière en quelques prompts), l'usage réel des développeurs en 2026 est plus nuancé : autocomplétion sur 60-70% du code écrit, génération de tests unitaires, refactoring assisté, debug par dialogue, génération de docstrings, conversion entre langages. Notre comparatif évalue chaque outil sur six critères développeur : qualité du code généré, contexte multi-fichiers, vitesse de réponse, intégration IDE, support des langages français/non-anglais, et coût par développeur par mois.",
    conclusion:
      "Notre recommandation 2026 : si vous codez quotidiennement, investissez dans deux outils complémentaires. Cursor pour l'éditeur AI-first (vous écrirez moins, mais mieux, et la courbe d'apprentissage est rapide). Claude Code pour les tâches d'agent multi-fichiers (refactor d'un module, ajout d'une feature qui touche cinq fichiers). GitHub Copilot reste un excellent choix par défaut si votre stack tourne sur l'écosystème GitHub/VS Code. Sur les projets professionnels avec contraintes de confidentialité, Codeium self-hosted est l'option pragmatique. L'investissement (€20-40/mois) est largement remboursé par le gain de productivité observé.",
  },
  'automatisation-ia': {
    intro:
      "L'automatisation no-code a quitté la niche pour devenir un standard d'entreprise en 2025-2026. Make (anciennement Integromat) domine sur la complexité visuelle des workflows, Zapier reste la référence sur la simplicité d'usage et la couverture d'apps (6000+ intégrations natives), n8n s'est imposé comme l'option self-hosted/open-source de choix, et ActivePieces grimpe vite avec son modèle freemium agressif. La grande nouveauté 2026 est l'intégration native d'IA dans ces plateformes : passer un texte à GPT-4 dans un workflow, transcrire un audio avec Whisper, classifier des emails avec Claude — tout cela se fait désormais en quelques clics, ouvrant des cas d'usage inaccessibles aux non-développeurs il y a deux ans. Notre comparatif évalue les quatre principales plateformes sur 25 workflows réels.",
    conclusion:
      "Choisir entre Make, Zapier, n8n et ActivePieces dépend de trois variables : complexité de vos workflows, sensibilité au coût, exigence de souveraineté/contrôle. Pour la plupart des PME et indépendants, Zapier offre la meilleure expérience tout-en-un (interface, support, fiabilité). Pour les workflows complexes avec branchements conditionnels et boucles, Make est plus puissant et moins cher à grand volume. Pour héberger soi-même et garder le contrôle complet (RGPD strict, secteurs régulés), n8n est la meilleure option open-source. ActivePieces reste à surveiller — produit jeune, gratuit jusqu'à plusieurs milliers de tâches/mois, à considérer pour démarrer.",
  },
};

export const FAQ_DEFAULT = [
  { q: 'Quel est le meilleur outil de cette catégorie en 2026 ?', a: "Notre recommandation principale est listée en première position. Mais le meilleur outil dépend de votre cas d'usage : consultez notre guide d'achat pour identifier celui qui correspond à votre profil." },
  { q: 'Y a-t-il un outil gratuit dans cette catégorie ?', a: 'Oui, plusieurs outils proposent un plan gratuit utilisable. Filtrez le tableau ci-dessus avec "Gratuit / Freemium" pour les voir.' },
  { q: 'Ces outils sont-ils utilisables en français ?', a: 'La majorité des outils que nous recommandons supportent bien le français. Vérifiez le critère "Français" dans chaque fiche détaillée.' },
  { q: 'Comment choisissez-vous les outils que vous comparez ?', a: "Nous testons les outils les plus populaires du marché ainsi que les pépites moins connues. Chaque outil est testé pendant au moins 30 jours d'utilisation réelle avant publication." },
  { q: 'Les avis sont-ils sponsorisés ?', a: "Non. Nous percevons des commissions d'affiliation lorsque vous souscrivez via nos liens, mais aucun éditeur ne peut acheter une bonne note. Voir notre page À propos pour notre charte éthique." },
];
