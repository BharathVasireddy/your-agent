import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import ProfileEditForm from './ProfileEditForm';

export default async function ProfilePage() {
  // Get the current user's session
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/api/auth/signin');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session as any).user.id as string;

  // Fetch agent profile
  const agent = await prisma.agent.findUnique({
    where: { userId },
    include: { user: true }
  });

  if (!agent) {
    redirect('/subscribe');
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-zinc-950">Edit Profile</h1>
        <p className="text-zinc-600 mt-1">Manage your agent profile and settings</p>
      </div>

      {/* Profile Edit Form */}
      <ProfileEditForm agent={agent} />
    </div>
  );
}