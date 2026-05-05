import type { Tool } from './types';

export type Metric =
  | 'overall'
  | 'price'
  | 'ease_of_use'
  | 'quality_output'
  | 'french_support'
  | 'value_for_money';

export interface MetricOption {
  value: Metric;
  label: string;
  unit: string;
  /** When true, lower is better (e.g., price). */
  inverse?: boolean;
}

export const METRIC_OPTIONS: MetricOption[] = [
  { value: 'overall', label: 'Note globale', unit: '/5' },
  { value: 'price', label: 'Prix mensuel (€)', unit: '€/mois', inverse: true },
  { value: 'ease_of_use', label: "Facilité d'utilisation", unit: '/5' },
  { value: 'quality_output', label: 'Qualité des résultats', unit: '/5' },
  { value: 'french_support', label: 'Support français', unit: '/5' },
  { value: 'value_for_money', label: 'Rapport qualité/prix', unit: '/5' },
];

/**
 * Returns the numeric value of a tool for a given metric.
 * For "price", returns the cheapest paid plan (or 0 if fully free).
 */
export function getMetricValue(tool: Tool, metric: Metric): number {
  switch (metric) {
    case 'overall':
      return tool.scores.overall;
    case 'ease_of_use':
      return tool.scores.ease_of_use;
    case 'quality_output':
      return tool.scores.quality_output;
    case 'french_support':
      return tool.scores.french_support;
    case 'value_for_money':
      return tool.scores.value_for_money;
    case 'price': {
      const paid = tool.pricing.plans.find((p) => p.price_eur > 0);
      return paid ? paid.price_eur : 0;
    }
    default:
      return 0;
  }
}

export function getMetricOption(metric: Metric): MetricOption {
  return METRIC_OPTIONS.find((m) => m.value === metric) ?? METRIC_OPTIONS[0];
}
