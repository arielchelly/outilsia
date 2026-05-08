/**
 * Decorative editorial divider — a small gold motif flanked by hairlines.
 * Drop between major sections to give a magazine-page rhythm.
 * Pure server component, server-renderable, accessible (aria-hidden).
 */
export function SectionOrnament({ symbol = 'diamond' }: { symbol?: 'diamond' | 'asterisk' | 'wave' }) {
  const Icon = SYMBOLS[symbol];
  return (
    <div className="section-ornament" aria-hidden="true">
      <Icon />
    </div>
  );
}

const SYMBOLS = {
  diamond: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-5 h-5">
      <path d="M12 2L20 12L12 22L4 12L12 2Z" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" opacity="0.7" />
    </svg>
  ),
  asterisk: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-5 h-5">
      <path d="M12 4v16M4 12h16M6.34 6.34l11.32 11.32M17.66 6.34L6.34 17.66" />
    </svg>
  ),
  wave: () => (
    <svg viewBox="0 0 48 12" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-12 h-3">
      <path d="M2 6 Q 8 0, 14 6 T 26 6 T 38 6 T 46 6" />
    </svg>
  ),
};
