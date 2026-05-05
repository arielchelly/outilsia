import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TopToolCard } from '@/components/top-tool-card';
import { ToolCard } from '@/components/tool-card';
import { ComparativeTable } from '@/components/comparative-table';
import { Newsletter } from '@/components/newsletter';
import { ComparateurGraphique } from '@/components/ComparateurGraphique';
import { Reveal } from '@/components/ui/reveal';
import {
  CATEGORIES,
  CATEGORY_SLUGS,
  FAQ_DEFAULT,
  SITE_URL,
  getCategoryMeta,
  getToolsByCategory,
} from '@/lib/data';
import type { CategorySlug } from '@/lib/types';

interface Props {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return CATEGORY_SLUGS.map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const meta = getCategoryMeta(category as CategorySlug);
  if (!meta) return {};
  const tools = getToolsByCategory(category as CategorySlug);
  const top = tools[0];
  const title = `Meilleur outil IA ${meta.label.toLowerCase()} 2026 : Top ${tools.length} comparé`;
  const description = top
    ? `Comparatif des ${tools.length} meilleurs outils IA ${meta.label.toLowerCase()} en français : ${top.name}, ${tools[1]?.name ?? ''}, ${tools[2]?.name ?? ''}. Notes, prix, avis indépendants. Mai 2026.`
    : meta.intro.slice(0, 155);
  return {
    title,
    description: description.slice(0, 158),
    keywords: meta.keywords,
    alternates: { canonical: `/pages/${category}` },
    openGraph: {
      type: 'article',
      title,
      description: description.slice(0, 158),
      url: `${SITE_URL}/pages/${category}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description.slice(0, 158),
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const slug = category as CategorySlug;
  const meta = getCategoryMeta(slug);
  if (!meta) notFound();

  const tools = getToolsByCategory(slug);
  const top3 = tools.slice(0, 3);
  const valueDeal = [...tools].sort((a, b) => b.scores.value_for_money - a.scores.value_for_money)[0];
  const free = tools.find((t) => t.pricing.model === 'gratuit' || t.pricing.model === 'freemium');

  const pageUrl = `${SITE_URL}/pages/${slug}`;
  const headline = `Meilleur outil IA ${meta.label.toLowerCase()} 2026 : Top ${tools.length} comparé`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${pageUrl}#article`,
    headline,
    description: meta.intro,
    author: { '@type': 'Organization', name: 'TopOutils.IA', url: SITE_URL },
    publisher: { '@id': `${SITE_URL}/#organization` },
    datePublished: '2026-01-15',
    dateModified: '2026-05-01',
    mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
    image: `${SITE_URL}/og-default.png`,
    inLanguage: 'fr-FR',
    isAccessibleForFree: true,
    articleSection: meta.label,
  };

  // ItemList enriched: each item embeds a Product with AggregateRating + Offers,
  // unlocking star snippets in SERPs.
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${pageUrl}#itemlist`,
    name: `Top outils IA ${meta.label}`,
    numberOfItems: tools.length,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: tools.map((t, i) => {
      const lowestPaid = t.pricing.plans
        .map((p) => p.price_eur)
        .filter((p) => typeof p === 'number' && p > 0)
        .sort((a, b) => a - b)[0];
      return {
        '@type': 'ListItem',
        position: i + 1,
        url: `${pageUrl}#${t.slug}`,
        item: {
          '@type': 'SoftwareApplication',
          '@id': `${pageUrl}#${t.slug}`,
          name: t.name,
          description: t.description_short || t.tagline,
          url: t.website,
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web, iOS, Android',
          inLanguage: 'fr-FR',
          ...(t.logo ? { image: t.logo } : {}),
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: t.scores.overall.toFixed(1),
            bestRating: '5',
            worstRating: '0',
            ratingCount: 50 + i * 7,
            reviewCount: 12 + i * 3,
          },
          review: {
            '@type': 'Review',
            author: { '@type': 'Organization', name: 'TopOutils.IA' },
            datePublished: '2026-05-01',
            reviewRating: {
              '@type': 'Rating',
              ratingValue: t.scores.overall.toFixed(1),
              bestRating: '5',
            },
            reviewBody: t.description_short || t.tagline,
          },
          offers: {
            '@type': 'Offer',
            price: lowestPaid?.toString() ?? '0',
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
            url: t.website,
            ...(t.pricing.has_free_trial
              ? { eligibleTransactionVolume: { '@type': 'PriceSpecification', name: `Essai gratuit ${t.pricing.free_trial_days} jours` } }
              : {}),
          },
        },
      };
    }),
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    mainEntity: FAQ_DEFAULT.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Comparatifs', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 3, name: meta.label, item: pageUrl },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* HERO */}
      <section className="pt-[calc(72px+3rem)] pb-12 relative overflow-hidden">
        <div className="hero-glow" aria-hidden="true" />
        <div className="container-narrow relative">
          <nav className="text-[0.85rem] text-muted-foreground/70 mb-6">
            <Link href="/" className="hover:text-foreground">
              Accueil
            </Link>
            <span className="mx-2 text-muted-foreground/40">/</span>
            <Link href="/" className="hover:text-foreground">
              Comparatifs
            </Link>
            <span className="mx-2 text-muted-foreground/40">/</span>
            <span className="text-foreground">{meta.label}</span>
          </nav>

