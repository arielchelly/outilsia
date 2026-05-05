'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ToolLogoProps {
  src?: string;
  name: string;
  size?: number;
  className?: string;
}

export function ToolLogo({ src, name, size = 48, className }: ToolLogoProps) {
  const [error, setError] = useState(false);
  const fallback = (
    <span
      className={cn(
        'inline-flex items-center justify-center bg-overlay border border-white/10 rounded-md text-gold font-display',
        className
      )}
      style={{ width: size, height: size, fontSize: size * 0.5 }}
    >
      {name.charAt(0)}
    </span>
  );

  if (!src || error) return fallback;

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center bg-overlay border border-white/10 rounded-md overflow-hidden',
        className
      )}
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`${name} logo`}
        loading="lazy"
        width={size}
        height={size}
        className="w-full h-full object-cover"
        onError={() => setError(true)}
      />
    </span>
  );
}
