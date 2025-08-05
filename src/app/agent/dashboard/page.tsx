import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import DashboardWithTour from './DashboardWithTour';
import type { Property } from '@/types/dashboard';

export default async function DashboardPage() {
  // Get the current user's session
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/api/auth/signin');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session as any).user.id as string;

  // Fetch agent profile and properties
  const [agent, properties] = await Promise.all([
    prisma.agent.findUnique({
      where: { userId },
      include: { user: true }
    }),
    prisma.property.findMany({
      where: { agent: { userId } },
      orderBy: { createdAt: 'desc' },
      take: 5 // Show only recent 5 properties
    })
  ]);

  // Filter properties with valid slugs
  const validProperties = properties.filter(p => p.slug !== null) as Property[];
  
  const saleProperties = validProperties.filter(p => p.listingType === 'Sale').length;
  const rentProperties = validProperties.filter(p => p.listingType === 'Rent').length;
  const availableProperties = validProperties.filter(p => p.status === 'Available').length;

  const needsTour = agent ? !agent.hasSeenTour : false;

  return (
    <DashboardWithTour 
      needsTour={needsTour}
      agent={agent}
      properties={validProperties}
      saleProperties={saleProperties}
      rentProperties={rentProperties}
      availableProperties={availableProperties}
    />
  );
}

