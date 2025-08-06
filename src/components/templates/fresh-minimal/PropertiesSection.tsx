'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, IndianRupee, Download } from 'lucide-react';
import { PerformanceSafeguards } from '@/lib/performance';
import { getPropertyFeatures } from '@/lib/property-display-utils';
import { generatePropertyBrochure } from '@/lib/pdfGenerator';
import { type Property } from '@/types/dashboard';



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
  const [showAll, setShowAll] = useState(false);
  const displayProperties = showAll ? properties : properties.slice(0, 6);

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)}Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };



  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-template-primary text-white';
      case 'sold':
        return 'bg-template-text-muted text-white';
      case 'under_offer':
        return 'bg-template-secondary text-white';
      default:
        return 'bg-template-background-accent text-template-text-secondary';
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
      <section id="properties" className="py-template-section bg-template-background-secondary">
        <div className="max-w-7xl mx-auto px-template-container text-center">
          <h2 className="text-3xl md:text-4xl font-template-primary font-bold text-template-text-primary mb-4">
            Featured Properties
          </h2>
          <p className="text-template-text-muted font-template-primary">
            New properties coming soon. Contact {agent.user.name} for exclusive listings.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="properties" className="py-template-section bg-template-background-secondary">
      <div className="max-w-7xl mx-auto px-template-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-template-primary font-bold text-template-text-primary mb-4">
            Featured Properties
          </h2>
          <p className="text-lg text-template-text-secondary font-template-primary max-w-2xl mx-auto">
            Discover our handpicked selection of premium properties. Each listing is carefully vetted to ensure quality and value.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProperties.map((property) => (
            <div key={property.id} className="bg-template-background rounded-template-card shadow-template-md hover:shadow-template-lg transition-all duration-300 overflow-hidden group">
              {/* Property Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                {property.photos && property.photos.length > 0 ? (
                  <Image
                    src={property.photos[0]}
                    alt={property.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    {...PerformanceSafeguards.getImageProps('property')}
                  />
                ) : (
                  <div className="w-full h-full bg-template-background-accent flex items-center justify-center">
                    <div className="text-template-text-muted font-template-primary">No image available</div>
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <Badge className={`${getStatusColor(property.status)} font-template-primary text-xs px-2 py-1 rounded-template-button`}>
                    {property.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>

                {/* Type Badge */}
                <div className="absolute top-3 right-3">
                  <Badge className="bg-template-background/90 text-template-text-primary border border-template-border font-template-primary text-xs px-2 py-1 rounded-template-button">
                    {property.listingType.toUpperCase()}
                  </Badge>
                </div>
              </div>

              {/* Property Details */}
              <div className="p-6 space-y-4">
                {/* Price */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <IndianRupee className="h-5 w-5 text-template-primary" />
                    <span className="text-2xl font-template-primary font-bold text-template-text-primary">
                      {formatPrice(property.price)}
                    </span>
                  </div>
                  {property.propertyType && (
                    <Badge variant="outline" className="border-template-border text-template-text-muted font-template-primary text-xs">
                      {property.propertyType}
                    </Badge>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-lg font-template-primary font-semibold text-template-text-primary line-clamp-2">
                  {property.title}
                </h3>

                {/* Location */}
                <div className="flex items-center space-x-2 text-template-text-muted">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm font-template-primary">{property.location}</span>
                </div>

                {/* Property Features */}
                <div className="flex items-center space-x-4 text-template-text-secondary">
                  {getPropertyFeatures(property).slice(0, 3).map((feature, index) => {
                    const IconComponent = feature.icon;
                    return (
                      <div key={index} className="flex items-center space-x-1">
                        <IconComponent className="h-4 w-4" />
                        <span className="text-sm font-template-primary">{feature.value}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Description */}
                <p className="text-sm text-template-text-muted font-template-primary line-clamp-2">
                  {property.description}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    className="flex-1 bg-template-primary hover:bg-template-primary-hover text-white rounded-template-button font-template-primary text-sm transition-all duration-200"
                    onClick={() => {
                      const element = document.querySelector('#contact');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    Get Details
                  </Button>
                  <Button 
                    variant="outline"
                    className="px-3 border-template-border text-template-text-secondary hover:text-template-primary hover:border-template-primary rounded-template-button font-template-primary text-sm transition-all duration-200"
                    onClick={() => handleDownloadBrochure(property)}
                    title="Download property brochure"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show More Button */}
        {properties.length > 6 && (
          <div className="text-center mt-12">
            <Button
              onClick={() => setShowAll(!showAll)}
              variant="outline"
              className="px-8 py-3 border-template-primary text-template-primary hover:bg-template-primary hover:text-white rounded-template-button font-template-primary font-semibold transition-all duration-300"
            >
              {showAll ? 'Show Less' : `View All ${properties.length} Properties`}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}