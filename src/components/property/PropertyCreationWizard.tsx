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
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
        // Subscription required - show modal instead of alert
        if (response.status === 403 || (typeof result.error === 'string' && /subscription/i.test(result.error))) {
          setShowSubscriptionModal(true);
          return;
        }
        throw new Error(result.error || 'Failed to create property');
      }

      // Success - redirect to properties list
      router.push('/agent/dashboard/properties');
    } catch (error) {
      console.error('Error creating property:', error);
      setSubmitError(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  return (
    <div>
      {quotaText && quotaPercent !== null && (
        <div className="mb-4">
          <div className="text-xs text-zinc-600 mb-1">{quotaText}</div>
          <div className="w-full h-2 bg-zinc-200 rounded overflow-hidden">
            <div className="h-2 bg-brand" style={{ width: `${quotaPercent}%` }} />
          </div>
        </div>
      )}
      {submitError && (
        <div className="mb-4 p-3 bg-brand-light border border-brand-soft rounded">
          <p className="text-sm text-brand-hover">{submitError}</p>
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
              className="text-brand hover:text-brand-hover text-sm font-medium"
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
      {/* Subscription required modal */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-zinc-200 max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-zinc-950">Subscription Required</h3>
            <p className="mt-2 text-sm text-zinc-600">
              You need an active subscription to create new properties. Upgrade your plan to start adding listings.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowSubscriptionModal(false)}
                className="px-4 py-2 rounded-md border border-zinc-300 text-zinc-700 hover:bg-zinc-50"
              >
                Not now
              </button>
              <button
                type="button"
                onClick={() => router.push('/subscribe')}
                className="px-4 py-2 rounded-md bg-brand text-white hover:bg-brand-hover"
              >
                Subscribe now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}