'use client';

import { useEffect, useRef, useState } from 'react';

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, select, textarea, label, summary, [data-cursor="hover"]';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const target = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number | null>(null);
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [enabled, setEnabled] = useState(false);

  // Disable on coarse pointers (touch) — leave native cursor for them.
  useEffect(() => {
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
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      // Dot follows instantly (1:1 with the OS pointer).
      const dot = dotRef.current;
      if (dot) {
        dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      setHover(!!t?.closest(INTERACTIVE_SELECTOR));
    };

    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => {
      target.current.x = -100;
      target.current.y = -100;
      const dot = dotRef.current;
      if (dot) dot.style.opacity = '0';
    };
    const onEnter = () => {
      const dot = dotRef.current;
      if (dot) dot.style.opacity = '1';
    };

    // Smooth lerp follow for the outer ring.
    const tick = () => {
      const ring = ringRef.current;
      if (ring) {
        ringPos.current.x += (target.current.x - ringPos.current.x) * 0.18;
        ringPos.current.y += (target.current.y - ringPos.current.y) * 0.18;
        ring.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('mousedown', onDown, { passive: true });
    window.addEventListener('mouseup', onUp, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      {/* Inner dot — instant 1:1 follow */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: hover ? 6 : 5,
          height: hover ? 6 : 5,
          borderRadius: 999,
          background: '#F5F5F7',
          mixBlendMode: 'difference',
          pointerEvents: 'none',
          zIndex: 99999,
          transition: 'width 180ms ease, height 180ms ease, opacity 180ms ease',
          willChange: 'transform',
        }}
      />
      {/* Outer ring — smooth lerp follow, expands on hover */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: hover ? 44 : 28,
          height: hover ? 44 : 28,
          borderRadius: 999,
          border: hover
            ? '1px solid rgba(245, 245, 247, 0.55)'
            : '1px solid rgba(245, 245, 247, 0.28)',
          background: hover ? 'rgba(245, 245, 247, 0.06)' : 'transparent',
          pointerEvents: 'none',
          zIndex: 99998,
          transition:
            'width 220ms cubic-bezier(.16,1,.3,1), height 220ms cubic-bezier(.16,1,.3,1), border-color 220ms ease, background 220ms ease, transform 60ms ease',
          willChange: 'transform',
          transformOrigin: 'center',
          ...(pressed ? { transform: 'scale(0.85)' } : {}),
        }}
      />
    </>
  );
}
