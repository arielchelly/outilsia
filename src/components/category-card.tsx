'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { CategoryIcon } from '@/components/category-icon';
import type { CategorySlug } from '@/lib/types';

interface Props {
  slug: CategorySlug;
  label: string;
  description?: string;
  toolCount: number;
  isFeature?: boolean;
  className?: string;
}

/**
 * Premium category card inspired by Eldora UI's animated card —
 * cursor-following gold spotlight + slight scale + arrow reveal on hover.
 */
export function CategoryCard({ slug, label, description, toolCount, isFeature, className }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [mouse, setMouse] = useState<{ x: number | null; y: number | null }>({ x: null, y: null });

  function onMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }
  function onLeave() {
    setMouse({ x: null, y: null });
  }

  const visible = mouse.x !== null && mouse.y !== null;
  const circleSize = isFeature ? 380 : 280;

  return (
    <Link
      ref={ref}
      href={`/pages/${slug}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn(
        'group relative overflow-hidden rounded-3xl border border-white/[0.06] transition-colors duration-500 block',
        'hover:border-[rgba(212, 184, 150,0.3)]',
        'bg-white/[0.015]',
        isFeature ? 'min-h-[280px] p-8' : 'min-h-[180px] p-6',
        'flex flex-col justify-between h-full',
        className
      )}
    >
      {/* Cursor-following gold spotlight (masked circle) */}
      <div
        className={cn(
          'pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-500',
          visible ? 'opacity-100 group-hover:scale-[1.6]' : 'opacity-0'
        )}
        style={{
          width: circleSize,
          height: circleSize,
          left: mouse.x ?? 0,
          top: mouse.y ?? 0,
          background:
            'radial-gradient(circle at center, rgba(212, 184, 150,0.18) 0%, rgba(212, 184, 150,0.04) 40%, rgba(212, 184, 150,0) 70%)',
          maskImage: `radial-gradient(${circleSize / 2}px circle at center, white, transparent)`,
        }}
      />

      {/* Inner backdrop for depth */}
      <div className="pointer-events-none absolute inset-px rounded-[calc(1.5rem-1px)] bg-void/60" />

      {/* Featured badge */}
      {isFeature && (
        <span className="absolute top-4 right-4 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 bg-[rgba(212, 184, 150,0.12)] border border-[rgba(212, 184, 150,0.3)] text-gold rounded-full text-[0.65rem] uppercase tracking-[0.12em] font-medium">
          <span className="w-1 h-1 rounded-full bg-gold" />
          Populaire
        </span>
      )}

      {/* Content */}
      <div className="relative z-[2]">
        <span className="inline-flex items-center justify-center w-11 h-11 mb-4 text-gold">
          <CategoryIcon slug={slug} className="w-7 h-7" />
        </span>
        <h3
          className={cn(
            'font-display font-normal text-foreground tracking-tight leading-tight',
            isFeature ? 'text-[2rem]' : 'text-[1.6rem]'
          )}
        >
          {label}
        </h3>
        {isFeature && description && (
          <p className="mt-2 text-[0.95rem] text-muted-foreground/80 max-w-md">{description}</p>
        )}
      </div>

      <div className="relative z-[2] flex items-center justify-between mt-6 text-[0.85rem] text-muted-foreground/80">
        <span>
          {toolCount} <span className="text-muted-foreground/60">outils comparés</span>
        </span>
        <span className="inline-flex items-center text-gold opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
          <span className="text-[0.78rem] mr-2 uppercase tracking-[0.12em]">Voir</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
