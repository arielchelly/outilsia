'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import type { Tool } from '@/lib/types';
import { ToolLogo } from '@/components/tool-logo';
import { cn } from '@/lib/utils';

// Recharts is client-only — load dynamically with no SSR.
const Chart = dynamic(() => import('./ComparateurGraphiqueChart'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] flex items-center justify-center text-muted-foreground/60 text-sm">
      Chargement du graphique…
    </div>
  ),
});

interface Props {
  tools: Tool[];
}

// Apple-clean chart palette — restrained mono with one sand accent.
// Distinct shades of cool gray + warm sand for the top-ranked tool.
const COLORS = [
  '#D4B896', // sand — top tool only
  '#FFFFFF', // pure white
  '#C7C7CC', // light gray
  '#A0A0A6', // mid-light gray
  '#86868B', // Apple system gray
  '#6E6E73', // mid-dark gray
  '#E5CFAE', // bright sand
  '#5A5A60', // dark gray
  '#48484E', // deeper gray
  '#A89570', // deep sand
  '#3A3A3F', // near-charcoal
  '#B5B5BA', // soft gray
];

// Six dimensions on the X axis — all in the 0..5 score scale for visual coherence.
const DIMENSIONS: { key: keyof Tool['scores']; label: string }[] = [
  { key: 'overall', label: 'Note globale' },
  { key: 'quality_output', label: 'Qualité' },
  { key: 'ease_of_use', label: 'Facilité' },
  { key: 'value_for_money', label: 'Prix' },
  { key: 'french_support', label: 'Français' },
  { key: 'reliability', label: 'Fiabilité' },
];

export function ComparateurGraphique({ tools }: Props) {
  // Sort by rank for a consistent color assignment
  const sortedTools = useMemo(
    () => [...tools].sort((a, b) => (a.rank_in_category || 99) - (b.rank_in_category || 99)),
    [tools]
  );

  // Stable color per tool (based on rank position).
  const colorMap = useMemo(() => {
    const map = new Map<string, string>();
    sortedTools.forEach((t, i) => map.set(t.id, COLORS[i % COLORS.length]));
    return map;
  }, [sortedTools]);

  // State
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(sortedTools.slice(0, 5).map((t) => t.id))
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

  const selectedTools = useMemo(
    () => sortedTools.filter((t) => selected.has(t.id)),
    [sortedTools, selected]
  );

  // Build chart-ready tools with the score per dimension label
  const chartTools = useMemo(
    () =>
      selectedTools.map((t) => ({
        id: t.id,
        name: t.name,
        color: colorMap.get(t.id) ?? '#D4B896',
        scores: DIMENSIONS.reduce<Record<string, number>>((acc, d) => {
          acc[d.label] = t.scores[d.key];
          return acc;
        }, {}),
      })),
    [selectedTools, colorMap]
  );

  return (
    <div className="w-full">
      {/* Title */}
      <div className="text-center mb-10 max-w-2xl mx-auto">
        <span className="eyebrow block mb-3">Comparateur visuel</span>
        <h3 className="heading-display text-[clamp(1.8rem,4vw,2.6rem)]">
          Une ligne, un outil, <span className="italic text-gold">tous les critères</span>
        </h3>
        <p className="text-muted-foreground text-[0.95rem] mt-3">
          Cochez les outils, chaque ligne traverse les 6 critères de notation. Survolez une
          ligne ou un point pour les détails.
        </p>
      </div>

      {/* Tool checkboxes */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
          <p className="text-[0.78rem] uppercase tracking-[0.18em] text-muted-foreground/70">
            Outils ({selected.size}/{sortedTools.length})
          </p>
          <div className="flex gap-2 text-[0.72rem]">
            <button
              type="button"
              onClick={selectAll}
              className="px-3 py-1.5 rounded-full border border-black/10 text-muted-foreground hover:text-gold hover:border-[rgba(212, 184, 150,0.3)] transition uppercase tracking-wider"
            >
              Tout cocher
            </button>
            <button
              type="button"
              onClick={selectNone}
              className="px-3 py-1.5 rounded-full border border-black/10 text-muted-foreground hover:text-coral hover:border-coral/30 transition uppercase tracking-wider"
            >
              Tout décocher
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {sortedTools.map((tool) => {
            const isOn = selected.has(tool.id);
            const color = colorMap.get(tool.id) ?? '#D4B896';
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => toggle(tool.id)}
                className={cn(
                  'group inline-flex items-center gap-2.5 pl-2 pr-3.5 py-1.5 rounded-full border transition-all',
                  isOn
                    ? 'bg-black/[0.04] text-foreground'
                    : 'bg-black/[0.015] border-black/[0.06] text-muted-foreground/70 hover:border-black/12 hover:text-foreground'
                )}
                style={
                  isOn ? { borderColor: color + '60', boxShadow: `0 0 0 1px ${color}25` } : undefined
                }
              >
                <span className="relative w-5 h-5 flex items-center justify-center">
                  <span
                    className="absolute inset-0 rounded-full border transition-all"
                    style={{
                      background: isOn ? color : 'transparent',
                      borderColor: isOn ? color : 'rgba(255,255,255,0.20)',
                    }}
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
                <span className="text-[0.85rem] font-medium whitespace-nowrap">{tool.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart */}
      <div
        className="rounded-2xl border border-black/[0.06] p-4 sm:p-6 overflow-x-auto"
        style={{ background: '#0A0A0B' }}
      >
        <div className="min-w-[640px]">
          {chartTools.length === 0 ? (
            <div className="h-[400px] flex items-center justify-center text-muted-foreground/60 italic">
              Cochez au moins un outil pour afficher le graphique.
            </div>
          ) : (
            <Chart tools={chartTools} dimensions={DIMENSIONS.map((d) => d.label)} />
          )}
        </div>
      </div>

      {/* Legend */}
      {selectedTools.length > 0 && (
        <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
          {selectedTools.map((tool) => {
            const color = colorMap.get(tool.id) ?? '#D4B896';
            return (
              <span
                key={tool.id}
                className="inline-flex items-center gap-2 text-[0.85rem] text-muted-foreground/80"
              >
                <span
                  className="inline-block w-6 h-[2px] rounded-full"
                  style={{ background: color, boxShadow: `0 0 8px ${color}55` }}
                />
                {tool.name}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
