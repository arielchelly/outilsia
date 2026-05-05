'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MagneticProps {
  children: ReactNode;
  className?: string;
  /** How strongly the element follows the cursor (0..1). Default 0.35 */
  strength?: number;
  /** How far the cursor needs to be (in px) to trigger the magnetic pull. */
  radius?: number;
}

/**
 * Wraps a child element so it gently floats toward the cursor on hover.
 * Disabled on touch + reduced motion.
 */
export function Magnetic({ children, className, strength = 0.35, radius = 120 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    function onMove(e: MouseEvent) {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const d = Math.hypot(dx, dy);
      if (d < radius) {
        const force = (1 - d / radius) * strength;
        target.x = dx * force;
        target.y = dy * force;
      } else {
        target.x = 0;
        target.y = 0;
      }
    }
    function tick() {
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
      current.x = lerp(current.x, target.x, 0.18);
      current.y = lerp(current.y, target.y, 0.18);
      if (el) el.style.transform = `translate3d(${current.x.toFixed(2)}px, ${current.y.toFixed(2)}px, 0)`;
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', () => {
      target.x = 0;
      target.y = 0;
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
    };
  }, [strength, radius]);

  return (
    <div ref={ref} className={cn('inline-block will-change-transform', className)}>
      {children}
    </div>
  );
}
