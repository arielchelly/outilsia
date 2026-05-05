import type { Metadata } from 'next';
import { ArticleCard } from '@/components/article-card';
import { Reveal } from '@/components/ui/reveal';
import { allArticles } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Blog — Tous les articles',
  description: 'Articles, guides et comparatifs sur les outils IA en français.',
  alternates: { canonical: '/blog' },
};

export default function BlogIndexPage() {
  const sorted = [...allArticles].sort(
    (a, b) => +new Date(b.date_published) - +new Date(a.date_published)
  );

  return (
    <>
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
