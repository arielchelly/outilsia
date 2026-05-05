export type CategorySlug =
  | 'image-ia'
  | 'video-ia'
  | 'copywriting-ia'
  | 'traduction-ia'
  | 'chatbot-ia'
  | 'seo-ia'
  | 'code-ia'
  | 'automatisation-ia';

export interface Pricing {
  model: 'gratuit' | 'freemium' | 'payant';
  has_free_trial: boolean;
  free_trial_days: number;
  plans: { name: string; price_eur: number; period: string; detail?: string }[];
}

export interface Scores {
  overall: number;
  quality_output: number;
  ease_of_use: number;
  value_for_money: number;
  french_support: number;
  api_quality: number;
  reliability: number;
}

export interface ToolFeatures {
  api_available?: boolean;
  commercial_use?: boolean;
  free_plan?: boolean;
  french_interface?: boolean;
  mobile_app?: boolean;
  team_collab?: boolean;
  watermark_free?: boolean;
}

export interface Tool {
  id: string;
  name: string;
  slug: string;
  category: CategorySlug;
  tagline: string;
  description_short: string;
  description_long: string;
  logo: string;
  website: string;
  affiliate_link: string;
  affiliate_program: string;
  commission_type: 'recurring' | 'one-time' | 'none';
  commission_rate: string;
  cookie_duration_days: number;
  pricing: Pricing;
  scores: Scores;
  pros: string[];
  cons: string[];
  best_for: string[];
  not_ideal_for: string[];
  features: ToolFeatures;
  alternatives: string[];
  tags: string[];
  is_featured: boolean;
  is_recommended: boolean;
  badge_text: string;
  badge_type: 'gold' | 'electric' | 'new' | 'free' | '';
  rank_in_category: number;
  last_reviewed: string;
}

export interface Article {
  slug: string;
  title: string;
  h1: string;
  category: string;
  category_label: string;
  description: string;
  reading_time: number;
  date_published: string;
  date_modified: string;
  content: string;
  faqs: { q: string; a: string }[];
  related_articles: string[];
  related_category: CategorySlug;
}

export interface ToolsData {
  meta: { total: number; categories: number; last_updated: string; version: string };
  tools: Tool[];
}

export interface ArticlesData {
  meta: { total: number; last_updated: string };
  articles: Article[];
}

export interface CategoryMeta {
  label: string;
  title: string;
  intro: string;
  keywords: string;
}
