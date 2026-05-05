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
        // Brand — "Maison" editorial palette.
        // Replaces the cold gold-on-blue-black "AI default" look with a warm
        // press/wine-cellar register: terracotta + cream + deep bordeaux + sage.
        // Class name `gold` is preserved (it now maps to terracotta) so existing
        // components keep working.
        gold: {
          DEFAULT: '#D88B6A',   // terracotta — primary accent
          deep: '#A85A3D',       // burnt sienna
          bright: '#E8A483',     // peach pink (hover)
        },
        terracotta: {
          DEFAULT: '#D88B6A',
          deep: '#A85A3D',
          bright: '#E8A483',
        },
        cream: '#F2EAD9',         // parchment text on dark
        bordeaux: '#6B1B2E',      // deep wine
        sage: '#94A88C',          // muted green — replaces electric/mint
        amber: '#E8A66A',         // warm amber
        mint: '#94A88C',          // alias → sage
        electric: '#94A88C',      // alias → sage
        coral: '#C45A52',         // muted coral
        sky: '#B8A89B',           // warm taupe — replaces cold sky
        // Backgrounds — warm wine/plum register, nearly identical for unity.
        void: '#15090E',          // deep aubergine-noir
        surface: '#1A0D13',       // wine-noir
        elevated: '#211119',      // muted plum
        overlay: '#2B1822',       // dusty bordeaux
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
