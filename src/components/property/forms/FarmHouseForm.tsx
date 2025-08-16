"use client";

import { useState } from 'react';
import Image from 'next/image';
import BasePropertyForm from './BasePropertyForm';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { type ListingType, type PropertyType, type BasePropertyFormData, type FarmHouseData, BHK_OPTIONS, FURNISHING_STATUS, FACING_DIRECTIONS } from '@/types/property';

interface FarmHouseFormProps {
  listingType: ListingType;
  propertyType: PropertyType;
  onSubmit: (data: BasePropertyFormData) => void;
  onCancel: () => void;
}

export default function FarmHouseForm({ 
  listingType, 
  propertyType, 
  onSubmit, 
  onCancel 
}: FarmHouseFormProps) {
  const [farmData, setFarmData] = useState<FarmHouseData>({
    city: '',
    overallAreaSqFt: 0,
    builtUpAreaSqFt: 0,
    numFloors: 0,
    bhk: '2BHK',
    swimmingPool: false,
    ageYears: 0,
    furnishingStatus: 'Unfurnished',
    plotSizeValue: 0,
    plotSizeUnit: 'Acres',
    bedrooms: 0,
    bathrooms: 0,
    landscapedGarden: false,
    roadWidthFt: 0,
    facing: 'East',
    nearestCityKm: 0,
    nearestHighwayKm: 0,
    landStatus: 'Agricultural',
    titleStatus: 'Clear',
    encumbranceCertificate: false,
    pricePerUnit: 0,
    pricePerUnitUnit: 'Acre',
    negotiable: false,
    interiorPhotosUrls: [],
    exteriorPhotosUrls: [],
    droneFootageUrls: [],
    locationMapUrl: ''
  });

  const updateFarmData = (updates: Partial<FarmHouseData>) => {
    setFarmData(prev => ({ ...prev, ...updates }));
  };

  async function uploadImages(files: File[], folder: string): Promise<string[]> {
    const uploads = files.map(async (file) => {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', folder);
      const res = await fetch('/api/upload-image', { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok || !json?.success || !json?.url) throw new Error(json?.error || 'Upload failed');
      return json.url as string;
    });
    return Promise.all(uploads);
  }

  async function handleInteriorUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const urls = await uploadImages(files, 'property-farmhouse/interior');
    updateFarmData({ interiorPhotosUrls: [...(farmData.interiorPhotosUrls || []), ...urls] });
    e.currentTarget.value = '';
  }

  async function handleExteriorUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const urls = await uploadImages(files, 'property-farmhouse/exterior');
    updateFarmData({ exteriorPhotosUrls: [...(farmData.exteriorPhotosUrls || []), ...urls] });
    e.currentTarget.value = '';
  }

  async function handleDroneUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const urls = await uploadImages(files, 'property-farmhouse/drone');
    updateFarmData({ droneFootageUrls: [...(farmData.droneFootageUrls || []), ...urls] });
    e.currentTarget.value = '';
  }

  const handleSubmit = (baseData: BasePropertyFormData) => {
    if ((baseData.status || '').toLowerCase() === 'available') {
      const mediaCount = (farmData.interiorPhotosUrls?.length || 0) + (farmData.exteriorPhotosUrls?.length || 0);
      if (mediaCount < 5) {
        alert('Please add at least 5 photos (interior/exterior) before publishing.');
        return;
      }
    }
    const completeData: BasePropertyFormData = {
      ...baseData,
      farmHouseData: farmData
    };
    onSubmit(completeData);
  };

  const generateFarmTitle = async (): Promise<string> => {
    const parts: string[] = [];
    parts.push('Farm House');
    parts.push(farmData.bhk);
    if (farmData.overallAreaSqFt > 0) parts.push(`${farmData.overallAreaSqFt} Sq.ft`);
    if (farmData.city) parts.push(farmData.city);
    return parts.join(' - ');
  };

  const generateFarmDescription = async (): Promise<string> => {
    const poolText = farmData.swimmingPool ? 'with swimming pool' : 'without swimming pool';
    return `${farmData.bhk} farm house in ${farmData.city}. Plot ${farmData.overallAreaSqFt} Sq.ft with built-up ${farmData.builtUpAreaSqFt} Sq.ft, ${farmData.numFloors} floors, ${poolText}. Age ${farmData.ageYears} years. ${farmData.furnishingStatus}.`;
  };

  return (
    <BasePropertyForm
      listingType={listingType}
      propertyType={propertyType}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      customTitleGenerator={generateFarmTitle}
      customDescriptionGenerator={generateFarmDescription}
    >
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={farmData.city}
              onChange={(e) => updateFarmData({ city: e.target.value })}
              placeholder="e.g., Hyderabad"
              className="mt-2"
            />
          </div>
          <div>
            <Label>Plot Size</Label>
            <div className="mt-2 flex gap-2">
              <Input
                type="number"
                value={farmData.plotSizeValue || ''}
                onChange={(e) => updateFarmData({ plotSizeValue: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0 })}
                placeholder="e.g., 2.5"
                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <Select value={farmData.plotSizeUnit} onValueChange={(v) => updateFarmData({ plotSizeUnit: v as FarmHouseData['plotSizeUnit'] })}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Acres">Acres</SelectItem>
                  <SelectItem value="Sq.Yds">Sq.Yds</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="overallArea">Overall Area (Sq.ft)</Label>
            <Input
              id="overallArea"
              type="number"
              value={farmData.overallAreaSqFt === 0 ? '' : farmData.overallAreaSqFt.toString()}
              onChange={(e) => updateFarmData({ overallAreaSqFt: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 })}
              placeholder="e.g., 10000"
              className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <Label htmlFor="builtUpArea">Built-up Area (Sq.ft)</Label>
            <Input
              id="builtUpArea"
              type="number"
              value={farmData.builtUpAreaSqFt === 0 ? '' : farmData.builtUpAreaSqFt.toString()}
              onChange={(e) => updateFarmData({ builtUpAreaSqFt: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 })}
              placeholder="e.g., 3500"
              className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div>
            <Label>No. of Bedrooms</Label>
            <Input
              type="number"
              value={farmData.bedrooms || ''}
              onChange={(e) => updateFarmData({ bedrooms: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 })}
              placeholder="e.g., 3"
              className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div>
            <Label>No. of Bathrooms</Label>
            <Input
              type="number"
              value={farmData.bathrooms || ''}
              onChange={(e) => updateFarmData({ bathrooms: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 })}
              placeholder="e.g., 3"
              className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <Label>Swimming Pool</Label>
            <RadioGroup value={(farmData.swimmingPool ? 'yes' : 'no')} onValueChange={(v) => updateFarmData({ swimmingPool: v === 'yes' })} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="pool-yes" />
                <Label htmlFor="pool-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="pool-no" />
                <Label htmlFor="pool-no">No</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label>Landscaped Garden</Label>
            <RadioGroup value={(farmData.landscapedGarden ? 'yes' : 'no')} onValueChange={(v) => updateFarmData({ landscapedGarden: v === 'yes' })} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="garden-yes" />
                <Label htmlFor="garden-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="garden-no" />
                <Label htmlFor="garden-no">No</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label>Road Width to property (ft)</Label>
            <Input
              type="number"
              value={farmData.roadWidthFt || ''}
              onChange={(e) => updateFarmData({ roadWidthFt: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 })}
              placeholder="e.g., 30"
              className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <Label>Facing Direction</Label>
            <Select value={farmData.facing} onValueChange={(v) => updateFarmData({ facing: v as FarmHouseData['facing'] })}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select facing" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(FACING_DIRECTIONS).map((dir) => (
                  <SelectItem key={dir} value={dir}>{dir}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Distance to nearest City (km)</Label>
            <Input
              type="number"
              value={farmData.nearestCityKm || ''}
              onChange={(e) => updateFarmData({ nearestCityKm: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0 })}
              placeholder="e.g., 12"
              className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div>
            <Label>Distance to nearest Highway (km)</Label>
            <Input
              type="number"
              value={farmData.nearestHighwayKm || ''}
              onChange={(e) => updateFarmData({ nearestHighwayKm: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0 })}
              placeholder="e.g., 5"
              className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Legal</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label>Land Status</Label>
            <Select value={farmData.landStatus} onValueChange={(v) => updateFarmData({ landStatus: v as FarmHouseData['landStatus'] })}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Agricultural">Agricultural</SelectItem>
                <SelectItem value="Converted">Converted</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Title Status</Label>
            <Select value={farmData.titleStatus} onValueChange={(v) => updateFarmData({ titleStatus: v as FarmHouseData['titleStatus'] })}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Clear">Clear</SelectItem>
                <SelectItem value="Disputed">Disputed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Encumbrance Certificate</Label>
            <RadioGroup value={(farmData.encumbranceCertificate ? 'yes' : 'no')} onValueChange={(v) => updateFarmData({ encumbranceCertificate: v === 'yes' })} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="ec-yes" />
                <Label htmlFor="ec-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="ec-no" />
                <Label htmlFor="ec-no">No</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Pricing</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label>Price per Unit</Label>
            <div className="mt-2 flex gap-2">
              <Input
                type="number"
                value={farmData.pricePerUnit || ''}
                onChange={(e) => updateFarmData({ pricePerUnit: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0 })}
                placeholder="e.g., 1200000"
                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <Select value={farmData.pricePerUnitUnit} onValueChange={(v) => updateFarmData({ pricePerUnitUnit: v as FarmHouseData['pricePerUnitUnit'] })}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Acre">Per Acre</SelectItem>
                  <SelectItem value="Sq.Yd">Per Sq.Yd</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Negotiable?</Label>
            <RadioGroup value={(farmData.negotiable ? 'yes' : 'no')} onValueChange={(v) => updateFarmData({ negotiable: v === 'yes' })} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="neg-yes" />
                <Label htmlFor="neg-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="neg-no" />
                <Label htmlFor="neg-no">No</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Media</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label>Interior Photos</Label>
            <input type="file" accept="image/*" multiple onChange={handleInteriorUpload} className="mt-2" />
            {(farmData.interiorPhotosUrls || []).length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {(farmData.interiorPhotosUrls || []).map((u, i) => (
                  <div key={u + i} className="relative">
                    <Image src={u} alt="interior" width={160} height={120} className="w-full h-24 object-cover rounded" />
                    <button type="button" className="absolute top-1 right-1 text-xs bg-zinc-900 text-white px-2 py-0.5 rounded" onClick={() => updateFarmData({ interiorPhotosUrls: (farmData.interiorPhotosUrls || []).filter((_, idx) => idx !== i) })}>Remove</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <Label>Exterior Photos</Label>
            <input type="file" accept="image/*" multiple onChange={handleExteriorUpload} className="mt-2" />
            {(farmData.exteriorPhotosUrls || []).length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {(farmData.exteriorPhotosUrls || []).map((u, i) => (
                  <div key={u + i} className="relative">
                    <Image src={u} alt="exterior" width={160} height={120} className="w-full h-24 object-cover rounded" />
                    <button type="button" className="absolute top-1 right-1 text-xs bg-zinc-900 text-white px-2 py-0.5 rounded" onClick={() => updateFarmData({ exteriorPhotosUrls: (farmData.exteriorPhotosUrls || []).filter((_, idx) => idx !== i) })}>Remove</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <Label>Drone Photos</Label>
            <input type="file" accept="image/*" multiple onChange={handleDroneUpload} className="mt-2" />
            {(farmData.droneFootageUrls || []).length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {(farmData.droneFootageUrls || []).map((u, i) => (
                  <div key={u + i} className="relative">
                    <Image src={u} alt="drone" width={160} height={120} className="w-full h-24 object-cover rounded" />
                    <button type="button" className="absolute top-1 right-1 text-xs bg-zinc-900 text-white px-2 py-0.5 rounded" onClick={() => updateFarmData({ droneFootageUrls: (farmData.droneFootageUrls || []).filter((_, idx) => idx !== i) })}>Remove</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <Label htmlFor="mapUrl">Location Map URL</Label>
            <Input id="mapUrl" value={farmData.locationMapUrl || ''} onChange={(e) => updateFarmData({ locationMapUrl: e.target.value || null })} placeholder="Google Maps link" className="mt-2" />
          </div>
        </div>
      </div>
    </BasePropertyForm>
  );
}