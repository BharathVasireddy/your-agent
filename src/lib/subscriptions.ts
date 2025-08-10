export type Plan = 'starter' | 'growth' | 'pro';
export type Interval = 'monthly' | 'quarterly' | 'yearly';

export const PRICE_PAISE: Record<Plan, Record<Interval, number>> = {
  starter: { monthly: 29900, quarterly: 84900, yearly: 299900 },
  growth:  { monthly: 49900, quarterly: 139900, yearly: 499900 },
  pro:     { monthly: 69900, quarterly: 199900, yearly: 699900 },
};

export const DURATION_MONTHS: Record<Interval, number> = {
  monthly: 1,
  quarterly: 3,
  yearly: 12,
};

export const ENTITLEMENTS = {
  starter: {
    listingLimit: 25,
    templates: ['fresh-minimal'],
    prioritySupport: false,
    exclusiveDeals: false,
    marketingSupport: false,
    seoTools: false,
    analytics: false,
  },
  growth: {
    listingLimit: Infinity,
    templates: 'all',
    prioritySupport: true,
    exclusiveDeals: true,
    marketingSupport: false,
    seoTools: false,
    analytics: false,
  },
  pro: {
    listingLimit: Infinity,
    templates: 'all',
    prioritySupport: true,
    exclusiveDeals: true,
    marketingSupport: true,
    seoTools: true,
    analytics: true,
  },
} as const;

export function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

export function isSubscriptionActive(agent: { subscriptionEndsAt: Date | null | undefined }): boolean {
  return !!agent.subscriptionEndsAt && agent.subscriptionEndsAt > new Date();
}


