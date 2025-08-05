import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';

export default async function PropertiesPage() {
  // Get the current user's session
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/api/auth/signin');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session as any).user.id as string;

  // Fetch all properties belonging to this agent
  const properties = await prisma.property.findMany({
    where: {
      agent: {
        userId: userId
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Group properties by listing type
  const saleProperties = properties.filter(p => p.listingType === 'Sale');
  const rentProperties = properties.filter(p => p.listingType === 'Rent');

  return (
    <div className="container mx-auto p-6">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-950">My Properties</h1>
          <p className="text-zinc-600 mt-1">Manage your property listings</p>
          <div className="flex gap-4 mt-3 text-sm text-zinc-500">
            <span>For Sale: {saleProperties.length}</span>
            <span>For Rent: {rentProperties.length}</span>
            <span>Total: {properties.length}</span>
          </div>
        </div>
        
        {/* Add New Property Button */}
        <Link
          href="/agent/dashboard/properties/new"
          className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Property
        </Link>
      </div>

      {/* Properties Content */}
      {properties.length === 0 ? (
        /* No Properties Message */
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-zinc-950 mb-2">No Properties Yet</h3>
          <p className="text-zinc-600 mb-6">You haven&apos;t added any properties yet.</p>
          <Link
            href="/agent/dashboard/properties/new"
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Add Your First Property
          </Link>
        </div>
      ) : (
        /* Properties Organized by Category */
        <div className="space-y-10">
          {/* For Sale Properties */}
          {saleProperties.length > 0 && (
            <div>
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-zinc-950">For Sale</h2>
                <span className="ml-3 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                  {saleProperties.length} {saleProperties.length === 1 ? 'Property' : 'Properties'}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {saleProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </div>
          )}

          {/* For Rent Properties */}
          {rentProperties.length > 0 && (
            <div>
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-zinc-950">For Rent</h2>
                <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {rentProperties.length} {rentProperties.length === 1 ? 'Property' : 'Properties'}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rentProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Property Card Component
interface Property {
  id: string;
  title: string;
  price: number;
  photos: string[];
  status: string;
  listingType: string;
  propertyType: string;
}

function PropertyCard({ property }: { property: Property }) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-zinc-200 overflow-hidden">
      {/* Property Photo */}
      <div className="aspect-video bg-zinc-100 relative">
        {property.photos.length > 0 ? (
          <img
            src={property.photos[0]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            property.status === 'Available' 
              ? 'bg-green-100 text-green-800'
              : property.status === 'Sold'
              ? 'bg-red-100 text-red-800'
              : property.status === 'Rented'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-zinc-100 text-zinc-800'
          }`}>
            {property.status}
          </span>
        </div>

        {/* Property Type Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 text-xs font-medium bg-white/90 text-zinc-700 rounded-full">
            {property.propertyType}
          </span>
        </div>
      </div>

      {/* Property Details */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-zinc-950 mb-2 line-clamp-1">
          {property.title}
        </h3>
        <p className="text-2xl font-bold text-red-600 mb-4">
          ₹{property.price.toLocaleString()}
          <span className="text-sm font-normal text-zinc-500 ml-1">
            / {property.listingType === 'Rent' ? 'month' : 'total'}
          </span>
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            href={`/agent/dashboard/properties/${property.id}/edit`}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-zinc-100 text-zinc-700 rounded-lg hover:bg-zinc-200 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </Link>
          <Link
            href={`/agent/dashboard/properties/${property.id}/delete`}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </Link>
        </div>
      </div>
    </div>
  );
}