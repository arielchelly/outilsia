import Link from 'next/link';
import type { Article } from '@/lib/types';

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group bg-white/[0.015] border border-white/[0.06] rounded-2xl overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-1 hover:border-[rgba(216, 139, 106,0.25)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_30px_rgba(216, 139, 106,0.06)]"
    >
      <div className="aspect-[16/9] bg-elevated relative overflow-hidden">
        <svg
          viewBox="0 0 800 450"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full transition-transform duration-700 group-hover:scale-105"
        >
          <defs>
            <linearGradient id={`gr-${article.slug}`} x1="0" x2="1">
              <stop offset="0%" stopColor="#161B27" />
              <stop offset="100%" stopColor="#15090E" />
            </linearGradient>
          </defs>
          <rect width="800" height="450" fill={`url(#gr-${article.slug})`} />
          <text
            x="400"
            y="245"
            fontFamily="Georgia, serif"
            fontSize="46"
            fontWeight="300"
            fill="#D88B6A"
            textAnchor="middle"
          >
            {(article.category_label || article.category).slice(0, 30)}
          </text>
        </svg>
      </div>
      <div className="p-6 flex flex-col gap-2 flex-grow">
        <span className="text-[0.7rem] uppercase tracking-[0.18em] text-gold font-medium">
          {article.category_label || article.category}
        </span>
        <h3 className="font-display font-normal text-[1.35rem] text-foreground leading-tight my-1">{article.title}</h3>
        <p className="text-[0.92rem] text-muted-foreground line-clamp-2">{article.description}</p>
        <div className="flex items-center gap-3 text-[0.78rem] text-muted-foreground/60 mt-auto pt-2">
          <span>{article.date_published}</span>
          <span>•</span>
          <span>{article.reading_time} min</span>
          <span className="ml-auto text-gold inline-flex items-center gap-1 transition-all duration-300 group-hover:gap-2">
            Lire <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
