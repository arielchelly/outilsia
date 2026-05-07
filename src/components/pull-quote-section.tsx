import { Reveal } from '@/components/ui/reveal';

export function PullQuoteSection() {
  return (
    <section className="py-28 relative overflow-hidden">
      {/* Subtle gold radial behind the quote */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(202,138,4,0.07) 0%, transparent 60%)',
        }}
      />
      <div className="container relative">
        <Reveal>
          <figure className="max-w-4xl mx-auto text-center">
            {/* Decorative open quote */}
            <span
              aria-hidden="true"
              className="font-display italic text-gold/30 text-[7rem] sm:text-[9rem] leading-none block mb-[-1.5rem]"
            >
              &ldquo;
            </span>

            <blockquote className="font-display font-normal italic text-[clamp(1.6rem,3.4vw,2.6rem)] leading-[1.25] tracking-[-0.02em] text-foreground text-balance">
              Le marché de l'IA produit de l'épuisement décisionnel.{' '}
              <span className="not-italic text-gold">Notre travail est de filtrer le bruit</span>{' '}
              — pour que vous gardiez votre temps et votre énergie créative.
            </blockquote>

            <figcaption className="mt-10 inline-flex items-center gap-3 text-[0.78rem] uppercase tracking-[0.2em] text-muted-foreground/80">
              <span className="w-12 h-px bg-gold/50" />
              <span>Manifeste TopOutils.IA — Édition 2026</span>
              <span className="w-12 h-px bg-gold/50" />
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
