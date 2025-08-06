"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type BasePropertyFormData, type ListingType, type PropertyType } from '@/types/property';

interface BasePropertyFormProps {
  listingType: ListingType;
  propertyType: PropertyType;
  onSubmit: (data: BasePropertyFormData) => void;
  onCancel: () => void;
  children?: React.ReactNode;
}

export default function BasePropertyForm({ 
  listingType, 
  propertyType, 
  onSubmit, 
  onCancel,
  children 
}: BasePropertyFormProps) {
  const [formData, setFormData] = useState<BasePropertyFormData>({
    title: '',
    description: '',
    price: 0,
    location: '',
    amenities: [],
    photos: [],
    status: 'Available',
    listingType,
    propertyType
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateFormData = (updates: Partial<BasePropertyFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="title">Property Title*</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => updateFormData({ title: e.target.value })}
              placeholder="e.g., Spacious 3BHK Apartment in City Center"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="price">Price*</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => updateFormData({ price: parseInt(e.target.value) })}
              placeholder={listingType === 'Sale' ? 'Sale Price (₹)' : 'Monthly Rent (₹)'}
              required
            />
          </div>
        </div>

        <div className="mt-6">
          <Label htmlFor="location">Location*</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => updateFormData({ location: e.target.value })}
            placeholder="e.g., Banjara Hills, Hyderabad"
            required
          />
        </div>

        <div className="mt-6">
          <Label htmlFor="description">Property Description*</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => updateFormData({ description: e.target.value })}
            placeholder="Describe the property features, amenities, and highlights..."
            rows={4}
            required
          />
        </div>
      </div>

      {/* Property Type Specific Fields */}
      {children}

      {/* Actions */}
      <div className="flex items-center justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        
        <Button
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          Create Property
        </Button>
      </div>
    </form>
  );
}