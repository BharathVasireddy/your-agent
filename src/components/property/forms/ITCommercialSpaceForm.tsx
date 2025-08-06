"use client";

import BasePropertyForm from './BasePropertyForm';
import { type ListingType, type PropertyType, type BasePropertyFormData } from '@/types/property';

interface ITCommercialSpaceFormProps {
  listingType: ListingType;
  propertyType: PropertyType;
  onSubmit: (data: BasePropertyFormData) => void;
  onCancel: () => void;
}

export default function ITCommercialSpaceForm({ 
  listingType, 
  propertyType, 
  onSubmit, 
  onCancel 
}: ITCommercialSpaceFormProps) {
  return (
    <BasePropertyForm
      listingType={listingType}
      propertyType={propertyType}
      onSubmit={onSubmit}
      onCancel={onCancel}
    >
      {/* IT Commercial Space specific fields will be added here */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">IT Commercial Space Details</h3>
        <div className="text-center py-8 text-zinc-500">
          <p>IT Commercial Space specific fields will be implemented here.</p>
          <p className="text-sm mt-2">Waiting for field specifications...</p>
        </div>
      </div>
    </BasePropertyForm>
  );
}