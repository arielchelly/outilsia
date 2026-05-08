import { Reveal } from '@/components/ui/reveal';

const PRINCIPLES = [
  {
    n: '01',
    title: "Tester avant d'écrire",
    body: 'Trente jours minimum d\'utilisation réelle, sur des cas concrets, avant la moindre ligne de comparatif.',
  },
  {
    n: '02',
    title: "Refuser le sponsoring",
    body: "Aucune marque n'achète un classement. Notre crédibilité ne se monnaye pas — point.",
  },
  {
    n: '03',
    title: 'Mettre à jour chaque mois',
    body: "Le marché bouge. Une note datée de plus de trente jours déclenche une alerte interne pour re-tester.",
  },
  {
    n: '04',
    title: "Écrire pour les francophones",
    body: "Pas de traduction maladroite, pas de SEO automatisé. Chaque comparatif est pensé en français, pour des francophones.",
  },
];

export function ManifestoSection() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Soft top + bottom hairline gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent"
      />

      <div className="container">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="eyebrow block mb-4">Manifeste</span>
            <h2 className="heading-display text-[clamp(2.4rem,5vw,4rem)] mb-6 leading-[1.05]">
              Quatre principes,{' '}
              <span className="italic text-gold">aucune exception</span>.
            </h2>
            <p className="text-muted-foreground leading-relaxed text-[1.05rem]">
              C'est ce qui distingue un comparatif tenable d'un blog d'affiliation à la chaîne.
              Nous nous y tenons depuis 2024 — et nous nous y tiendrons.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-14 max-w-5xl mx-auto">
          {PRINCIPLES.map((p, i) => (
            <Reveal key={p.n} delay={i * 100}>
              <div className="relative group">
                {/* Big italic gold numeral */}
                <div className="font-display italic font-light text-[clamp(4rem,7vw,6.5rem)] leading-none text-gold/15 absolute -top-6 -left-2 select-none pointer-events-none transition-colors duration-500 group-hover:text-gold/25">
                  {p.n}
                </div>
                <div className="relative pt-8 pl-2">
                  <h3 className="font-display text-[1.4rem] text-foreground mb-3 leading-tight tracking-tight">
                    {p.title}
                  </h3>
                  <p className="text-[0.98rem] text-muted-foreground leading-[1.65] max-w-md">
                    {p.body}
                  </p>
                  <div className="mt-5 w-12 h-px bg-gold/40 transition-all duration-500 group-hover:w-20 group-hover:bg-gold" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
