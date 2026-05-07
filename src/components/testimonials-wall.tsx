'use client';

import { Reveal } from '@/components/ui/reveal';
import { TiltCard } from '@/components/ui/tilt-card';
import { Stars } from '@/components/ui/stars';

type Testimonial = {
  quote: string;
  author: string;
  role: string;
  initials: string;
  tool: string;
  rating: number;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Le seul comparatif IA français qui prend vraiment le temps de tester avant de noter. Les nuances sur Midjourney vs DALL-E m'ont fait gagner trois mois.",
    author: 'Florence Marchand',
    role: 'Head of Content, agence parisienne',
    initials: 'FM',
    tool: 'Midjourney',
    rating: 5,
  },
  {
    quote:
      "Enfin un site qui ne fait pas l'éloge aveugle de tout. Les bémols sur Make sont exactement ceux qu'on découvre après deux semaines d'usage intensif.",
    author: 'Thomas Bernard',
    role: 'Founder, SaaS B2B Lyon',
    initials: 'TB',
    tool: 'Make',
    rating: 5,
  },
  {
    quote:
      "Comparatif rigoureux, ton éditorial soigné. On sent le travail derrière. C'est devenu ma première recherche avant tout abonnement IA.",
    author: 'Sophie Leroux',
    role: 'Product Designer freelance',
    initials: 'SL',
    tool: 'Claude',
    rating: 5,
  },
];

export function TestimonialsWall() {
  return (
    <section className="py-24 relative">
      <div className="container">
        <Reveal>
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="eyebrow block mb-3">Ils nous font confiance</span>
            <h2 className="heading-display text-[clamp(2rem,4.5vw,3rem)] mb-3">
              Ce que disent nos <span className="italic text-gold">lecteurs</span>
            </h2>
            <p className="text-muted-foreground">
              Des professionnels qui s'appuient sur nos comparatifs avant chaque décision IA.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.author} delay={i * 100}>
              <TiltCard tiltLimit={5} scale={1.015} effect="evade" className="rounded-3xl h-full">
                <article className="glass-card h-full p-8 flex flex-col">
                  {/* Open quote mark */}
                  <span
                    aria-hidden="true"
                    className="font-display italic text-gold/35 text-[5rem] leading-none -mb-6 -ml-1 block"
                  >
                    &ldquo;
                  </span>

                  <p className="font-display text-[1.05rem] leading-[1.55] text-foreground/90 mb-6 flex-1 text-pretty">
                    {t.quote}
                  </p>

                  <div className="flex items-center gap-2 mb-5">
                    <Stars score={t.rating} />
                    <span className="text-[0.78rem] uppercase tracking-[0.16em] text-muted-foreground/70">
                      Recommande {t.tool}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 pt-5 border-t border-black/[0.06]">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-deep text-white font-display font-medium text-[0.95rem] flex items-center justify-center flex-shrink-0">
                      {t.initials}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-foreground text-[0.92rem] leading-tight flex items-center gap-1.5">
                        {t.author}
                        <svg
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-3.5 h-3.5 text-sage flex-shrink-0"
                          aria-label="Lecteur vérifié"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="text-[0.78rem] text-muted-foreground truncate">{t.role}</div>
                    </div>
                  </div>
                </article>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
