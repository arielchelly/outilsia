import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, period?: string): string {
  if (!price || price === 0) return 'Gratuit';
  return `${price}€${period ? '/' + period : ''}`;
}

export function priceLabel(tool: { pricing: { model: string; plans: { price_eur: number; period: string }[] } }): string {
  if (tool.pricing.model === 'gratuit') return 'Gratuit';
  const minPlan = tool.pricing.plans.find((p) => p.price_eur > 0);
  if (!minPlan) return 'Gratuit';
  return `${minPlan.price_eur}€/${minPlan.period}`;
}
