import { redirect } from 'next/navigation';
import ModernDashboardContent from './ModernDashboardContent';
import type { Property, AgentProfile } from '@/types/dashboard';
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
    <ModernDashboardContent 
      agent={agent as AgentProfile | null}
      properties={validProperties}
      saleProperties={counts.saleProperties}
      rentProperties={counts.rentProperties}
      availableProperties={counts.availableProperties}
    />
  );
}