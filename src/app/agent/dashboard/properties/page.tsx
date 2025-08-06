import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Home, Edit, Trash2, ImageIcon } from 'lucide-react';
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
          <Plus className="w-5 h-5 mr-2" />
          Add New Property
        </Link>
      </div>

      {/* Properties Content */}
      <div className="px-4 md:px-0">
        {validProperties.length === 0 ? (
          /* No Properties Message */
          <div className="text-center py-12 md:py-16">
            <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-zinc-100 rounded-full mb-4">
              <Home className="w-6 h-6 md:w-8 md:h-8 text-zinc-400" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-zinc-950 mb-2">No Properties Yet</h3>
            <p className="text-zinc-600 mb-6 text-sm md:text-base">You haven&apos;t added any properties yet.</p>
            <Link
              href="/agent/dashboard/properties/new"
              className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm md:text-base"
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Add Your First Property
            </Link>
          </div>
        ) : (
          /* Properties Organized by Category */
          <div className="space-y-6 md:space-y-10">
            {/* For Sale Properties */}
            {saleProperties.length > 0 && (
              <div>
                <div className="flex items-center mb-4 md:mb-6">
                  <h2 className="text-lg md:text-2xl font-bold text-zinc-950">For Sale</h2>
                  <span className="ml-2 md:ml-3 px-2 py-1 bg-green-100 text-green-800 text-xs md:text-sm font-medium rounded-full">
                    {saleProperties.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {saleProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              </div>
            )}

            {/* For Rent Properties */}
            {rentProperties.length > 0 && (
              <div>
                <div className="flex items-center mb-4 md:mb-6">
                  <h2 className="text-lg md:text-2xl font-bold text-zinc-950">For Rent</h2>
                  <span className="ml-2 md:ml-3 px-2 py-1 bg-blue-100 text-blue-800 text-xs md:text-sm font-medium rounded-full">
                    {rentProperties.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {rentProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Property Card Component
interface Property {
  id: string;
  slug: string;
  title: string;
  price: number;
  photos: string[];
  status: string;
  listingType: string;
  propertyType: string;
}

function PropertyCard({ property }: { property: Property }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Property Photo */}
      <div className="aspect-[4/3] md:aspect-video bg-zinc-100 relative">
        {property.photos.length > 0 ? (
          <Image
            src={property.photos[0]}
            alt={property.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-8 h-8 md:w-12 md:h-12 text-zinc-400" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-2 right-2">
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
        <div className="absolute top-2 left-2">
          <span className="px-2 py-1 text-xs font-medium bg-white/90 text-zinc-700 rounded-full">
            {property.propertyType}
          </span>
        </div>
      </div>

      {/* Property Details */}
      <div className="p-3 md:p-4">
        <h3 className="font-semibold text-sm md:text-lg text-zinc-950 mb-2 line-clamp-2">
          {property.title}
        </h3>
        <p className="text-lg md:text-2xl font-bold text-red-600 mb-3 md:mb-4">
          ₹{property.price.toLocaleString()}
          <span className="text-xs md:text-sm font-normal text-zinc-500 ml-1">
            / {property.listingType === 'Rent' ? 'month' : 'total'}
          </span>
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            href={`/agent/dashboard/properties/${property.slug}/edit`}
            className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-zinc-100 text-zinc-700 rounded-lg hover:bg-zinc-200 transition-colors text-xs md:text-sm font-medium"
          >
            <Edit className="w-3 h-3 md:w-4 md:h-4 mr-1" />
            Edit
          </Link>
          <Link
            href={`/agent/dashboard/properties/${property.slug}/delete`}
            className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-xs md:text-sm font-medium"
          >
            <Trash2 className="w-3 h-3 md:w-4 md:h-4 mr-1" />
            Delete
          </Link>
        </div>
      </div>
    </div>
  );
}