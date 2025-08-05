'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Sparkles, User, Home, Settings } from 'lucide-react';
import { grantSubscription } from '@/app/actions';
import type { UserFlowStatus } from '@/lib/userFlow';

import type { ExtendedSession } from '@/types/dashboard';

interface WelcomeFlowProps {
  session: ExtendedSession;
  flowStatus: UserFlowStatus;
}

export default function WelcomeFlow({ session, flowStatus }: WelcomeFlowProps) {
  const router = useRouter();
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionComplete, setSubscriptionComplete] = useState(!flowStatus.needsSubscription);
  const [error, setError] = useState<string | null>(null);

  // Auto-subscribe Google users
  useEffect(() => {
    const autoSubscribe = async () => {
      if (flowStatus.needsSubscription && !isSubscribing) {
        try {
          setIsSubscribing(true);
          await grantSubscription();
          setSubscriptionComplete(true);
        } catch (error) {
          console.error('Auto-subscription failed:', error);
          setError(error instanceof Error ? error.message : 'Failed to activate your account');
        } finally {
          setIsSubscribing(false);
        }
      }
    };

    autoSubscribe();
  }, [flowStatus.needsSubscription, isSubscribing]);

  const handleStartOnboarding = () => {
    router.push('/onboarding/wizard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-zinc-950 mb-4">
            Welcome to YourAgent! 🎉
          </h1>
          <p className="text-lg text-zinc-600 max-w-lg mx-auto">
            Let&apos;s set up your professional real estate profile and get you started with your digital presence.
          </p>
        </div>

        {/* Progress Card */}
        <div className="bg-white rounded-xl shadow-lg border border-zinc-200 p-8">
          <div className="space-y-6">
            {/* Account Activation */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  subscriptionComplete ? 'bg-green-100' : isSubscribing ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  {subscriptionComplete ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : isSubscribing ? (
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <User className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-950">Account Activation</h3>
                  <p className="text-sm text-zinc-600">
                    {subscriptionComplete 
                      ? 'Your account is active and ready!' 
                      : isSubscribing 
                      ? 'Activating your account...' 
                      : 'Activating your professional account'}
                  </p>
                </div>
              </div>
              {subscriptionComplete && (
                <div className="text-green-600 font-medium">Complete</div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  Try Again
                </Button>
              </div>
            )}

            {/* Profile Setup */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-950">Profile Setup</h3>
                  <p className="text-sm text-zinc-600">
                    Complete your professional profile in 4 easy steps
                  </p>
                </div>
              </div>
              <div className="text-gray-500 font-medium">Next</div>
            </div>

            {/* Dashboard Access */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <Home className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-950">Dashboard Access</h3>
                  <p className="text-sm text-zinc-600">
                    Access your professional dashboard and tools
                  </p>
                </div>
              </div>
              <div className="text-gray-500 font-medium">Pending</div>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-semibold text-red-900 mb-2">
              Hi {session.user.name}! 👋
            </h3>
            <p className="text-red-800 text-sm mb-4">
              We&apos;ve automatically activated your account with your Google login. 
              Now let&apos;s set up your professional profile so clients can find and connect with you.
            </p>
            <div className="text-xs text-red-700">
              <strong>What&apos;s next:</strong> You&apos;ll complete a quick 4-step setup to create your 
              professional profile, then get access to your dashboard with property management tools.
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-8 text-center">
            <Button
              onClick={handleStartOnboarding}
              disabled={!subscriptionComplete || isSubscribing}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg"
            >
              {!subscriptionComplete ? (
                'Activating Account...'
              ) : (
                <>
                  Start Profile Setup
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
            <p className="text-sm text-zinc-500 mt-3">
              Takes about 3-5 minutes to complete
            </p>
          </div>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 text-center border border-zinc-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-medium text-zinc-950 mb-1">Professional Profile</h3>
            <p className="text-xs text-zinc-600">Showcase your expertise and credentials</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 text-center border border-zinc-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Home className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-medium text-zinc-950 mb-1">Property Management</h3>
            <p className="text-xs text-zinc-600">Manage your listings effortlessly</p>
          </div>
          
          <div className="bg-white rounded-lg p-4 text-center border border-zinc-200">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-medium text-zinc-950 mb-1">AI-Powered Tools</h3>
            <p className="text-xs text-zinc-600">Generate content with AI assistance</p>
          </div>
        </div>
      </div>
    </div>
  );
}