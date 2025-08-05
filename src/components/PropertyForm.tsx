"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { 
  Upload,
  X,
  Plus,
  Home,
  Building,
  MapPin,
  IndianRupee,
  Bed,
  Bath,
  Square,
  Tag
} from 'lucide-react';

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

interface PropertyFormProps {
  onSubmit: (data: PropertyFormData) => Promise<void>;
  isSubmitting?: boolean;
}

const propertyTypes = [
  'Flat/Apartment',
  'Villa',
  'Independent House',
  'Plot/Land',
  'Commercial Space',
  'Office Space',
  'Shop/Showroom',
  'Warehouse',
  'Farm House',
  'Other'
];

const commonAmenities = [
  'Parking',
  'Security',
  'Power Backup',
  'Elevator',
  'Swimming Pool',
  'Gym',
  'Garden',
  'Club House',
  'Children Play Area',
  'CCTV',
  'Water Supply',
  'Internet/WiFi',
  'Air Conditioning',
  'Balcony',
  'Terrace'
];

export default function PropertyForm({ onSubmit, isSubmitting = false }: PropertyFormProps) {
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    price: 0,
    area: 0,
    bedrooms: 1,
    bathrooms: 1,
    location: '',
    amenities: [],
    listingType: 'Sale',
    propertyType: 'Flat/Apartment',
    photos: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newAmenity, setNewAmenity] = useState('');

  const handleInputChange = (field: keyof PropertyFormData, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new window.Image();
      
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        const maxWidth = 1200;
        const maxHeight = 800;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        }, 'image/jpeg', 0.8);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + formData.photos.length > 10) {
      setErrors(prev => ({ ...prev, photos: 'Maximum 10 photos allowed' }));
      return;
    }

    try {
      // Compress each image
      const compressedFiles = await Promise.all(
        files.map(file => compressImage(file))
      );
      
      setFormData(prev => ({ ...prev, photos: [...prev.photos, ...compressedFiles] }));
      setErrors(prev => ({ ...prev, photos: '' }));
    } catch (error) {
      console.error('Error compressing images:', error);
      setErrors(prev => ({ ...prev, photos: 'Error processing images. Please try again.' }));
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const addAmenity = (amenity: string) => {
    if (amenity && !formData.amenities.includes(amenity)) {
      handleInputChange('amenities', [...formData.amenities, amenity]);
    }
  };

  const removeAmenity = (amenity: string) => {
    handleInputChange('amenities', formData.amenities.filter(a => a !== amenity));
  };

  const addCustomAmenity = () => {
    if (newAmenity.trim()) {
      addAmenity(newAmenity.trim());
      setNewAmenity('');
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Property title is required';
    if (!formData.description.trim()) newErrors.description = 'Property description is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (formData.area <= 0) newErrors.area = 'Area must be greater than 0';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (formData.photos.length === 0) newErrors.photos = 'At least one photo is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
      {/* Basic Information */}
      <div className="bg-white rounded-lg border border-zinc-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <Home className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-zinc-950">Basic Information</h2>
            <p className="text-sm text-zinc-600">Enter the basic details of your property</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Label htmlFor="title">Property Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., 3BHK Spacious Apartment in Gachibowli"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
          </div>

          <div>
            <Label htmlFor="listingType">Listing Type *</Label>
            <select
              id="listingType"
              value={formData.listingType}
              onChange={(e) => handleInputChange('listingType', e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-zinc-200 bg-white text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 appearance-none"
              style={{ backgroundColor: 'white' }}
            >
              <option value="Sale">For Sale</option>
              <option value="Rent">For Rent</option>
            </select>
          </div>

          <div>
            <Label htmlFor="propertyType">Property Type *</Label>
            <select
              id="propertyType"
              value={formData.propertyType}
              onChange={(e) => handleInputChange('propertyType', e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-zinc-200 bg-white text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 appearance-none"
              style={{ backgroundColor: 'white' }}
            >
              {propertyTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="location">Location *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., Gachibowli, Hyderabad"
                className={`pl-10 ${errors.location ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.location && <p className="text-sm text-red-600 mt-1">{errors.location}</p>}
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your property in detail..."
              rows={4}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="bg-white rounded-lg border border-zinc-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Building className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-zinc-950">Property Details</h2>
            <p className="text-sm text-zinc-600">Specify the technical details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <Label htmlFor="price">Price ({formData.listingType === 'Rent' ? 'per month' : 'total'}) *</Label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <Input
                id="price"
                type="number"
                value={formData.price || ''}
                onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                placeholder="0"
                className={`pl-10 ${errors.price ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.price && <p className="text-sm text-red-600 mt-1">{errors.price}</p>}
          </div>

          <div>
            <Label htmlFor="area">Area (sq ft) *</Label>
            <div className="relative">
              <Square className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <Input
                id="area"
                type="number"
                value={formData.area || ''}
                onChange={(e) => handleInputChange('area', parseInt(e.target.value) || 0)}
                placeholder="0"
                className={`pl-10 ${errors.area ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.area && <p className="text-sm text-red-600 mt-1">{errors.area}</p>}
          </div>

          <div>
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <div className="relative">
              <Bed className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <Input
                id="bedrooms"
                type="number"
                min="0"
                value={formData.bedrooms}
                onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value) || 0)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <div className="relative">
              <Bath className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <Input
                id="bathrooms"
                type="number"
                min="0"
                value={formData.bathrooms}
                onChange={(e) => handleInputChange('bathrooms', parseInt(e.target.value) || 0)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="bg-white rounded-lg border border-zinc-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Tag className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-zinc-950">Amenities</h2>
            <p className="text-sm text-zinc-600">Select available amenities</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {commonAmenities.map(amenity => (
              <button
                key={amenity}
                type="button"
                onClick={() => formData.amenities.includes(amenity) ? removeAmenity(amenity) : addAmenity(amenity)}
                className={`p-3 text-sm rounded-lg border transition-all ${
                  formData.amenities.includes(amenity)
                    ? 'bg-red-50 border-red-200 text-red-700'
                    : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300'
                }`}
              >
                {amenity}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={newAmenity}
              onChange={(e) => setNewAmenity(e.target.value)}
              placeholder="Add custom amenity"
              className="flex-1"
            />
            <Button
              type="button"
              onClick={addCustomAmenity}
              variant="outline"
              size="sm"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {formData.amenities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.amenities.map(amenity => (
                <span
                  key={amenity}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                >
                  {amenity}
                  <button
                    type="button"
                    onClick={() => removeAmenity(amenity)}
                    className="hover:bg-red-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Photos */}
      <div className="bg-white rounded-lg border border-zinc-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Upload className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-zinc-950">Property Photos *</h2>
            <p className="text-sm text-zinc-600">Upload up to 10 photos (first photo will be the main image)</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-zinc-300 rounded-lg p-6 text-center">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              id="photo-upload"
              disabled={formData.photos.length >= 10}
            />
            <label
              htmlFor="photo-upload"
              className={`cursor-pointer ${formData.photos.length >= 10 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Upload className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
              <p className="text-sm text-zinc-600">
                {formData.photos.length >= 10 ? 'Maximum photos reached' : 'Click to upload photos or drag and drop'}
              </p>
              <p className="text-xs text-zinc-400 mt-1">PNG, JPG up to 10MB each (automatically compressed)</p>
            </label>
          </div>

          {errors.photos && <p className="text-sm text-red-600">{errors.photos}</p>}

          {formData.photos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {formData.photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={URL.createObjectURL(photo)}
                    alt={`Property photo ${index + 1}`}
                    width={96}
                    height={96}
                    className="w-full h-24 object-cover rounded-lg border border-zinc-200"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-1 left-1 bg-red-600 text-white text-xs px-2 py-0.5 rounded">
                      Main
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4 pt-6">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white h-12"
        >
          {isSubmitting ? 'Creating Property...' : 'Create Property'}
        </Button>
      </div>
    </form>
  );
}