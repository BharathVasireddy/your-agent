"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PropertyTypeSelector from './PropertyTypeSelector';
import PropertyFormFactory from './forms/PropertyFormFactory';
import { type ListingType, type PropertyType, type BasePropertyFormData } from '@/types/property';

interface PropertyCreationWizardProps {
  className?: string;
}

export default function PropertyCreationWizard({}: PropertyCreationWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<'type-selection' | 'form'>('type-selection');
  const [selectedListingType, setSelectedListingType] = useState<ListingType | null>(null);
  const [selectedPropertyType, setSelectedPropertyType] = useState<PropertyType | null>(null);

  const handleTypeSelection = (listingType: ListingType, propertyType: PropertyType) => {
    setSelectedListingType(listingType);
    setSelectedPropertyType(propertyType);
    setCurrentStep('form');
  };

  const handleCancel = () => {
    router.push('/agent/dashboard/properties');
  };

  const handleBackToTypeSelection = () => {
    setCurrentStep('type-selection');
  };

  const handleFormSubmit = async (data: BasePropertyFormData) => {
    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create property');
      }

      // Success - redirect to properties list
      router.push('/agent/dashboard/properties');
    } catch (error) {
      console.error('Error creating property:', error);
      // TODO: Show error message to user
      alert(`Error creating property: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div>
      {currentStep === 'type-selection' && (
        <PropertyTypeSelector
          onSelect={handleTypeSelection}
          onCancel={handleCancel}
        />
      )}
      
      {currentStep === 'form' && selectedListingType && selectedPropertyType && (
        <div className="space-y-6">
          {/* Form will be rendered here based on property type */}
          <div>
            <button
              onClick={handleBackToTypeSelection}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              ← Back to Type Selection
            </button>
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-zinc-950">Property Details</h1>
            <p className="text-zinc-600 mt-1">
              {selectedPropertyType} for {selectedListingType}
            </p>
          </div>

          {/* Type-specific form */}
          <PropertyFormFactory
            listingType={selectedListingType}
            propertyType={selectedPropertyType}
            onSubmit={handleFormSubmit}
            onCancel={handleBackToTypeSelection}
          />
        </div>
      )}
    </div>
  );
}