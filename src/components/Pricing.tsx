"use client";

import { useState } from 'react';
import type { Plan, Interval } from '@/lib/subscriptions';
import { PRICE_PAISE } from '@/lib/subscriptions';
import Link from 'next/link';

function formatINRFromPaise(paise: number): string {
  const rupees = paise / 100;
  return rupees.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
}

const PLAN_FEATURES: Record<Plan, string[]> = {
  starter: [
    'Custom domain (youragent.in/your-name)',
    '25 Listings',
    'Unlimited CRM Leads',
    'WhatsApp Enquiry',
    'Single Template',
  ],
  growth: [
    'Everything in Starter',
    'Exclusive Listing Deals from YourAgent',
    'Access to All Design Templates',
    'Priority Support',
  ],
  pro: [
    'Everything in Growth',
    'Marketing Support (Meta & Google)',
    'SEO Tools',
    'Site Analytics',
  ],
};

export default function Pricing() {
  const [interval, setInterval] = useState<Interval>('monthly');

  const plans: Plan[] = ['starter', 'growth', 'pro'];

  return (
    <div>
      {/* Interval Toggle */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {(['monthly','quarterly','yearly'] as Interval[]).map(i => (
          <button
            key={i}
            onClick={() => setInterval(i)}
            className={`px-3 py-1.5 rounded-full border text-sm capitalize transition-colors ${interval===i ? 'border-red-600 text-red-700 bg-red-50' : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'}`}
          >
            {i}
          </button>
        ))}
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const pricePaise = PRICE_PAISE[plan][interval];
          const price = formatINRFromPaise(pricePaise);
          const title = plan.charAt(0).toUpperCase() + plan.slice(1);
          return (
            <div key={plan} className="border border-zinc-200 rounded-2xl p-6 bg-white">
              <div className="flex items-baseline justify-between mb-4">
                <h3 className="text-xl font-semibold text-zinc-950">{title}</h3>
                <span className="text-xs uppercase tracking-wide text-zinc-500">{interval}</span>
              </div>
              <div className="text-4xl font-bold text-zinc-950 mb-4">{price}
                <span className="text-base text-zinc-500">/{interval}</span>
              </div>
              <ul className="space-y-2 text-sm text-zinc-700 mb-6">
                {PLAN_FEATURES[plan].map((f, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-600" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/subscribe" className="inline-flex items-center justify-center w-full h-11 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors">
                Choose {title}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}


