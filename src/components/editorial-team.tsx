import { Reveal } from '@/components/ui/reveal';

type Member = {
  initials: string;
  name: string;
  role: string;
  expertise: string;
  testsCount: number;
};

const TEAM: Member[] = [
  {
    initials: 'AM',
    name: 'Antoine Marchand',
    role: 'Rédacteur en chef',
    expertise: 'Chatbots, Code IA',
    testsCount: 24,
  },
  {
    initials: 'CL',
    name: 'Clara Leroy',
    role: 'Lead Tests',
    expertise: 'Image, Vidéo IA',
    testsCount: 19,
  },
  {
    initials: 'BS',
    name: 'Benoît Sauvage',
    role: 'Analyste senior',
    expertise: 'SEO, Automation',
    testsCount: 17,
  },
  {
    initials: 'EF',
    name: 'Elsa Fournier',
    role: 'Freelance contributrice',
    expertise: 'Copywriting, Traduction',
    testsCount: 12,
  },
];

export function EditorialTeam() {
  return (
    <section className="py-24 relative">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 items-center max-w-6xl mx-auto">
          {/* Left: heading */}
          <Reveal>
            <div>
              <span className="eyebrow block mb-3">La rédaction</span>
              <h2 className="heading-display text-[clamp(2rem,4vw,2.8rem)] leading-[1.05] mb-5">
                Quatre paires d'yeux,{' '}
                <span className="italic text-gold">soixante-douze outils</span> testés.
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[1rem] mb-6">
                Chaque comparatif est rédigé puis relu par au moins deux membres de la rédaction.
                Pas de stagiaire IA, pas de contenu généré : du temps humain, des heures
                d'utilisation réelle, des opinions tranchées.
              </p>
              <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full bg-gold/8 border border-gold/20">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4 text-gold" aria-hidden="true">
                  <path d="M12 2L4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
                <span className="text-[0.85rem] text-foreground font-medium">
                  Chartre éditoriale signée par chaque membre
                </span>
              </div>
            </div>
          </Reveal>

          {/* Right: team grid */}
          <Reveal delay={150}>
            <div className="grid grid-cols-2 gap-4">
              {TEAM.map((m, i) => (
                <article
                  key={m.name}
                  className="group relative rounded-2xl bg-white/70 backdrop-blur-md border border-black/[0.06] p-6 transition-all duration-500 hover:border-gold/25 hover:bg-white hover:-translate-y-1 hover:shadow-[0_18px_48px_-18px_rgba(202,138,4,0.18)]"
                >
                  {/* Avatar */}
                  <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-gold via-gold to-gold-deep text-white font-display font-medium text-[1.1rem] flex items-center justify-center mb-4 shadow-[0_8px_20px_-6px_rgba(202,138,4,0.4)]">
                    {m.initials}
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white border border-sage flex items-center justify-center">
                      <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3 text-sage">
                        <path d="M5 8.5L2 5.5l1-1L5 6.5 9 2.5l1 1L5 8.5z" />
                      </svg>
                    </span>
                  </div>
                  <h3 className="font-display text-[1.1rem] text-foreground leading-tight mb-1">
                    {m.name}
                  </h3>
                  <p className="text-[0.8rem] text-gold uppercase tracking-[0.12em] font-medium mb-3">
                    {m.role}
                  </p>
                  <div className="space-y-1.5 text-[0.8rem] text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-gold/60" />
                      <span>{m.expertise}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-gold/60" />
                      <span>
                        <strong className="text-foreground">{m.testsCount}</strong> outils testés
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
