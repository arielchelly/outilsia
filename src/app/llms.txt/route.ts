import {
  CATEGORIES,
  CATEGORY_SLUGS,
  SITE_NAME,
  SITE_URL,
  allArticles,
} from '@/lib/data';

// llms.txt — emerging standard to help LLM crawlers (ChatGPT, Claude,
// Perplexity, Gemini) understand site structure quickly.
// Reference: https://llmstxt.org/
export const dynamic = 'force-static';

export function GET() {
  const sortedArticles = [...allArticles].sort(
    (a, b) => +new Date(b.date_published) - +new Date(a.date_published)
  );

  const lines: string[] = [];

  lines.push(`# ${SITE_NAME}`);
  lines.push('');
  lines.push(
    "> Comparatif indépendant des meilleurs outils d'intelligence artificielle en français. 62 outils testés sur 30 jours, comparés sur 8 critères, notés sans complaisance. 8 catégories, mise à jour mensuelle."
  );
  lines.push('');

  lines.push('## Comparatifs par catégorie');
  lines.push('');
  for (const slug of CATEGORY_SLUGS) {
    const c = CATEGORIES[slug];
    lines.push(`- [${c.label}](${SITE_URL}/pages/${slug}/) : ${c.intro}`);
  }
  lines.push('');

  lines.push('## Articles');
  lines.push('');
  for (const a of sortedArticles) {
    lines.push(`- [${a.title}](${SITE_URL}/blog/${a.slug}/) : ${a.description}`);
  }
  lines.push('');

  lines.push('## Méthodologie');
  lines.push('');
  lines.push(
    "Chaque outil est testé pendant 30 jours minimum sur des cas d'usage représentatifs. Sept critères évalués : qualité brute, facilité d'usage, rapport qualité-prix, support du français, qualité de l'API, fiabilité, et note globale synthétique. Les notes vont de 1 à 5 selon une méthodologie publique. Aucune marque ne peut acheter une bonne note. Liens d'affiliation possibles mais ne conditionnent jamais une recommandation."
  );
  lines.push('');

  lines.push('## Pages utiles');
  lines.push('');
  lines.push(`- [Accueil](${SITE_URL}/) : Toutes les catégories et notre top du moment`);
  lines.push(`- [Blog](${SITE_URL}/blog/) : Tous les guides et comparatifs`);
  lines.push(`- [À propos](${SITE_URL}/about/) : Charte éditoriale et méthode de test`);
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
