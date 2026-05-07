import type { Metadata } from 'next';
import { Fraunces } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { CookieBanner } from '@/components/cookie-banner';
import { GlobalMouseGlow } from '@/components/global-mouse-glow';
import { SmoothScroll } from '@/components/smooth-scroll';
import { WebGLBackground } from '@/components/webgl-background';
import { FloatingAction } from '@/components/floating-action';
import { Toaster } from '@/components/ui/toaster';
import { SITE_NAME, SITE_URL } from '@/lib/data';
import './globals.css';

// Fraunces — variable serif used by Stripe Press, Tailwind Labs blog, etc.
// Premium, warm, with a beautiful italic. Loaded as the variable build so all
// weight/style/opsz combinations are available without separate fetches.
const display = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
  axes: ['opsz', 'SOFT'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Comparatif d'outils IA en français | 62 IA testées en 2026`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Comparatif indépendant des meilleurs outils IA en français : ChatGPT, Claude, Midjourney, DeepL, Make. 62 IA testées et notées sur 8 catégories. Mis à jour mai 2026.",
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: 'technology',
  keywords: [
    'comparatif ia',
    'meilleur outil ia',
    'outil ia francais',
    'ia francais 2026',
    'midjourney',
    'chatgpt',
    'claude',
    'gemini',
    'deepl',
    'github copilot',
    'cursor',
    'make automatisation',
    'ia generation image',
    'ia generation video',
    'ia copywriting',
    'ia seo',
  ],
  formatDetection: { email: false, telephone: false, address: false },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Le comparatif de référence des outils IA en français`,
    description:
      '62 outils IA testés, notés et comparés. Indépendant, sans sponsoring. Mis à jour mensuellement par notre rédaction.',
    // images auto-resolved from src/app/opengraph-image.tsx
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Comparatif des outils IA`,
    description: '62 IA testées en français. Indépendant.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  verification: {},
  alternates: {
    canonical: '/',
    languages: {
      // Site is French-only — declare fr + x-default both pointing to root,
      // absolute URLs to avoid Google's "hreflang conflict" warnings.
      fr: SITE_URL,
      'x-default': SITE_URL,
    },
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  // ImageObject with dimensions — required for rich-result eligibility.
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/opengraph-image`,
    width: 1200,
    height: 630,
    caption: SITE_NAME,
  },
  description:
    "Site français indépendant de comparatif d'outils d'intelligence artificielle. Nous testons et notons les meilleures IA dans 8 catégories.",
  foundingDate: '2024',
  inLanguage: 'fr-FR',
  sameAs: ['https://x.com/topoutilsia'],
  knowsAbout: [
    'Intelligence Artificielle',
    'Outils IA',
    "Génération d'image IA",
    'Chatbots IA',
    'Code IA',
    'SEO IA',
    'Automatisation no-code',
  ],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  description: "Le comparatif de référence des outils IA en français",
  publisher: { '@id': `${SITE_URL}/#organization` },
  inLanguage: 'fr-FR',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/blog?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <a href="#main-content" className="skip-link">
          Aller au contenu principal
        </a>
        <SmoothScroll />
        <WebGLBackground />
        <GlobalMouseGlow />
        <SiteHeader />
        <main id="main-content" className="relative z-10">{children}</main>
        <SiteFooter />
        <FloatingAction />
        <CookieBanner />
        <Toaster />
      </body>
    </html>
  );
}
