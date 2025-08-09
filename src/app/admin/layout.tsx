import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/admin';
import AdminSidebar from './AdminSidebar';
import AdminMobileNav from './AdminMobileNav';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  if (!admin) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Desktop Layout with Sidebar */}
      <div className="hidden md:flex">
        {/* Left Sidebar */}
        <AdminSidebar adminEmail={admin.email} />
        
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
        <AdminMobileNav />
      </div>
    </div>
  );
}


