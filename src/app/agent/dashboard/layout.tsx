import { redirect } from 'next/navigation';
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
    redirect('/api/auth/signin');
  }

  // Check user flow status to ensure they should be on dashboard
  const flowStatus = await getUserFlowStatus();
  
  // If user needs onboarding or subscription, redirect them
  if (flowStatus.needsSubscription || flowStatus.needsOnboarding) {
    redirect(flowStatus.redirectTo);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session as any).user.id as string;

  // Use cached agent lookup - same cache as used in pages
  const agent = await getCachedAgent(userId);

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