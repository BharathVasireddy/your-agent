import { redirect } from 'next/navigation';
import SettingsContent from './SettingsContent';
import { getCachedSession, getCachedAgent } from '@/lib/dashboard-data';

export default async function SettingsPage() {
  // Use cached session
  const session = await getCachedSession();
  
  if (!session?.user) {
    redirect('/login');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session as any).user.id as string;

  // Use cached agent data - user data is already in session
  const agent = await getCachedAgent(userId);

  const user = {
    id: userId,
    name: (session as unknown as { user?: { name?: string | null } }).user?.name ?? null,
    email: (session as unknown as { user?: { email?: string | null } }).user?.email ?? null,
    image: (session as unknown as { user?: { image?: string | null } }).user?.image ?? null,
  } satisfies { id: string; name: string | null; email: string | null; image: string | null };

  if (!user) {
    redirect('/login');
  }

  return <SettingsContent user={user} agent={agent} />;
}