'use client';

import { useState } from 'react';
import { Reveal } from '@/components/ui/reveal';
import { cn } from '@/lib/utils';

const FAQ: { q: string; a: string }[] = [
  {
    q: "Comment notez-vous les outils IA ?",
    a: "Chaque outil est testé sur 30 jours minimum, sur 8 critères pondérés (qualité, vitesse, prix, support FR, intégrations, écosystème, fiabilité, courbe d'apprentissage). La note finale combine ces critères en éliminant les biais ponctuels.",
  },
  {
    q: "Êtes-vous vraiment indépendants ?",
    a: "Oui. Aucune marque ne peut acheter une bonne note. Certains liens sont affiliés (transparence en pied de page) et nous touchons une commission si vous souscrivez, mais cela n'influence jamais le classement. Notre crédibilité long-terme dépend de notre honnêteté.",
  },
  {
    q: "À quelle fréquence mettez-vous à jour les comparatifs ?",
    a: "Tous nos comparatifs sont revus chaque mois. Le marché de l'IA bouge vite : nouveaux modèles, baisses de prix, fonctionnalités. Une note datée de plus de 30 jours déclenche une alerte interne pour re-tester.",
  },
  {
    q: "Pourquoi des outils manquent-ils ?",
    a: "Nous refusons d'écrire sur des outils que nous n'avons pas testés sérieusement. Si un outil populaire est absent, c'est qu'il est en cours d'évaluation — la qualité prime sur l'exhaustivité.",
  },
  {
    q: "Le support du français est-il pris en compte ?",
    a: "C'est un de nos critères les plus importants. Beaucoup d'outils prétendent supporter le français mais font des erreurs grossières. Nous testons chaque outil sur des cas réels en français (rédaction, traduction, analyse) avant de noter.",
  },
  {
    q: "Comment proposer un outil à tester ?",
    a: "Écrivez-nous via la page contact avec le nom de l'outil et votre cas d'usage. Nous priorisons les demandes qui reviennent le plus souvent. Aucun paiement ne fait passer un outil devant un autre.",
  },
];

export function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-24" id="faq">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-12 lg:gap-16 max-w-6xl mx-auto">
          {/* Left: heading */}
          <Reveal>
            <div className="lg:sticky lg:top-32">
              <span className="eyebrow block mb-3">Questions fréquentes</span>
              <h2 className="heading-display text-[clamp(2rem,4vw,2.8rem)] mb-5">
                On vous répond <span className="italic text-gold">sans détour</span>.
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[1rem]">
                La transparence fait partie du contrat. Si une question manque, écrivez-nous —
                nous l'ajoutons.
              </p>
            </div>
          </Reveal>

          {/* Right: accordion */}
          <Reveal delay={150}>
            <div className="flex flex-col gap-3">
              {FAQ.map((item, i) => {
                const isOpen = open === i;
                return (
                  <div
                    key={i}
                    className={cn(
                      'group border rounded-2xl overflow-hidden transition-all duration-500',
                      isOpen
                        ? 'border-gold/30 bg-white shadow-[0_8px_32px_-12px_rgba(202,138,4,0.18)]'
                        : 'border-black/[0.06] bg-surface/40 hover:border-black/[0.12]'
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      className="w-full flex items-center justify-between gap-6 px-6 py-5 text-left"
                    >
                      <span
                        className={cn(
                          'font-display text-[1.1rem] sm:text-[1.2rem] leading-snug tracking-[-0.01em] transition-colors',
                          isOpen ? 'text-foreground' : 'text-foreground/85'
                        )}
                      >
                        {item.q}
                      </span>
                      <span
                        aria-hidden="true"
                        className={cn(
                          'flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-500',
                          isOpen
                            ? 'border-gold bg-gold text-white rotate-45'
                            : 'border-black/[0.12] text-foreground/70 group-hover:border-gold/40 group-hover:text-gold'
                        )}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </span>
                    </button>
                    <div
                      id={`faq-panel-${i}`}
                      className={cn(
                        'grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                        isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="px-6 pb-6 text-[0.98rem] leading-[1.65] text-muted-foreground max-w-prose">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
