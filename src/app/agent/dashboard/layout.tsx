import { redirect } from 'next/navigation';
import Link from 'next/link';
import ModernDashboardSidebar from './ModernDashboardSidebar';
import ModernDashboardMobileNav from './ModernDashboardMobileNav';
import { InstantNavProvider } from '@/components/InstantNavProvider';
import ContentLoadingWrapper from './ContentLoadingWrapper';
import { getCachedSession, getCachedAgent } from '@/lib/dashboard-data';
import { getUserFlowStatus } from '@/lib/userFlow';
import type { Plan } from '@/lib/subscriptions';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use cached session check
  const session = await getCachedSession();
  
  if (!session?.user) {
    redirect('/login');
  }

  // Check user flow status to ensure they should be on dashboard
  const flowStatus = await getUserFlowStatus();

  // If session cookie exists but underlying DB user is missing or invalid,
  // the flow will report not authenticated. Redirect to login in that case.
  if (!flowStatus.isAuthenticated) {
    redirect('/login');
  }

  // If user needs onboarding, redirect them
  if (flowStatus.needsOnboarding) {
    redirect('/onboarding/wizard');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session as any).user.id as string;

  // Use cached agent lookup - same cache as used in pages
  const agent = await getCachedAgent(userId);
  const subscriptionEndsAt = agent?.subscriptionEndsAt ? new Date(agent.subscriptionEndsAt) : null;
  const isActiveSubscription = !!agent?.isSubscribed && !!subscriptionEndsAt && subscriptionEndsAt > new Date();
  const hasEverSubscribed = !!subscriptionEndsAt; // if we have an end date, they had a subscription at some point
  const isExpired = !!subscriptionEndsAt && subscriptionEndsAt <= new Date();
  const plan = (agent?.subscriptionPlan as Plan) ?? 'starter';

  return (
    <InstantNavProvider>
      <div className="min-h-screen bg-zinc-50">
        {/* Desktop Layout with Sidebar */}
        <div className="hidden md:flex">
          {/* Left Sidebar */}
          <ModernDashboardSidebar user={session.user} agent={agent} plan={plan} />
          
          {/* Main Content Area */}
          <div className="flex-1 ml-64">
            <main className="p-6 max-w-7xl mx-auto">
              {!isActiveSubscription && (
                <div className="mb-4 rounded-xl border border-orange-200 bg-orange-50 p-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <span className="text-xl">🚀</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-orange-900 mb-1">
                        {isExpired && hasEverSubscribed ? 'Subscription Expired' : 'Unlock Your Full Potential! ✨'}
                      </h3>
                      <p className="text-sm text-orange-800">
                        {isExpired && hasEverSubscribed ? (
                          <>Your subscription expired on {subscriptionEndsAt?.toLocaleDateString('en-IN')}. Renew to restore publishing and access all premium features.</>
                        ) : (
                          <>Get access to advanced analytics, priority support, and publish your profile to attract more clients.</>
                        )}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <Link
                        href="/agent/dashboard/subscription"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-brand hover:bg-brand-hover text-white font-medium rounded-lg transition-colors"
                      >
                        <span>{isExpired && hasEverSubscribed ? 'Renew Now' : 'Subscribe Now'}</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
              <ContentLoadingWrapper>
                {children}
              </ContentLoadingWrapper>
            </main>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden pb-20">
          {/* Mobile Main Content */}
          <main className="p-4">
            {!isActiveSubscription && (
              <div className="mb-4 rounded-xl border border-orange-200 bg-orange-50 p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">🚀</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-orange-900 mb-1">
                      {isExpired && hasEverSubscribed ? 'Subscription Expired' : 'Unlock Premium Features! ✨'}
                    </h3>
                    <p className="text-xs text-orange-800 mb-3 leading-relaxed">
                      {isExpired && hasEverSubscribed ? (
                        <>Expired on {subscriptionEndsAt?.toLocaleDateString('en-IN')}. Renew to restore all features.</>
                      ) : (
                        <>Get analytics, priority support, and publish your profile.</>
                      )}
                    </p>
                    <Link
                      href="/agent/dashboard/subscription"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-brand hover:bg-brand-hover text-white text-xs font-semibold rounded-lg transition-colors shadow-md"
                    >
                      <span>{isExpired && hasEverSubscribed ? 'Renew Now' : 'Subscribe Now'}</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}
            <ContentLoadingWrapper>
              {children}
            </ContentLoadingWrapper>
          </main>

          {/* Mobile Bottom Navigation */}
          <ModernDashboardMobileNav plan={plan} />
        </div>
      </div>
    </InstantNavProvider>
  );
}