import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Home, Building, User, LogOut } from 'lucide-react';
import SignOutButton from './SignOutButton';

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
    <div className="min-h-screen bg-zinc-50 pb-20">
      {/* Dashboard Header */}
      <header className="bg-white border-b border-zinc-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-zinc-950">Agent Dashboard</h1>
              <span className="text-sm text-zinc-500 hidden sm:block">
                Welcome back, {session.user.name}
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/agent/dashboard"
                className="text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/agent/dashboard/properties"
                className="text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                Properties
              </Link>
              <Link
                href="/agent/dashboard/profile"
                className="text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                Profile
              </Link>
              <SignOutButton className="text-red-600 hover:text-red-700 transition-colors" />
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-6">
        {children}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav id="bottom-nav" className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 md:hidden">
        <div className="grid grid-cols-4 h-16">
          <Link
            href="/agent/dashboard"
            className="flex flex-col items-center justify-center space-y-1 text-zinc-600 hover:text-red-600 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Dashboard</span>
          </Link>
          
          <Link
            href="/agent/dashboard/properties"
            className="flex flex-col items-center justify-center space-y-1 text-zinc-600 hover:text-red-600 transition-colors"
          >
            <Building className="w-5 h-5" />
            <span className="text-xs">Properties</span>
          </Link>
          
          <Link
            href="/agent/dashboard/profile"
            className="flex flex-col items-center justify-center space-y-1 text-zinc-600 hover:text-red-600 transition-colors"
          >
            <User className="w-5 h-5" />
            <span className="text-xs">Profile</span>
          </Link>
          
          <SignOutButton className="flex flex-col items-center justify-center space-y-1 text-zinc-600 hover:text-red-600 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="text-xs">Sign Out</span>
          </SignOutButton>
        </div>
      </nav>
    </div>
  );
}