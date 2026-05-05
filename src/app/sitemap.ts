import type { MetadataRoute } from 'next';
import { allArticles, CATEGORY_SLUGS, SITE_URL } from '@/lib/data';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: today, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/about`, lastModified: today, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${SITE_URL}/blog`, lastModified: today, changeFrequency: 'weekly', priority: 0.8 },
    ...CATEGORY_SLUGS.map((slug) => ({
      url: `${SITE_URL}/pages/${slug}`,
      lastModified: today,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    ...allArticles.map((a) => ({
      url: `${SITE_URL}/blog/${a.slug}`,
      lastModified: new Date(a.date_modified),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
