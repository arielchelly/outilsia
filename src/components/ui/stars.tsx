import { cn } from '@/lib/utils';

interface StarsProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Stars({ score, size = 'md', className }: StarsProps) {
  const full = Math.floor(score);
  const half = score - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  const dim = size === 'sm' ? 13 : size === 'lg' ? 22 : 16;

  return (
    <span className={cn('inline-flex items-center gap-0.5', className)}>
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f${i}`} fill={true} dim={dim} />
      ))}
      {half ? <Star half dim={dim} /> : null}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e${i}`} dim={dim} />
      ))}
    </span>
  );
}

function Star({ fill, half, dim }: { fill?: boolean; half?: boolean; dim: number }) {
  if (half) {
    return (
      <svg width={dim} height={dim} viewBox="0 0 24 24" aria-hidden="true">
        <defs>
          <linearGradient id={`half-${dim}`} x1="0" x2="1">
            <stop offset="50%" stopColor="#E8C878" />
            <stop offset="50%" stopColor="rgba(74,85,104,0.5)" />
          </linearGradient>
        </defs>
        <path
          fill={`url(#half-${dim})`}
          d="M12 2l2.9 6.9L22 10l-5.5 4.7L18.2 22 12 18.3 5.8 22l1.7-7.3L2 10l7.1-1.1z"
        />
      </svg>
    );
  }
  return (
    <svg width={dim} height={dim} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill={fill ? '#E8C878' : 'rgba(74,85,104,0.4)'}
        d="M12 2l2.9 6.9L22 10l-5.5 4.7L18.2 22 12 18.3 5.8 22l1.7-7.3L2 10l7.1-1.1z"
      />
    </svg>
  );
}
