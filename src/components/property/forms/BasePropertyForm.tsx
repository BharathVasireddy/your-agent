"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Upload, X } from 'lucide-react';
import { type BasePropertyFormData, type ListingType, type PropertyType } from '@/types/property';

interface BasePropertyFormProps {
  listingType: ListingType;
  propertyType: PropertyType;
  onSubmit: (data: BasePropertyFormData) => void;
  onCancel: () => void;
  children?: React.ReactNode;
  customTitleGenerator?: () => Promise<string>;
  customDescriptionGenerator?: () => Promise<string>;
}

export default function BasePropertyForm({ 
  listingType, 
  propertyType, 
  onSubmit, 
  onCancel,
  children,
  customTitleGenerator,
  customDescriptionGenerator
}: BasePropertyFormProps) {
  const [formData, setFormData] = useState<BasePropertyFormData>({
    title: '',
    description: '',
    price: 0,
    location: '',
    amenities: [],
    photos: [],
    status: 'Draft',
    listingType,
    propertyType
  });

  // Display state for price with Indian-style commas (e.g., 30,00,000)
  const [priceDisplay, setPriceDisplay] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateFormData = (updates: Partial<BasePropertyFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const formatIndianNumber = (value: number): string => {
    try {
      return new Intl.NumberFormat('en-IN').format(value);
    } catch {
      return String(value);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const digitsOnly = raw.replace(/\D/g, '');
    if (digitsOnly.length === 0) {
      setPriceDisplay('');
      updateFormData({ price: 0 });
      return;
    }
    const numeric = parseInt(digitsOnly, 10) || 0;
    updateFormData({ price: numeric });
    setPriceDisplay(formatIndianNumber(numeric));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + formData.photos.length > 10) {
      alert('Maximum 10 photos allowed');
      return;
    }

    try {
      const uploadPromises = files.map(async (file) => {
        const formDataFile = new FormData();
        formDataFile.append('file', file);
        formDataFile.append('folder', 'property-photos');
        
        const response = await fetch('/api/upload-image', {
          method: 'POST',
          body: formDataFile,
        });
        
        const result = await response.json();
        if (result.success && result.url) {
          return result.url;
        } else {
          throw new Error(result.error || 'Failed to upload image');
        }
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      updateFormData({ photos: [...formData.photos, ...uploadedUrls] });
    } catch (error) {
      console.error('Error uploading photos:', error);
      alert('Error uploading some photos. Please try again.');
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = formData.photos.filter((_, i) => i !== index);
    updateFormData({ photos: newPhotos });
  };

  const AIAssist = ({ onClick, tooltip }: { onClick: () => void, tooltip: string }) => (
    <div className="group relative inline-block ml-1">
      <button
        type="button"
        onClick={onClick}
        className="h-4 w-4 text-blue-500 hover:text-blue-600 cursor-pointer transition-colors"
        title={tooltip}
      >
        <Sparkles className="h-4 w-4" />
      </button>
      <div className="invisible group-hover:visible absolute left-0 top-5 z-10 w-48 p-2 text-xs bg-blue-900 text-white rounded shadow-lg">
        {tooltip}
      </div>
    </div>
  );

  const generatePropertyTitle = async () => {
    if (customTitleGenerator) {
      const customTitle = await customTitleGenerator();
      updateFormData({ title: customTitle });
      return;
    }
    
    // Fallback default generation
    const titleTemplates = [
      `Prime ${propertyType} for ${listingType}`,
      `Beautiful ${propertyType} - Perfect for ${listingType}`,
      `Spacious ${propertyType} Available for ${listingType}`,
      `Excellent ${propertyType} Opportunity - ${listingType}`,
      `Premium ${propertyType} Ready for ${listingType}`
    ];
    
    const randomTitle = titleTemplates[Math.floor(Math.random() * titleTemplates.length)];
    updateFormData({ title: randomTitle });
  };

  const generatePropertyDescription = async () => {
    if (customDescriptionGenerator) {
      const customDescription = await customDescriptionGenerator();
      updateFormData({ description: customDescription });
      return;
    }
    
    // Fallback default generation
    const descriptionTemplates = {
      'Agricultural Land': [
        "Fertile agricultural land with excellent soil quality, perfect for farming operations. Well-connected with good road access and water availability. Ideal investment opportunity for agricultural ventures.",
        "Premium agricultural land in a prime location with rich soil and excellent drainage. Perfect for organic farming or commercial agriculture. Great connectivity and infrastructure support.",
        "Expansive agricultural land with multiple crop possibilities. Well-maintained with proper boundaries and easy accessibility. Excellent investment potential in growing agricultural sector."
      ],
      'Plot': [
        "Well-located residential plot in a developing area with excellent infrastructure. Perfect for building your dream home with good connectivity and amenities nearby.",
        "Premium plot in a sought-after location with clear title and all approvals. Great investment opportunity with high appreciation potential."
      ]
    };
    
    const templates = descriptionTemplates[propertyType as keyof typeof descriptionTemplates] || [
      `Excellent ${propertyType.toLowerCase()} opportunity in a prime location with great potential for ${listingType.toLowerCase()}. Well-maintained property with good connectivity and infrastructure.`
    ];
    
    const randomDescription = templates[Math.floor(Math.random() * templates.length)];
    updateFormData({ description: randomDescription });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="title" className="flex items-center">
              Property Title*
              <AIAssist 
                onClick={generatePropertyTitle} 
                tooltip="Generate an attractive property title using AI"
              />
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => updateFormData({ title: e.target.value })}
              placeholder="e.g., Spacious 3BHK Apartment in City Center"
              required
              className="mt-2"
            />
          </div>
          
          <div>
            <Label htmlFor="price">Price*</Label>
            <div className="relative mt-2">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 text-sm">₹</span>
              <Input
                id="price"
                type="text"
                inputMode="numeric"
                value={priceDisplay}
                onChange={handlePriceChange}
                placeholder={listingType === 'Sale' ? 'Sale Price' : 'Monthly Rent'}
                required
                className="pl-8"
              />
            </div>
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
            className="mt-2"
          />
        </div>

        <div className="mt-6">
          <Label htmlFor="description" className="flex items-center">
            Property Description*
            <AIAssist 
              onClick={generatePropertyDescription} 
              tooltip="Generate a compelling property description using AI"
            />
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => updateFormData({ description: e.target.value })}
            placeholder="Describe the property features, amenities, and highlights..."
            rows={4}
            required
            className="mt-2"
          />
        </div>
      </div>

      {/* Property Photos */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Property Photos</h3>
        
        <div className="space-y-4">
          {/* Upload Area */}
          <div>
            <Label htmlFor="photos">Upload Photos (Max 10)</Label>
            <div className="mt-2">
              <input
                type="file"
                id="photos"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <label
                htmlFor="photos"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-zinc-300 border-dashed rounded-lg cursor-pointer bg-zinc-50 hover:bg-zinc-100 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-3 text-zinc-400" />
                  <p className="mb-2 text-sm text-zinc-500">
                    <span className="font-semibold">Click to upload</span> property photos
                  </p>
                  <p className="text-xs text-zinc-500">PNG, JPG, JPEG up to 5MB each</p>
                </div>
              </label>
            </div>
          </div>

          {/* Photo Preview Grid */}
          {formData.photos.length > 0 && (
            <div>
              <p className="text-sm font-medium text-zinc-700 mb-3">
                Uploaded Photos ({formData.photos.length}/10)
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-zinc-100">
                      <Image
                        src={photo}
                        alt={`Property photo ${index + 1}`}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 bg-brand hover:bg-brand-hover text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
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
        
        <div className="flex items-center gap-3">
          <Button type="submit" className="bg-brand hover:bg-brand-hover text-white">
            Save Draft
          </Button>
          <Button type="button" className="bg-zinc-900 hover:bg-zinc-800 text-white" onClick={() => onSubmit({ ...formData, status: 'Available' })}>
            Publish
          </Button>
        </div>
      </div>
    </form>
  );
}