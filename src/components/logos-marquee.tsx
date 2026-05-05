'use client';

import { AI_BRANDS, logoUrl, fallbackLogoUrl } from '@/data/ai-brands';

/**
 * Infinite horizontal marquee showing all AI tool brand logos.
 * Two parallel rows scrolling in opposite directions for visual rhythm.
 */
export function LogosMarquee() {
  // Split brands into two halves for two opposing rows
  const half = Math.ceil(AI_BRANDS.length / 2);
  const row1 = AI_BRANDS.slice(0, half);
  const row2 = AI_BRANDS.slice(half);

  return (
    <section className="relative py-16 overflow-hidden">
      <div className="container mb-10">
        <p className="text-center text-[0.72rem] tracking-[0.22em] uppercase text-muted-foreground/70">
          80+ outils IA testés et comparés
        </p>
      </div>

      {/* Row 1 — left direction */}
      <Marquee items={row1} duration={60} direction="left" />
      {/* Row 2 — right direction */}
      <div className="mt-6">
        <Marquee items={row2} duration={75} direction="right" />
      </div>

      {/* Edge fades to blend with page bg */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-void to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-void to-transparent z-10" />
    </section>
  );
}

interface MarqueeProps {
  items: typeof AI_BRANDS;
  duration: number;
  direction: 'left' | 'right';
}

function Marquee({ items, duration, direction }: MarqueeProps) {
  // Duplicate items for seamless loop
  const doubled = [...items, ...items];
  const animationName = direction === 'left' ? 'marquee-left' : 'marquee-right';

  return (
    <div className="relative overflow-hidden">
      <ul
        className="flex gap-6 will-change-transform"
        style={{
          width: 'max-content',
          animation: `${animationName} ${duration}s linear infinite`,
        }}
      >
        {doubled.map((brand, i) => (
          <li
            key={`${brand.domain}-${i}`}
            className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm transition-colors hover:border-[rgba(232,200,120,0.25)] hover:bg-white/[0.04]"
          >
            <span className="w-8 h-8 rounded-md bg-white overflow-hidden flex items-center justify-center flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl(brand.domain, 64)}
                alt=""
                loading="lazy"
                decoding="async"
                width={32}
                height={32}
                className="w-full h-full object-contain p-0.5"
                onError={(ev) => {
                  const img = ev.currentTarget as HTMLImageElement;
                  if (!img.dataset.fallback) {
                    img.dataset.fallback = '1';
                    img.src = fallbackLogoUrl(brand.domain);
                  } else {
                    img.style.display = 'none';
                    const parent = img.parentElement;
                    if (parent) {
                      parent.style.background = 'linear-gradient(135deg, #E8C878, #C9A84C)';
                      parent.innerHTML = `<span style="font-family:var(--font-display);color:#080B14;font-weight:600;font-size:0.95rem">${brand.name.charAt(0)}</span>`;
                    }
                  }
                }}
              />
            </span>
            <span className="text-[0.85rem] text-foreground/80 whitespace-nowrap font-medium">
              {brand.name}
            </span>
          </li>
        ))}
      </ul>

      <style jsx>{`
        @keyframes marquee-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
