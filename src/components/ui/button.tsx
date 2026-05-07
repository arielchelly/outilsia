import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        // Premium primary: solid champagne with liquid sheen sweep on hover
        default:
          'cta-liquid bg-gold text-white font-semibold shadow-[0_1px_0_rgba(255,255,255,0.18)_inset,0_4px_18px_rgba(202,138,4,0.22)] hover:bg-gold-bright hover:-translate-y-0.5 hover:shadow-[0_1px_0_rgba(255,255,255,0.22)_inset,0_12px_32px_rgba(202,138,4,0.34)]',
        primary:
          'cta-liquid bg-gold text-white font-semibold shadow-[0_1px_0_rgba(255,255,255,0.18)_inset,0_4px_18px_rgba(202,138,4,0.22)] hover:bg-gold-bright hover:-translate-y-0.5 hover:shadow-[0_1px_0_rgba(255,255,255,0.22)_inset,0_12px_32px_rgba(202,138,4,0.34)]',
        ghost:
          'border border-black/10 bg-black/[0.025] backdrop-blur-sm text-foreground hover:border-gold/50 hover:text-gold hover:bg-[rgba(224,200,150,0.06)]',
        affiliate:
          'bg-gold text-white font-semibold shadow-[0_1px_0_rgba(255,255,255,0.18)_inset,0_4px_18px_rgba(224,200,150,0.18)] hover:bg-gold-bright hover:-translate-y-0.5 hover:shadow-[0_1px_0_rgba(255,255,255,0.22)_inset,0_10px_28px_rgba(224,200,150,0.32)] [&>span.arrow]:transition-transform hover:[&>span.arrow]:translate-x-1',
        electric:
          'bg-sage text-white font-semibold shadow-[0_4px_20px_rgba(157,177,168,0.2)] hover:-translate-y-0.5',
        link: 'text-gold underline-offset-4 hover:underline rounded-none px-0 h-auto',
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
