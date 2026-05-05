'use client';

import { Reveal } from '@/components/ui/reveal';
import { cn } from '@/lib/utils';

const items = [
  {
    title: 'Indépendant',
    accent: '01',
    description:
      "Aucune marque n'achète une bonne note. Notre crédibilité long-terme dépend de notre honnêteté.",
    span: 'lg:col-span-2 lg:row-span-2',
    visual: (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.10]">
        <svg viewBox="0 0 200 200" className="w-72 h-72 text-gold">
          <defs>
            <linearGradient id="bento-shield" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.6" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <path
            fill="url(#bento-shield)"
            d="M100 10l80 28v60c0 50-38 84-80 92-42-8-80-42-80-92V38l80-28z"
          />
        </svg>
      </div>
    ),
  },
  {
    title: '30 jours de test',
    accent: '02',
    description: "Chaque outil testé pendant un mois minimum sur des cas d'usage réels.",
    span: '',
    visual: (
      <div className="absolute right-6 bottom-6 font-display italic text-gold/40 text-[3.5rem] leading-none pointer-events-none">
        30
      </div>
    ),
  },
  {
    title: 'Tout en français',
    accent: '03',
    description: "Comparatifs nuancés, support du français évalué pour chaque outil.",
    span: '',
    visual: (
      <div className="absolute right-6 bottom-6 font-display italic text-gold/30 text-[3.5rem] leading-none pointer-events-none">
        FR
      </div>
    ),
  },
  {
    title: 'Mis à jour mensuellement',
    accent: '04',
    description:
      "Le marché de l'IA bouge vite. Nos comparatifs sont revus chaque mois pour rester pertinents.",
    span: 'lg:col-span-2',
    visual: (
      <div className="absolute right-6 top-6 flex items-center gap-2 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-mint shadow-[0_0_12px_#86868B] animate-pulse-blink" />
        <span className="text-[0.7rem] text-mint uppercase tracking-[0.18em]">Live</span>
      </div>
    ),
  },
];

export function WhyBento() {
  return (
    <section className="py-24 relative">
      <div className="container">
        <Reveal>
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="eyebrow block mb-3">Notre méthode</span>
            <h2 className="heading-display text-[clamp(2rem,4.5vw,3rem)] mb-3">
              Pourquoi <span className="italic text-gold">TopOutils.IA</span>
            </h2>
            <p className="text-muted-foreground">
              Quatre principes simples qui font la différence avec les autres comparatifs IA en français.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 gap-4">
          {items.map((it, i) => (
            <Reveal key={it.accent} delay={i * 80} className={cn('contents')}>
              <article
                className={cn(
                  'relative bg-white/[0.015] border border-white/[0.06] rounded-3xl p-8 overflow-hidden transition-all duration-500',
                  'hover:border-[rgba(212, 184, 150,0.25)] hover:bg-white/[0.025]',
                  it.span
                )}
              >
                {it.visual}
                <div className="relative">
                  <span className="block font-mono text-[0.7rem] text-gold/60 mb-4 tracking-wider">
                    {it.accent}
                  </span>
                  <h3 className="font-display text-[1.6rem] sm:text-[1.9rem] text-foreground tracking-tight leading-tight mb-3">
                    {it.title}
                  </h3>
                  <p className="text-muted-foreground text-[0.95rem] leading-relaxed max-w-md">
                    {it.description}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
