'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { Tool } from '@/lib/types';

interface ToolLogoProps {
  /** Direct URL — kept for backward compat. If passed, used as the first
   *  candidate before the auto cascade. */
  src?: string;
  /** Pass the full Tool to enable the auto cascade based on its id + website. */
  tool?: Pick<Tool, 'id' | 'name' | 'website' | 'logo'>;
  name: string;
  size?: number;
  className?: string;
}

function deriveDomain(websiteOrUrl?: string): string | undefined {
  if (!websiteOrUrl) return undefined;
  try {
    return new URL(websiteOrUrl).hostname.replace(/^www\./, '');
  } catch {
    return undefined;
  }
}

/**
 * Logo with a 3-tier fallback cascade:
 *   1. /logos/{tool.id}.svg                       (self-hosted, optional)
 *   2. https://www.google.com/s2/favicons?...     (always reachable via Google)
 *   3. Coloured initial of the tool name          (final fallback, never broken)
 *
 * The unavatar.io URLs in tools.json (which often 404 and triggered Semrush's
 * "broken external image" warnings) are intentionally NOT used here anymore.
 */
export function ToolLogo({ src, tool, name, size = 48, className }: ToolLogoProps) {
  const candidates = useMemo(() => {
    const list: string[] = [];
    if (tool?.id) list.push(`/logos/${tool.id}.svg`);
    const domain = deriveDomain(tool?.website);
    if (domain) list.push(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
    // Legacy `src` prop is appended last so it doesn't shadow the cascade,
    // but still acts as a final URL attempt before the initial fallback.
    if (src && !candidates_includes(list, src)) list.push(src);
    return list;
  }, [tool?.id, tool?.website, src]);

  const [idx, setIdx] = useState(0);

  if (idx >= candidates.length || candidates.length === 0) {
    return (
      <span
        className={cn(
          'inline-flex items-center justify-center bg-overlay border border-white/10 rounded-md text-gold font-display select-none',
          className
        )}
        style={{ width: size, height: size, fontSize: size * 0.5 }}
        aria-label={`Logo ${name}`}
      >
        {name.charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center bg-overlay border border-white/10 rounded-md overflow-hidden',
        className
      )}
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={candidates[idx]}
        alt={`Logo ${name}`}
        loading="lazy"
        decoding="async"
        width={size}
        height={size}
        className="w-full h-full object-cover"
        onError={() => setIdx((i) => i + 1)}
      />
    </span>
  );
}

// tiny inline helper to avoid pulling lodash for a single dedupe check
function candidates_includes(arr: string[], v: string) {
  return arr.indexOf(v) !== -1;
}
