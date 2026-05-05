'use client';

import { useEffect, useState } from 'react';

type CursorType = 'default' | 'open' | 'point';

const CLICKABLE_SELECTOR =
  'a[href], button, [role="button"], label, input[type="checkbox"], input[type="radio"], select, summary, .btn, [data-cursor="point"]';

const SRC: Record<CursorType, string> = {
  default: '/cursors/cursor-default.svg',
  open: '/cursors/cursor-hand-open.svg',
  point: '/cursors/cursor-hand-point.svg',
};

// Hotspot offsets (in image px) so the visual "tip" sits exactly on the pointer.
const HOTSPOT: Record<CursorType, { x: number; y: number }> = {
  default: { x: 3, y: 2 },   // arrow tip
  open: { x: 20, y: 2 },     // middle finger top
  point: { x: 13, y: 1 },    // index fingertip
};

const SIZE: Record<CursorType, { w: number; h: number }> = {
  default: { w: 28, h: 28 },
  open: { w: 36, h: 36 },
  point: { w: 30, h: 34 },
};

export function CustomCursor() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [type, setType] = useState<CursorType>('default');
  const [enabled, setEnabled] = useState(false);

  // Coarse pointer (touch) → keep the native cursor / no overlay.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const m = window.matchMedia('(pointer: fine)');
    setEnabled(m.matches);
    const onChange = (e: MediaQueryListEvent) => setEnabled(e.matches);
    m.addEventListener('change', onChange);
    return () => m.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.classList.add('has-custom-cursor');

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      const target = e.target as Element | null;
      if (target?.closest?.(CLICKABLE_SELECTOR)) {
        setType('point');
      } else if (target && target !== document.documentElement) {
        setType('open');
      } else {
        setType('default');
      }
    };

    const onLeave = () => setPos(null);
    const onEnter = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, [enabled]);

  if (!enabled || !pos) return null;

  const { x: hx, y: hy } = HOTSPOT[type];
  const { w, h } = SIZE[type];

  return (
    <img
      src={SRC[type]}
      alt=""
      aria-hidden="true"
      draggable={false}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: w,
        height: h,
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 99999,
        transform: `translate3d(${pos.x - hx}px, ${pos.y - hy}px, 0)`,
        willChange: 'transform',
      }}
    />
  );
}
