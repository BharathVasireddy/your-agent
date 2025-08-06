'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Loader2, TestTube, CheckCircle } from 'lucide-react';
import { UserFlowStatus } from '@/lib/userFlow';
import { grantSubscription } from '@/app/actions';

interface TestPaymentPageProps {
  session: {
    user: {
      id: string;
      email: string;
      name: string;
    };
  };
  flowStatus: UserFlowStatus;
}

export default function TestPaymentPage({ session }: TestPaymentPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleTestPayment = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Grant subscription directly
      await grantSubscription();
      
      setSuccess(true);
      
      // Redirect to onboarding after a short delay
      setTimeout(() => {
        router.push('/onboarding/wizard');
      }, 1500);

    } catch (error) {
      console.error('Test payment error:', error);
      setError(error instanceof Error ? error.message : 'Test payment failed');
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-xl border border-green-200 p-12">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-zinc-950 mb-4">
              Test Payment Successful!
            </h1>
            <p className="text-lg text-zinc-600 mb-6">
              Your subscription has been activated. Redirecting to onboarding...
            </p>
            <div className="w-full bg-green-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full animate-pulse w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Warning Banner */}
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg mb-8">
          <div className="flex items-center">
            <TestTube className="w-5 h-5 mr-2" />
            <span className="font-medium">Development Mode - Test Payment</span>
          </div>
        </div>

        {/* Test Payment Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-zinc-200 overflow-hidden">
          <div className="bg-yellow-500 text-white text-center py-4">
            <span className="text-sm font-medium uppercase tracking-wide">Test Environment</span>
          </div>
          
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-zinc-950 mb-4">
                Test Subscription Flow
              </h1>
              <p className="text-lg text-zinc-600">
                Welcome {session.user.name}! This is a test environment for the subscription flow.
              </p>
            </div>

            {/* Test Info */}
            <div className="bg-zinc-50 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-zinc-950 mb-4">What this test does:</h3>
              <ul className="space-y-2 text-zinc-700">
                <li>• Simulates the ₹499/month subscription payment</li>
                <li>• Grants you instant access without real payment</li>
                <li>• Activates your subscription for 1 year</li>
                <li>• Redirects you to the onboarding wizard</li>
              </ul>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Test Payment Button */}
            <Button
              onClick={handleTestPayment}
              disabled={isLoading}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-lg py-6 rounded-xl font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Processing Test Payment...
                </>
              ) : (
                <>
                  <TestTube className="w-5 h-5 mr-3" />
                  Simulate ₹499/month Payment
                </>
              )}
            </Button>

            <div className="text-center mt-6">
              <p className="text-sm text-zinc-500">
                This is for testing only. No real payment will be processed.
              </p>
              <Link 
                href="/subscribe" 
                className="text-yellow-600 hover:text-yellow-700 underline text-sm"
              >
                Go to real payment page →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}