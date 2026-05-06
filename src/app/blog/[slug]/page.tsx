import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Newsletter } from '@/components/newsletter';
import { Button } from '@/components/ui/button';
import { RelatedArticles } from '@/components/related-articles';
import { allArticles, CATEGORIES, SITE_URL, getArticleBySlug } from '@/lib/data';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return allArticles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticleBySlug(slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: 'article',
      title: a.title,
      description: a.description,
      url: `${SITE_URL}/blog/${slug}`,
      publishedTime: a.date_published,
      modifiedTime: a.date_modified,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const categoryMeta = CATEGORIES[article.related_category as keyof typeof CATEGORIES];

  const pageUrl = `${SITE_URL}/blog/${slug}`;
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${pageUrl}#article`,
    headline: article.title,
    description: article.description,
    author: { '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: 'TopOutils.IA', url: SITE_URL },
    publisher: { '@id': `${SITE_URL}/#organization` },
    datePublished: article.date_published,
    dateModified: article.date_modified,
    mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
    image: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/opengraph-image`,
      width: 1200,
      height: 630,
    },
    inLanguage: 'fr-FR',
    articleSection: article.category_label || article.category,
    wordCount: article.content?.split(/\s+/).length ?? 0,
    timeRequired: `PT${article.reading_time}M`,
    keywords: [article.category_label, article.category, 'IA', 'comparatif'].filter(Boolean).join(', '),
  };
  const faqSchema = article.faqs?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: article.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }
    : null;
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: article.title, item: pageUrl },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <article>
        <header className="pt-[calc(72px+3rem)] pb-8 relative overflow-hidden">
          <div className="hero-glow" aria-hidden="true" />
          <div className="container-narrow relative">
            <nav className="text-[0.85rem] text-muted-foreground/70 mb-6">
              <Link href="/" className="hover:text-foreground">Accueil</Link>
              <span className="mx-2 text-muted-foreground/40">/</span>
              <Link href="/blog" className="hover:text-foreground">Blog</Link>
              <span className="mx-2 text-muted-foreground/40">/</span>
              <span className="text-foreground line-clamp-1">{article.title}</span>
            </nav>
            <span className="eyebrow block mb-3">{article.category_label || article.category}</span>
            <h1 className="heading-display text-[clamp(2.4rem,5vw,4rem)] mb-6">{article.h1}</h1>
            <div className="flex items-center gap-6 flex-wrap text-muted-foreground/70 text-[0.9rem]">
              <span>📅 {article.date_modified}</span>
              <span>⏱ {article.reading_time} min de lecture</span>
            </div>
          </div>
        </header>

        <div className="container-narrow pb-16">
          <div
            className="article-prose"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {article.faqs?.length > 0 && (
            <section className="mt-16">
              <h2 className="heading-display text-[2rem] mb-6">Questions fréquentes</h2>
              <div className="flex flex-col gap-3">
                {article.faqs.map((f, i) => (
                  <details key={i} className="bg-elevated border border-white/[0.06] rounded-md p-5 group">
                    <summary className="cursor-pointer font-medium text-foreground text-[1.02rem] list-none flex items-center justify-between">
                      {f.q}
                      <span className="text-gold ml-4 transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-3 text-muted-foreground leading-relaxed">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Pour aller plus loin — drives 8-15+ internal links per article */}
          <RelatedArticles
            slugs={article.related_articles ?? []}
            category={article.related_category}
            exclude={article.slug}
          />

          {article.related_category && categoryMeta && (
            <div className="mt-12 text-center">
              <Link href={`/pages/${article.related_category}/`}>
                <Button variant="primary">Voir le comparatif {categoryMeta.label} →</Button>
              </Link>
            </div>
          )}
        </div>
      </article>

      <section className="py-24">
        <div className="container">
          <Newsletter />
        </div>
      </section>
    </>
  );
}
