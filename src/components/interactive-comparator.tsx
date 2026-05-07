'use client';

import { useMemo, useState } from 'react';
import { Reveal } from '@/components/ui/reveal';
import { Stars } from '@/components/ui/stars';
import { ToolLogo } from '@/components/tool-logo';
import { allTools } from '@/lib/data';
import { cn } from '@/lib/utils';

const PAIRS: { left: string; right: string; label: string }[] = [
  { left: 'midjourney', right: 'dalle-3', label: 'Image IA' },
  { left: 'claude-chatbot', right: 'chatgpt', label: 'Chatbot' },
  { left: 'cursor', right: 'github-copilot', label: 'Code IA' },
];

const CRITERIA: { key: keyof Tool['scores']; label: string }[] = [
  { key: 'quality_output', label: 'Qualité' },
  { key: 'ease_of_use', label: 'Simplicité' },
  { key: 'value_for_money', label: 'Rapport qualité/prix' },
  { key: 'french_support', label: 'Support français' },
  { key: 'reliability', label: 'Fiabilité' },
];

type Tool = (typeof allTools)[number];

export function InteractiveComparator() {
  const [pairIdx, setPairIdx] = useState(0);
  const pair = PAIRS[pairIdx];

  const left = useMemo(() => allTools.find((t) => t.id === pair.left), [pair]);
  const right = useMemo(() => allTools.find((t) => t.id === pair.right), [pair]);

  if (!left || !right) return null;

  return (
    <section className="py-24 relative" id="comparator">
      <div className="container">
        <Reveal>
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <span className="eyebrow block mb-3">Face-à-face</span>
            <h2 className="heading-display text-[clamp(2rem,4.5vw,3rem)] mb-3">
              Comparez les <span className="italic text-gold">duels</span> du moment
            </h2>
            <p className="text-muted-foreground">
              Chaque IA a ses forces. Trois matchups éditoriaux que nous recommandons d'arbitrer
              avant tout abonnement.
            </p>
          </div>
        </Reveal>

        {/* Pair selector */}
        <Reveal delay={100}>
          <div className="flex justify-center mb-10">
            <div role="tablist" className="inline-flex p-1 rounded-full bg-surface/80 backdrop-blur-md border border-black/[0.08]">
              {PAIRS.map((p, i) => (
                <button
                  key={p.label}
                  role="tab"
                  aria-selected={pairIdx === i}
                  type="button"
                  onClick={() => setPairIdx(i)}
                  className={cn(
                    'px-5 py-2 rounded-full text-[0.85rem] font-medium transition-all duration-300',
                    pairIdx === i
                      ? 'bg-gold text-white shadow-[0_4px_14px_rgba(202,138,4,0.3)]'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden border border-black/[0.08] bg-white/70 backdrop-blur-md shadow-[0_24px_72px_-24px_rgba(12,10,9,0.12)]">
            {/* Headers row */}
            <div className="grid grid-cols-2 relative">
              <ToolHeader tool={left} side="left" />
              <ToolHeader tool={right} side="right" />
              {/* Center "VS" badge */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold to-gold-deep text-white font-display italic text-[1.4rem] flex items-center justify-center shadow-[0_8px_24px_rgba(202,138,4,0.4)] ring-4 ring-white">
                  vs
                </div>
              </div>
            </div>

            {/* Criteria comparison rows */}
            <div className="border-t border-black/[0.06]">
              {CRITERIA.map((c) => {
                const lScore = left.scores[c.key] ?? 0;
                const rScore = right.scores[c.key] ?? 0;
                const lWins = lScore > rScore;
                const rWins = rScore > lScore;
                return (
                  <div key={c.key} className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 py-5 border-t border-black/[0.04] first:border-t-0">
                    {/* Left bar */}
                    <ScoreBar score={lScore} side="left" winning={lWins} />
                    <div className="text-center px-4">
                      <div className="text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground/80">
                        {c.label}
                      </div>
                    </div>
                    <ScoreBar score={rScore} side="right" winning={rWins} />
                  </div>
                );
              })}
            </div>

            {/* Footer with overall verdict */}
            <div className="border-t border-black/[0.06] bg-surface/50 px-6 py-5 grid grid-cols-2 gap-4">
              <Verdict tool={left} side="left" overall={left.scores.overall} />
              <Verdict tool={right} side="right" overall={right.scores.overall} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ToolHeader({ tool, side }: { tool: Tool; side: 'left' | 'right' }) {
  return (
    <div
      className={cn(
        'p-8 lg:p-10 flex flex-col gap-3',
        side === 'left' ? 'items-start text-left pr-12' : 'items-end text-right pl-12'
      )}
    >
      <ToolLogo tool={tool} name={tool.name} size={56} />
      <h3 className="font-display text-[1.5rem] text-foreground leading-tight tracking-tight">
        {tool.name}
      </h3>
      <p className="text-[0.85rem] text-muted-foreground max-w-[200px]">{tool.tagline}</p>
    </div>
  );
}

function ScoreBar({ score, side, winning }: { score: number; side: 'left' | 'right'; winning: boolean }) {
  const pct = (score / 5) * 100;
  return (
    <div className={cn('flex flex-col gap-1.5', side === 'right' && 'items-end')}>
      <div className={cn('flex items-center gap-2', side === 'right' && 'flex-row-reverse')}>
        <span
          className={cn(
            'font-display text-[1.15rem] tabular-nums',
            winning ? 'text-gold' : 'text-foreground/70'
          )}
        >
          {score.toFixed(1)}
        </span>
        {winning && (
          <span className="text-[0.62rem] uppercase tracking-[0.2em] font-medium text-gold">
            ★ avantage
          </span>
        )}
      </div>
      <div
        className={cn(
          'h-1.5 w-full bg-black/[0.05] rounded-full overflow-hidden',
          side === 'right' && '[&>div]:ml-auto'
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
            winning ? 'bg-gradient-to-r from-gold to-gold-deep' : 'bg-foreground/30'
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Verdict({ tool, side, overall }: { tool: Tool; side: 'left' | 'right'; overall: number }) {
  return (
    <div className={cn('flex flex-col gap-2', side === 'right' && 'items-end text-right')}>
      <span className="text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground/70">
        Note finale
      </span>
      <div className={cn('flex items-center gap-2', side === 'right' && 'flex-row-reverse')}>
        <Stars score={overall} />
        <span className="font-display text-[1.4rem] text-foreground">{overall.toFixed(1)}</span>
      </div>
      <a
        href={tool.affiliate_link}
        target="_blank"
        rel="sponsored noopener"
        className={cn(
          'inline-flex items-center gap-1.5 text-[0.85rem] text-gold hover:text-gold-bright transition-colors mt-1',
          side === 'right' && 'flex-row-reverse'
        )}
      >
        {side === 'left' ? `Essayer ${tool.name}` : `Essayer ${tool.name}`}
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </a>
    </div>
  );
}
