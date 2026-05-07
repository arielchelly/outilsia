'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function FloatingAction() {
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setShow(window.scrollY > 600);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 transition-all duration-500',
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      )}
      aria-hidden={!show}
    >
      {/* Expanded menu */}
      <div
        className={cn(
          'flex flex-col gap-2 transition-all duration-300 origin-bottom-right',
          open ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
        )}
      >
        <FabAction
          href="#comparator"
          label="Face-à-face"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          }
        />
        <FabAction
          href="#categories"
          label="Catégories"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          }
        />
        <FabAction
          href="#faq"
          label="FAQ"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
            </svg>
          }
        />
        <FabAction
          onClick={scrollToTop}
          label="Haut de page"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-4">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          }
        />
      </div>

      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Fermer le menu rapide' : 'Ouvrir le menu rapide'}
        aria-expanded={open}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-gold to-gold-deep text-white shadow-[0_12px_32px_-8px_rgba(202,138,4,0.55),0_4px_12px_rgba(12,10,9,0.12)] flex items-center justify-center hover:shadow-[0_18px_40px_-8px_rgba(202,138,4,0.7)] hover:-translate-y-0.5 transition-all duration-300"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className={cn('w-5 h-5 transition-transform duration-500', open && 'rotate-45')}
          aria-hidden="true"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </div>
  );
}

function FabAction({
  href,
  onClick,
  label,
  icon,
}: {
  href?: string;
  onClick?: () => void;
  label: string;
  icon: React.ReactNode;
}) {
  const className =
    'group flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-full bg-white/95 backdrop-blur-md border border-black/[0.08] shadow-[0_8px_24px_-8px_rgba(12,10,9,0.18)] hover:border-gold/30 hover:bg-white transition-all duration-300';

  const content = (
    <>
      <span className="text-[0.85rem] font-medium text-foreground">{label}</span>
      <span className="w-7 h-7 rounded-full bg-gold/8 text-gold flex items-center justify-center group-hover:bg-gold group-hover:text-white transition-colors">
        {icon}
      </span>
    </>
  );

  if (href) {
    return (
      <a href={href} className={className}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}
