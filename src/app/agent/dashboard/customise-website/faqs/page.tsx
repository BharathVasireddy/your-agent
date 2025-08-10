import { redirect } from 'next/navigation';
import FaqsManager from './FaqsManager';
import { getCachedSession, getCachedAgentProfile } from '@/lib/dashboard-data';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function FaqsPage() {
  // Use cached session
  const session = await getCachedSession();
  
  if (!session?.user) {
    redirect('/login');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session as any).user.id as string;

  // Use cached agent profile with relations
  const agent = await getCachedAgentProfile(userId);

  if (!agent) {
    redirect('/subscribe');
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm">
        <Link 
          href="/agent/dashboard/customise-website" 
          className="text-zinc-500 hover:text-red-600 transition-colors flex items-center space-x-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Customise Website</span>
        </Link>
        <span className="text-zinc-300">/</span>
        <span className="text-zinc-900 font-medium">FAQs</span>
      </div>

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-zinc-950">Manage FAQs</h1>
        <p className="text-zinc-600 mt-1">Create and organize frequently asked questions for your profile page</p>
      </div>

      {/* FAQs Manager */}
      <FaqsManager agent={agent} />
    </div>
  );
}