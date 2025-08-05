import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
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

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Desktop Layout with Sidebar */}
      <div className="hidden md:flex">
        {/* Left Sidebar */}
        <DashboardSidebar user={session.user} />
        
        {/* Main Content Area */}
        <div className="flex-1 ml-64">
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden pb-20">
        {/* Mobile Header */}
        <header className="bg-white border-b border-zinc-200 px-4 py-4">
          <h1 className="text-xl font-bold text-zinc-950">Agent Dashboard</h1>
          <span className="text-sm text-zinc-500">
            Welcome back, {session.user.name}
          </span>
        </header>

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