"use client";

import { useState } from 'react';
import BasePropertyForm from './BasePropertyForm';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { type ListingType, type PropertyType, type BasePropertyFormData, type FarmHouseData, BHK_OPTIONS, FURNISHING_STATUS } from '@/types/property';

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
    furnishingStatus: 'Unfurnished'
  });

  const updateFarmData = (updates: Partial<FarmHouseData>) => {
    setFarmData(prev => ({ ...prev, ...updates }));
  };

  const handleSubmit = (baseData: BasePropertyFormData) => {
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
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Farm House Details</h3>
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
          <div>
            <Label htmlFor="builtUpArea">Built Up Area (Sq.ft)</Label>
            <Input
              id="builtUpArea"
              type="number"
              value={farmData.builtUpAreaSqFt === 0 ? '' : farmData.builtUpAreaSqFt.toString()}
              onChange={(e) => updateFarmData({ builtUpAreaSqFt: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 })}
              placeholder="e.g., 3500"
              className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <Label htmlFor="numFloors">Number of Floors</Label>
            <Input
              id="numFloors"
              type="number"
              value={farmData.numFloors === 0 ? '' : farmData.numFloors.toString()}
              onChange={(e) => updateFarmData({ numFloors: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 })}
              placeholder="e.g., 2"
              className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div>
            <Label>BHK</Label>
            <Select value={farmData.bhk} onValueChange={(value) => updateFarmData({ bhk: value as FarmHouseData['bhk'] })}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select BHK" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(BHK_OPTIONS).map((b) => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="flex items-center">Swimming Pool</Label>
            <RadioGroup
              value={farmData.swimmingPool.toString()}
              onValueChange={(value) => updateFarmData({ swimmingPool: value === 'true' })}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="pool-yes" />
                <Label htmlFor="pool-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="pool-no" />
                <Label htmlFor="pool-no">No</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <Label htmlFor="ageYears">Age of the Property (years)</Label>
            <Input
              id="ageYears"
              type="number"
              value={farmData.ageYears === 0 ? '' : farmData.ageYears.toString()}
              onChange={(e) => updateFarmData({ ageYears: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 })}
              placeholder="e.g., 3"
              className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div>
            <Label>Furnishing Status</Label>
            <Select value={farmData.furnishingStatus} onValueChange={(value) => updateFarmData({ furnishingStatus: value as FarmHouseData['furnishingStatus'] })}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select furnishing status" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(FURNISHING_STATUS).map((f) => (
                  <SelectItem key={f} value={f}>{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </BasePropertyForm>
  );
}