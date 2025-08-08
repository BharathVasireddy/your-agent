"use client";

import { useState } from 'react';
import BasePropertyForm from './BasePropertyForm';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type ListingType, type PropertyType, type BasePropertyFormData, type FlatApartmentData, BHK_OPTIONS, COMMUNITY_STATUS, TRANSACTION_TYPES, FLAT_CONSTRUCTION_STATUS, FACING_DIRECTIONS } from '@/types/property';

interface FlatApartmentFormProps {
  listingType: ListingType;
  propertyType: PropertyType;
  onSubmit: (data: BasePropertyFormData) => void;
  onCancel: () => void;
}

export default function FlatApartmentForm({ 
  listingType, 
  propertyType, 
  onSubmit, 
  onCancel 
}: FlatApartmentFormProps) {
  const [flatData, setFlatData] = useState<FlatApartmentData>({
    city: '',
    projectName: '',
    projectArea: '',
    numUnits: 0,
    flatAreaSqFt: 0,
    bhk: '2BHK',
    communityStatus: 'Standalone',
    constructionStatus: 'Ready to move',
    handoverInMonths: undefined,
    floor: 0,
    parkingCount: 0,
    transactionType: 'Resale',
    facing: 'East'
  });

  const updateFlatData = (updates: Partial<FlatApartmentData>) => {
    setFlatData(prev => ({ ...prev, ...updates }));
  };

  const handleSubmit = (baseData: BasePropertyFormData) => {
    const completeData: BasePropertyFormData = {
      ...baseData,
      flatApartmentData: flatData
    };
    onSubmit(completeData);
  };

  const generateFlatTitle = async (): Promise<string> => {
    const parts: string[] = [];
    if (flatData.projectName) parts.push(flatData.projectName);
    parts.push(flatData.bhk);
    if (flatData.flatAreaSqFt > 0) parts.push(`${flatData.flatAreaSqFt} Sq.ft`);
    if (flatData.city) parts.push(flatData.city);
    return parts.join(' - ');
  };

  const generateFlatDescription = async (): Promise<string> => {
    const statusText = flatData.constructionStatus === 'Ready to move'
      ? 'Ready to move'
      : `Handover in ${flatData.handoverInMonths || 0} months`;
    return `${flatData.bhk} apartment in ${flatData.projectName}, ${flatData.city}. ${flatData.flatAreaSqFt} Sq.ft, ${flatData.communityStatus} community, ${statusText}. ${flatData.parkingCount} car parking(s). ${flatData.transactionType}. ${flatData.facing} facing.`;
  };

  return (
    <BasePropertyForm
      listingType={listingType}
      propertyType={propertyType}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      customTitleGenerator={generateFlatTitle}
      customDescriptionGenerator={generateFlatDescription}
    >
      {/* Project & Location */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Project & Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" placeholder="e.g., Gachibowli" className="mt-2" /* Location is in Base form; this label is a hint */ disabled />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={flatData.city}
              onChange={(e) => updateFlatData({ city: e.target.value })}
              placeholder="e.g., Hyderabad"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="projectName">Project Name</Label>
            <Input
              id="projectName"
              value={flatData.projectName}
              onChange={(e) => updateFlatData({ projectName: e.target.value })}
              placeholder="e.g., Sunshine Towers"
              className="mt-2"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <Label htmlFor="projectArea">Project Area</Label>
            <Input
              id="projectArea"
              value={flatData.projectArea}
              onChange={(e) => updateFlatData({ projectArea: e.target.value })}
              placeholder="e.g., 5 Acres"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="numUnits">No. of Units</Label>
            <Input
              id="numUnits"
              type="number"
              value={flatData.numUnits === 0 ? '' : flatData.numUnits.toString()}
              onChange={(e) => updateFlatData({ numUnits: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 })}
              placeholder="e.g., 120"
              className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div>
            <Label htmlFor="flatArea">Flat Area (Sq.ft)</Label>
            <Input
              id="flatArea"
              type="number"
              value={flatData.flatAreaSqFt === 0 ? '' : flatData.flatAreaSqFt.toString()}
              onChange={(e) => updateFlatData({ flatAreaSqFt: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 })}
              placeholder="e.g., 1450"
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
            <Select value={flatData.bhk} onValueChange={(value) => updateFlatData({ bhk: value as FlatApartmentData['bhk'] })}>
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
            <Select value={flatData.communityStatus} onValueChange={(value) => updateFlatData({ communityStatus: value as FlatApartmentData['communityStatus'] })}>
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
            <Select value={flatData.constructionStatus} onValueChange={(value) => updateFlatData({ constructionStatus: value as FlatApartmentData['constructionStatus'] })}>
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

        {flatData.constructionStatus === 'Handover in' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div>
              <Label htmlFor="handoverIn">Handover In (months)</Label>
              <Input
                id="handoverIn"
                type="number"
                value={flatData.handoverInMonths?.toString() || ''}
                onChange={(e) => updateFlatData({ handoverInMonths: e.target.value === '' ? undefined : parseInt(e.target.value) || 0 })}
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
            <Label htmlFor="floor">Floor</Label>
            <Input
              id="floor"
              type="number"
              value={flatData.floor === 0 ? '' : flatData.floor.toString()}
              onChange={(e) => updateFlatData({ floor: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 })}
              placeholder="e.g., 5"
              className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div>
            <Label htmlFor="parkingCount">Parking (No. of Car Parkings)</Label>
            <Input
              id="parkingCount"
              type="number"
              value={flatData.parkingCount === 0 ? '' : flatData.parkingCount.toString()}
              onChange={(e) => updateFlatData({ parkingCount: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 })}
              placeholder="e.g., 2"
              className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div>
            <Label>Transaction</Label>
            <Select value={flatData.transactionType} onValueChange={(value) => updateFlatData({ transactionType: value as FlatApartmentData['transactionType'] })}>
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
            <Select value={flatData.facing} onValueChange={(value) => updateFlatData({ facing: value as FlatApartmentData['facing'] })}>
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
        </div>
      </div>
    </BasePropertyForm>
  );
}