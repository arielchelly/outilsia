import type { Tool } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Stars } from '@/components/ui/stars';
import { ToolLogo } from '@/components/tool-logo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const badgeVariantMap: Record<string, 'gold' | 'electric' | 'new' | 'free' | 'soft'> = {
  gold: 'gold', electric: 'electric', new: 'new', free: 'free',
};

export function TopToolCard({ tool, rank, isFirst }: { tool: Tool; rank: number; isFirst?: boolean }) {
  return (
    <article
      className={cn(
        'relative rounded-3xl p-8 grid items-center gap-8 overflow-hidden border transition-all duration-500',
        'grid-cols-1 lg:grid-cols-[auto_1fr_auto]',
        isFirst
          ? 'pt-16 lg:pt-8 border-gold/25 bg-gradient-to-br from-white via-elevated/40 to-surface shadow-[0_24px_72px_-24px_rgba(202,138,4,0.22),0_4px_12px_rgba(12,10,9,0.04)] hover:border-gold/40'
          : 'bg-white/70 backdrop-blur-md border-black/[0.06] hover:border-gold/25 hover:shadow-[0_18px_48px_-18px_rgba(202,138,4,0.18)]'
      )}
    >
      {/* Magazine numeral — huge italic gold gradient digits */}
      <span className="magazine-numeral absolute -top-6 -right-2 lg:-right-4" aria-hidden="true">
        {String(rank).padStart(2, '0')}
      </span>
      {/* Gold ribbon for #1 */}
      {isFirst && (
        <span className="absolute top-6 left-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold text-white text-[0.62rem] font-medium uppercase tracking-[0.18em] shadow-[0_4px_12px_rgba(202,138,4,0.3)]">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3" aria-hidden="true">
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6L12 2z" />
          </svg>
          Choix de la rédaction
        </span>
      )}

      <div className="flex items-center gap-6 relative">
        <ToolLogo tool={tool} name={tool.name} size={64} />
        <div>
          <h3 className="font-display font-normal text-[1.8rem] text-foreground mb-1 flex items-center gap-3 flex-wrap">
            {tool.name}
            {tool.badge_text && (
              <Badge variant={badgeVariantMap[tool.badge_type] || 'soft'}>{tool.badge_text}</Badge>
            )}
          </h3>
          <p className="text-muted-foreground text-[0.95rem] max-w-[380px] leading-[1.5]">{tool.tagline}</p>
        </div>
      </div>

      <ul className="hidden lg:flex flex-col gap-2 relative">
        {tool.pros.slice(0, 3).map((p, i) => (
          <li key={i} className="flex items-start gap-2 text-[0.88rem] text-muted-foreground max-w-[280px]">
            <span className="text-electric font-bold flex-shrink-0">✓</span>
            {p}
          </li>
        ))}
      </ul>

      <div className="relative flex flex-col gap-2 items-start lg:items-end">
        <div className="flex items-center gap-2">
          <Stars score={tool.scores.overall} />
          <span className="font-mono text-foreground text-[0.95rem]">{tool.scores.overall.toFixed(1)} / 5</span>
        </div>
        <a
          href={tool.affiliate_link}
          rel="sponsored noopener"
          target="_blank"
          data-track-affiliate=""
          data-tool-id={tool.id}
          data-tool-name={tool.name}
        >
          <Button variant="affiliate">
            Essayer {tool.name}
            <span className="arrow">→</span>
          </Button>
        </a>
      </div>
    </article>
  );
}
