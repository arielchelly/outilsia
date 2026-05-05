import toolsRaw from '@/data/tools.json';
import articlesRaw from '@/data/articles.json';
import type { Tool, Article, CategorySlug, CategoryMeta, ToolsData, ArticlesData } from './types';

export const SITE_URL = 'https://topoutils.ia';
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

export const FAQ_DEFAULT = [
  { q: 'Quel est le meilleur outil de cette catégorie en 2026 ?', a: "Notre recommandation principale est listée en première position. Mais le meilleur outil dépend de votre cas d'usage : consultez notre guide d'achat pour identifier celui qui correspond à votre profil." },
  { q: 'Y a-t-il un outil gratuit dans cette catégorie ?', a: 'Oui, plusieurs outils proposent un plan gratuit utilisable. Filtrez le tableau ci-dessus avec "Gratuit / Freemium" pour les voir.' },
  { q: 'Ces outils sont-ils utilisables en français ?', a: 'La majorité des outils que nous recommandons supportent bien le français. Vérifiez le critère "Français" dans chaque fiche détaillée.' },
  { q: 'Comment choisissez-vous les outils que vous comparez ?', a: "Nous testons les outils les plus populaires du marché ainsi que les pépites moins connues. Chaque outil est testé pendant au moins 30 jours d'utilisation réelle avant publication." },
  { q: 'Les avis sont-ils sponsorisés ?', a: "Non. Nous percevons des commissions d'affiliation lorsque vous souscrivez via nos liens, mais aucun éditeur ne peut acheter une bonne note. Voir notre page À propos pour notre charte éthique." },
];
