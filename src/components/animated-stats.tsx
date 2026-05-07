'use client';

import { useEffect, useRef, useState } from 'react';
import { Reveal } from '@/components/ui/reveal';

type Stat = {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  description: string;
  decimals?: number;
};

const STATS: Stat[] = [
  {
    value: 62,
    suffix: '+',
    label: 'Outils IA testés',
    description: 'Chacun évalué pendant 30 jours minimum sur des cas réels.',
  },
  {
    value: 800,
    suffix: ' h',
    label: 'Heures de tests',
    description: 'Soit plus de 4 mois temps-plein de mise à l\'épreuve cumulée.',
  },
  {
    value: 12,
    suffix: ' M',
    label: 'Recherches/mois',
    description: 'Volume estimé de recherches IA dans la francophonie.',
  },
  {
    value: 4.8,
    suffix: '/5',
    decimals: 1,
    label: 'Note des lecteurs',
    description: 'Sur la base de 1 200+ retours qualifiés depuis 2024.',
  },
];

export function AnimatedStats() {
  return (
    <section className="py-24 relative">
      <div className="container">
        <Reveal>
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="eyebrow block mb-3">Notre travail en chiffres</span>
            <h2 className="heading-display text-[clamp(2rem,4.5vw,3rem)] mb-3">
              Des heures de tests pour vous faire{' '}
              <span className="italic text-gold">gagner les vôtres</span>
            </h2>
            <p className="text-muted-foreground">
              Quatre métriques qui résument notre rigueur — mises à jour chaque mois.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-black/[0.06] rounded-3xl overflow-hidden border border-black/[0.06]">
          {STATS.map((s, i) => (
            <StatCell key={i} stat={s} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCell({ stat, delay }: { stat: Stat; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(0);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);

  useEffect(() => {
    if (!seen) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setN(stat.value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const duration = 1600;
    const startVal = 0;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setN(startVal + (stat.value - startVal) * ease(t));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, stat.value]);

  const display = stat.decimals != null ? n.toFixed(stat.decimals) : Math.floor(n).toLocaleString('fr-FR');

  return (
    <div
      ref={ref}
      className="bg-white/80 backdrop-blur-md p-8 lg:p-10 flex flex-col items-start gap-3 transition-colors duration-500 hover:bg-white"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="font-display font-normal text-foreground text-[clamp(2.6rem,5vw,4rem)] leading-none tracking-[-0.04em]">
        {stat.prefix}
        <span className="text-gold">{display}</span>
        {stat.suffix && <span className="text-muted-foreground/70 text-[0.6em] ml-0.5">{stat.suffix}</span>}
      </div>
      <div className="font-medium text-foreground text-[0.95rem]">{stat.label}</div>
      <p className="text-[0.85rem] text-muted-foreground leading-[1.55]">{stat.description}</p>
    </div>
  );
}
