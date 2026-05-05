'use client';

import { useEffect, useRef } from 'react';

/**
 * Soft golden glow that smoothly follows the mouse cursor across its parent.
 * The parent must be `position: relative` and `overflow: hidden`.
 */
export function HeroMouseGlow() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: 0.5, y: 0.5 });
  const currentRef = useRef({ x: 0.5, y: 0.5 });
  const sizeRef = useRef({ w: 0, h: 0 });
  const rafRef = useRef<number | null>(null);
  const visibleRef = useRef(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const parent = wrap.parentElement;
    if (!parent) return;

    function measure() {
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      sizeRef.current.w = rect.width;
      sizeRef.current.h = rect.height;
    }
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(parent);

    function onMove(e: MouseEvent) {
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      targetRef.current.x = (e.clientX - rect.left) / rect.width;
      targetRef.current.y = (e.clientY - rect.top) / rect.height;
      visibleRef.current = true;
    }
    function onLeave() {
      visibleRef.current = false;
    }

    parent.addEventListener('mousemove', onMove, { passive: true });
    parent.addEventListener('mouseleave', onLeave);

    function tick() {
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
      currentRef.current.x = lerp(currentRef.current.x, targetRef.current.x, 0.12);
      currentRef.current.y = lerp(currentRef.current.y, targetRef.current.y, 0.12);

      const g = glowRef.current;
      if (g && sizeRef.current.w > 0) {
        const px = currentRef.current.x * sizeRef.current.w;
        const py = currentRef.current.y * sizeRef.current.h;
        g.style.transform = `translate3d(${px - 350}px, ${py - 350}px, 0)`;
        g.style.opacity = visibleRef.current ? '1' : '0';
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      parent.removeEventListener('mousemove', onMove);
      parent.removeEventListener('mouseleave', onLeave);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={wrapRef} className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        ref={glowRef}
        className="absolute top-0 left-0 w-[700px] h-[700px] rounded-full opacity-0 transition-opacity duration-500 will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(216, 139, 106,0.18) 0%, rgba(216, 139, 106,0.04) 40%, rgba(216, 139, 106,0) 70%)',
          filter: 'blur(40px)',
        }}
      />
    </div>
  );
}
