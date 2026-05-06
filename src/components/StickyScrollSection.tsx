'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { MotionValue } from 'framer-motion';

interface Step {
  num: string;
  title: string;
  description: string;
  visual: React.ReactNode;
}

const STEPS: Step[] = [
  {
    num: '01',
    title: 'On teste',
    description:
      "Chaque outil IA est testé pendant 30 jours minimum sur des cas d'usage réels. Pas de tests superficiels.",
    visual: <Visual gradient="from-gold/20 via-gold/5 to-transparent" icon="test" />,
  },
  {
    num: '02',
    title: 'On compare',
    description:
      'Chaque outil est comparé sur 8 critères mesurables : qualité, prix, support français, facilité d\'utilisation, et plus.',
    visual: <Visual gradient="from-sky/20 via-sky/5 to-transparent" icon="compare" />,
  },
  {
    num: '03',
    title: 'On note',
    description:
      'Une note de 1 à 5 attribuée selon notre méthodologie publique. Aucune marque ne peut acheter une bonne note.',
    visual: <Visual gradient="from-mint/20 via-mint/5 to-transparent" icon="rate" />,
  },
  {
    num: '04',
    title: 'On publie',
    description:
      'Comparatif complet, mis à jour mensuellement. Honnête, détaillé, en français.',
    visual: <Visual gradient="from-gold/20 via-amber/5 to-transparent" icon="publish" />,
  },
];

// Each step occupies 1/N of the scroll. Animate opacity in / hold / out so
// the previous step fades out exactly when the next fades in.
const STEP_RANGES: Array<[number, number, number, number]> = [
  [0.00, 0.05, 0.22, 0.27],
  [0.23, 0.30, 0.47, 0.52],
  [0.48, 0.55, 0.72, 0.77],
  [0.73, 0.80, 1.00, 1.05],
];

