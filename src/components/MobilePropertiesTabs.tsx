'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Edit, Trash2, ImageIcon } from 'lucide-react';

interface Property {
  id: string;
  slug: string;
  agentId: string;
  title: string;
  description: string;
  price: number;
  area: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  location: string;
  amenities: string[];
  photos: string[];
  status: string;
  listingType: string;
  propertyType: string;
}

interface MobilePropertiesTabsProps {
  saleProperties: Property[];
  rentProperties: Property[];
}

function PropertyCard({ property }: { property: Property }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Property Photo */}
      <div className="aspect-[4/3] bg-zinc-100 relative">
        {property.photos.length > 0 ? (
          <Image
            src={property.photos[0]}
            alt={property.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-zinc-400" />
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
      <div className="p-3">
        <h3 className="font-semibold text-sm text-zinc-950 mb-2 line-clamp-2">
          {property.title}
        </h3>
        <p className="text-lg font-bold text-red-600 mb-3">
          ₹{property.price.toLocaleString('en-IN')}
          <span className="text-xs font-normal text-zinc-500 ml-1">
            / {property.listingType === 'Rent' ? 'month' : 'total'}
          </span>
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            href={`/agent/dashboard/properties/${property.slug}/edit`}
            className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-zinc-100 text-zinc-700 rounded-lg hover:bg-zinc-200 transition-colors text-xs font-medium"
          >
            <Edit className="w-3 h-3 mr-1" />
            Edit
          </Link>
          <Link
            href={`/agent/dashboard/properties/${property.slug}/delete`}
            className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-xs font-medium"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Delete
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function MobilePropertiesTabs({ saleProperties, rentProperties }: MobilePropertiesTabsProps) {
  const [activeTab, setActiveTab] = useState<'sale' | 'rent'>('sale');

  return (
    <div className="md:hidden">
      {/* Tab Navigation */}
      <div className="bg-white border-b border-zinc-200 px-4 pt-4">
        <div className="flex">
          <button
            onClick={() => setActiveTab('sale')}
            className={`flex-1 pb-3 text-sm font-medium text-center border-b-2 transition-colors ${
              activeTab === 'sale'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-zinc-500 hover:text-zinc-700'
            }`}
          >
            For Sale ({saleProperties.length})
          </button>
          <button
            onClick={() => setActiveTab('rent')}
            className={`flex-1 pb-3 text-sm font-medium text-center border-b-2 transition-colors ${
              activeTab === 'rent'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-zinc-500 hover:text-zinc-700'
            }`}
          >
            For Rent ({rentProperties.length})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 pt-4 pb-6">
        {activeTab === 'sale' && (
          <div>
            {saleProperties.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-zinc-100 rounded-full mb-4">
                  <ImageIcon className="w-6 h-6 text-zinc-400" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-950 mb-2">No Sale Properties</h3>
                <p className="text-zinc-600 mb-4 text-sm">You haven&apos;t added any properties for sale yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {saleProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'rent' && (
          <div>
            {rentProperties.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-zinc-100 rounded-full mb-4">
                  <ImageIcon className="w-6 h-6 text-zinc-400" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-950 mb-2">No Rental Properties</h3>
                <p className="text-zinc-600 mb-4 text-sm">You haven&apos;t added any properties for rent yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {rentProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}