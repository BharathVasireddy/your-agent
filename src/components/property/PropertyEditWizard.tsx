"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sparkles, Upload, X, HelpCircle } from 'lucide-react';
import { type BasePropertyFormData, type ListingType, type PropertyType, type AgriculturalLandData, FACING_DIRECTIONS, AGRICULTURAL_PURPOSES } from '@/types/property';
import { type Property } from '@/types/dashboard';

interface PropertyEditWizardProps {
  property: Property;
}

export default function PropertyEditWizard({ property }: PropertyEditWizardProps) {
  const router = useRouter();
  
  // Initialize form data from existing property
  const [formData, setFormData] = useState<BasePropertyFormData>({
    title: property.title,
    description: property.description,
    price: property.price,
    location: property.location,
    amenities: property.amenities,
    photos: property.photos,
    status: property.status,
    listingType: property.listingType as ListingType,
    propertyType: property.propertyType as PropertyType,
    agriculturalLandData: (property.propertyData as unknown as AgriculturalLandData) || undefined
  });

  // Initialize agricultural land data if it exists
  const propertyDataObj = property.propertyData as unknown as AgriculturalLandData | null;
  const [agriculturalData, setAgriculturalData] = useState<AgriculturalLandData>({
    village: propertyDataObj?.village || '',
    city: propertyDataObj?.city || '',
    district: propertyDataObj?.district || '',
    extentAcres: propertyDataObj?.extentAcres || 0,
    extentGuntas: propertyDataObj?.extentGuntas || 0,
    facing: propertyDataObj?.facing || 'East',
    roadWidth: propertyDataObj?.roadWidth || 0,
    boundaryWall: propertyDataObj?.boundaryWall || false,
    openSides: propertyDataObj?.openSides || 0,
    purpose: propertyDataObj?.purpose || 'Farming'
  });

  const updateFormData = (updates: Partial<BasePropertyFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const updateAgriculturalData = (updates: Partial<AgriculturalLandData>) => {
    setAgriculturalData(prev => ({ ...prev, ...updates }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const completeData: BasePropertyFormData = {
        ...formData,
        agriculturalLandData: property.propertyType === 'Agricultural Land' ? agriculturalData : undefined
      };

      const response = await fetch(`/api/properties/${property.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(completeData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update property');
      }

      // Success - redirect to properties list
      router.push('/agent/dashboard/properties');
    } catch (error) {
      console.error('Error updating property:', error);
      alert(`Error updating property: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleCancel = () => {
    router.push('/agent/dashboard/properties');
  };

  const Tooltip = ({ text }: { text: string }) => (
    <div className="group relative inline-block ml-1">
      <HelpCircle className="h-4 w-4 text-zinc-400 cursor-help" />
      <div className="invisible group-hover:visible absolute left-0 top-5 z-10 w-64 p-2 text-xs bg-zinc-900 text-white rounded shadow-lg">
        {text}
      </div>
    </div>
  );

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

  const generatePurposeAwareDescription = async (): Promise<string> => {
    const descriptionTemplates = {
      'Farming': [
        "Fertile agricultural land with excellent soil quality, perfect for farming operations. Rich black soil ideal for multiple crops including cotton, sugarcane, and vegetables. Well-connected with good road access and reliable water source through borewells. Ideal investment for serious farmers and agricultural ventures.",
        "Premium agricultural land with superior drainage and irrigation facilities. Suitable for organic farming and commercial agriculture with high yield potential. The land has been well-maintained with proper soil management and is ready for immediate cultivation.",
        "Expansive agricultural land offering multiple cropping opportunities throughout the year. The fertile soil supports diverse crops with excellent water table and monsoon dependency. Perfect for farmers looking to expand operations or investors seeking agricultural income."
      ],
      'Real Estate Development': [
        "Strategic agricultural land with high development potential in a rapidly growing corridor. Excellent connectivity to major highways and upcoming infrastructure projects. Ideal for residential or commercial development with clear title and DTCP approvals possible.",
        "Prime agricultural land positioned for future development with excellent appreciation prospects. Located in an emerging growth area with planned infrastructure development. Perfect investment for land banking and future real estate projects.",
        "Well-located agricultural land with strong development potential due to proximity to expanding urban areas. Clear land records and development-friendly terrain make this ideal for township projects or residential layouts."
      ],
      'Mixed Use': [
        "Versatile agricultural land suitable for both farming and future development. Currently generating agricultural income while offering long-term development potential. Strategic location provides flexibility for immediate farming or future real estate opportunities.",
        "Multi-purpose agricultural land offering dual investment benefits - current farming income and future development potential. Well-positioned property with good connectivity and clear development possibilities in the growing region."
      ]
    };
    
    const templates = descriptionTemplates[agriculturalData.purpose];
    return templates[Math.floor(Math.random() * templates.length)];
  };

  const generatePurposeAwareTitle = async (): Promise<string> => {
    const titleTemplates = {
      'Farming': [
        `Prime Agricultural Land for ${property.listingType} - Fertile Farming Opportunity`,
        `Excellent Agricultural Land - Ready for Cultivation`,
        `Premium Farmland for ${property.listingType} - High Yield Potential`,
        `Fertile Agricultural Land - Perfect for Farming Operations`
      ],
      'Real Estate Development': [
        `Strategic Agricultural Land for ${property.listingType} - Development Potential`,
        `Prime Land for Development - Excellent Growth Prospects`,
        `Agricultural Land with Development Opportunity`,
        `Premium Land for Real Estate Development`
      ],
      'Mixed Use': [
        `Versatile Agricultural Land for ${property.listingType} - Multi-Purpose`,
        `Agricultural Land with Development Potential`,
        `Prime Land - Farming & Future Development Opportunity`,
        `Strategic Agricultural Investment - Dual Purpose Land`
      ]
    };
    
    const templates = titleTemplates[agriculturalData.purpose];
    return templates[Math.floor(Math.random() * templates.length)];
  };

  const generatePropertyTitle = async () => {
    if (property.propertyType === 'Agricultural Land') {
      const title = await generatePurposeAwareTitle();
      updateFormData({ title });
    } else {
      const titleTemplates = [
        `Updated ${property.propertyType} for ${property.listingType}`,
        `Premium ${property.propertyType} - ${property.listingType}`,
        `Excellent ${property.propertyType} Opportunity`
      ];
      const randomTitle = titleTemplates[Math.floor(Math.random() * titleTemplates.length)];
      updateFormData({ title: randomTitle });
    }
  };

  const generatePropertyDescription = async () => {
    if (property.propertyType === 'Agricultural Land') {
      const description = await generatePurposeAwareDescription();
      updateFormData({ description });
    } else {
      const descriptions = [
        "Updated property listing with excellent features and prime location. Great investment opportunity with modern amenities and accessibility.",
        "Refreshed listing showcasing the best features of this premium property. Perfect for discerning buyers looking for quality.",
        "Enhanced property details highlighting the unique advantages and potential of this excellent property."
      ];
      const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
      updateFormData({ description: randomDescription });
    }
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
                tooltip="Generate an updated property title using AI"
              />
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => updateFormData({ title: e.target.value })}
              placeholder="e.g., Updated Property Title"
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
                type="number"
                value={formData.price === 0 ? '' : formData.price.toString()}
                onChange={(e) => updateFormData({ price: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 })}
                placeholder="Property Price"
                required
                className="pl-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
            placeholder="Property location"
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
                    <span className="font-semibold">Click to upload</span> additional photos
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
                Current Photos ({formData.photos.length}/10)
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
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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

      {/* Agricultural Land Specific Fields */}
      {property.propertyType === 'Agricultural Land' && (
        <>
          {/* Purpose and Location Details */}
          <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
            <h3 className="text-lg font-semibold text-zinc-900 mb-4">Purpose & Location Details</h3>
            
            {/* Purpose Selection */}
            <div className="mb-6">
              <Label className="flex items-center">
                Intended Purpose*
                <Tooltip text="Select the primary intended use for this agricultural land. This helps buyers understand the potential and guides them toward the right investment decision." />
              </Label>
              <Select value={agriculturalData.purpose} onValueChange={(value) => updateAgriculturalData({ purpose: value as 'Farming' | 'Real Estate Development' | 'Mixed Use' })}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select intended purpose" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(AGRICULTURAL_PURPOSES).map((purpose) => (
                    <SelectItem key={purpose} value={purpose}>
                      {purpose}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="village" className="flex items-center">
                  Village*
                  <Tooltip text="Enter the name of the village where the agricultural land is located. This helps buyers understand the exact locality and evaluate proximity to amenities." />
                </Label>
                <Input
                  id="village"
                  value={agriculturalData.village}
                  onChange={(e) => updateAgriculturalData({ village: e.target.value })}
                  placeholder="e.g., Kondapur"
                  required
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="city" className="flex items-center">
                  City*
                  <Tooltip text="Enter the city or town nearest to the agricultural land. This provides broader location context and helps buyers assess accessibility to markets and infrastructure." />
                </Label>
                <Input
                  id="city"
                  value={agriculturalData.city}
                  onChange={(e) => updateAgriculturalData({ city: e.target.value })}
                  placeholder="e.g., Hyderabad"
                  required
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="district" className="flex items-center">
                  District*
                  <Tooltip text="Enter the district where the agricultural land is situated. This is important for legal documentation, administrative processes, and understanding local regulations." />
                </Label>
                <Input
                  id="district"
                  value={agriculturalData.district}
                  onChange={(e) => updateAgriculturalData({ district: e.target.value })}
                  placeholder="e.g., Rangareddy"
                  required
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          {/* Land Measurements */}
          <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
            <h3 className="text-lg font-semibold text-zinc-900 mb-4">Land Measurements</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="extentAcres" className="flex items-center">
                  Extent - Acres*
                  <Tooltip text="Enter the total area of the agricultural land in acres. 1 acre = 40 guntas. Provide accurate measurements as per survey documents." />
                </Label>
                <Input
                  id="extentAcres"
                  type="number"
                  min="0"
                  step="0.01"
                  value={agriculturalData.extentAcres === 0 ? '' : agriculturalData.extentAcres.toString()}
                  onChange={(e) => updateAgriculturalData({ extentAcres: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  required
                  className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              
              <div>
                <Label htmlFor="extentGuntas" className="flex items-center">
                  Extent - Guntas*
                  <Tooltip text="Enter additional area in guntas. 40 guntas = 1 acre. This allows for precise land measurement specification." />
                </Label>
                <Input
                  id="extentGuntas"
                  type="number"
                  min="0"
                  max="39"
                  step="1"
                  value={agriculturalData.extentGuntas === 0 ? '' : agriculturalData.extentGuntas.toString()}
                  onChange={(e) => updateAgriculturalData({ extentGuntas: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>
          </div>

          {/* Property Characteristics */}
          <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
            <h3 className="text-lg font-semibold text-zinc-900 mb-4">Property Characteristics</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="flex items-center">
                  Facing Direction*
                  <Tooltip text="Select the primary direction the land faces. This affects sunlight exposure and wind patterns - crucial for farming productivity and important for real estate development planning." />
                </Label>
                <Select value={agriculturalData.facing} onValueChange={(value) => updateAgriculturalData({ facing: value as 'East' | 'West' | 'North' | 'South' | 'North-East' | 'North-West' | 'South-East' | 'South-West' })}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select facing direction" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(FACING_DIRECTIONS).map((direction) => (
                      <SelectItem key={direction} value={direction}>
                        {direction}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="roadWidth" className="flex items-center">
                  Road Width*
                  <Tooltip text="Enter the width of the road that provides access to the land in feet. Wider roads ensure better accessibility for farming equipment, transportation of produce, and future development activities." />
                </Label>
                <div className="relative mt-2">
                  <Input
                    id="roadWidth"
                    type="number"
                    min="0"
                    step="1"
                    value={agriculturalData.roadWidth === 0 ? '' : agriculturalData.roadWidth.toString()}
                    onChange={(e) => updateAgriculturalData({ roadWidth: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 })}
                    placeholder="20"
                    required
                    className="pr-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 text-sm">ft</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <Label className="flex items-center">
                  Boundary Wall*
                  <Tooltip text="Indicate whether the land has a boundary wall or fencing. This affects security for crops/equipment, defines property limits clearly, and can impact value for both farming and development purposes." />
                </Label>
                <RadioGroup 
                  value={agriculturalData.boundaryWall.toString()} 
                  onValueChange={(value) => updateAgriculturalData({ boundaryWall: value === 'true' })}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="boundary-yes" />
                    <Label htmlFor="boundary-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="boundary-no" />
                    <Label htmlFor="boundary-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label htmlFor="openSides" className="flex items-center">
                  Open Sides*
                  <Tooltip text="Enter the number of sides of the land that are open (not bounded by other properties). More open sides mean better accessibility for farming operations, good ventilation, and easier development potential." />
                </Label>
                <Input
                  id="openSides"
                  type="number"
                  min="0"
                  max="4"
                  step="1"
                  value={agriculturalData.openSides === 0 ? '' : agriculturalData.openSides.toString()}
                  onChange={(e) => updateAgriculturalData({ openSides: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 })}
                  placeholder="2"
                  required
                  className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
        >
          Cancel
        </Button>
        
        <Button
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          Update Property
        </Button>
      </div>
    </form>
  );
}