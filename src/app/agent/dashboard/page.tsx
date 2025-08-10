import { redirect } from 'next/navigation';
import DashboardContent from './DashboardContent';
import type { Property } from '@/types/dashboard';
import { 
  getCachedSession, 
  getCachedAgent, 
  getCachedDashboardProperties,
  getPropertyCounts 
} from '@/lib/dashboard-data';

export default async function DashboardPage() {
  // Use cached session
  const session = await getCachedSession();
  
  if (!session?.user) {
    redirect('/login');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session as any).user.id as string;

  // Use cached data - these are now shared across layout and page
  const [agent, properties, counts] = await Promise.all([
    getCachedAgent(userId),
    getCachedDashboardProperties(userId),
    getPropertyCounts(userId)
  ]);

  // Filter properties with valid slugs
  const validProperties = properties.filter(p => p.slug !== null) as Property[];

  return (
    <DashboardContent 
      agent={agent}
      properties={validProperties}
      saleProperties={counts.saleProperties}
      rentProperties={counts.rentProperties}
      availableProperties={counts.availableProperties}
    />
  );
}