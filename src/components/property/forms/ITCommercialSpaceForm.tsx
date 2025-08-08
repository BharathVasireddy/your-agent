"use client";

import { useState } from 'react';
import BasePropertyForm from './BasePropertyForm';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { type ListingType, type PropertyType, type BasePropertyFormData, type ITCommercialSpaceData, FACING_DIRECTIONS, TRANSACTION_TYPES, FLAT_CONSTRUCTION_STATUS, FURNISHING_STATUS } from '@/types/property';

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
  const [itData, setItData] = useState<ITCommercialSpaceData>({
    city: '',
    projectName: '',
    projectAreaSqFt: 0,
    numUnits: 0,
    perUnitAreaSqFt: 0,
    constructionStatus: 'Ready to move',
    handoverInMonths: undefined,
    floorInfo: '',
    facing: 'East',
    carParkingCount: 0,
    bikeParkingCount: 0,
    transactionType: 'Resale',
    furnishingStatus: 'Unfurnished',
    airConditioned: false
  });

  const updateItData = (updates: Partial<ITCommercialSpaceData>) => {
    setItData(prev => ({ ...prev, ...updates }));
  };

  const handleSubmit = (baseData: BasePropertyFormData) => {
    const completeData: BasePropertyFormData = {
      ...baseData,
      itCommercialSpaceData: itData
    };
    onSubmit(completeData);
  };

  const generateItTitle = async (): Promise<string> => {
    const parts: string[] = [];
    if (itData.projectName) parts.push(itData.projectName);
    parts.push('IT Commercial Space');
    if (itData.perUnitAreaSqFt > 0) parts.push(`${itData.perUnitAreaSqFt} Sq.ft/unit`);
    if (itData.city) parts.push(itData.city);
    return parts.join(' - ');
  };

  const generateItDescription = async (): Promise<string> => {
    const statusText = itData.constructionStatus === 'Ready to move'
      ? 'Ready to move'
      : `Handover in ${itData.handoverInMonths || 0} months`;
    const acText = itData.airConditioned ? 'Air-conditioned' : 'Non AC';
    return `${itData.projectName}, ${itData.city}. Project ${itData.projectAreaSqFt} Sq.ft, ${itData.numUnits} units, ${itData.perUnitAreaSqFt} Sq.ft per unit. ${statusText}, Floor ${itData.floorInfo}, ${itData.facing} facing. ${itData.carParkingCount} car + ${itData.bikeParkingCount} bike parking. ${itData.transactionType}, ${itData.furnishingStatus}. ${acText}.`;
  };

  return (
    <BasePropertyForm
      listingType={listingType}
      propertyType={propertyType}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      customTitleGenerator={generateItTitle}
      customDescriptionGenerator={generateItDescription}
    >
      {/* Project & Location */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Project & Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={itData.city}
              onChange={(e) => updateItData({ city: e.target.value })}
              placeholder="e.g., Hyderabad"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="projectName">Project Name</Label>
            <Input
              id="projectName"
              value={itData.projectName}
              onChange={(e) => updateItData({ projectName: e.target.value })}
              placeholder="e.g., Cyber Heights"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="projectAreaSqFt">Project Area (Sq.ft)</Label>
            <Input
              id="projectAreaSqFt"
              type="number"
              value={itData.projectAreaSqFt === 0 ? '' : itData.projectAreaSqFt.toString()}
              onChange={(e) => updateItData({ projectAreaSqFt: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 })}
              placeholder="e.g., 100000"
              className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <Label htmlFor="numUnits">No. of Units</Label>
            <Input
              id="numUnits"
              type="number"
              value={itData.numUnits === 0 ? '' : itData.numUnits.toString()}
              onChange={(e) => updateItData({ numUnits: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 })}
              placeholder="e.g., 20"
              className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div>
            <Label htmlFor="perUnitAreaSqFt">Area (per unit in Sq.ft)</Label>
            <Input
              id="perUnitAreaSqFt"
              type="number"
              value={itData.perUnitAreaSqFt === 0 ? '' : itData.perUnitAreaSqFt.toString()}
              onChange={(e) => updateItData({ perUnitAreaSqFt: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 })}
              placeholder="e.g., 5000"
              className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div>
            <Label htmlFor="floorInfo">Floor (e.g., 3/10)</Label>
            <Input
              id="floorInfo"
              value={itData.floorInfo}
              onChange={(e) => updateItData({ floorInfo: e.target.value })}
              placeholder="e.g., 3/10"
              className="mt-2"
            />
          </div>
        </div>
      </div>

      {/* Status & Specs */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Status & Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label>Construction Status</Label>
            <Select value={itData.constructionStatus} onValueChange={(value) => updateItData({ constructionStatus: value as ITCommercialSpaceData['constructionStatus'] })}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(FLAT_CONSTRUCTION_STATUS).map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {itData.constructionStatus === 'Handover in' && (
            <div>
              <Label htmlFor="handoverIn">Handover In (months)</Label>
              <Input
                id="handoverIn"
                type="number"
                value={itData.handoverInMonths?.toString() || ''}
                onChange={(e) => updateItData({ handoverInMonths: e.target.value === '' ? undefined : parseInt(e.target.value) || 0 })}
                placeholder="e.g., 6"
                className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          )}
          <div>
            <Label>Facing</Label>
            <Select value={itData.facing} onValueChange={(value) => updateItData({ facing: value as ITCommercialSpaceData['facing'] })}>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <Label htmlFor="carParkingCount">Car Parking</Label>
            <Input
              id="carParkingCount"
              type="number"
              value={itData.carParkingCount === 0 ? '' : itData.carParkingCount.toString()}
              onChange={(e) => updateItData({ carParkingCount: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 })}
              placeholder="e.g., 4"
              className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div>
            <Label htmlFor="bikeParkingCount">Bike Parking</Label>
            <Input
              id="bikeParkingCount"
              type="number"
              value={itData.bikeParkingCount === 0 ? '' : itData.bikeParkingCount.toString()}
              onChange={(e) => updateItData({ bikeParkingCount: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 })}
              placeholder="e.g., 10"
              className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div>
            <Label>Transaction Type</Label>
            <Select value={itData.transactionType} onValueChange={(value) => updateItData({ transactionType: value as ITCommercialSpaceData['transactionType'] })}>
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
            <Label>Furnishing Status</Label>
            <Select value={itData.furnishingStatus} onValueChange={(value) => updateItData({ furnishingStatus: value as ITCommercialSpaceData['furnishingStatus'] })}>
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
          <div>
            <Label className="flex items-center">Air Conditioned</Label>
            <RadioGroup
              value={itData.airConditioned.toString()}
              onValueChange={(value) => updateItData({ airConditioned: value === 'true' })}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="ac-yes" />
                <Label htmlFor="ac-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="ac-no" />
                <Label htmlFor="ac-no">No</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
    </BasePropertyForm>
  );
}