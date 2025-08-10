"use client";

import { useEffect, useState } from 'react';
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
  const [quotaText, setQuotaText] = useState<string | null>(null);
  const [quotaPercent, setQuotaPercent] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    // Fetch plan/entitlements and current usage to show a small indicator
    Promise.all([
      fetch('/api/subscription/entitlements').then(r => r.json()).catch(() => null),
      fetch('/api/properties', { method: 'HEAD' }).catch(() => null)
    ]).then(async ([ent]) => {
      if (!mounted || !ent) return;
      try {
        const resp = await fetch('/api/properties?count=1');
        const data = await resp.json().catch(() => ({}));
        const used = typeof data.count === 'number' ? data.count : null;
        const limit = ent.entitlements?.listingLimit;
        if (typeof used === 'number' && Number.isFinite(limit)) {
          const percent = Math.min(100, Math.round((used / limit) * 100));
          setQuotaPercent(percent);
          setQuotaText(`${used} / ${limit} listings used`);
        }
      } catch { /* ignore */ }
    });
    return () => { mounted = false; };
  }, []);

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
      {quotaText && quotaPercent !== null && (
        <div className="mb-4">
          <div className="text-xs text-zinc-600 mb-1">{quotaText}</div>
          <div className="w-full h-2 bg-zinc-200 rounded overflow-hidden">
            <div className="h-2 bg-red-600" style={{ width: `${quotaPercent}%` }} />
          </div>
        </div>
      )}
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