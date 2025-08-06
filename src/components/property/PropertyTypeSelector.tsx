"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  LISTING_TYPES, 
  PROPERTY_CATEGORIES, 
  getPropertyTypesForListing,
  type ListingType,
  type PropertyType 
} from '@/types/property';
import { 
  Home, 
  Building, 
  TreePine, 
  Car,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';

interface PropertyTypeSelectorProps {
  onSelect: (listingType: ListingType, propertyType: PropertyType) => void;
  onCancel: () => void;
}

export default function PropertyTypeSelector({ onSelect, onCancel }: PropertyTypeSelectorProps) {
  const [selectedListingType, setSelectedListingType] = useState<ListingType | null>(null);
  const [selectedPropertyType, setSelectedPropertyType] = useState<PropertyType | null>(null);

  const handleListingTypeSelect = (listingType: ListingType) => {
    setSelectedListingType(listingType);
    setSelectedPropertyType(null); // Reset property type when listing type changes
  };

  const handlePropertyTypeSelect = (propertyType: PropertyType) => {
    setSelectedPropertyType(propertyType);
  };

  const handleContinue = () => {
    if (selectedListingType && selectedPropertyType) {
      onSelect(selectedListingType, selectedPropertyType);
    }
  };

  const getIconForPropertyType = (propertyType: PropertyType) => {
    switch (propertyType) {
      case 'Flat/Apartment':
      case 'Villa/Independent House':
      case 'Farm House':
        return <Home className="w-6 h-6" />;
      case 'IT Commercial Space':
        return <Building className="w-6 h-6" />;
      case 'Agricultural Land':
      case 'Plot':
        return <TreePine className="w-6 h-6" />;
      default:
        return <Home className="w-6 h-6" />;
    }
  };

  const getCategoryIcon = (categoryKey: string) => {
    switch (categoryKey) {
      case 'RESIDENTIAL':
        return <Home className="w-5 h-5" />;
      case 'COMMERCIAL':
        return <Building className="w-5 h-5" />;
      case 'LAND':
        return <TreePine className="w-5 h-5" />;
      default:
        return <Home className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Property</h1>
        <p className="text-gray-600">Choose the listing type and property type to get started</p>
      </div>

      {/* Step 1: Listing Type Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <span className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
            1
          </span>
          Select Listing Type
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(LISTING_TYPES).map((listingType) => (
            <button
              key={listingType}
              onClick={() => handleListingTypeSelect(listingType)}
              className={`p-6 border-2 rounded-xl text-left transition-all duration-200 hover:border-red-300 hover:bg-red-50 ${
                selectedListingType === listingType
                  ? 'border-red-600 bg-red-50 shadow-lg'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-3 rounded-full mr-4 ${
                    selectedListingType === listingType 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {listingType === LISTING_TYPES.SALE ? <Car className="w-6 h-6" /> : <Home className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">For {listingType}</h3>
                    <p className="text-gray-600 text-sm">
                      {listingType === LISTING_TYPES.SALE 
                        ? 'Sell properties to buyers' 
                        : 'Rent properties to tenants'
                      }
                    </p>
                  </div>
                </div>
                {selectedListingType === listingType && (
                  <CheckCircle2 className="w-6 h-6 text-red-600" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Property Type Selection */}
      {selectedListingType && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <span className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
              2
            </span>
            Select Property Type
          </h2>

          {Object.entries(PROPERTY_CATEGORIES).map(([categoryKey, category]) => {
            const availableTypes = getPropertyTypesForListing(selectedListingType);
            const categoryTypes = category.types.filter(type => availableTypes.includes(type));
            
            if (categoryTypes.length === 0) return null;

            return (
              <div key={categoryKey} className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                  {getCategoryIcon(categoryKey)}
                  <span className="ml-2">{category.label}</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryTypes.map((propertyType) => (
                    <button
                      key={propertyType}
                      onClick={() => handlePropertyTypeSelect(propertyType)}
                      className={`p-4 border-2 rounded-lg text-left transition-all duration-200 hover:border-red-300 hover:bg-red-50 ${
                        selectedPropertyType === propertyType
                          ? 'border-red-600 bg-red-50 shadow-md'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-lg mr-3 ${
                            selectedPropertyType === propertyType 
                              ? 'bg-red-600 text-white' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {getIconForPropertyType(propertyType)}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{propertyType}</h4>
                          </div>
                        </div>
                        {selectedPropertyType === propertyType && (
                          <CheckCircle2 className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={onCancel}
          className="px-6 py-2"
        >
          Cancel
        </Button>
        
        <Button
          onClick={handleContinue}
          disabled={!selectedListingType || !selectedPropertyType}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 flex items-center"
        >
          Continue to Details
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Selection Summary */}
      {selectedListingType && selectedPropertyType && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Selected Configuration:</h3>
          <p className="text-gray-700">
            <span className="font-medium">{selectedPropertyType}</span> for{' '}
            <span className="font-medium">{selectedListingType}</span>
          </p>
        </div>
      )}
    </div>
  );
}