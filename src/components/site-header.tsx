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
        'fixed inset-x-0 top-0 z-50 h-[72px] flex items-center transition-all duration-300',
        scrolled
          ? 'bg-void/70 backdrop-blur-xl backdrop-saturate-150 border-b border-white/[0.06]'
          : 'bg-transparent'
      )}
    >
      <div className="container flex items-center justify-between">
        <Link
          href="/"
          className="font-display font-normal text-[1.45rem] tracking-tight text-gold flex items-center gap-1.5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_12px_#E8C878]" />
          TopOutils<span className="text-muted-foreground">.</span>IA
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
                <div className="bg-elevated border border-white/[0.12] rounded-2xl p-4 grid grid-cols-2 gap-1 shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
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
            className="border border-white/15 rounded-md px-4 py-2 text-foreground hover:border-gold hover:text-gold hover:bg-[rgba(232,200,120,0.08)] transition text-xs"
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
