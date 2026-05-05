import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-medium tracking-[0.06em] uppercase border leading-tight',
  {
    variants: {
      variant: {
        default: 'bg-overlay text-muted-foreground border-white/10',
        gold: 'bg-gradient-to-br from-[rgba(232,200,120,0.2)] to-[rgba(232,200,120,0.05)] text-gold border-[rgba(232,200,120,0.3)]',
        electric: 'bg-gradient-to-br from-[rgba(77,255,180,0.18)] to-[rgba(77,255,180,0.04)] text-electric border-[rgba(77,255,180,0.3)]',
        free: 'bg-[rgba(77,255,180,0.12)] text-electric border-[rgba(77,255,180,0.25)]',
        paid: 'bg-[rgba(232,200,120,0.1)] text-gold border-[rgba(232,200,120,0.2)]',
        freemium: 'bg-[rgba(126,179,255,0.1)] text-sky border-[rgba(126,179,255,0.2)]',
        new: 'bg-[rgba(255,107,107,0.1)] text-coral border-[rgba(255,107,107,0.2)]',
        soft: 'bg-overlay text-muted-foreground border-white/10',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };
