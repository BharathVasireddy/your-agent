"use client";

import { type ListingType, type PropertyType, type BasePropertyFormData } from '@/types/property';
import AgriculturalLandForm from './AgriculturalLandForm';
import PlotForm from './PlotForm';
import FlatApartmentForm from './FlatApartmentForm';
import VillaIndependentHouseForm from './VillaIndependentHouseForm';
import ITCommercialSpaceForm from './ITCommercialSpaceForm';
import FarmHouseForm from './FarmHouseForm';

interface PropertyFormFactoryProps {
  listingType: ListingType;
  propertyType: PropertyType;
  onSubmit: (data: BasePropertyFormData) => void;
  onCancel: () => void;
}

export default function PropertyFormFactory({ 
  listingType, 
  propertyType, 
  onSubmit, 
  onCancel 
}: PropertyFormFactoryProps) {
  
  const getFormComponent = () => {
    switch (propertyType) {
      case 'Agricultural Land':
        return (
          <AgriculturalLandForm
            listingType={listingType}
            propertyType={propertyType}
            onSubmit={onSubmit}
            onCancel={onCancel}
          />
        );
      
      case 'Plot':
        return (
          <PlotForm
            listingType={listingType}
            propertyType={propertyType}
            onSubmit={onSubmit}
            onCancel={onCancel}
          />
        );
      
      case 'Flat/Apartment':
        return (
          <FlatApartmentForm
            listingType={listingType}
            propertyType={propertyType}
            onSubmit={onSubmit}
            onCancel={onCancel}
          />
        );
      
      case 'Villa/Independent House':
        return (
          <VillaIndependentHouseForm
            listingType={listingType}
            propertyType={propertyType}
            onSubmit={onSubmit}
            onCancel={onCancel}
          />
        );
      
      case 'IT Commercial Space':
        return (
          <ITCommercialSpaceForm
            listingType={listingType}
            propertyType={propertyType}
            onSubmit={onSubmit}
            onCancel={onCancel}
          />
        );
      
      case 'Farm House':
        return (
          <FarmHouseForm
            listingType={listingType}
            propertyType={propertyType}
            onSubmit={onSubmit}
            onCancel={onCancel}
          />
        );
      
      default:
        return (
          <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                Unsupported Property Type
              </h3>
              <p className="text-zinc-600">
                Form for &quot;{propertyType}&quot; is not yet implemented.
              </p>
            </div>
          </div>
        );
    }
  };

  return <div>{getFormComponent()}</div>;
}