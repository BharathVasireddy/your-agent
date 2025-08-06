'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Check, Loader2, CreditCard, Shield, Star, Users, Zap, Globe } from 'lucide-react';
import { UserFlowStatus } from '@/lib/userFlow';
import { createRazorpayOrder, verifyPayment } from '@/app/actions';

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

export default function SubscriptionPage({ session, flowStatus }: SubscriptionPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const orderResult = await createRazorpayOrder();
      
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
        name: 'YourAgent.in',
        description: 'Professional Real Estate Agent Subscription',
        order_id: order.id,
        prefill: {
          name: session.user.name || '',
          email: session.user.email || '',
        },
        theme: {
          color: '#DC2626' // red-600
        },
        handler: async function (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) {
          try {
            // Verify payment on server
            const verificationResult = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

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
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-950 mb-4">
            Launch Your Professional
            <span className="text-red-600 block">Real Estate Business</span>
          </h1>
          <p className="text-xl text-zinc-600 max-w-3xl mx-auto">
            Join thousands of successful agents who use YourAgent.in to generate leads, 
            showcase properties, and grow their business online.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-zinc-200 overflow-hidden mb-8">
          <div className="bg-red-600 text-white text-center py-4">
            <span className="text-sm font-medium uppercase tracking-wide">Limited Time Offer</span>
          </div>
          
          <div className="p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <span className="text-6xl md:text-7xl font-bold text-zinc-950">₹499</span>
                <div className="ml-4 text-left">
                  <div className="text-zinc-600 text-lg">/month</div>
                  <div className="text-sm text-zinc-500">Billed monthly</div>
                </div>
              </div>
              <p className="text-zinc-600 text-lg">
                Everything you need to succeed in real estate
              </p>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex items-start space-x-3">
                      <IconComponent className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-zinc-700">{feature.text}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* CTA Button */}
            <Button
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-3" />
                  Start Your Real Estate Journey
                </>
              )}
            </Button>

            <p className="text-center text-sm text-zinc-500 mt-4">
              Secure payment powered by Razorpay • Cancel anytime • 7-day money-back guarantee
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
            <Users className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="font-semibold text-zinc-950 mb-2">Trusted by 1000+ Agents</h3>
            <p className="text-zinc-600 text-sm">Real estate professionals across India trust our platform</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
            <Shield className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="font-semibold text-zinc-950 mb-2">Secure & Reliable</h3>
            <p className="text-zinc-600 text-sm">Bank-grade security with 99.9% uptime guarantee</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
            <Star className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="font-semibold text-zinc-950 mb-2">5-Star Support</h3>
            <p className="text-zinc-600 text-sm">Dedicated support team to help you succeed</p>
          </div>
        </div>
      </div>
    </div>
  );
}