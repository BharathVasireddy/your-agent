import { redirect } from 'next/navigation';
import { getCachedSession, getCachedAgentProfile } from '@/lib/dashboard-data';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import BuildersManager from './BuildersManager';

export default async function BuildersPage() {
  const raw = await getCachedSession();
  const session = raw as { user?: { id?: string } } | null;
  if (!session?.user?.id) {
    redirect('/login');
  }

  const userId = session.user.id as string;
  const agent = await getCachedAgentProfile(userId);
  if (!agent) redirect('/subscribe');

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-sm">
        <Link href="/agent/dashboard/customise-website" className="text-zinc-500 hover:text-brand transition-colors flex items-center space-x-1">
          <ArrowLeft className="w-4 h-4" />
          <span>Customise Website</span>
        </Link>
        <span className="text-zinc-300">/</span>
        <span className="text-zinc-900 font-medium">Builders</span>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-zinc-950">Past Builders</h1>
        <p className="text-zinc-600 mt-1">Add builders you have worked with to enhance credibility</p>
      </div>

      <BuildersManager agent={agent as unknown as { id: string; builders?: Array<{ id: string; name: string; logoUrl: string; websiteUrl: string | null }> }} />
    </div>
  );
}


