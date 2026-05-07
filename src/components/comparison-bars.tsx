'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion';
import type { Tool } from '@/lib/types';
import { ToolLogo } from '@/components/tool-logo';
import { cn } from '@/lib/utils';

interface Props {
  tools: Tool[];
  /** How many tools selected by default (default 5). */
  defaultLimit?: number;
  className?: string;
}

const DIMENSIONS: { key: keyof Tool['scores']; short: string }[] = [
  { key: 'overall', short: 'GLOBAL' },
  { key: 'quality_output', short: 'QUALITÉ' },
  { key: 'ease_of_use', short: 'FACILITÉ' },
  { key: 'value_for_money', short: 'PRIX' },
  { key: 'french_support', short: 'FRANÇAIS' },
  { key: 'api_quality', short: 'API' },
  { key: 'reliability', short: 'FIABILITÉ' },
];

const MAX_SCORE = 5;
const SPRING = { type: 'spring' as const, stiffness: 260, damping: 28, mass: 0.9 };

export function ComparisonBars({ tools, defaultLimit = 5, className }: Props) {
  // Sort the source list by rank
  const sortedTools = useMemo(
    () =>
      [...tools].sort((a, b) => (a.rank_in_category || 99) - (b.rank_in_category || 99)),
    [tools]
  );

  // Initial selection: top N by rank
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(sortedTools.slice(0, defaultLimit).map((t) => t.id))
  );
  const [activeDim, setActiveDim] = useState<keyof Tool['scores']>('overall');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // The list of selected tools sorted by current criterion (descending)
  const sortedSelected = useMemo(
    () =>
      sortedTools
        .filter((t) => selected.has(t.id))
        .sort((a, b) => b.scores[activeDim] - a.scores[activeDim]),
    [sortedTools, selected, activeDim]
  );

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  function selectAll() {
    setSelected(new Set(sortedTools.map((t) => t.id)));
  }
  function selectNone() {
    setSelected(new Set());
  }
  function selectTopN(n: number) {
    setSelected(new Set(sortedTools.slice(0, n).map((t) => t.id)));
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Criterion pills */}
      <div className="overflow-x-auto -mx-2 px-2 pb-3 mb-6 border-b border-black/[0.06]">
        <div className="flex gap-2 min-w-max">
          {DIMENSIONS.map((d) => {
            const active = activeDim === d.key;
            return (
              <button
                key={d.key}
                onClick={() => setActiveDim(d.key)}
                className={cn(
                  'px-4 py-2 rounded-full text-[0.78rem] uppercase tracking-[0.12em] font-medium transition-all whitespace-nowrap',
                  active
                    ? 'bg-gold text-white shadow-[0_4px_18px_rgba(212, 184, 150,0.3)]'
                    : 'bg-black/[0.025] text-muted-foreground border border-black/[0.06] hover:border-[rgba(212, 184, 150,0.3)] hover:text-gold'
                )}
              >
                {d.short}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tool selector */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
          <p className="text-[0.78rem] uppercase tracking-[0.18em] text-muted-foreground/70">
            Outils à comparer ({selected.size}/{sortedTools.length})
          </p>
          <div className="flex gap-2 text-[0.72rem]">
            <button
              onClick={() => selectTopN(5)}
              className="px-3 py-1.5 rounded-full border border-black/10 text-muted-foreground hover:text-gold hover:border-[rgba(212, 184, 150,0.3)] transition uppercase tracking-wider"
            >
              Top 5
            </button>
            <button
              onClick={selectAll}
              className="px-3 py-1.5 rounded-full border border-black/10 text-muted-foreground hover:text-gold hover:border-[rgba(212, 184, 150,0.3)] transition uppercase tracking-wider"
            >
              Tous
            </button>
            <button
              onClick={selectNone}
              className="px-3 py-1.5 rounded-full border border-black/10 text-muted-foreground hover:text-coral hover:border-coral/30 transition uppercase tracking-wider"
            >
              Aucun
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {sortedTools.map((tool) => {
            const isOn = selected.has(tool.id);
            return (
              <button
                key={tool.id}
                onClick={() => toggle(tool.id)}
                className={cn(
                  'group inline-flex items-center gap-2.5 pl-2 pr-3.5 py-1.5 rounded-full border transition-all',
                  isOn
                    ? 'bg-[rgba(212, 184, 150,0.10)] border-[rgba(212, 184, 150,0.4)] text-foreground'
                    : 'bg-black/[0.025] border-black/[0.06] text-muted-foreground/70 hover:border-black/12 hover:text-foreground'
                )}
              >
                <span className="relative w-5 h-5 flex items-center justify-center">
                  <span
                    className={cn(
                      'absolute inset-0 rounded-full border transition-all',
                      isOn ? 'bg-gold border-gold' : 'border-black/15 bg-transparent'
                    )}
                  />
                  {isOn && (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="relative w-3 h-3"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </span>
                <ToolLogo tool={tool} name={tool.name} size={20} />
                <span className="text-[0.85rem] font-medium whitespace-nowrap">
                  {tool.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* The bars */}
      <div className="min-h-[200px]">
        {sortedSelected.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground/60 italic">
            Sélectionnez au moins un outil pour afficher la comparaison.
          </div>
        ) : (
          <LayoutGroup>
            <motion.div layout className="flex flex-col gap-3">
              <AnimatePresence initial={false}>
                {sortedSelected.map((tool, rank) => {
                  const score = tool.scores[activeDim];
                  const pct = (score / MAX_SCORE) * 100;
                  const isLeader = rank === 0;
                  const isDimmed = hoveredId !== null && hoveredId !== tool.id;

                  return (
                    <motion.div
                      key={tool.id}
                      layout
                      initial={{ opacity: 0, x: -30, scale: 0.96 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 30, scale: 0.92 }}
                      transition={SPRING}
                      onMouseEnter={() => setHoveredId(tool.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      className={cn(
                        'group grid items-center gap-4 px-4 py-4 rounded-2xl border cursor-default',
                        'border-black/[0.06] bg-black/[0.02] hover:border-black/12 hover:bg-black/[0.04]',
                        isLeader && 'border-[rgba(212, 184, 150,0.3)] bg-[rgba(212, 184, 150,0.025)]',
                        isDimmed && 'opacity-40'
                      )}
                      style={{
                        gridTemplateColumns: '40px minmax(180px, 250px) 1fr auto',
                        minHeight: 64,
                        transition: 'opacity 0.25s ease, border-color 0.25s ease, background 0.25s ease',
                      }}
                    >
                      {/* Rank */}
                      <span
                        className={cn(
                          'font-mono text-[0.85rem] tracking-wider',
                          isLeader ? 'text-gold' : 'text-muted-foreground/60'
                        )}
                      >
                        #{rank + 1}
                      </span>

                      {/* Tool info */}
                      <div className="flex items-center gap-3 min-w-0">
                        <ToolLogo tool={tool} name={tool.name} size={36} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-foreground font-medium text-[0.95rem] truncate">
                              {tool.name}
                            </span>
                            {isLeader && (
                              <span className="text-[0.62rem] uppercase tracking-[0.15em] text-gold font-medium px-1.5 py-0.5 bg-[rgba(212, 184, 150,0.1)] border border-[rgba(212, 184, 150,0.25)] rounded-full whitespace-nowrap">
                                Leader
                              </span>
                            )}
                          </div>
                          <span className="hidden md:block text-[0.78rem] text-muted-foreground/70 truncate">
                            {tool.tagline}
                          </span>
                        </div>
                      </div>

                      {/* Animated horizontal bar — STRETCHES to fill */}
                      <div className="flex flex-col gap-1 min-w-0">
                        <div className="relative h-2.5 bg-black/[0.04] rounded-full overflow-hidden">
                          {/* Tick marks */}
                          {[1, 2, 3, 4].map((tick) => (
                            <span
                              key={tick}
                              className="absolute top-0 bottom-0 w-px bg-black/[0.05]"
                              style={{ left: `${(tick / MAX_SCORE) * 100}%` }}
                            />
                          ))}
                          {/* Animated fill */}
                          <motion.div
                            className={cn(
                              'absolute left-0 top-0 h-full rounded-full',
                              isLeader
                                ? 'bg-gradient-to-r from-gold via-amber to-gold-deep shadow-[0_0_18px_rgba(212, 184, 150,0.4)]'
                                : 'bg-gradient-to-r from-white/35 to-white/15'
                            )}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{
                              duration: 0.9,
                              ease: [0.16, 1, 0.3, 1],
                              delay: rank * 0.06,
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-[0.62rem] text-muted-foreground/40 font-mono">
                          <span>0</span>
                          <span>1</span>
                          <span>2</span>
                          <span>3</span>
                          <span>4</span>
                          <span>5</span>
                        </div>
                      </div>

                      {/* Score */}
                      <motion.div
                        key={`${tool.id}-${activeDim}`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: rank * 0.06 + 0.4 }}
                        className={cn(
                          'font-mono text-right pl-2',
                          isLeader ? 'text-gold' : 'text-foreground/80'
                        )}
                      >
                        <span className="text-[1.4rem] font-medium leading-none">
                          {score.toFixed(1)}
                        </span>
                        <span className="text-[0.7rem] text-muted-foreground/60">/5</span>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
        )}
      </div>

      <p className="text-[0.78rem] text-muted-foreground/60 mt-6 text-center leading-relaxed">
        Cochez les outils, choisissez un critère, le classement se réorganise en direct.
      </p>
    </div>
  );
}
