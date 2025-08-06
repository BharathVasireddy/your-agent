"use client";

import BasePropertyForm from './BasePropertyForm';
import { type ListingType, type PropertyType, type BasePropertyFormData } from '@/types/property';

interface AgriculturalLandFormProps {
  listingType: ListingType;
  propertyType: PropertyType;
  onSubmit: (data: BasePropertyFormData) => void;
  onCancel: () => void;
}

export default function AgriculturalLandForm({ 
  listingType, 
  propertyType, 
  onSubmit, 
  onCancel 
}: AgriculturalLandFormProps) {
  return (
    <BasePropertyForm
      listingType={listingType}
      propertyType={propertyType}
      onSubmit={onSubmit}
      onCancel={onCancel}
    >
      {/* Agricultural Land specific fields will be added here */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Agricultural Land Details</h3>
        <div className="text-center py-8 text-zinc-500">
          <p>Agricultural Land specific fields will be implemented here.</p>
          <p className="text-sm mt-2">Waiting for field specifications...</p>
        </div>
      </div>
    </BasePropertyForm>
  );
}