import type { Metadata } from 'next';
import { ArticleCard } from '@/components/article-card';
import { Reveal } from '@/components/ui/reveal';
import { SITE_NAME, SITE_URL, allArticles } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Blog IA — Guides, comparatifs et analyses',
  description:
    "Tous nos articles : guides d'achat IA, comparatifs détaillés, analyses du marché de l'intelligence artificielle en français. Mis à jour chaque semaine.",
  alternates: { canonical: '/blog' },
  openGraph: {
    type: 'website',
    title: `Blog | ${SITE_NAME}`,
    description: 'Guides, comparatifs et analyses IA en français.',
    url: `${SITE_URL}/blog`,
  },
};

export default function BlogIndexPage() {
  const sorted = [...allArticles].sort(
    (a, b) => +new Date(b.date_published) - +new Date(a.date_published)
  );

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE_URL}/blog#collection`,
    url: `${SITE_URL}/blog`,
    name: `Blog ${SITE_NAME}`,
    description: 'Articles, guides et comparatifs sur les outils IA en français.',
    inLanguage: 'fr-FR',
    isPartOf: { '@id': `${SITE_URL}/#website` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: sorted.length,
      itemListElement: sorted.map((a, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE_URL}/blog/${a.slug}`,
        name: a.title,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <section className="pt-[calc(72px+3rem)] pb-12 relative overflow-hidden">
        <div className="hero-glow" aria-hidden="true" />
        <div className="container-narrow text-center relative">
          <span className="eyebrow block mb-3">Notre journal</span>
          <h1 className="heading-display text-[clamp(2.6rem,6vw,4.5rem)]">
            Le <span className="italic text-gold">blog</span>
          </h1>
          <p className="lead mt-6 max-w-xl mx-auto">
            Guides, comparatifs et analyses sur l'IA en français — toujours à jour.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container">
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sorted.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
