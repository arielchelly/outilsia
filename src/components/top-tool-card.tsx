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
        'relative rounded-2xl p-8 grid items-center gap-8 overflow-hidden border transition-all',
        'grid-cols-1 lg:grid-cols-[auto_1fr_auto]',
        isFirst
          ? 'border-[rgba(232,200,120,0.3)] bg-gradient-to-br from-elevated to-surface shadow-[0_0_60px_rgba(232,200,120,0.08)]'
          : 'bg-surface border-white/[0.06] hover:border-white/[0.12] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
      )}
    >
      <span
        className="absolute font-display font-normal leading-none text-[11rem] text-muted-foreground/10 -top-6 -left-4 pointer-events-none select-none"
        aria-hidden="true"
      >
        {String(rank).padStart(2, '0')}
      </span>

      <div className="flex items-center gap-6 relative">
        <ToolLogo src={tool.logo} name={tool.name} size={64} />
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
