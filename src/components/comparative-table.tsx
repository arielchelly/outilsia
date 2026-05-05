'use client';

import { useMemo, useState } from 'react';
import type { Tool, CategorySlug } from '@/lib/types';
import { ToolLogo } from '@/components/tool-logo';
import { Button } from '@/components/ui/button';
import { priceLabel } from '@/lib/utils';
import { cn } from '@/lib/utils';

type SortKey = 'rank' | 'name' | 'overall' | 'price' | 'commission';

interface Props {
  tools: Tool[];
  category: CategorySlug;
}

export function ComparativeTable({ tools, category: _category }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('rank');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState('');
  const [filterFree, setFilterFree] = useState(false);
  const [filterApi, setFilterApi] = useState(false);

  const sorted = useMemo(() => {
    let arr = tools.slice();
    if (search) {
      const t = search.toLowerCase();
      arr = arr.filter((x) => x.name.toLowerCase().includes(t) || x.tagline.toLowerCase().includes(t));
    }
    if (filterFree) arr = arr.filter((x) => x.pricing.model === 'gratuit' || x.pricing.model === 'freemium');
    if (filterApi) arr = arr.filter((x) => x.features.api_available);
    arr.sort((a, b) => {
      let av: number | string = 0,
        bv: number | string = 0;
      switch (sortKey) {
        case 'name':
          av = a.name.toLowerCase();
          bv = b.name.toLowerCase();
          break;
        case 'overall':
          av = a.scores.overall;
          bv = b.scores.overall;
          break;
        case 'price':
          av = a.pricing.plans[0]?.price_eur ?? 0;
          bv = b.pricing.plans[0]?.price_eur ?? 0;
          break;
        case 'commission':
          av = parseFloat(String(a.commission_rate || '0').replace('%', '')) || 0;
          bv = parseFloat(String(b.commission_rate || '0').replace('%', '')) || 0;
          break;
        default:
          av = a.rank_in_category;
          bv = b.rank_in_category;
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }, [tools, sortKey, sortDir, search, filterFree, filterApi]);

  function toggleSort(k: SortKey) {
    if (sortKey === k) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else {
      setSortKey(k);
      setSortDir('asc');
    }
  }

  function ind(k: SortKey) {
    return sortKey === k ? (sortDir === 'asc' ? '↑' : '↓') : '↕';
  }

  return (
    <div className="bg-surface border border-white/[0.06] rounded-2xl overflow-hidden">
      <div className="flex items-center gap-4 p-4 border-b border-white/[0.06] bg-elevated flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="search"
            placeholder="Rechercher un outil…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-void border border-white/15 rounded-md pl-9 pr-3 py-2 text-foreground text-[0.88rem] focus:outline-none focus:border-gold"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <FilterChip active={filterFree} onClick={() => setFilterFree(!filterFree)}>
            Gratuit / Freemium
          </FilterChip>
          <FilterChip active={filterApi} onClick={() => setFilterApi(!filterApi)}>
            Avec API
          </FilterChip>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[0.9rem]">
          <thead>
            <tr>
              <Th onClick={() => toggleSort('name')} active={sortKey === 'name'} ind={ind('name')}>
                Outil
              </Th>
              <Th onClick={() => toggleSort('overall')} active={sortKey === 'overall'} ind={ind('overall')}>
                Note
              </Th>
              <Th onClick={() => toggleSort('price')} active={sortKey === 'price'} ind={ind('price')}>
                Prix
              </Th>
              <Th>Gratuit</Th>
              <Th>API</Th>
              <Th onClick={() => toggleSort('commission')} active={sortKey === 'commission'} ind={ind('commission')}>
                Com.
              </Th>
              <Th />
            </tr>
          </thead>
          <tbody>
            {sorted.map((tool) => (
              <tr
                key={tool.id}
                className={cn(
                  'border-t border-white/[0.06] hover:bg-elevated/60 transition',
                  tool.is_recommended && 'relative'
                )}
              >
                <td className={cn('p-4', tool.is_recommended && 'pl-6 relative')}>
                  {tool.is_recommended && (
                    <span className="absolute left-0 top-3 bottom-3 w-1 bg-gold" aria-hidden="true" />
                  )}
                  <span className="flex items-center gap-3">
                    <ToolLogo src={tool.logo} name={tool.name} size={32} />
                    <span className="text-foreground font-medium">
                      {tool.is_recommended ? '★ ' : ''}
                      {tool.name}
                    </span>
                  </span>
                </td>
                <td className="p-4 font-mono">{tool.scores.overall.toFixed(1)}</td>
                <td className="p-4 font-mono text-[0.85rem]">{priceLabel(tool)}</td>
                <td className="p-4">
                  {tool.pricing.model === 'gratuit' || tool.pricing.model === 'freemium' ? (
                    <span className="text-electric text-base">✓</span>
                  ) : (
                    <span className="text-muted-foreground/40 text-base">✕</span>
                  )}
                </td>
                <td className="p-4">
                  {tool.features.api_available ? (
                    <span className="text-electric text-base">✓</span>
                  ) : (
                    <span className="text-muted-foreground/40 text-base">✕</span>
                  )}
                </td>
                <td className="p-4 text-gold font-medium">{tool.commission_rate || '—'}</td>
                <td className="p-4">
                  <a
                    href={tool.affiliate_link}
                    rel="sponsored noopener"
                    target="_blank"
                    data-track-affiliate=""
                    data-tool-id={tool.id}
                    data-tool-name={tool.name}
                  >
                    <Button variant="affiliate" size="sm">
                      Essayer
                    </Button>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({
  children,
  onClick,
  active,
  ind,
}: {
  children?: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  ind?: string;
}) {
  return (
    <th
      onClick={onClick}
      className={cn(
        'bg-elevated p-4 text-left text-[0.75rem] uppercase tracking-[0.12em] font-medium text-muted-foreground select-none',
        onClick && 'cursor-pointer hover:text-gold',
        active && 'text-gold'
      )}
    >
      <span className="inline-flex items-center gap-1.5">
        {children}
        {onClick && ind && <span className="text-[0.7rem] opacity-70">{ind}</span>}
      </span>
    </th>
  );
}

function FilterChip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-3.5 py-1.5 border rounded-full text-[0.78rem] transition',
        active
          ? 'bg-[rgba(216, 139, 106,0.15)] text-gold border-[rgba(216, 139, 106,0.3)]'
          : 'border-white/15 text-muted-foreground hover:border-gold hover:text-gold'
      )}
    >
      {children}
    </button>
  );
}
