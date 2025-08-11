'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Pricing as AnimatedPricing } from '@/components/ui/pricing';
import { Check, Loader2, CreditCard, Shield, Star, Users, Zap, Globe } from 'lucide-react';
import { UserFlowStatus } from '@/lib/userFlow';
import { createRazorpayOrder, verifyPayment } from '@/app/actions';
import type { Plan, Interval } from '@/lib/subscriptions';

interface SubscriptionPageProps {
  session: {
    user: {
      id: string;
      email: string;
      name: string;
    };
  };
  flowStatus: UserFlowStatus;
}

declare global {
  interface Window {
    Razorpay: {
      new(options: { key: string; amount: number; currency: string; order_id: string; name: string; description: string; handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void }): {
        open(): void;
      };
    };
  }
}

function getPreselected(): { plan?: 'starter'|'growth'|'pro'; interval?: 'monthly'|'quarterly'|'yearly' } {
  if (typeof document === 'undefined') return {};
  try {
    const cookie = document.cookie.split('; ').find(c => c.startsWith('selectedPlan='));
    if (!cookie) return {};
    const value = decodeURIComponent(cookie.split('=')[1] || '');
    const parsed = JSON.parse(value);
    return { plan: parsed.plan, interval: parsed.interval };
  } catch { return {}; }
}

export default function SubscriptionPage({ session, flowStatus }: SubscriptionPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const preset = getPreselected();
  const [plan, setPlan] = useState<Plan>(preset.plan as Plan || 'starter');
  const [interval, setInterval] = useState<Interval>(preset.interval as Interval || 'monthly');
  
  // Suppress unused variable warning for flowStatus (used by parent for routing logic)
  void flowStatus;

  const features = [
    { icon: Globe, text: 'Professional profile with custom URL (youragent.in/your-name)' },
    { icon: Zap, text: 'Unlimited property listings with high-quality photos' },
    { icon: Users, text: 'Advanced lead management and client tracking' },
    { icon: Star, text: 'Customer testimonials and reviews system' },
    { icon: Shield, text: 'Professional website templates and customization' },
    { icon: CreditCard, text: 'Priority support and regular feature updates' }
  ];

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if Razorpay key is available
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        throw new Error('Payment configuration error. Please contact support.');
      }

      // Create Razorpay order
      const orderResult = await createRazorpayOrder(plan, interval);
      
      if (!orderResult.success || !orderResult.order) {
        throw new Error(orderResult.error || 'Failed to create payment order');
      }

      const { order } = orderResult;

      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      // Initialize Razorpay payment
      const options = {
        key: razorpayKey,
        amount: typeof order.amount === 'string' ? parseInt(order.amount, 10) : order.amount,
        currency: order.currency,
        name: 'YourAgent',
        description: `Subscription: ${plan.toUpperCase()} (${interval})`,
        order_id: order.id,
        prefill: {
          name: session.user.name || '',
          email: session.user.email || '',
        },
        theme: { color: '#DC2626' },
        handler: async function (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) {
          try {
            // Verify payment on server
            const verificationResult = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }, plan, interval);

            if (verificationResult.success) {
              // Payment successful, redirect to onboarding
              router.push('/onboarding/wizard');
            } else {
              setError(verificationResult.error || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            setError('Payment verification failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: function() {
            setIsLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Payment error:', error);
      setError(error instanceof Error ? error.message : 'Payment failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-950 mb-4">
            Launch Your Professional
            <span className="text-brand block">Real Estate Business</span>
          </h1>
          <p className="text-xl text-zinc-600 max-w-3xl mx-auto">
            Join thousands of successful agents who use YourAgent.in to generate leads, 
            showcase properties, and grow their business online.
          </p>
        </div>

        {/* Pricing: reuse the same responsive component as homepage */}
        <AnimatedPricing
          plans={[
            {
              name: 'STARTER',
              price: '299',
              quarterlyPrice: '849',
              yearlyPrice: '2999',
              period: 'per month',
              features: [
                'Custom domain (youragent.in/your-name)',
                '25 Listings',
                'Unlimited CRM Leads',
                'WhatsApp Enquiry',
                'Single Template',
              ],
              description: 'Great for getting started',
              buttonText: 'Choose Starter',
              href: '/subscribe',
              isPopular: false,
            },
            {
              name: 'GROWTH',
              price: '499',
              quarterlyPrice: '1399',
              yearlyPrice: '4999',
              period: 'per month',
              features: [
                'Everything in Starter',
                'Exclusive Listing Deals from YourAgent',
                'Access to All Design Templates',
                'Priority Support',
              ],
              description: 'Best for growing agents',
              buttonText: 'Choose Growth',
              href: '/subscribe',
              isPopular: true,
            },
            {
              name: 'PRO',
              price: '699',
              quarterlyPrice: '1999',
              yearlyPrice: '6999',
              period: 'per month',
              features: [
                'Everything in Growth',
                'Marketing Support (Meta & Google)',
                'SEO Tools',
                'Site Analytics',
              ],
              description: 'For power users',
              buttonText: 'Choose Pro',
              href: '/subscribe',
              isPopular: false,
            },
          ]}
        />

        {/* Trust Indicators */}
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
            <Users className="w-12 h-12 text-brand mx-auto mb-4" />
            <h3 className="font-semibold text-zinc-950 mb-2">Trusted by 1000+ Agents</h3>
            <p className="text-zinc-600 text-sm">Real estate professionals across India trust our platform</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
            <Shield className="w-12 h-12 text-brand mx-auto mb-4" />
            <h3 className="font-semibold text-zinc-950 mb-2">Secure & Reliable</h3>
            <p className="text-zinc-600 text-sm">Bank-grade security with 99.9% uptime guarantee</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
            <Star className="w-12 h-12 text-brand mx-auto mb-4" />
            <h3 className="font-semibold text-zinc-950 mb-2">5-Star Support</h3>
            <p className="text-zinc-600 text-sm">Dedicated support team to help you succeed</p>
          </div>
        </div>
      </div>
    </div>
  );
}