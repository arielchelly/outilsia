import Link from 'next/link';
import { ToolsConstellation } from '@/components/tools-constellation';
import { LogosMarquee } from '@/components/logos-marquee';
import { WhyBento } from '@/components/why-bento';
import { Magnetic } from '@/components/ui/magnetic';
import { TiltCard } from '@/components/ui/tilt-card';
import { AnimatedText } from '@/components/ui/animated-text';
import { FinalCTA } from '@/components/final-cta';
import { CategoryCard } from '@/components/category-card';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { TopToolCard } from '@/components/top-tool-card';
import { ArticleCard } from '@/components/article-card';
import { Newsletter } from '@/components/newsletter';
import { CategoryIcon } from '@/components/category-icon';
import { StickyScrollSection } from '@/components/StickyScrollSection';
import { AnimatedShaderHero } from '@/components/ui/animated-shader-hero';
import { allTools, allArticles, CATEGORIES, CATEGORY_SLUGS, getRecentArticles, toolsMeta } from '@/lib/data';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const top3 = ['claude-chatbot', 'midjourney', 'make']
    .map((id) => allTools.find((t) => t.id === id))
    .filter(Boolean) as typeof allTools;

  const recentArticles = getRecentArticles(3);

  const toolCountByCategory = CATEGORY_SLUGS.reduce<Record<string, number>>((acc, slug) => {
    acc[slug] = allTools.filter((t) => t.category === slug).length;
    return acc;
  }, {});

  return (
    <>
      {/* HERO — animated shader background ("signal flow" theme) */}
      <AnimatedShaderHero
        trustBadge={{
          text: `${toolsMeta.total} outils testés • Mis à jour mai 2026`,
        }}
        headline={{
          line1: "Trouvez l'outil IA",
          line2: 'parfait. En français.',
        }}
        subtitle="Des comparatifs indépendants, honnêtes et détaillés. Nous testons chaque outil pour que vous n'ayez pas à le faire."
        buttons={{
          primary: { text: 'Voir les comparatifs', href: '#categories' },
          secondary: { text: 'Lire le blog', href: '/blog' },
        }}
      />

      {/* STATS */}
      <section className="py-12 border-y border-white/[0.06]">
        <div className="container">
          <div className="grid grid-cols-3 max-w-2xl mx-auto gap-8">
            <Stat num={toolsMeta.total} label="Outils testés" />
            <Stat num={toolsMeta.categories} label="Catégories" />
            <Stat num="12M+" label="Recherches/mois" />
          </div>
        </div>
      </section>

      {/* MARQUEE — infinite scrolling brands */}
      <LogosMarquee />

      {/* CATEGORIES */}
      <section id="categories" className="py-24">
        <div className="container">
          <SectionHeader
            eyebrow="8 catégories"
            title={
              <>
                Explorez par <span className="italic text-gold">catégorie</span>
              </>
            }
            description="Chaque catégorie contient un comparatif détaillé, un guide d'achat et notre verdict."
          />

          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {CATEGORY_SLUGS.map((slug, i) => {
                const isFeature = i < 2;
                return (
                  <TiltCard
                    key={slug}
                    tiltLimit={isFeature ? 6 : 8}
                    scale={1.02}
                    perspective={1400}
                    effect="evade"
                    spotlight={false}
                    className={cn(
                      'rounded-3xl',
                      isFeature ? 'md:col-span-3 md:row-span-2' : 'md:col-span-2'
                    )}
                  >
                    <CategoryCard
                      slug={slug}
                      label={CATEGORIES[slug].label}
                      description={CATEGORIES[slug].intro}
                      toolCount={toolCountByCategory[slug]}
                      isFeature={isFeature}
                    />
                  </TiltCard>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* STICKY SCROLL — méthode en 4 étapes */}
      <StickyScrollSection />

      {/* TOP 3 */}
      <section className="py-24">
        <div className="container">
          <SectionHeader
            eyebrow="Sélection éditoriale"
            title={
              <>
                Les <span className="italic text-gold">incontournables</span> du moment
              </>
            }
            description="Trois outils que nous recommandons à chaque profil professionnel en 2026."
          />
          <div className="flex flex-col gap-4">
            {top3.map((tool, i) => (
              <Reveal key={tool.id} delay={i * 100}>
                <TiltCard tiltLimit={4} scale={1.01} effect="evade" className="rounded-2xl">
                  <TopToolCard tool={tool} rank={i + 1} isFirst={i === 0} />
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US — bento grid */}
      <WhyBento />

      {/* STATS BAR */}
      <section className="py-12">
        <div className="container">
          <div className="flex items-center justify-around flex-wrap gap-6 py-6 border-y border-white/[0.06]">
            <Inline num={toolsMeta.total} label="outils comparés" />
            <Inline num={toolsMeta.categories} label="catégories" />
            <Inline num={allArticles.length} label="articles experts" />
            <Inline num="100%" label="indépendant" />
          </div>
        </div>
      </section>

      {/* RECENT ARTICLES */}
      <section className="py-24">
        <div className="container">
          <SectionHeader
            eyebrow="Notre journal"
            title={<>Les derniers <span className="italic text-gold">articles</span></>}
            description="Guides, comparatifs et analyses sur l'IA en français."
          />
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentArticles.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </Reveal>
          <div className="text-center mt-16">
            <Link href="/blog">
              <Button variant="ghost">Voir tous les articles →</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-24">
        <div className="container">
          <Reveal>
            <Newsletter />
          </Reveal>
        </div>
      </section>

      {/* FINAL CTA — premium banner before footer */}
      <FinalCTA />
    </>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
}) {
  return (
    <Reveal>
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <span className="eyebrow block mb-3">{eyebrow}</span>
        <h2 className="heading-display text-[clamp(2rem,4.5vw,3rem)] mb-3">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </Reveal>
  );
}

function Stat({ num, label }: { num: number | string; label: string }) {
  return (
    <div className="text-center">
      <div className="font-display font-normal text-[3.5rem] leading-none text-gold tracking-tight mb-2">{num}</div>
      <div className="label">{label}</div>
    </div>
  );
}

function Inline({ num, label }: { num: number | string; label: string }) {
  return (
    <div className="text-center">
      <span className="font-display text-gold text-[1.6rem]">{num}</span> <span className="label">{label}</span>
    </div>
  );
}
