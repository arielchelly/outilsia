'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface AnimatedTextProps {
  text: string;
  className?: string;
  /** delay before the first word in seconds */
  startDelay?: number;
  /** stagger between each word */
  stagger?: number;
  /** wrap each word optionally (e.g., to italicize one word) */
  wrap?: (word: string, idx: number) => ReactNode;
}

/**
 * Reveals text word-by-word with a blur + slide-up effect (Aceternity-style).
 * Designed to feel native to our Instrument Serif display headings.
 */
export function AnimatedText({ text, className, startDelay = 0, stagger = 0.08, wrap }: AnimatedTextProps) {
  const words = text.split(' ');
  return (
    <span className={cn('inline-block', className)}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: 'blur(8px)', y: 14 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{
            duration: 0.55,
            delay: startDelay + i * stagger,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block mr-[0.25em] last:mr-0"
        >
          {wrap ? wrap(word, i) : word}
        </motion.span>
      ))}
    </span>
  );
}
