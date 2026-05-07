'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CATEGORIES, CATEGORY_SLUGS } from '@/lib/data';
import { cn } from '@/lib/utils';
import { CategoryIcon } from '@/components/category-icon';

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 h-[68px] flex items-center transition-all duration-500',
        scrolled
          ? 'bg-white/85 backdrop-blur-2xl backdrop-saturate-150 border-b border-black/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
          : 'bg-white/40 backdrop-blur-sm'
      )}
    >
      <div className="container flex items-center justify-between">
        <Link
          href="/"
          className="font-display font-normal text-[1.5rem] tracking-[-0.02em] text-foreground flex items-center gap-2 hover:text-gold transition-colors"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_12px_var(--gold)]" />
          TopOutils<span className="text-muted-foreground/60">.</span>
          <span className="italic text-gold">IA</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-[0.92rem] text-muted-foreground">
          <div
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              className="flex items-center gap-1 py-2 hover:text-foreground transition"
              aria-expanded={dropdownOpen}
            >
              Comparatifs
              <span
                className={cn(
                  'inline-block w-1.5 h-1.5 border-b border-r border-current rotate-45 transition-transform -mt-0.5 ml-1',
                  dropdownOpen && 'rotate-[225deg] mt-0.5'
                )}
              />
            </button>
            {dropdownOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[480px]">
                <div className="bg-elevated border border-black/[0.10] rounded-2xl p-4 grid grid-cols-2 gap-1 shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
                  {CATEGORY_SLUGS.map((slug) => (
                    <Link
                      key={slug}
                      href={`/pages/${slug}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-overlay transition group"
                    >
                      <span className="w-9 h-9 rounded-md bg-overlay flex items-center justify-center text-gold flex-shrink-0">
                        <CategoryIcon slug={slug} className="w-[18px] h-[18px]" />
                      </span>
                      <span className="flex flex-col">
                        <span className="text-foreground font-medium text-[0.9rem]">{CATEGORIES[slug].label}</span>
                        <span className="text-[0.72rem] text-muted-foreground/70">Voir le comparatif</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Link href="/blog" className="hover:text-foreground transition">
            Blog
          </Link>
          <Link href="/about" className="hover:text-foreground transition">
            À propos
          </Link>
          <Link
            href="/#newsletter"
            className="bg-foreground text-background rounded-full px-5 py-2 hover:bg-gold transition-all duration-300 text-xs uppercase tracking-[0.12em] font-medium"
          >
            Newsletter
          </Link>
        </nav>

        <button className="md:hidden flex flex-col gap-1.5 w-8 h-8 items-center justify-center" aria-label="Menu">
          <span className="block w-5 h-px bg-foreground" />
          <span className="block w-5 h-px bg-foreground" />
          <span className="block w-5 h-px bg-foreground" />
        </button>
      </div>
    </header>
  );
}
