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

interface DesktopPropertiesGridProps {
  saleProperties: Property[];
  rentProperties: Property[];
}

function PropertyCard({ property }: { property: Property }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Property Photo */}
      <div className="aspect-video bg-zinc-100 relative">
        {property.photos.length > 0 ? (
          <Image
            src={property.photos[0]}
            alt={property.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-12 h-12 text-zinc-400" />
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
      <div className="p-4">
        <h3 className="font-semibold text-lg text-zinc-950 mb-2 line-clamp-2">
          {property.title}
        </h3>
        <p className="text-2xl font-bold text-red-600 mb-4">
          ₹{property.price.toLocaleString('en-IN')}
          <span className="text-sm font-normal text-zinc-500 ml-1">
            / {property.listingType === 'Rent' ? 'month' : 'total'}
          </span>
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            href={`/agent/dashboard/properties/${property.slug}/edit`}
            className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-zinc-100 text-zinc-700 rounded-lg hover:bg-zinc-200 transition-colors text-sm font-medium"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Link>
          <Link
            href={`/agent/dashboard/properties/${property.slug}/delete`}
            className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function DesktopPropertiesGrid({ saleProperties, rentProperties }: DesktopPropertiesGridProps) {
  return (
    <div className="hidden md:block space-y-10">
      {/* For Sale Properties */}
      {saleProperties.length > 0 && (
        <div>
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-bold text-zinc-950">For Sale</h2>
            <span className="ml-3 px-2 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
              {saleProperties.length}
            </span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
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
            <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              {rentProperties.length}
            </span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {rentProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}