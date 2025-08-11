"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PropertyForm from './PropertyForm';
import { createPropertyAction } from '@/app/actions';

interface PropertyFormData {
  title: string;
  description: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  location: string;
  amenities: string[];
  listingType: string;
  propertyType: string;
  photos: File[];
}

export default function PropertyFormWrapper() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Create FormData for server action
      const formData = new FormData();
      
      // Append all form fields
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('price', data.price.toString());
      formData.append('area', data.area.toString());
      formData.append('bedrooms', data.bedrooms.toString());
      formData.append('bathrooms', data.bathrooms.toString());
      formData.append('location', data.location);
      formData.append('listingType', data.listingType);
      formData.append('propertyType', data.propertyType);
      formData.append('amenities', JSON.stringify(data.amenities));

      // Append photos
      data.photos.forEach((photo) => {
        formData.append('photos', photo);
      });

      // Submit to server action
      const result = await createPropertyAction(formData);
      
      if (result.success) {
        // Redirect to properties page with success message
        router.push('/agent/dashboard/properties?created=true');
      }
    } catch (error) {
      console.error('Error creating property:', error);
      setError(error instanceof Error ? error.message : 'Failed to create property');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-brand-light border border-brand-soft rounded-lg p-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-brand-deep font-medium">Error</p>
          </div>
          <p className="text-brand mt-1">{error}</p>
        </div>
      )}
      
      <PropertyForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}