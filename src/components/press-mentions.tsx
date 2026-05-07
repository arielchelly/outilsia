import { Reveal } from '@/components/ui/reveal';

const PRESS = [
  { name: 'Le Monde', initials: 'LM' },
  { name: 'Numerama', initials: 'NU' },
  { name: 'Frenchweb', initials: 'FW' },
  { name: 'Les Échos', initials: 'LE' },
  { name: 'BFM Tech', initials: 'BFM' },
  { name: 'Maddyness', initials: 'MA' },
];

export function PressMentions() {
  return (
    <section className="py-16 relative">
      <div className="container">
        <Reveal>
          <div className="flex flex-col items-center gap-8">
            <div className="flex items-center gap-4 text-[0.7rem] uppercase tracking-[0.28em] text-muted-foreground/60">
              <span className="w-12 h-px bg-gradient-to-r from-transparent to-muted-foreground/30" />
              <span>Cités dans la presse française</span>
              <span className="w-12 h-px bg-gradient-to-l from-transparent to-muted-foreground/30" />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 lg:gap-x-16">
              {PRESS.map((p) => (
                <div
                  key={p.name}
                  className="group flex items-center gap-3 transition-all duration-300 grayscale opacity-50 hover:grayscale-0 hover:opacity-100"
                >
                  <div className="w-10 h-10 rounded-lg bg-foreground/[0.04] border border-black/[0.08] flex items-center justify-center text-foreground/70 font-display font-medium text-[0.78rem] tracking-tight group-hover:border-gold/30 group-hover:text-gold transition-colors">
                    {p.initials}
                  </div>
                  <span className="font-display text-foreground/70 text-[1rem] group-hover:text-foreground transition-colors">
                    {p.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
