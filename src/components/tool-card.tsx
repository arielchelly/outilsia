import type { Tool } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Stars } from '@/components/ui/stars';
import { ToolLogo } from '@/components/tool-logo';
import { Button } from '@/components/ui/button';
import { priceLabel } from '@/lib/utils';
import { cn } from '@/lib/utils';

const badgeVariantMap: Record<string, 'gold' | 'electric' | 'new' | 'free' | 'soft'> = {
  gold: 'gold',
  electric: 'electric',
  new: 'new',
  free: 'free',
};

interface Props {
  tool: Tool;
  index: number;
}

export function ToolCard({ tool, index }: Props) {
  const f = tool.features;
  const featureBadges = [
    f.api_available && 'API',
    f.commercial_use && 'Usage commercial',
    f.french_interface && 'Interface FR',
    f.mobile_app && 'App mobile',
    f.team_collab && 'Équipe',
  ].filter(Boolean);

  const priceVariant: 'free' | 'freemium' | 'paid' =
    tool.pricing.model === 'gratuit' ? 'free' : tool.pricing.model === 'freemium' ? 'freemium' : 'paid';

  return (
    <article
      id={tool.slug}
      className={cn(
        'bg-surface border rounded-2xl p-8 mb-6 scroll-mt-24 transition-colors',
        tool.is_recommended ? 'border-[rgba(212, 184, 150,0.3)] shadow-[0_0_50px_rgba(212, 184, 150,0.05)]' : 'border-white/[0.06] hover:border-white/[0.12]'
      )}
    >
      <div className="flex items-start gap-6 pb-6 border-b border-white/[0.06] flex-wrap">
        <ToolLogo tool={tool} name={tool.name} size={56} />
        <div className="flex-1 min-w-[200px]">
          <h2 className="font-display font-normal text-[1.8rem] text-foreground mb-1 flex items-center gap-3 flex-wrap">
            #{index + 1} — {tool.name}
            {tool.badge_text && (
              <Badge variant={badgeVariantMap[tool.badge_type] || 'soft'}>{tool.badge_text}</Badge>
            )}
          </h2>
          <p className="font-display italic text-[1.05rem] text-muted-foreground">{tool.tagline}</p>
          <div className="flex items-center gap-4 flex-wrap mt-2">
            <Stars score={tool.scores.overall} />
            <span className="font-mono text-foreground">{tool.scores.overall.toFixed(1)} / 5</span>
            <Badge variant={priceVariant}>
              {tool.pricing.model === 'gratuit' ? 'Gratuit' : tool.pricing.model === 'freemium' ? 'Freemium' : 'Payant'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="pt-6 flex flex-col gap-6">
        <p className="text-[1rem] leading-[1.75] text-muted-foreground">
          {tool.description_long || tool.description_short}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-void rounded-md border border-white/[0.06]">
          <Meta label="Prix d'entrée" value={priceLabel(tool)} />
          <Meta
            label="Essai gratuit"
            value={tool.pricing.has_free_trial ? `✓ ${tool.pricing.free_trial_days || 'oui'}${tool.pricing.free_trial_days ? ' jours' : ''}` : '✕ Non'}
          />
          <Meta
            label="Commission"
            value={`${tool.commission_rate || '—'}${tool.commission_type === 'recurring' ? ' récurrent' : ''}`}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ul className="flex flex-col gap-2">
            {tool.pros.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-[0.92rem] text-muted-foreground leading-[1.5]">
                <span className="text-electric font-bold flex-shrink-0">✓</span>
                {p}
              </li>
            ))}
          </ul>
          <ul className="flex flex-col gap-2">
            {tool.cons.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-[0.92rem] text-muted-foreground leading-[1.5]">
                <span className="text-coral font-bold flex-shrink-0">✕</span>
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <span className="label block mb-2">Plans tarifaires</span>
          {tool.pricing.plans.map((p, i) => (
            <div
              key={i}
              className="py-2 border-b border-white/[0.06] flex justify-between gap-4 last:border-b-0 text-[0.9rem]"
            >
              <span>
                <strong className="text-foreground">{p.name}</strong>
                {p.detail && <span className="text-muted-foreground/60 ml-2">{p.detail}</span>}
              </span>
              <span className="text-gold whitespace-nowrap">
                {p.price_eur === 0 ? 'Gratuit' : `${p.price_eur}€`}
                <span className="text-muted-foreground/60 text-[0.85em]">/{p.period}</span>
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="label">Pour qui :</span>
          {tool.best_for.map((b, i) => (
            <Badge key={i} variant="soft">
              {b}
            </Badge>
          ))}
        </div>

        {featureBadges.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="label">Caractéristiques :</span>
            {featureBadges.map((b, i) => (
              <Badge key={i} variant="soft">
                {b as string}
              </Badge>
            ))}
          </div>
        )}

        <a
          href={tool.affiliate_link}
          rel="sponsored noopener"
          target="_blank"
          data-track-affiliate=""
          data-tool-id={tool.id}
          data-tool-name={tool.name}
          data-category={tool.category}
          data-position="category-card"
        >
          <Button variant="affiliate" size="block">
            Essayer {tool.name} gratuitement
            <span className="arrow">→</span>
          </Button>
        </a>
      </div>
    </article>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="label block mb-1">{label}</span>
      <span className="text-foreground font-medium text-[0.95rem]">{value}</span>
    </div>
  );
}
