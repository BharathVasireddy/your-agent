'use client';

import { Button } from '@/components/ui/button';
import { MapPin, IndianRupee, Download, Home } from 'lucide-react';
import { generatePropertyBrochure } from '@/lib/pdfGenerator';
import { getPropertyFeatures } from '@/lib/property-display-utils';
import { type Property } from '@/types/dashboard';
import Image from 'next/image';
import { PerformanceSafeguards } from '@/lib/performance';



interface Agent {
  id: string;
  slug: string;
  user: {
    name: string | null;
    email: string | null;
  };
  phone: string | null;
  city: string | null;
  area: string | null;
  experience: number | null;
  bio: string | null;
}

interface PropertiesSectionProps {
  properties: Property[];
  agent: Agent;
}

export default function PropertiesSection({ properties, agent }: PropertiesSectionProps) {
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `${(price / 100000).toFixed(1)} L`;
    } else {
      return `${price.toLocaleString()}`;
    }
  };

  const handleDownloadBrochure = async (property: Property) => {
    try {
      await generatePropertyBrochure(property, agent);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Sorry, there was an error generating the brochure. Please try again.');
    }
  };



  if (properties.length === 0) {
    return (
      <section id="properties" className="w-full py-16 bg-zinc-50">
        <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16">
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
    <section id="properties" className="w-full py-16 bg-zinc-50">
      <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-950 mb-4">Featured Properties</h2>
            <p className="text-zinc-600 max-w-2xl mx-auto">
              Discover exceptional properties carefully selected for you. Each listing represents quality, value, and the perfect opportunity for your next home or investment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.slice(0, 8).map((property) => (
            <div key={property.id} className="bg-white rounded-2xl overflow-hidden transition-all duration-300 group h-full flex flex-col">
              {/* Property Image */}
              <div className="relative h-56 overflow-hidden rounded-3xl mx-5 mt-5">
                {property.photos.length > 0 ? (
                  <>
                    <Image
                      src={property.photos[0]}
                      alt={property.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      {...PerformanceSafeguards.getImageProps('property')}
                    />
                  </>
                ) : (
                  <div className="w-full h-full bg-zinc-200 flex items-center justify-center">
                    <Home className="w-12 h-12 text-zinc-400" />
                  </div>
                )}
                
                {/* Listing Type Badge */}
                <div className="absolute top-4 right-4">
                  <span className="bg-white/95 backdrop-blur-sm text-zinc-700 px-3 py-1.5 text-xs font-medium rounded-lg shadow-sm">
                    For {property.listingType}
                  </span>
                </div>
              </div>

              {/* Property Details */}
              <div className="p-5 flex-1 flex flex-col">
                {/* Location */}
                <div className="flex items-center text-zinc-500 text-xs mb-2">
                  <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="line-clamp-1">{property.location}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-zinc-950 mb-3 line-clamp-2 leading-snug">{property.title}</h3>

                {/* Property Features */}
                <div className="flex items-center gap-4 text-sm text-zinc-600 mb-4">
                  {getPropertyFeatures(property).slice(0, 3).map((feature, index) => {
                    const IconComponent = feature.icon;
                    return (
                      <div key={index} className="flex items-center">
                        <IconComponent className="w-4 h-4 mr-1" />
                        <span>{feature.value}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Price */}
                <div className="mb-5">
                  <div className="flex items-center text-zinc-950 font-bold text-xl">
                    <IndianRupee className="w-5 h-5 mr-1" />
                    <span>{formatPrice(property.price)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-auto">
                  <Button 
                    className="flex-1 bg-zinc-950 hover:bg-zinc-800 text-white text-sm font-medium h-10 rounded-full"
                    onClick={() => {
                      const element = document.querySelector('#contact');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    View property
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="px-3 border-zinc-200 text-zinc-700 hover:bg-zinc-50 text-sm font-medium h-10 rounded-full"
                    onClick={() => handleDownloadBrochure(property)}
                    title="Download property brochure"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Properties Button */}
        {properties.length > 8 && (
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
              className="border-zinc-300 text-zinc-700 hover:bg-zinc-50 px-8 rounded-full"
            >
              View All {properties.length} Properties
            </Button>
          </div>
        )}
        </div>
      </div>
    </section>
  );
}