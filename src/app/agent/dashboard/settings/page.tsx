import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import SettingsContent from './SettingsContent';

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/api/auth/signin');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session as any).user.id as string;

  // Fetch user and agent data
  const [user, agent] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      }
    }),
    prisma.agent.findUnique({
      where: { userId },
      select: {
        id: true,
        slug: true,
        profilePhotoUrl: true,
        bio: true,
        experience: true,
        city: true,
        area: true,
        phone: true,
        isSubscribed: true,
        createdAt: true,
      }
    })
  ]);

  if (!user) {
    redirect('/api/auth/signin');
  }

  return <SettingsContent user={user} agent={agent} />;
}