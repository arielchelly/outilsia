import type { Metadata } from 'next';
import { Instrument_Serif } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { CookieBanner } from '@/components/cookie-banner';
import { GlobalMouseGlow } from '@/components/global-mouse-glow';
import { SmoothScroll } from '@/components/smooth-scroll';
import { Toaster } from '@/components/ui/toaster';
import { SITE_NAME, SITE_URL } from '@/lib/data';
import './globals.css';

const display = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Comparatifs d'outils IA en français | 62 outils testés en 2026`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Le site de référence pour comparer les meilleurs outils IA en français : génération d'image, vidéo, copywriting, traduction, chatbot, SEO, code et automatisation. Avis indépendants.",
  keywords: ['outils ia', 'ia francais', 'comparatif ia', 'midjourney', 'chatgpt', 'claude'],
  authors: [{ name: SITE_NAME }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Le comparatif de référence des outils IA en français`,
    description: '62 outils IA testés et comparés. Indépendant. Mis à jour mensuellement.',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  alternates: { canonical: '/' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${display.variable} ${GeistSans.variable} ${GeistMono.variable}`}
      style={
        {
          '--font-body': 'var(--font-geist-sans)',
          '--font-mono': 'var(--font-geist-mono)',
        } as React.CSSProperties
      }
    >
      <body className="font-sans">
        <SmoothScroll />
        <GlobalMouseGlow />
        <SiteHeader />
        <main className="relative z-10">{children}</main>
        <SiteFooter />
        <CookieBanner />
        <Toaster />
      </body>
    </html>
  );
}
