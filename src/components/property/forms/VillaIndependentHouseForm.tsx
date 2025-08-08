"use client";

import { useState } from 'react';
import BasePropertyForm from './BasePropertyForm';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  type ListingType,
  type PropertyType,
  type BasePropertyFormData,
  type VillaIndependentHouseData,
  BHK_OPTIONS,
  COMMUNITY_STATUS,
  TRANSACTION_TYPES,
  FLAT_CONSTRUCTION_STATUS,
  FACING_DIRECTIONS,
  FURNISHING_STATUS,
} from '@/types/property';

interface VillaIndependentHouseFormProps {
  listingType: ListingType;
  propertyType: PropertyType;
  onSubmit: (data: BasePropertyFormData) => void;
  onCancel: () => void;
}

export default function VillaIndependentHouseForm({ 
  listingType, 
  propertyType, 
  onSubmit, 
  onCancel 
}: VillaIndependentHouseFormProps) {
  const [villaData, setVillaData] = useState<VillaIndependentHouseData>({
    city: '',
    projectName: '',
    projectArea: '',
    numUnits: 0,
    villaAreaSqFt: 0,
    bhk: '2BHK',
    communityStatus: 'Standalone',
    constructionStatus: 'Ready to move',
    handoverInMonths: undefined,
    numFloors: 0,
    parkingCount: 0,
    transactionType: 'Resale',
    facing: 'East',
    furnishingStatus: 'Unfurnished',
  });

  const updateVillaData = (updates: Partial<VillaIndependentHouseData>) => {
    setVillaData(prev => ({ ...prev, ...updates }));
  };

  const handleSubmit = (baseData: BasePropertyFormData) => {
    const completeData: BasePropertyFormData = {
      ...baseData,
      villaIndependentHouseData: villaData,
    };
    onSubmit(completeData);
  };

  const generateVillaTitle = async (): Promise<string> => {
    const parts: string[] = [];
    if (villaData.projectName) parts.push(villaData.projectName);
    parts.push(villaData.bhk);
    if (villaData.villaAreaSqFt > 0) parts.push(`${villaData.villaAreaSqFt} Sq.ft`);
    if (villaData.city) parts.push(villaData.city);
    return parts.join(' - ');
  };

  const generateVillaDescription = async (): Promise<string> => {
    const statusText = villaData.constructionStatus === 'Ready to move'
      ? 'Ready to move'
      : `Handover in ${villaData.handoverInMonths || 0} months`;
    const furnish = villaData.furnishingStatus;
    return `${villaData.bhk} Villa/Independent House in ${villaData.projectName}, ${villaData.city}. ${villaData.villaAreaSqFt} Sq.ft, ${villaData.communityStatus} community, ${statusText}. ${villaData.numFloors} floor(s), ${villaData.parkingCount} car parking(s). ${villaData.transactionType}. ${villaData.facing} facing. ${furnish}.`;
  };

  return (
    <BasePropertyForm
      listingType={listingType}
      propertyType={propertyType}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      customTitleGenerator={generateVillaTitle}
      customDescriptionGenerator={generateVillaDescription}
    >
      {/* Project & Location */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Project & Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" placeholder="e.g., Jubilee Hills" className="mt-2" disabled />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={villaData.city}
              onChange={(e) => updateVillaData({ city: e.target.value })}
              placeholder="e.g., Hyderabad"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="projectName">Project Name</Label>
            <Input
              id="projectName"
              value={villaData.projectName}
              onChange={(e) => updateVillaData({ projectName: e.target.value })}
              placeholder="e.g., Elite Enclave"
              className="mt-2"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <Label htmlFor="projectArea">Project Area</Label>
            <Input
              id="projectArea"
              value={villaData.projectArea}
              onChange={(e) => updateVillaData({ projectArea: e.target.value })}
              placeholder="e.g., 5 Acres"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="numUnits">No. of Units</Label>
            <Input
              id="numUnits"
              type="number"
              value={villaData.numUnits === 0 ? '' : villaData.numUnits.toString()}
              onChange={(e) => updateVillaData({ numUnits: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 })}
              placeholder="e.g., 50"
              className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div>
            <Label htmlFor="villaAreaSqFt">Villa Area (Sq.ft)</Label>
            <Input
              id="villaAreaSqFt"
              type="number"
              value={villaData.villaAreaSqFt === 0 ? '' : villaData.villaAreaSqFt.toString()}
              onChange={(e) => updateVillaData({ villaAreaSqFt: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 })}
              placeholder="e.g., 2400"
              className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>
      </div>

      {/* Configuration & Status */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Configuration & Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label>BHK</Label>
            <Select value={villaData.bhk} onValueChange={(value) => updateVillaData({ bhk: value as VillaIndependentHouseData['bhk'] })}>
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
            <Label>Community Status</Label>
            <Select value={villaData.communityStatus} onValueChange={(value) => updateVillaData({ communityStatus: value as VillaIndependentHouseData['communityStatus'] })}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select community type" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(COMMUNITY_STATUS).map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Construction Status</Label>
            <Select value={villaData.constructionStatus} onValueChange={(value) => updateVillaData({ constructionStatus: value as VillaIndependentHouseData['constructionStatus'] })}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select construction status" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(FLAT_CONSTRUCTION_STATUS).map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {villaData.constructionStatus === 'Handover in' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div>
              <Label htmlFor="handoverIn">Handover In (months)</Label>
              <Input
                id="handoverIn"
                type="number"
                value={villaData.handoverInMonths?.toString() || ''}
                onChange={(e) => updateVillaData({ handoverInMonths: e.target.value === '' ? undefined : parseInt(e.target.value) || 0 })}
                placeholder="e.g., 6"
                className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Other Details */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Other Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="numFloors">Number of Floors</Label>
            <Input
              id="numFloors"
              type="number"
              value={villaData.numFloors === 0 ? '' : villaData.numFloors.toString()}
              onChange={(e) => updateVillaData({ numFloors: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 })}
              placeholder="e.g., 2"
              className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div>
            <Label htmlFor="parkingCount">Parking (No. of Car Parkings)</Label>
            <Input
              id="parkingCount"
              type="number"
              value={villaData.parkingCount === 0 ? '' : villaData.parkingCount.toString()}
              onChange={(e) => updateVillaData({ parkingCount: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 })}
              placeholder="e.g., 2"
              className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div>
            <Label>Transaction</Label>
            <Select value={villaData.transactionType} onValueChange={(value) => updateVillaData({ transactionType: value as VillaIndependentHouseData['transactionType'] })}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select transaction type" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(TRANSACTION_TYPES).map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <Label>Facing</Label>
            <Select value={villaData.facing} onValueChange={(value) => updateVillaData({ facing: value as VillaIndependentHouseData['facing'] })}>
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
            <Label>Furnishing Status</Label>
            <Select value={villaData.furnishingStatus} onValueChange={(value) => updateVillaData({ furnishingStatus: value as VillaIndependentHouseData['furnishingStatus'] })}>
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