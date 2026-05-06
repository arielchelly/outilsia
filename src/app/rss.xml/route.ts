import { SITE_NAME, SITE_URL, allArticles } from '@/lib/data';

// Static export needs an explicit force-static + a dynamic param to disable
// the request-level features. RSS 2.0 with the channel + items pattern.
export const dynamic = 'force-static';

function escape(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function GET() {
  const sorted = [...allArticles].sort(
    (a, b) => +new Date(b.date_published) - +new Date(a.date_published)
  );

  const items = sorted
    .map((a) => {
      const url = `${SITE_URL}/blog/${a.slug}/`;
      const pub = new Date(a.date_published).toUTCString();
      return `    <item>
      <title>${escape(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pub}</pubDate>
      <description>${escape(a.description)}</description>
      <category>${escape(a.category_label || a.category)}</category>
    </item>`;
    })
    .join('\n');

  const lastBuild = new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(SITE_NAME)} — Blog</title>
    <link>${SITE_URL}/blog/</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Comparatifs, guides et analyses sur les outils IA en français.</description>
    <language>fr-FR</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <generator>${SITE_NAME}</generator>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'content-type': 'application/rss+xml; charset=utf-8' },
  });
}
