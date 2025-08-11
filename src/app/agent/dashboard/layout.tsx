import { redirect } from 'next/navigation';
import Link from 'next/link';
import DashboardSidebar from './DashboardSidebar';
import DashboardMobileNav from './DashboardMobileNav';
import { InstantNavProvider } from '@/components/InstantNavProvider';
import ContentLoadingWrapper from './ContentLoadingWrapper';
import { getCachedSession, getCachedAgent } from '@/lib/dashboard-data';
import { getUserFlowStatus } from '@/lib/userFlow';

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

  return (
    <InstantNavProvider>
      <div className="min-h-screen bg-zinc-50">
        {/* Desktop Layout with Sidebar */}
        <div className="hidden md:flex">
          {/* Left Sidebar */}
          <DashboardSidebar user={session.user} agent={agent} />
          
          {/* Main Content Area */}
          <div className="flex-1 ml-64">
            <main className="p-6 max-w-7xl mx-auto">
              {!isActiveSubscription && (
                <div className="mb-4 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-900">
                  {isExpired && hasEverSubscribed ? (
                    <>
                      Your subscription expired on {subscriptionEndsAt?.toLocaleDateString('en-IN')}. Renew to restore publishing and all features.
                      <Link href="/agent/dashboard/subscription" className="ml-2 underline text-yellow-900 hover:text-yellow-800">Renew now</Link>
                    </>
                  ) : (
                    <>
                      You’re not subscribed. Subscribe to publish your profile and unlock all features.
                      <Link href="/agent/dashboard/subscription" className="ml-2 underline text-yellow-900 hover:text-yellow-800">Subscribe now</Link>
                    </>
                  )}
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
              <div className="mb-4 rounded-lg border border-yellow-300 bg-yellow-50 p-3 text-xs text-yellow-900">
                {isExpired && hasEverSubscribed ? (
                  <>
                    Subscription expired on {subscriptionEndsAt?.toLocaleDateString('en-IN')}. 
                    <Link href="/agent/dashboard/subscription" className="ml-1 underline text-yellow-900 hover:text-yellow-800">Renew</Link>
                  </>
                ) : (
                  <>
                    You’re not subscribed. 
                    <Link href="/agent/dashboard/subscription" className="ml-1 underline text-yellow-900 hover:text-yellow-800">Subscribe</Link>
                  </>
                )}
              </div>
            )}
            <ContentLoadingWrapper>
              {children}
            </ContentLoadingWrapper>
          </main>

          {/* Mobile Bottom Navigation */}
          <DashboardMobileNav />
        </div>
      </div>
    </InstantNavProvider>
  );
}