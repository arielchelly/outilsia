'use client';

import { useMemo, useState } from 'react';
import type { Tool } from '@/lib/types';
import { cn } from '@/lib/utils';

interface Props {
  tools: Tool[];
  /** How many tools to overlay on the radar (default 5). */
  limit?: number;
  className?: string;
}

const DIMENSIONS: { key: keyof Tool['scores']; label: string }[] = [
  { key: 'quality_output', label: 'Qualité' },
  { key: 'ease_of_use', label: 'Facilité' },
  { key: 'value_for_money', label: 'Prix' },
  { key: 'french_support', label: 'Français' },
  { key: 'api_quality', label: 'API' },
  { key: 'reliability', label: 'Fiabilité' },
  { key: 'overall', label: 'Global' },
];

const COLORS = ['#E8C878', '#5EEAB6', '#9BC4FF', '#FF6B6B', '#F0A848'];

const CHART_SIZE = 420;
const PADDING = 80;
const CENTER = CHART_SIZE / 2;
const RADIUS = (CHART_SIZE - PADDING * 2) / 2;
const RINGS = 5; // 0, 1, 2, 3, 4, 5
const ANGLE_STEP = (Math.PI * 2) / DIMENSIONS.length;
const ANGLE_OFFSET = -Math.PI / 2; // start at top

function polar(angleIndex: number, value: number): [number, number] {
  // value 0..5 → 0..1 → multiply by RADIUS
  const r = (value / 5) * RADIUS;
  const a = ANGLE_OFFSET + angleIndex * ANGLE_STEP;
  return [CENTER + r * Math.cos(a), CENTER + r * Math.sin(a)];
}

function buildPolygonPoints(scores: Tool['scores']): string {
  return DIMENSIONS.map((d, i) => {
    const [x, y] = polar(i, scores[d.key]);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
}

export function ComparisonChart({ tools, limit = 5, className }: Props) {
  const subset = useMemo(
    () =>
      tools
        .slice()
        .sort((a, b) => (a.rank_in_category || 99) - (b.rank_in_category || 99))
        .slice(0, limit),
    [tools, limit]
  );

  // null = highlight none (all visible). Otherwise, highlight one
  const [hovered, setHovered] = useState<string | null>(null);

  const ringRadii = Array.from({ length: RINGS }, (_, i) => ((i + 1) / RINGS) * RADIUS);

  return (
    <div className={cn('w-full', className)}>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 items-center">
        {/* The chart */}
        <div className="relative w-full max-w-[440px] mx-auto">
          <svg
            viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}
            className="w-full h-auto"
            role="img"
            aria-label="Graphique radar comparatif"
          >
            {/* Ring grids */}
            {ringRadii.map((r, i) => (
              <polygon
                key={i}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={1}
                points={DIMENSIONS.map((_, idx) => {
                  const a = ANGLE_OFFSET + idx * ANGLE_STEP;
                  return `${(CENTER + r * Math.cos(a)).toFixed(1)},${(CENTER + r * Math.sin(a)).toFixed(1)}`;
                }).join(' ')}
              />
            ))}

            {/* Radial axes */}
            {DIMENSIONS.map((_, i) => {
              const [x, y] = polar(i, 5);
              return (
                <line
                  key={i}
                  x1={CENTER}
                  y1={CENTER}
                  x2={x}
                  y2={y}
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth={1}
                />
              );
            })}

            {/* Tool polygons */}
            {subset.map((tool, idx) => {
              const isDimmed = hovered !== null && hovered !== tool.id;
              const isHighlighted = hovered === tool.id;
              const color = COLORS[idx % COLORS.length];
              return (
                <g
                  key={tool.id}
                  style={{
                    opacity: isDimmed ? 0.12 : 1,
                    transition: 'opacity 0.25s ease',
                  }}
                >
                  <polygon
                    points={buildPolygonPoints(tool.scores)}
                    fill={color}
                    fillOpacity={isHighlighted ? 0.25 : 0.12}
                    stroke={color}
                    strokeWidth={isHighlighted ? 2.5 : 1.5}
                    strokeLinejoin="round"
                    style={{ transition: 'fill-opacity 0.25s ease, stroke-width 0.25s ease' }}
                  />
                  {/* Vertices dots */}
                  {DIMENSIONS.map((d, i) => {
                    const [x, y] = polar(i, tool.scores[d.key]);
                    return (
                      <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r={isHighlighted ? 3.5 : 2.5}
                        fill={color}
                        style={{ transition: 'r 0.25s ease' }}
                      />
                    );
                  })}
                </g>
              );
            })}

            {/* Axis labels */}
            {DIMENSIONS.map((d, i) => {
              const [x, y] = polar(i, 5);
              const dx = x - CENTER;
              const dy = y - CENTER;
              const norm = Math.hypot(dx, dy) || 1;
              const lx = CENTER + (dx / norm) * (RADIUS + 26);
              const ly = CENTER + (dy / norm) * (RADIUS + 26);
              const anchor = Math.abs(dx) < 6 ? 'middle' : dx > 0 ? 'start' : 'end';
              return (
                <text
                  key={d.key}
                  x={lx}
                  y={ly}
                  fontSize={11}
                  fontWeight={500}
                  letterSpacing="0.08em"
                  textAnchor={anchor}
                  dominantBaseline="middle"
                  fill="rgba(240,244,255,0.7)"
                  style={{
                    fontFamily: 'var(--font-body)',
                    textTransform: 'uppercase',
                  }}
                >
                  {d.label}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Legend / stats */}
        <div className="flex flex-col gap-3 lg:min-w-[280px]">
          <p className="text-[0.72rem] uppercase tracking-[0.2em] text-muted-foreground/70 mb-2">
            Top {subset.length} comparés
          </p>
          {subset.map((tool, idx) => {
            const color = COLORS[idx % COLORS.length];
            const isActive = hovered === tool.id;
            const isOther = hovered !== null && !isActive;
            return (
              <button
                key={tool.id}
                onMouseEnter={() => setHovered(tool.id)}
                onMouseLeave={() => setHovered(null)}
                className={cn(
                  'group relative flex items-center gap-4 px-4 py-3 rounded-xl border text-left transition-all',
                  'border-white/[0.06] bg-white/[0.015]',
                  'hover:border-white/15 hover:bg-white/[0.04]',
                  isActive && 'border-white/15 bg-white/[0.04]',
                  isOther && 'opacity-40'
                )}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: color, boxShadow: `0 0 12px ${color}55` }}
                />
                <span className="flex-1 min-w-0">
                  <span className="block text-[0.95rem] text-foreground font-medium truncate">
                    {tool.name}
                  </span>
                  <span className="block text-[0.78rem] text-muted-foreground/70 truncate">
                    {tool.tagline}
                  </span>
                </span>
                <span className="font-mono text-[0.85rem] text-foreground/80 flex-shrink-0">
                  {tool.scores.overall.toFixed(1)}
                </span>
              </button>
            );
          })}
          <p className="text-[0.72rem] text-muted-foreground/60 mt-2 leading-relaxed">
            Survolez un outil pour le mettre en avant. Les notes vont de 0 à 5 sur 7 critères.
          </p>
        </div>
      </div>
    </div>
  );
}
