import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-br from-gold to-gold-deep text-void font-semibold shadow-[0_4px_20px_rgba(216, 139, 106,0.25)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(216, 139, 106,0.4)]',
        primary:
          'bg-gradient-to-br from-gold to-gold-deep text-void font-semibold shadow-[0_4px_20px_rgba(216, 139, 106,0.25)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(216, 139, 106,0.4)]',
        ghost:
          'border border-white/15 bg-transparent text-foreground hover:border-gold hover:text-gold hover:bg-[rgba(216, 139, 106,0.08)]',
        affiliate:
          'bg-gradient-to-br from-gold to-gold-deep text-void font-semibold shadow-[0_4px_20px_rgba(216, 139, 106,0.25)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(216, 139, 106,0.4)] [&>span.arrow]:transition-transform hover:[&>span.arrow]:translate-x-1',
        electric:
          'bg-gradient-to-br from-electric to-[#2BCC8A] text-void font-semibold shadow-[0_4px_20px_rgba(77,255,180,0.2)] hover:-translate-y-0.5',
        link: 'text-gold underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-6 py-2',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-12 px-8 text-base',
        block: 'w-full h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />;
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
