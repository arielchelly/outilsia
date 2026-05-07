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
import { TrustBar } from '@/components/trust-bar';
import { TestimonialsWall } from '@/components/testimonials-wall';
import { FAQAccordion } from '@/components/faq-accordion';
import { PullQuoteSection } from '@/components/pull-quote-section';
import { PressMentions } from '@/components/press-mentions';
import { AnimatedStats } from '@/components/animated-stats';
import { InteractiveComparator } from '@/components/interactive-comparator';
import dynamic from 'next/dynamic';
// Below-fold + heavy (Framer Motion + 4 sticky panels) — lazy-load so it
// doesn't block initial render or compete with the constellation for CPU.
// ssr:false isn't allowed inside a Server Component in Next 16, but a plain
// dynamic() still defers the chunk on the client — initial HTML stays SEO-rich
// while Framer Motion is loaded only when this section nears the viewport.
const StickyScrollSection = dynamic(
  () => import('@/components/StickyScrollSection').then((m) => m.StickyScrollSection),
  { loading: () => <div className="h-[80vh]" aria-hidden="true" /> }
);
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
      {/* HERO with Spline 3D */}
      <section className="relative pt-[calc(72px+3rem)] pb-12 overflow-hidden">
        <div className="hero-glow" aria-hidden="true" />

        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 min-h-[640px]">
            {/* Left content */}
            <div className="relative z-10 flex flex-col justify-center py-8">
              <span className="inline-flex items-center gap-2 self-start px-4 py-1.5 bg-foreground/[0.04] border border-black/[0.06] rounded-full text-[0.78rem] text-muted-foreground mb-8 animate-fade-in">
                <span className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_10px_var(--gold)] animate-pulse-blink" />
                {toolsMeta.total} outils testés • Mis à jour mai 2026
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-[4.2rem] font-normal leading-[1.02] mb-6 font-display tracking-[-0.025em]">
                <span className="block text-foreground">
                  <AnimatedText text="Trouvez l'outil IA" startDelay={0.15} />
                </span>
                <span className="block italic text-gold">
                  <AnimatedText text="parfait." startDelay={0.55} />
                </span>
                <span className="block text-foreground">
                  <AnimatedText text="En français." startDelay={0.75} />
                </span>
              </h1>

              <p className="mt-2 text-muted-foreground max-w-lg text-[1.05rem] leading-relaxed">
                Des comparatifs indépendants, honnêtes et détaillés. Nous testons chaque outil pour que vous n'ayez
                pas à le faire.
              </p>

              <div className="flex flex-wrap gap-3 mt-8">
                <Magnetic strength={0.45} radius={140}>
                  <Link href="#categories">
                    <Button variant="primary" size="lg">
                      Voir les comparatifs <span className="arrow">→</span>
                    </Button>
                  </Link>
                </Magnetic>
                <Magnetic strength={0.35} radius={120}>
                  <Link href="/blog">
                    <Button variant="ghost" size="lg">
                      Lire le blog
                    </Button>
                  </Link>
                </Magnetic>
              </div>
            </div>

            {/* Right content — constellation blends into the page bg
                (Stone-50). The WebGL gold flow shader + aurora-mesh provide
                all the visual depth needed; no decorative ring required. */}
            <div className="relative h-[420px] lg:h-[640px] w-full">
              {/* Gold aurora — slow morph behind the globe */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none aurora-mesh"
              />
              <ToolsConstellation />
            </div>
          </div>

          <div className="grid grid-cols-3 max-w-2xl mx-auto mt-16 gap-8">
            <Stat num={toolsMeta.total} label="Outils testés" />
            <Stat num={toolsMeta.categories} label="Catégories" />
            <Stat num="12M+" label="Recherches/mois" />
          </div>
        </div>
      </section>

      {/* MARQUEE — infinite scrolling brands */}
      <LogosMarquee />

      {/* TRUST BAR — editorial pledge + aggregate metrics */}
      <TrustBar />

      {/* PRESS MENTIONS — French media credibility strip */}
      <PressMentions />

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

      {/* PULL QUOTE — editorial breather */}
      <PullQuoteSection />

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

      {/* INTERACTIVE COMPARATOR — face-à-face entre 2 outils */}
      <InteractiveComparator />

      {/* TESTIMONIALS — 3 editorial reader quotes */}
      <TestimonialsWall />

      {/* ANIMATED STATS — count-up metrics on scroll */}
      <AnimatedStats />

      {/* STATS BAR */}
      <section className="py-12">
        <div className="container">
          <div className="flex items-center justify-around flex-wrap gap-6 py-6 border-y border-black/[0.06]">
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

      {/* FAQ — fluid morphing accordion */}
      <FAQAccordion />

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
