import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plus, Home } from 'lucide-react';
import { getCachedSession, getFilteredAgentProperties, getCachedAgent } from '@/lib/dashboard-data';
import prisma from '@/lib/prisma';
import { ENTITLEMENTS, type Plan } from '@/lib/subscriptions';
import PropertiesViewToggle from '@/components/PropertiesViewToggle';
import PropertiesFilterBar from '@/components/PropertiesFilterBar';
import PropertiesTable from '@/components/PropertiesTable';
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

export default async function PropertiesPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  // Use cached session
  const session = await getCachedSession();
  
  if (!session?.user) {
    redirect('/login');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session as any).user.id as string;

  const params = await searchParams;
  const listingType = params.listingType || undefined;
  const propertyType = params.propertyType || undefined;
  // status filter removed from UI; keep reading for backward compatibility but unused in query build
  const status = params.status || undefined;
  const q = params.q || undefined;
  const area = params.area || undefined;
  const view = (params.view as 'cards' | 'table') || 'cards';
  const page = params.page ? parseInt(params.page) || 1 : 1;

  const { items, total, pages } = await getFilteredAgentProperties(userId, {
    listingType,
    propertyType,
    status,
    area,
    page,
    take: 12,
    q,
  });

  // Quota info
  const agent = await getCachedAgent(userId);
  const plan: Plan = (agent?.subscriptionPlan as Plan | null) ?? 'starter';
  const limit = ENTITLEMENTS[plan].listingLimit;
  const limitNumber = Number.isFinite(limit) ? (limit as number) : null;
  const overallCount = await prisma.property.count({ where: { agent: { userId } } });

  const saleProperties = items.filter(p => p.listingType === 'Sale') as unknown as Property[];
  const rentProperties = items.filter(p => p.listingType === 'Rent') as unknown as Property[];

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
            {limitNumber !== null && (
              <div className="mt-2 text-[10px] text-zinc-600">
                <div className="w-full h-1.5 bg-zinc-200 rounded overflow-hidden">
                  <div
                   className="h-1.5 bg-brand"
                    style={{ width: `${Math.min(100, Math.round((total / limitNumber) * 100))}%` }}
                  />
                </div>
                <div className="mt-1">{total} / {limitNumber} used</div>
              </div>
            )}
          </div>
          <Link
            href="/agent/dashboard/properties/new"
          className="inline-flex items-center justify-center w-10 h-10 bg-brand text-white rounded-full hover:bg-brand-hover transition-colors"
          >
            <Plus className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-zinc-950">Properties</h1>
          <p className="text-zinc-600 mt-1">Manage your property listings</p>
          {limitNumber !== null && (
            <div className="mt-2 text-xs text-zinc-600">
              <div className="flex items-center gap-2">
                <div className="w-40 h-2 bg-zinc-200 rounded overflow-hidden">
                  <div
                     className="h-2 bg-brand"
                    style={{ width: `${Math.min(100, Math.round((overallCount / limitNumber) * 100))}%` }}
                  />
                </div>
                <span>
                  {overallCount} / {limitNumber} listings used
                </span>
              </div>
              {overallCount >= Math.max(0, limitNumber - 5) && overallCount < limitNumber && (
                <div className="text-orange-600 mt-1">Approaching your plan limit. Consider upgrading.</div>
              )}
              {overallCount >= limitNumber && (
               <div className="text-brand mt-1">You have reached your plan limit. Upgrade to add more listings.</div>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <PropertiesViewToggle initial={view} />
          <Link
          href="/agent/dashboard/properties/new"
          className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors ${limitNumber !== null && overallCount >= limitNumber ? 'bg-zinc-200 text-zinc-500 cursor-not-allowed' : 'bg-brand text-white hover:bg-brand-hover'}`}
          aria-disabled={limitNumber !== null && overallCount >= limitNumber}
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Property
        </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="hidden md:block mb-6">
        <PropertiesFilterBar />
      </div>

      {/* Mobile Tabs */}
      <div className="md:hidden">
        <MobilePropertiesTabs 
          saleProperties={saleProperties}
          rentProperties={rentProperties}
        />
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        {view === 'table' ? (
          <PropertiesTable
            rows={items.map(p => ({
              id: p.id,
              slug: p.slug,
              title: p.title,
              price: p.price,
              listingType: p.listingType,
              propertyType: p.propertyType,
              status: p.status,
              createdAt: p.createdAt.toISOString(),
            }))}
            total={total}
            page={page}
            pages={pages}
            basePath={"/agent/dashboard/properties"}
            query={{
              view,
              listingType: listingType || undefined,
              propertyType: propertyType || undefined,
              area: area || undefined,
              q: q || undefined,
            }}
          />
        ) : (
          <DesktopPropertiesGrid 
            saleProperties={saleProperties}
            rentProperties={rentProperties}
          />
        )}
      </div>

      {/* Empty State for Desktop */}
      {total === 0 && (
        <div className="hidden md:flex items-center justify-center py-12">
          <div className="text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="w-8 h-8 text-zinc-400" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 mb-2">No properties yet</h3>
            <p className="text-zinc-600 mb-6">Start building your property portfolio by adding your first listing.</p>
            <Link
              href="/agent/dashboard/properties/new"
              className="inline-flex items-center px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-hover transition-colors"
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