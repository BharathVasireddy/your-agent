import { redirect } from 'next/navigation';
import SettingsContent from './SettingsContent';
import { getCachedSession, getCachedAgent } from '@/lib/dashboard-data';

export default async function SettingsPage() {
  // Use cached session
  const session = await getCachedSession();
  
  if (!session?.user) {
    redirect('/api/auth/signin');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session as any).user.id as string;

  // Use cached agent data - user data is already in session
  const agent = await getCachedAgent(userId);

  const user = {
    id: userId,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
  };

  if (!user) {
    redirect('/api/auth/signin');
  }

  return <SettingsContent user={user} agent={agent} />;
}