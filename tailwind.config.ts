import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/**/*.{ts,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: { '2xl': '1280px' },
    },
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        // Brand — "Editorial Premium v5" palette (validated by UI/UX Pro Max
        // skill against the "Luxury/Premium" reference for review/comparison
        // sites). Stone-warm neutrals + premium gold CTA. Reads as Wirecutter
        // meets Stripe Press in French. AAA contrast on body text.
        // The `gold` class name maps to the premium amber-gold #CA8A04.
        gold: {
          DEFAULT: '#CA8A04',   // amber-700 — premium CTA gold
          deep: '#A16207',       // amber-800 — pressed state
          bright: '#EAB308',     // amber-500 — hover highlight
        },
        cream: '#0C0A09',         // Stone-950 — text (legacy alias inverted)
        sand: '#CA8A04',
        sage: '#15803D',          // emerald-700 — verified / positive
        amber: '#CA8A04',
        mint: '#15803D',
        electric: '#15803D',
        coral: '#B91C1C',         // red-700 — destructive
        sky: '#44403C',           // Stone-700 — secondary muted
        // Backgrounds — Stone-warm neutrals (off-white paper, not clinical).
        void: '#FAFAF9',          // Stone-50 — page bg (warm off-white)
        surface: '#F5F5F4',       // Stone-100 — card bg
        elevated: '#E7E5E4',      // Stone-200 — popover / inner card
        overlay: '#D6D3D1',       // Stone-300 — hover overlay
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        spotlight: {
          '0%': { opacity: '0', transform: 'translate(-72%, -62%) scale(0.5)' },
          '100%': { opacity: '1', transform: 'translate(-50%, -40%) scale(1)' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'mask-reveal': {
          from: { clipPath: 'inset(0 100% 0 0)' },
          to: { clipPath: 'inset(0 0 0 0)' },
        },
        'pulse-blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
      animation: {
        spotlight: 'spotlight 2s ease 0.75s 1 forwards',
        'fade-in': 'fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'mask-reveal': 'mask-reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) both',
        'pulse-blink': 'pulse-blink 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
