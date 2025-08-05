'use client';

import { Button } from '@/components/ui/button';
import { Bed, Bath, Home, MapPin, IndianRupee, Download } from 'lucide-react';

interface Property {
  id: string;
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
  slug: string | null;
  brochureUrl: string | null;
}

interface PropertiesSectionProps {
  properties: Property[];
}

export default function PropertiesSection({ properties }: PropertiesSectionProps) {
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  const formatArea = (area: number) => {
    return `${area.toLocaleString()} sq ft`;
  };

  if (properties.length === 0) {
    return (
      <section id="properties" className="py-16 bg-zinc-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-950 mb-4">Featured Properties</h2>
            <p className="text-zinc-600 max-w-2xl mx-auto">
              New properties are coming soon! Contact me to get early access to the latest listings.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="properties" className="py-16 bg-zinc-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-950 mb-4">Featured Properties</h2>
          <p className="text-zinc-600 max-w-2xl mx-auto">
            Discover exceptional properties carefully selected for you. Each listing represents quality, value, and the perfect opportunity for your next home or investment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.slice(0, 6).map((property) => (
            <div key={property.id} className="bg-white rounded-lg shadow-sm border border-zinc-200 overflow-hidden hover:shadow-lg transition-all duration-300">
              {/* Property Image */}
              <div className="relative h-48 overflow-hidden">
                {property.photos.length > 0 ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={property.photos[0]}
                      alt={property.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </>
                ) : (
                  <div className="w-full h-full bg-zinc-200 flex items-center justify-center">
                    <Home className="w-12 h-12 text-zinc-400" />
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    property.status === 'Available' 
                      ? 'bg-green-100 text-green-800' 
                      : property.status === 'Sold'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {property.status}
                  </span>
                </div>

                {/* Listing Type Badge */}
                <div className="absolute top-3 right-3">
                  <span className="bg-red-600 text-white px-2 py-1 text-xs font-semibold rounded-full">
                    {property.listingType}
                  </span>
                </div>
              </div>

              {/* Property Details */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-zinc-950 line-clamp-1">{property.title}</h3>
                  <div className="flex items-center text-red-600 font-bold text-lg">
                    <IndianRupee className="w-4 h-4" />
                    <span>{formatPrice(property.price)}</span>
                  </div>
                </div>

                <div className="flex items-center text-zinc-600 text-sm mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="line-clamp-1">{property.location}</span>
                </div>

                <p className="text-zinc-700 text-sm mb-4 line-clamp-2">{property.description}</p>

                {/* Property Features */}
                <div className="flex items-center justify-between text-sm text-zinc-600 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Bed className="w-4 h-4 mr-1" />
                      <span>{property.bedrooms} Bed</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="w-4 h-4 mr-1" />
                      <span>{property.bathrooms} Bath</span>
                    </div>
                  </div>
                  <div className="text-zinc-900 font-medium">
                    {formatArea(property.area)}
                  </div>
                </div>

                {/* Property Type */}
                <div className="text-xs text-zinc-500 mb-4">
                  {property.propertyType}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Button 
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm"
                    onClick={() => {
                      const element = document.querySelector('#contact');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    Inquire Now
                  </Button>
                  
                  {property.brochureUrl && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => window.open(property.brochureUrl!, '_blank')}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Properties Button */}
        {properties.length > 6 && (
          <div className="text-center mt-12">
            <Button 
              onClick={() => {
                const element = document.querySelector('#contact');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              variant="outline" 
              size="lg"
              className="border-red-600 text-red-600 hover:bg-red-50 px-8"
            >
              View All {properties.length} Properties
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}