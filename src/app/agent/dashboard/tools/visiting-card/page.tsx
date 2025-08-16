import { redirect } from 'next/navigation';
import { getCachedSession, getCachedAgent } from '@/lib/dashboard-data';
import VisitingCardGenerator from './visiting-card';

export default async function VisitingCardPage() {
  const session = await getCachedSession();
  if (!session?.user) redirect('/login');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session as any).user.id as string;
  const agent = await getCachedAgent(userId);
  if (!agent) redirect('/subscribe');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-950">Visiting Card</h1>
        <p className="text-zinc-600 mt-1">Generate and download your professional visiting card. Details are read from your profile.</p>
      </div>
      <VisitingCardGenerator agent={agent} />
    </div>
  );
}


