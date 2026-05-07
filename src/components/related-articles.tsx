import Link from 'next/link';
import { allArticles, CATEGORIES, getArticleBySlug, getToolsByCategory } from '@/lib/data';
import type { CategorySlug } from '@/lib/types';

interface RelatedArticlesProps {
  /** Slugs of related articles to feature (defined in articles.json). */
  slugs: string[];
  /** Category to surface relevant tool cross-links from. */
  category?: CategorySlug;
  /** Slug of the current article (excluded from suggestions). */
  exclude?: string;
}

/**
 * "Pour aller plus loin" block — boosts internal linking on every blog post.
 * Renders related articles + a quick link to the matching category page +
 * top tools of that category. Targets 8-15 internal links per article.
 */
export function RelatedArticles({ slugs, category, exclude }: RelatedArticlesProps) {
  // Resolve slugs → articles, drop self / unknown.
  const articles = slugs
    .filter((s) => s !== exclude)
    .map((s) => getArticleBySlug(s))
    .filter((a): a is NonNullable<ReturnType<typeof getArticleBySlug>> => Boolean(a));

  // If we don't have enough explicit related ones, top up with recent same-category articles.
  if (articles.length < 3 && category) {
    for (const a of allArticles) {
      if (articles.length >= 3) break;
      if (a.slug === exclude) continue;
      if (articles.some((x) => x.slug === a.slug)) continue;
      if (a.related_category === category) articles.push(a);
    }
  }

  const cat = category ? CATEGORIES[category] : undefined;
  const topTools = category ? getToolsByCategory(category).slice(0, 3) : [];

  return (
    <aside
      aria-label="Pour aller plus loin"
      className="mt-16 pt-12 border-t border-black/[0.08]"
    >
      <header className="mb-8">
        <span className="eyebrow block mb-3">Pour aller plus loin</span>
        <h2 className="heading-display text-[clamp(1.6rem,3.5vw,2.2rem)]">
          Continuez votre exploration
        </h2>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {articles.slice(0, 3).map((a) => (
          <Link
            key={a.slug}
            href={`/blog/${a.slug}/`}
            className="group block p-5 rounded-2xl border border-black/[0.06] bg-elevated/40 hover:border-gold/30 hover:bg-elevated transition-all"
          >
            <span className="text-[0.7rem] uppercase tracking-[0.18em] text-gold">
              {a.category_label || a.category}
            </span>
            <h3 className="mt-2 font-display text-[1.15rem] leading-snug group-hover:text-gold transition-colors">
              {a.h1 || a.title}
            </h3>
            <p className="mt-2 text-[0.88rem] text-muted-foreground line-clamp-2">
              {a.description}
            </p>
          </Link>
        ))}
      </div>

      {cat && category && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-5 rounded-2xl border border-gold/15 bg-elevated/30">
          <div className="md:col-span-1">
            <span className="text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground/70">
              Comparatif complet
            </span>
            <p className="mt-2 font-display text-[1.1rem]">
              Voir notre <Link className="text-gold underline underline-offset-4 decoration-gold/40 hover:decoration-gold" href={`/pages/${category}/`}>comparatif {cat.label.toLowerCase()}</Link>
            </p>
          </div>
          <div className="md:col-span-2 flex flex-wrap gap-2 md:justify-end">
            {topTools.map((t) => (
              <Link
                key={t.id}
                href={`/pages/${category}/#${t.slug}`}
                className="inline-flex items-center px-3 py-1.5 rounded-full border border-white/[0.1] text-[0.82rem] text-muted-foreground hover:text-gold hover:border-gold/40 transition"
              >
                {t.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
