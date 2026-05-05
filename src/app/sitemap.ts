import type { MetadataRoute } from 'next';
import { allArticles, CATEGORY_SLUGS, SITE_URL, toolsMeta } from '@/lib/data';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date();
  const lastUpdated = new Date(toolsMeta.last_updated || today);

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: lastUpdated,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: today,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...CATEGORY_SLUGS.map((slug) => ({
      url: `${SITE_URL}/pages/${slug}`,
      lastModified: lastUpdated,
      changeFrequency: 'weekly' as const,
      priority: 0.95,
    })),
    ...allArticles.map((a) => ({
      url: `${SITE_URL}/blog/${a.slug}`,
      lastModified: new Date(a.date_modified),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
