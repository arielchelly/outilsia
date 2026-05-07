import { Stars } from '@/components/ui/stars';
import { toolsMeta } from '@/lib/data';

const TRUST_METRICS = [
  { value: '4.8', suffix: '/5', label: 'Note moyenne lecteurs' },
  { value: '+30 j', suffix: '', label: 'Test minimum par outil' },
  { value: '0', suffix: ' €', label: 'Sponsoring accepté' },
];

export function TrustBar() {
  return (
    <section
      aria-label="Indicateurs de confiance"
      className="py-10 border-y border-black/[0.05] bg-surface/40"
    >
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-16 items-center">
          {/* Editorial pledge */}
          <div className="flex items-start gap-5">
            <div className="hidden sm:flex w-12 h-12 rounded-full bg-gold/8 border border-gold/20 items-center justify-center flex-shrink-0">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="w-5 h-5 text-gold"
                aria-hidden="true"
              >
                <path d="M12 2L4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
            </div>
            <div>
              <span className="eyebrow block mb-2">Charte éditoriale</span>
              <p className="font-display italic text-[clamp(1.05rem,1.6vw,1.4rem)] leading-[1.4] text-foreground/85 text-balance max-w-2xl">
                « Aucune marque ne peut acheter une bonne note. Notre crédibilité long-terme dépend
                de notre honnêteté — point. »
              </p>
              <p className="mt-2 text-[0.78rem] text-muted-foreground/70 uppercase tracking-[0.18em]">
                — La rédaction TopOutils.IA
              </p>
            </div>
          </div>

          {/* Aggregate stats */}
          <div className="grid grid-cols-3 gap-3 lg:gap-2">
            <Metric
              value={toolsMeta.total.toString()}
              label="Outils testés"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4" aria-hidden="true">
                  <path d="M12 2v4M12 18v4M4 12H2M22 12h-2M5.6 5.6L4.2 4.2M19.8 19.8l-1.4-1.4M5.6 18.4l-1.4 1.4M19.8 4.2l-1.4 1.4M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              }
            />
            <Metric
              value="4.8"
              suffix="/5"
              label="Note lecteurs"
              icon={
                <Stars score={4.8} className="!text-gold scale-90" />
              }
            />
            <Metric
              value="100%"
              label="Indépendant"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({
  value,
  suffix,
  label,
  icon,
}: {
  value: string;
  suffix?: string;
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="text-center lg:text-left lg:px-4 lg:border-l lg:border-black/[0.06] first:lg:border-l-0">
      <div className="flex items-center justify-center lg:justify-start gap-1.5 mb-1 text-gold">
        {icon}
      </div>
      <div className="font-display font-normal text-foreground text-[1.6rem] sm:text-[1.9rem] leading-none tracking-tight">
        {value}
        {suffix && <span className="text-[1.05rem] text-muted-foreground/70 ml-0.5">{suffix}</span>}
      </div>
      <div className="label mt-1.5 !text-[0.62rem]">{label}</div>
    </div>
  );
}
