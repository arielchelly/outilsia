import Link from 'next/link';
import { CATEGORIES, CATEGORY_SLUGS } from '@/lib/data';

const RESOURCES = [
  { label: 'Blog', href: '/blog' },
  { label: 'À propos', href: '/about' },
  { label: 'Newsletter', href: '/#newsletter' },
];

const LEGAL = [
  { label: 'Mentions légales', href: '/about#mentions' },
  { label: 'Cookies', href: '/about#cookies' },
  { label: 'Contact', href: '/about#contact' },
  { label: 'Affiliation', href: '/about' },
];

const SOCIALS = [
  {
    label: 'X / Twitter',
    href: 'https://x.com/topoutilsia',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.852 3.37-1.852 3.601 0 4.267 2.37 4.267 5.455v6.288zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.063 2.063 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'RSS',
    href: '/rss.xml',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20A2.18 2.18 0 0 1 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1Z" />
      </svg>
    ),
  },
];

export function SiteFooter() {
  return (
    <footer className="relative pt-24 pb-10 mt-24 border-t border-black/[0.06] bg-surface/50">
      {/* Refined gradient hairline at the top */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, var(--gold) 25%, var(--gold) 75%, transparent 100%)',
          opacity: 0.5,
        }}
      />
      <div className="container">
        {/* Editorial line above the grid — gives gravitas */}
        <div className="mb-20 max-w-3xl">
          <span className="eyebrow block mb-5">Édition 2026</span>
          <p className="font-display text-[clamp(1.6rem,3vw,2.4rem)] text-foreground/90 leading-[1.15] tracking-[-0.02em] text-balance">
            Le comparatif de référence des outils IA{' '}
            <span className="italic text-gold">en français</span>. Indépendant, exigeant, à jour chaque mois.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-12 gap-y-12 gap-x-8 mb-16">
          <div className="col-span-2 md:col-span-4 max-w-xs">
            <Link
              href="/"
              className="font-display font-normal text-[1.6rem] tracking-tight text-gold flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_10px_var(--gold)]" />
              TopOutils<span className="text-muted-foreground">.</span>IA
            </Link>
            <p className="mt-5 text-[0.9rem] text-muted-foreground leading-relaxed">
              80+ outils IA testés au minimum 30 jours. Comparatifs nuancés en français, avis
              indépendants, mise à jour mensuelle.
            </p>
            <div className="flex gap-2 mt-6">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full border border-black/10 flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold/40 hover:bg-[rgba(212, 184, 150,0.08)] transition-all"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-gold uppercase tracking-[0.18em] text-[0.72rem] font-medium mb-5">
              Comparatifs
            </h4>
            <ul className="flex flex-col gap-2.5">
              {CATEGORY_SLUGS.map((slug) => (
                <li key={slug}>
                  <Link
                    href={`/pages/${slug}`}
                    className="group inline-flex items-center gap-2 text-[0.92rem] text-muted-foreground hover:text-gold transition"
                  >
                    <span className="w-0 h-px bg-gold transition-all duration-300 group-hover:w-3" />
                    {CATEGORIES[slug].label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-gold uppercase tracking-[0.18em] text-[0.72rem] font-medium mb-5">
              Ressources
            </h4>
            <ul className="flex flex-col gap-2.5">
              {RESOURCES.map((r) => (
                <li key={r.label}>
                  <Link
                    href={r.href}
                    className="group inline-flex items-center gap-2 text-[0.92rem] text-muted-foreground hover:text-gold transition"
                  >
                    <span className="w-0 h-px bg-gold transition-all duration-300 group-hover:w-3" />
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-gold uppercase tracking-[0.18em] text-[0.72rem] font-medium mb-5">
              Légal
            </h4>
            <ul className="flex flex-col gap-2.5">
              {LEGAL.map((r) => (
                <li key={r.label}>
                  <Link
                    href={r.href}
                    className="group inline-flex items-center gap-2 text-[0.92rem] text-muted-foreground hover:text-gold transition"
                  >
                    <span className="w-0 h-px bg-gold transition-all duration-300 group-hover:w-3" />
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Affiliate disclaimer — moved here as fine print */}
        <p className="text-[0.78rem] text-muted-foreground/60 leading-relaxed max-w-3xl mb-8">
          <strong className="text-muted-foreground">Transparence affiliation :</strong> certains liens
          peuvent générer une commission pour TopOutils.IA, sans surcoût pour vous. Aucune marque ne
          peut acheter une bonne note. Nos évaluations restent 100% indépendantes.
        </p>

        <div className="pt-8 border-t border-black/[0.06] flex flex-wrap items-center justify-between gap-4 text-[0.78rem] text-muted-foreground/60">
          <p>© 2026 TopOutils.IA — Tous droits réservés.</p>
          <p>Fait avec soin en 🇫🇷</p>
        </div>
      </div>
    </footer>
  );
}
