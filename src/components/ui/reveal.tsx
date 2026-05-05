'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'section' | 'article' | 'span';
}

export function Reveal({ children, className, delay = 0, as: Tag = 'div' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const Comp = Tag as 'div';
  return (
    <Comp
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn(
        'transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[opacity,transform]',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Comp>
  );
}
