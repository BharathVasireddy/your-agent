import { redirect } from 'next/navigation';
import ProfileEditFormBasic from './ProfileEditFormBasic';
import { getCachedSession, getCachedAgent } from '@/lib/dashboard-data';

export default async function ProfilePage() {
  // Use cached session
  const session = await getCachedSession();
  
  if (!session?.user) {
    redirect('/api/auth/signin');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session as any).user.id as string;

  // Use cached agent data
  const agent = await getCachedAgent(userId);

  if (!agent) {
    redirect('/subscribe');
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-zinc-950">Edit Profile</h1>
        <p className="text-zinc-600 mt-1">Manage your basic professional information and settings</p>
      </div>

      {/* Profile Edit Form */}
      <ProfileEditFormBasic agent={agent} />
    </div>
  );
}