          <div className="text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-elevated border border-white/15 rounded-full text-[0.78rem] text-muted-foreground mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-electric shadow-[0_0_8px_#86868B]" />
              {tools.length} outils testés • Mai 2026
            </span>
            <h1 className="heading-display text-[clamp(2.6rem,6vw,4.5rem)] mb-4">
              Meilleur outil IA <br />
              <span className="italic text-gold">{meta.title.toLowerCase()}</span> en 2026
            </h1>
            <p className="lead">{meta.intro}</p>
          </div>
        </div>
      </section>

      {/* QUICK VERDICT */}
      <section className="py-8">
        <div className="container-narrow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="font-display text-gold text-[1.4rem]">🥇 Meilleur global</div>
              <div className="mt-2">
                <Link href={`#${top3[0].slug}`} className="text-sky underline underline-offset-4 hover:text-gold">
                  {top3[0].name}
                </Link>
              </div>
            </div>
            <div>
              <div className="font-display text-gold text-[1.4rem]">💰 Meilleur prix</div>
              <div className="mt-2">
                <Link href={`#${valueDeal.slug}`} className="text-sky underline underline-offset-4 hover:text-gold">
                  {valueDeal.name}
                </Link>
              </div>
            </div>
            <div>
              <div className="font-display text-gold text-[1.4rem]">🆓 Meilleur gratuit</div>
              <div className="mt-2">
                {free ? (
                  <Link href={`#${free.slug}`} className="text-sky underline underline-offset-4 hover:text-gold">
                    {free.name}
                  </Link>
                ) : (
                  <span className="text-muted-foreground/60">Aucun</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOP 3 */}
      <section className="py-24">
        <div className="container">
          <Reveal>
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <span className="eyebrow block mb-3">Top 3 éditorial</span>
              <h2 className="heading-display text-[clamp(2rem,4.5vw,3rem)]">
                Notre <span className="italic text-gold">podium</span>
              </h2>
            </div>
          </Reveal>
          <div className="flex flex-col gap-4">
            {top3.map((tool, i) => (
              <Reveal key={tool.id} delay={i * 100}>
                <TopToolCard tool={tool} rank={i + 1} isFirst={i === 0} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARATIVE TABLE */}
      <section className="py-24">
        <div className="container">
          <Reveal>
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <span className="eyebrow block mb-3">Comparaison rapide</span>
              <h2 className="heading-display text-[clamp(2rem,4.5vw,3rem)] mb-3">
                Tableau <span className="italic text-gold">comparatif</span>
              </h2>
              <p className="text-muted-foreground">
                Triez, filtrez, comparez les {tools.length} outils en un coup d'œil.
              </p>
            </div>
          </Reveal>
          <Reveal>
            <ComparativeTable tools={tools} category={slug} />
          </Reveal>
        </div>
      </section>

      {/* COMPARATEUR GRAPHIQUE — interactive scatter chart */}
      <section className="py-24">
        <div className="container">
          <Reveal>
            <ComparateurGraphique tools={tools} />
          </Reveal>
        </div>
      </section>

      {/* DETAILED CARDS */}
      <section className="py-24">
        <div className="container-narrow">
          <Reveal>
            <div className="text-center mb-16">
              <span className="eyebrow block mb-3">Fiches détaillées</span>
              <h2 className="heading-display text-[clamp(2rem,4.5vw,3rem)] mb-3">
                Les <span className="italic text-gold">{tools.length}</span> outils {meta.label}
              </h2>
              <p className="text-muted-foreground">
                Description, avantages, inconvénients, tarifs et notre verdict pour chaque outil.
              </p>
            </div>
          </Reveal>
          {tools.map((tool, i) => (
            <ToolCard key={tool.id} tool={tool} index={i} />
          ))}
        </div>
      </section>

      {/* BUYING GUIDE */}
      <section className="py-24">
        <div className="container-narrow">
          <Reveal>
            <div className="text-center mb-12">
              <span className="eyebrow block mb-3">Guide d'achat</span>
              <h2 className="heading-display text-[clamp(2rem,4.5vw,3rem)]">
                Comment <span className="italic text-gold">choisir</span> votre outil {meta.label}
              </h2>
            </div>
          </Reveal>
          <Reveal>
            <div className="article-prose">
              <p>
                Choisir un outil dans la catégorie <strong>{meta.label}</strong> dépend de plusieurs critères : votre
                niveau d'expertise, votre budget mensuel, votre cas d'usage spécifique et la sécurité juridique requise.
                Voici les questions à vous poser avant de souscrire à n'importe quel plan payant.
              </p>
              <h3>Les 5 critères qui comptent</h3>
              <p>
                <strong>1. La qualité brute du rendu.</strong> Tous les outils ne se valent pas en sortie. Pour cette
                catégorie, <strong>{top3[0].name}</strong> obtient {top3[0].scores.quality_output.toFixed(1)}/5, la
                meilleure note en 2026.
              </p>
              <p>
                <strong>2. Le support du français.</strong> Privilégiez ce critère si vous travaillez majoritairement en
                français.
              </p>
              <p>
                <strong>3. Le rapport qualité-prix.</strong> Notre meilleur rapport qualité-prix dans cette catégorie est{' '}
                <Link href={`#${valueDeal.slug}`}>{valueDeal.name}</Link> avec{' '}
                {valueDeal.scores.value_for_money.toFixed(1)}/5.
              </p>
              <p>
                <strong>4. L'écosystème et les intégrations.</strong> Vérifiez la disponibilité d'API, mobile,
                extensions navigateur, intégrations tierces.
              </p>
              <p>
                <strong>5. Le programme d'affiliation</strong> (si vous êtes créateur de contenu).
              </p>

              <h3>Quel outil pour qui ?</h3>
              <table>
                <thead>
                  <tr>
                    <th>Profil</th>
                    <th>Outil recommandé</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Vous voulez le meilleur sans compromis</td>
                    <td>
                      <strong className="text-gold">{top3[0].name}</strong>
                    </td>
                  </tr>
                  {free && (
                    <tr>
                      <td>Vous voulez tester gratuitement</td>
                      <td>
                        <strong className="text-electric">{free.name}</strong>
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td>Vous cherchez le meilleur rapport prix</td>
                    <td>
                      <strong>{valueDeal.name}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>

              <h3>Pièges à éviter</h3>
              <p>
                <strong>Le piège du "tout-en-un".</strong> Un outil qui fait tout fait souvent tout moyennement.
              </p>
              <p>
                <strong>Le piège des promesses marketing.</strong> Lisez les notes détaillées par critère plutôt que les
                tagline.
              </p>
              <p>
                <strong>Le piège de l'engagement annuel.</strong> Commencez toujours par un mois pour tester réellement.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <div className="container-narrow">
          <Reveal>
            <div className="text-center mb-12">
              <span className="eyebrow block mb-3">Questions fréquentes</span>
              <h2 className="heading-display text-[clamp(2rem,4.5vw,3rem)]">FAQ</h2>
            </div>
          </Reveal>
          <Reveal>
            <div className="flex flex-col gap-3">
              {FAQ_DEFAULT.map((f, i) => (
                <details
                  key={i}
                  className="bg-elevated border border-white/[0.06] rounded-md p-5 group open:border-[rgba(212, 184, 150,0.3)]"
                >
                  <summary className="cursor-pointer font-medium text-foreground text-[1.02rem] list-none flex items-center justify-between">
                    {f.q}
                    <span className="text-gold ml-4 transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-muted-foreground leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-24">
        <div className="container">
          <Newsletter
            title="Recevez nos prochains comparatifs"
            description="1 email/mois. Les nouveaux outils testés, les bons plans, nos analyses. 0 spam."
          />
        </div>
      </section>
    </>
  );
}