export function StickyScrollSection() {
  const containerRef = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [inView, setInView] = useState(false);

  // Mobile breakpoint check (no sticky behavior under 768px)
  useEffect(() => {
    const m = window.matchMedia('(max-width: 767px)');
    setIsMobile(m.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    m.addEventListener('change', onChange);
    return () => m.removeEventListener('change', onChange);
  }, []);

  // Track when the section is in viewport (drives the side progress dots)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => setInView(e.isIntersecting)),
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Drive the left-side dot indicator from scroll progress.
  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => {
      const idx = Math.min(STEPS.length - 1, Math.max(0, Math.floor(v * STEPS.length + 0.001)));
      setActiveStep(idx);
    });
    return () => unsub();
  }, [scrollYProgress]);

  // ───────── Mobile fallback: 4 stacked panels, no sticky ─────────
  if (isMobile) {
    return (
      <section className="py-16">
        <div className="container">
          <Header />
          <div className="flex flex-col gap-16 mt-12">
            {STEPS.map((s, i) => (
              <StepPanel key={i} step={s} static />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ───────── Desktop: sticky scroll-triggered section ─────────
  return (
    <>
      <section
        ref={containerRef}
        className="relative h-[400vh]"
        aria-label="Notre méthode en quatre étapes"
      >
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          <div className="container relative w-full">
            <div className="absolute top-12 left-1/2 -translate-x-1/2">
              <Header compact />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[60vh]">
              {/* LEFT — 4 stacked layers, only one visible at a time */}
              <div className="relative h-[60vh]">
                {STEPS.map((s, i) => (
                  <StepText key={i} step={s} progress={scrollYProgress} index={i} reduce={!!reduce} />
                ))}
              </div>

              {/* RIGHT — 4 stacked visuals */}
              <div className="relative h-[60vh] hidden lg:block">
                {STEPS.map((s, i) => (
                  <StepVisual key={i} progress={scrollYProgress} index={i} reduce={!!reduce}>
                    {s.visual}
                  </StepVisual>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vertical progress indicator — only while section in viewport */}
      <ProgressDots activeStep={activeStep} visible={inView} />
    </>
  );
}

// ───────── Sub-components ─────────

function Header({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? 'text-center' : 'text-center mb-8'}>
      <span className="eyebrow block mb-3">Notre méthode</span>
      {!compact && (
        <h2 className="heading-display text-[clamp(2rem,4.5vw,3rem)]">
          Comment nous <span className="italic text-gold">travaillons</span>
        </h2>
      )}
    </div>
  );
}

function StepText({
  step,
  progress,
  index,
  reduce,
}: {
  step: Step;
  progress: MotionValue<number>;
  index: number;
  reduce: boolean;
}) {
  const r = STEP_RANGES[index];
  const opacity = useTransform(progress, r, [0, 1, 1, 0]);
  const y = useTransform(progress, r, reduce ? [0, 0, 0, 0] : [40, 0, 0, -40]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex flex-col justify-center"
    >
      <div className="font-display italic text-gold/30 text-[clamp(5rem,10vw,8rem)] leading-none mb-2 select-none">
        {step.num}
      </div>
      <h3 className="heading-display text-[clamp(2.4rem,5vw,4rem)] mb-6">
        — <span className="italic">{step.title}</span>
      </h3>
      <p className="text-muted-foreground text-[1.15rem] leading-relaxed max-w-[500px]">
        {step.description}
      </p>
    </motion.div>
  );
}

function StepVisual({
  children,
  progress,
  index,
  reduce,
}: {
  children: React.ReactNode;
  progress: MotionValue<number>;
  index: number;
  reduce: boolean;
}) {
  const r = STEP_RANGES[index];
  const opacity = useTransform(progress, r, [0, 1, 1, 0]);
  const scale = useTransform(progress, r, reduce ? [1, 1, 1, 1] : [0.94, 1, 1, 0.96]);

  return (
    <motion.div style={{ opacity, scale }} className="absolute inset-0">
      {children}
    </motion.div>
  );
}

function StepPanel({ step, static: isStatic }: { step: Step; static?: boolean }) {
  return (
    <div className={isStatic ? 'flex flex-col gap-6' : 'flex flex-col gap-6'}>
      <div className="font-display italic text-gold/40 text-[5rem] leading-none select-none">
        {step.num}
      </div>
      <h3 className="heading-display text-[2.2rem]">
        — <span className="italic">{step.title}</span>
      </h3>
      <p className="text-muted-foreground text-[1.05rem] leading-relaxed">
        {step.description}
      </p>
      <div className="h-[280px]">{step.visual}</div>
    </div>
  );
}

function ProgressDots({ activeStep, visible }: { activeStep: number; visible: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`fixed left-8 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-4 transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {STEPS.map((_, i) => (
        <div key={i} className="relative w-3 h-3 flex items-center justify-center">
          <span
            className={`block rounded-full transition-all duration-300 ${
              i === activeStep
                ? 'w-3 h-3 bg-gold shadow-[0_0_12px_var(--gold-glow)]'
                : 'w-1.5 h-1.5 bg-muted-foreground/30'
            }`}
          />
        </div>
      ))}
    </div>
  );
}

// Decorative placeholder visuals — replace with real screenshots later.
function Visual({ gradient, icon }: { gradient: string; icon: 'test' | 'compare' | 'rate' | 'publish' }) {
  return (
    <div
      className={`relative w-full h-full rounded-2xl border border-white/[0.08] bg-elevated overflow-hidden flex items-center justify-center`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      <div className="absolute inset-0 opacity-[0.025] [background:radial-gradient(circle_at_50%_50%,_white_1px,_transparent_1px)] [background-size:16px_16px]" />
      <div className="relative z-10">
        <VisualIcon icon={icon} />
      </div>
    </div>
  );
}

function VisualIcon({ icon }: { icon: 'test' | 'compare' | 'rate' | 'publish' }) {
  const common = 'text-gold';
  if (icon === 'test') {
    return (
      <svg viewBox="0 0 120 120" className={`w-32 h-32 ${common}`} fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="20" y="20" width="80" height="80" rx="8" />
        <line x1="20" y1="40" x2="100" y2="40" />
        <circle cx="30" cy="30" r="2" fill="currentColor" />
        <circle cx="38" cy="30" r="2" fill="currentColor" />
        <circle cx="46" cy="30" r="2" fill="currentColor" />
        <line x1="32" y1="55" x2="88" y2="55" strokeOpacity="0.5" />
        <line x1="32" y1="65" x2="78" y2="65" strokeOpacity="0.4" />
        <line x1="32" y1="75" x2="84" y2="75" strokeOpacity="0.3" />
        <line x1="32" y1="85" x2="62" y2="85" strokeOpacity="0.4" />
      </svg>
    );
  }
  if (icon === 'compare') {
    return (
      <svg viewBox="0 0 120 120" className={`w-32 h-32 ${common}`} fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="15" y="25" width="90" height="70" rx="6" />
        <line x1="15" y1="42" x2="105" y2="42" />
        <line x1="40" y1="25" x2="40" y2="95" />
        <line x1="65" y1="25" x2="65" y2="95" />
        <line x1="90" y1="25" x2="90" y2="95" />
        <line x1="15" y1="60" x2="105" y2="60" strokeOpacity="0.4" />
        <line x1="15" y1="78" x2="105" y2="78" strokeOpacity="0.4" />
      </svg>
    );
  }
  if (icon === 'rate') {
    return (
      <svg viewBox="0 0 120 120" className={`w-32 h-32 ${common}`} fill="currentColor">
        {[0, 1, 2, 3, 4].map((i) => (
          <polygon
            key={i}
            points="12,2 14.5,8.5 21,9 16,13.5 17.5,20 12,16.5 6.5,20 8,13.5 3,9 9.5,8.5"
            transform={`translate(${i * 22 + 8}, 50)`}
            fillOpacity={i < 4 ? 1 : 0.3}
          />
        ))}
      </svg>
    );
  }
  // publish
  return (
    <svg viewBox="0 0 120 120" className={`w-32 h-32 ${common}`} fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="20" y="15" width="80" height="95" rx="6" />
      <line x1="32" y1="32" x2="88" y2="32" />
      <line x1="32" y1="44" x2="74" y2="44" strokeOpacity="0.4" />
      <line x1="32" y1="54" x2="88" y2="54" strokeOpacity="0.4" />
      <line x1="32" y1="64" x2="78" y2="64" strokeOpacity="0.4" />
      <line x1="32" y1="74" x2="86" y2="74" strokeOpacity="0.4" />
      <line x1="32" y1="84" x2="70" y2="84" strokeOpacity="0.4" />
      <line x1="32" y1="94" x2="82" y2="94" strokeOpacity="0.4" />
    </svg>
  );
}
