import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plus, Home } from 'lucide-react';
import { getCachedSession, getCachedAllProperties } from '@/lib/dashboard-data';
import MobilePropertiesTabs from '@/components/MobilePropertiesTabs';
import DesktopPropertiesGrid from '@/components/DesktopPropertiesGrid';

interface Property {
  id: string;
  slug: string;
  agentId: string;
  title: string;
  description: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  location: string;
  amenities: string[];
  photos: string[];
  status: string;
  listingType: string;
  propertyType: string;
}

export default async function PropertiesPage() {
  // Use cached session
  const session = await getCachedSession();
  
  if (!session?.user) {
    redirect('/api/auth/signin');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session as any).user.id as string;

  // Use cached properties
  const properties = await getCachedAllProperties(userId);

  // Filter properties with valid slugs and group by listing type
  const validProperties = properties.filter(p => p.slug !== null) as Property[];
  const saleProperties = validProperties.filter(p => p.listingType === 'Sale');
  const rentProperties = validProperties.filter(p => p.listingType === 'Rent');

  return (
    <div className="h-full">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-zinc-200 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-zinc-950">Properties</h1>
            <div className="flex gap-3 mt-1 text-xs text-zinc-500">
              <span>Sale: {saleProperties.length}</span>
              <span>Rent: {rentProperties.length}</span>
            </div>
          </div>
          <Link
            href="/agent/dashboard/properties/new"
            className="inline-flex items-center justify-center w-10 h-10 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-950">Properties</h1>
          <p className="text-zinc-600 mt-1">Manage your property listings</p>
        </div>
        <Link
          href="/agent/dashboard/properties/new"
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Property
        </Link>
      </div>

      {/* Mobile Tabs */}
      <div className="md:hidden">
        <MobilePropertiesTabs 
          saleProperties={saleProperties}
          rentProperties={rentProperties}
        />
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:block">
        <DesktopPropertiesGrid 
          saleProperties={saleProperties}
          rentProperties={rentProperties}
        />
      </div>

      {/* Empty State for Desktop */}
      {validProperties.length === 0 && (
        <div className="hidden md:flex items-center justify-center py-12">
          <div className="text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="w-8 h-8 text-zinc-400" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 mb-2">No properties yet</h3>
            <p className="text-zinc-600 mb-6">Start building your property portfolio by adding your first listing.</p>
            <Link
              href="/agent/dashboard/properties/new"
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Property
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}