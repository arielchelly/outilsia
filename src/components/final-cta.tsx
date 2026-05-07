'use client';

import Link from 'next/link';
import { Magnetic } from '@/components/ui/magnetic';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';

export function FinalCTA() {
  return (
    <section className="py-32 relative">
      <div className="container">
        <Reveal>
          <div className="relative max-w-5xl mx-auto rounded-[2rem] overflow-hidden border border-[rgba(212, 184, 150,0.18)]">
            {/* Animated gradient bg */}
            <div className="absolute inset-0 bg-gradient-to-br from-[rgba(212, 184, 150,0.06)] via-transparent to-[rgba(134, 134, 139,0.04)]" />
            <div
              aria-hidden="true"
              className="absolute -top-1/2 -right-1/4 w-[700px] h-[700px] rounded-full opacity-30"
              style={{
                background:
                  'radial-gradient(circle, rgba(212, 184, 150,0.18) 0%, rgba(212, 184, 150,0) 60%)',
                filter: 'blur(40px)',
              }}
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] rounded-full opacity-20"
              style={{
                background:
                  'radial-gradient(circle, rgba(134, 134, 139,0.18) 0%, rgba(134, 134, 139,0) 60%)',
                filter: 'blur(40px)',
              }}
            />

            {/* Subtle grid pattern */}
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
                backgroundSize: '48px 48px',
                maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
              }}
            />

            <div className="relative px-8 py-16 md:px-16 md:py-24 text-center">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-elevated/60 backdrop-blur border border-black/10 rounded-full text-[0.72rem] uppercase tracking-[0.2em] text-gold mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-mint shadow-[0_0_10px_#86868B]" />
                Mis à jour en mai 2026
              </span>

              <h2 className="font-display text-[clamp(2.4rem,5vw,4rem)] leading-[1.05] tracking-[-0.025em] mb-6 max-w-3xl mx-auto">
                Économisez des heures de recherche.
                <br />
                <span className="italic text-gold">Trouvez l'outil parfait.</span>
              </h2>

              <p className="text-[1.1rem] text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
                Notre comparatif vous évite des semaines d'essais. 80+ outils IA testés en
                profondeur, classés et expliqués en français.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <Magnetic strength={0.45} radius={140}>
                  <Link href="#categories">
                    <Button variant="primary" size="lg">
                      Voir tous les comparatifs <span className="arrow">→</span>
                    </Button>
                  </Link>
                </Magnetic>
                <Magnetic strength={0.35} radius={120}>
                  <Link href="#newsletter">
                    <Button variant="ghost" size="lg">
                      Recevoir le digest mensuel
                    </Button>
                  </Link>
                </Magnetic>
              </div>

              <div className="mt-12 flex items-center justify-center gap-8 flex-wrap text-[0.78rem] uppercase tracking-[0.18em] text-muted-foreground/70">
                <span className="inline-flex items-center gap-2">
                  <span className="text-gold">✓</span> 100% indépendant
                </span>
                <span className="hidden sm:inline text-muted-foreground/30">•</span>
                <span className="inline-flex items-center gap-2">
                  <span className="text-gold">✓</span> Tests sur 30 jours
                </span>
                <span className="hidden sm:inline text-muted-foreground/30">•</span>
                <span className="inline-flex items-center gap-2">
                  <span className="text-gold">✓</span> Aucun spam
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
