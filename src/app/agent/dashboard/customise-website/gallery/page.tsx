import { redirect } from 'next/navigation';
import { getCachedSession, getCachedAgentProfile } from '@/lib/dashboard-data';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import GalleryManager from './GalleryManager';

export default async function GalleryPage() {
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
        <span className="text-zinc-900 font-medium">Gallery</span>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-zinc-950">Manage Gallery</h1>
        <p className="text-zinc-600 mt-1">Upload and organize photos in your public gallery</p>
      </div>

      <GalleryManager agent={agent as unknown as { id: string; galleryImages?: Array<{ id: string; imageUrl: string; caption: string | null }> }} />
    </div>
  );
}


