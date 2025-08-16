"use client";

import { useState } from 'react';
import BasePropertyForm from './BasePropertyForm';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { type ListingType, type PropertyType, type BasePropertyFormData, type ITCommercialSpaceData, FACING_DIRECTIONS, TRANSACTION_TYPES, FLAT_CONSTRUCTION_STATUS, FURNISHING_STATUS, POWER_BACKUP } from '@/types/property';

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
    airConditioned: false,
    // extended
    commercialType: undefined,
    readinessStatus: 'Ready',
    possessionDateIso: '',
    builtUpAreaSqFt: undefined,
    carpetAreaSqFt: undefined,
    floorLevel: undefined,
    ceilingHeightFeet: undefined,
    coveredParkingSlots: undefined,
    openParkingSlots: undefined,
    liftType: undefined,
    powerBackup: undefined,
    acType: undefined,
    roadWidthFeet: undefined,
    furnishingCommercial: undefined,
    commercialApprovalCertificate: undefined,
    fireNoc: undefined,
    reraRegistrationNumber: null,
    pricePerSqFt: undefined,
    maintenanceMonthly: undefined,
    negotiable: undefined,
    interiorPhotoUrls: [],
    exteriorPhotoUrls: [],
    floorPlanUrls: [],
    locationMapUrl: ''
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
    parts.push(itData.commercialType || 'IT Commercial Space');
    if (itData.builtUpAreaSqFt) parts.push(`${itData.builtUpAreaSqFt} Sq.ft`);
    if (itData.city) parts.push(itData.city);
    return parts.join(' - ');
  };

  const generateItDescription = async (): Promise<string> => {
    const statusText = itData.readinessStatus === 'Under Construction'
      ? `Possession by ${(itData.possessionDateIso && new Date(itData.possessionDateIso).toLocaleDateString()) || 'TBD'}`
      : itData.readinessStatus || 'Ready';
    const ac = itData.acType || (itData.airConditioned ? 'Central' : 'None');
    return `${itData.commercialType || 'IT Commercial Space'} in ${itData.projectName}, ${itData.city}. Built-up ${itData.builtUpAreaSqFt || 0} Sq.ft, Carpet ${itData.carpetAreaSqFt || 0} Sq.ft. ${statusText}. Floor: ${itData.floorLevel || itData.floorInfo}. Ceiling ${itData.ceilingHeightFeet || 0} ft. Parking: ${itData.coveredParkingSlots || 0} covered / ${itData.openParkingSlots || 0} open. Lift: ${itData.liftType || 'N/A'}. Power backup: ${itData.powerBackup || 'None'}. AC: ${ac}. Road ${itData.roadWidthFeet || 0} ft. Furnishing: ${itData.furnishingCommercial || itData.furnishingStatus}.`;
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

      {/* Basic Information */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label>Type</Label>
            <Select value={itData.commercialType} onValueChange={(value) => updateItData({ commercialType: value as NonNullable<ITCommercialSpaceData['commercialType']> })}>
              <SelectTrigger className="mt-2"><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                {['IT Office Space','Retail Space','Showroom','Warehouse'].map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Status</Label>
            <Select value={itData.readinessStatus} onValueChange={(value) => updateItData({ readinessStatus: value as NonNullable<ITCommercialSpaceData['readinessStatus']> })}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {['Ready','Under Construction','Shell'].map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          {itData.readinessStatus === 'Under Construction' && (
            <div>
              <Label htmlFor="possessionDate">Possession Date</Label>
              <Input id="possessionDate" type="date" value={itData.possessionDateIso || ''} onChange={(e) => updateItData({ possessionDateIso: e.target.value })} className="mt-2" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <Label htmlFor="builtUpArea">Built-up Area (Sq.ft)</Label>
            <Input id="builtUpArea" type="number" value={itData.builtUpAreaSqFt?.toString() || ''} onChange={(e) => updateItData({ builtUpAreaSqFt: e.target.value === '' ? undefined : parseInt(e.target.value) || 0 })} className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
          </div>
          <div>
            <Label htmlFor="carpetArea">Carpet Area (Sq.ft)</Label>
            <Input id="carpetArea" type="number" value={itData.carpetAreaSqFt?.toString() || ''} onChange={(e) => updateItData({ carpetAreaSqFt: e.target.value === '' ? undefined : parseInt(e.target.value) || 0 })} className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
          </div>
          <div>
            <Label>Floor Level</Label>
            <Select value={itData.floorLevel} onValueChange={(value) => updateItData({ floorLevel: value as NonNullable<ITCommercialSpaceData['floorLevel']> })}>
              <SelectTrigger className="mt-2"><SelectValue placeholder="Select floor level" /></SelectTrigger>
              <SelectContent>
                {['Ground','Upper','Multiple floors'].map((v) => (<SelectItem key={v} value={v}>{v}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <Label htmlFor="ceilingHeight">Ceiling Height (ft)</Label>
            <Input id="ceilingHeight" type="number" value={itData.ceilingHeightFeet?.toString() || ''} onChange={(e) => updateItData({ ceilingHeightFeet: e.target.value === '' ? undefined : parseFloat(e.target.value) || 0 })} className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
          </div>
          <div>
            <Label>Parking Slots</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <Input type="number" placeholder="Covered" value={itData.coveredParkingSlots?.toString() || ''} onChange={(e) => updateItData({ coveredParkingSlots: e.target.value === '' ? undefined : parseInt(e.target.value) || 0 })} className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              <Input type="number" placeholder="Open" value={itData.openParkingSlots?.toString() || ''} onChange={(e) => updateItData({ openParkingSlots: e.target.value === '' ? undefined : parseInt(e.target.value) || 0 })} className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
            </div>
          </div>
          <div>
            <Label>Lift Type</Label>
            <Select value={itData.liftType} onValueChange={(value) => updateItData({ liftType: value as NonNullable<ITCommercialSpaceData['liftType']> })}>
              <SelectTrigger className="mt-2"><SelectValue placeholder="Select lift" /></SelectTrigger>
              <SelectContent>
                {['Passenger','Service','Freight'].map((v) => (<SelectItem key={v} value={v}>{v}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <Label>Power Backup</Label>
            <Select value={itData.powerBackup} onValueChange={(value) => updateItData({ powerBackup: value as NonNullable<ITCommercialSpaceData['powerBackup']> })}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(POWER_BACKUP).map((v) => (<SelectItem key={v} value={v}>{v}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Air Conditioning</Label>
            <Select value={itData.acType} onValueChange={(value) => updateItData({ acType: value as NonNullable<ITCommercialSpaceData['acType']> })}>
              <SelectTrigger className="mt-2"><SelectValue placeholder="Select AC type" /></SelectTrigger>
              <SelectContent>
                {['Central','Split','None'].map((v) => (<SelectItem key={v} value={v}>{v}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="roadWidth">Road Width in front (ft)</Label>
            <Input id="roadWidth" type="number" value={itData.roadWidthFeet?.toString() || ''} onChange={(e) => updateItData({ roadWidthFeet: e.target.value === '' ? undefined : parseInt(e.target.value) || 0 })} className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <Label>Furnishing</Label>
            <Select value={itData.furnishingCommercial} onValueChange={(value) => updateItData({ furnishingCommercial: value as NonNullable<ITCommercialSpaceData['furnishingCommercial']> })}>
              <SelectTrigger className="mt-2"><SelectValue placeholder="Select furnishing" /></SelectTrigger>
              <SelectContent>
                {['Bare shell','Warm shell','Fully furnished'].map((v) => (<SelectItem key={v} value={v}>{v}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Legal */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Legal</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-2"><Checkbox checked={!!itData.commercialApprovalCertificate} onCheckedChange={(v) => updateItData({ commercialApprovalCertificate: !!v })} /><Label>Commercial Approval Certificate</Label></div>
          <div className="flex items-center space-x-2"><Checkbox checked={!!itData.fireNoc} onCheckedChange={(v) => updateItData({ fireNoc: !!v })} /><Label>Fire NOC</Label></div>
          <div>
            <Label htmlFor="rera">RERA Number</Label>
            <Input id="rera" value={itData.reraRegistrationNumber || ''} onChange={(e) => updateItData({ reraRegistrationNumber: e.target.value || null })} className="mt-2" />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Pricing</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="pricePerSqFt">Price per Sq.Ft</Label>
            <Input id="pricePerSqFt" type="number" value={itData.pricePerSqFt?.toString() || ''} onChange={(e) => updateItData({ pricePerSqFt: e.target.value === '' ? undefined : parseInt(e.target.value) || 0 })} className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
          </div>
          <div>
            <Label htmlFor="maintenanceMonthly">Maintenance Charges</Label>
            <Input id="maintenanceMonthly" type="number" value={itData.maintenanceMonthly?.toString() || ''} onChange={(e) => updateItData({ maintenanceMonthly: e.target.value === '' ? undefined : parseInt(e.target.value) || 0 })} className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
          </div>
          <div className="flex items-center space-x-2 mt-8">
            <Checkbox checked={!!itData.negotiable} onCheckedChange={(v) => updateItData({ negotiable: !!v })} />
            <Label>Negotiable?</Label>
          </div>
        </div>
      </div>

      {/* Media */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Media</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="interiorUrls">Interior Photo URLs (comma-separated)</Label>
            <Textarea id="interiorUrls" value={(itData.interiorPhotoUrls || []).join(', ')} onChange={(e) => updateItData({ interiorPhotoUrls: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} className="mt-2" rows={2} />
          </div>
          <div>
            <Label htmlFor="exteriorUrls">Exterior Photo URLs (comma-separated)</Label>
            <Textarea id="exteriorUrls" value={(itData.exteriorPhotoUrls || []).join(', ')} onChange={(e) => updateItData({ exteriorPhotoUrls: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} className="mt-2" rows={2} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <Label htmlFor="floorPlanUrls">Floor Plan URLs (comma-separated)</Label>
            <Textarea id="floorPlanUrls" value={(itData.floorPlanUrls || []).join(', ')} onChange={(e) => updateItData({ floorPlanUrls: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} className="mt-2" rows={2} />
          </div>
          <div>
            <Label htmlFor="locationMapUrl">Location Map URL</Label>
            <Input id="locationMapUrl" value={itData.locationMapUrl || ''} onChange={(e) => updateItData({ locationMapUrl: e.target.value || null })} className="mt-2" />
          </div>
        </div>
      </div>
    </BasePropertyForm>
  );
}