'use client';

import { useEffect, useRef } from 'react';

/**
 * Soft golden glow that smoothly follows the mouse cursor across the entire viewport.
 * Mounted in the root layout — works on every page, including when scrolling.
 */
export function GlobalMouseGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: -2000, y: -2000 });
  const visibleRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return; // skip touch
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let lastMove = 0;

    function startLoop() {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(tick);
    }

    function onMove(e: MouseEvent) {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
      visibleRef.current = true;
      lastMove = performance.now();
      startLoop();
    }
    function onLeave() {
      visibleRef.current = false;
    }

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseout', (e) => {
      if (!e.relatedTarget) onLeave();
    });

    function tick() {
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
      currentRef.current.x = lerp(currentRef.current.x, targetRef.current.x, 0.14);
      currentRef.current.y = lerp(currentRef.current.y, targetRef.current.y, 0.14);
      const g = glowRef.current;
      if (g) {
        g.style.transform = `translate3d(${currentRef.current.x - 350}px, ${currentRef.current.y - 350}px, 0)`;
        g.style.opacity = visibleRef.current ? '1' : '0';
      }
      // Stop the loop after 1.5s of mouse inactivity AND once the lerp has
      // settled — frees the main thread between interactions.
      const idle = performance.now() - lastMove > 1500;
      const settled = Math.hypot(
        currentRef.current.x - targetRef.current.x,
        currentRef.current.y - targetRef.current.y
      ) < 0.5;
      if (idle && settled) {
        rafRef.current = null;
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden"
      // No mix-blend-mode here. A soft additive gold tint is enough; blend
      // modes reveal stacking-context boundaries (overflow-hidden, transforms)
      // which made the constellation rectangle visible when the light passed.
      style={{ zIndex: 5 }}
    >
      <div
        ref={glowRef}
        className="absolute top-0 left-0 w-[900px] h-[900px] rounded-full opacity-0 transition-opacity duration-500 will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(212, 184, 150,0.10) 0%, rgba(212, 184, 150,0.03) 35%, rgba(212, 184, 150,0) 70%)',
          filter: 'blur(80px)',
        }}
      />
    </div>
  );
}
