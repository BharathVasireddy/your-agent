import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import DashboardSidebar from './DashboardSidebar';
import DashboardMobileNav from './DashboardMobileNav';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/api/auth/signin');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session as any).user.id as string;

  // Fetch agent profile for sidebar
  const agent = await prisma.agent.findUnique({
    where: { userId },
    include: { user: true }
  });

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Desktop Layout with Sidebar */}
      <div className="hidden md:flex">
        {/* Left Sidebar */}
        <DashboardSidebar user={session.user} agent={agent} />
        
        {/* Main Content Area */}
        <div className="flex-1 ml-64">
          <main className="p-6 max-w-7xl mx-auto">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden pb-20">
        {/* Mobile Main Content */}
        <main className="p-4">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <DashboardMobileNav />
      </div>
    </div>
  );
}