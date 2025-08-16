"use client";

import { useState } from 'react';
import Image from 'next/image';
import BasePropertyForm from './BasePropertyForm';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type ListingType, type PropertyType, type BasePropertyFormData, type FlatApartmentData, BHK_OPTIONS, COMMUNITY_STATUS, TRANSACTION_TYPES, FACING_DIRECTIONS, FURNISHING_STATUS, FLOORING_TYPES, AGE_OF_PROPERTY, POWER_BACKUP, PARKING_TYPES, WATER_SUPPLY, TITLE_STATUS } from '@/types/property';

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
    const statusText = flatData.readinessStatus === 'Under Construction'
      ? `Possession by ${(flatData.possessionDateIso && new Date(flatData.possessionDateIso).toLocaleDateString()) || 'TBD'}`
      : flatData.readinessStatus || 'Ready to Move';
    const area = flatData.flatAreaSqFt || flatData.builtUpAreaSqFt || 0;
    return `${flatData.bhk} apartment in ${flatData.projectName}, ${flatData.city}. ${area} Sq.ft, ${flatData.communityStatus} community, ${statusText}. ${flatData.parkingCount} car parking(s). ${flatData.transactionType}. ${flatData.facing} facing.`;
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
            <Label htmlFor="numUnits">Total number of flats</Label>
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
            <Label>Readiness Status</Label>
            <Select value={flatData.readinessStatus} onValueChange={(value) => updateFlatData({ readinessStatus: value as NonNullable<FlatApartmentData['readinessStatus']> })}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {['Ready to Move','Under Construction','Pre-launch'].map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {flatData.readinessStatus === 'Under Construction' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div>
              <Label htmlFor="possessionDate">Possession Date</Label>
              <Input
                id="possessionDate"
                type="date"
                value={flatData.possessionDateIso || ''}
                onChange={(e) => updateFlatData({ possessionDateIso: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <Label>Ownership Type</Label>
            <Select value={flatData.transactionType} onValueChange={(value) => updateFlatData({ transactionType: value as FlatApartmentData['transactionType'] })}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select ownership" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(TRANSACTION_TYPES).map((t) => (
                  <SelectItem key={t} value={t}>{t === 'Brand New' ? 'New' : 'Resale'}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Age of Property</Label>
            <Select value={flatData.ageOfProperty} onValueChange={(value) => updateFlatData({ ageOfProperty: value as NonNullable<FlatApartmentData['ageOfProperty']> })}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select age" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(AGE_OF_PROPERTY).map((v) => (
                  <SelectItem key={v} value={v}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Areas & Other Details */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Areas & Other Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="builtUpArea">Built-up Area (Sq.ft)</Label>
            <Input
              id="builtUpArea"
              type="number"
              value={flatData.builtUpAreaSqFt?.toString() || ''}
              onChange={(e) => updateFlatData({ builtUpAreaSqFt: e.target.value === '' ? undefined : parseInt(e.target.value) || 0 })}
              placeholder="e.g., 1600"
              className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div>
            <Label htmlFor="carpetArea">Carpet Area (Sq.ft)</Label>
            <Input
              id="carpetArea"
              type="number"
              value={flatData.carpetAreaSqFt?.toString() || ''}
              onChange={(e) => updateFlatData({ carpetAreaSqFt: e.target.value === '' ? undefined : parseInt(e.target.value) || 0 })}
              placeholder="e.g., 1200"
              className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <Label htmlFor="totalFloors">Total Floors (building)</Label>
            <Input
              id="totalFloors"
              type="number"
              value={flatData.totalFloors?.toString() || ''}
              onChange={(e) => updateFlatData({ totalFloors: e.target.value === '' ? undefined : parseInt(e.target.value) || 0 })}
              placeholder="e.g., 10"
              className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div>
            <Label htmlFor="propertyArea">Property Area</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <Input id="propertyArea" type="number" value={flatData.propertyAreaValue?.toString() || ''} onChange={(e) => updateFlatData({ propertyAreaValue: e.target.value === '' ? undefined : parseFloat(e.target.value) || 0 })} className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              <Select value={flatData.propertyAreaUnit} onValueChange={(value) => updateFlatData({ propertyAreaUnit: value as NonNullable<FlatApartmentData['propertyAreaUnit']> })}>
                <SelectTrigger>
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  {['Acres','Sq.Yds','Sq.Ft'].map((u) => (<SelectItem key={u} value={u}>{u}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
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
          <div>
            <Label htmlFor="bathrooms">No. of Bathrooms</Label>
            <Input id="bathrooms" type="number" value={flatData.bathroomsCount?.toString() || ''} onChange={(e) => updateFlatData({ bathroomsCount: e.target.value === '' ? undefined : parseInt(e.target.value) || 0 })} className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
          </div>
          <div>
            <Label htmlFor="balconies">No. of Balconies</Label>
            <Input id="balconies" type="number" value={flatData.balconiesCount?.toString() || ''} onChange={(e) => updateFlatData({ balconiesCount: e.target.value === '' ? undefined : parseInt(e.target.value) || 0 })} className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <Label htmlFor="ceilingHeight">Ceiling Height (feet)</Label>
            <Input
              id="ceilingHeight"
              type="number"
              value={flatData.ceilingHeightFeet?.toString() || ''}
              onChange={(e) => updateFlatData({ ceilingHeightFeet: e.target.value === '' ? undefined : parseFloat(e.target.value) || 0 })}
              placeholder="e.g., 10"
              className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Amenities</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-2"><Checkbox checked={!!flatData.hasClubhouse} onCheckedChange={(v) => updateFlatData({ hasClubhouse: !!v })} /><Label>Clubhouse</Label></div>
          <div className="flex items-center space-x-2"><Checkbox checked={!!flatData.hasGym} onCheckedChange={(v) => updateFlatData({ hasGym: !!v })} /><Label>Gym</Label></div>
          <div className="flex items-center space-x-2"><Checkbox checked={!!flatData.hasSwimmingPool} onCheckedChange={(v) => updateFlatData({ hasSwimmingPool: !!v })} /><Label>Swimming Pool</Label></div>
          <div className="flex items-center space-x-2"><Checkbox checked={!!flatData.hasChildrenPlayArea} onCheckedChange={(v) => updateFlatData({ hasChildrenPlayArea: !!v })} /><Label>Children’s Play Area</Label></div>
          <div className="flex items-center space-x-2"><Checkbox checked={!!flatData.hasGardenPark} onCheckedChange={(v) => updateFlatData({ hasGardenPark: !!v })} /><Label>Garden / Park</Label></div>
          <div className="flex items-center space-x-2"><Checkbox checked={!!flatData.hasSecurityCctv} onCheckedChange={(v) => updateFlatData({ hasSecurityCctv: !!v })} /><Label>Security / CCTV</Label></div>
          <div className="flex items-center space-x-2"><Checkbox checked={!!flatData.hasLift} onCheckedChange={(v) => updateFlatData({ hasLift: !!v })} /><Label>Lift Availability</Label></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <Label>Power Backup</Label>
            <Select value={flatData.powerBackup} onValueChange={(value) => updateFlatData({ powerBackup: value as NonNullable<FlatApartmentData['powerBackup']> })}>
              <SelectTrigger className="mt-2"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {Object.values(POWER_BACKUP).map((v) => (<SelectItem key={v} value={v}>{v}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Parking Type</Label>
            <Select value={flatData.parkingType} onValueChange={(value) => updateFlatData({ parkingType: value as NonNullable<FlatApartmentData['parkingType']> })}>
              <SelectTrigger className="mt-2"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {Object.values(PARKING_TYPES).map((v) => (<SelectItem key={v} value={v}>{v}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="parkingSlots">Number of Parking Slots</Label>
            <Input id="parkingSlots" type="number" value={flatData.parkingSlots?.toString() || ''} onChange={(e) => updateFlatData({ parkingSlots: e.target.value === '' ? undefined : parseInt(e.target.value) || 0 })} className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <Label>Water Supply</Label>
            <Select value={flatData.waterSupply} onValueChange={(value) => updateFlatData({ waterSupply: value as NonNullable<FlatApartmentData['waterSupply']> })}>
              <SelectTrigger className="mt-2"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {Object.values(WATER_SUPPLY).map((v) => (<SelectItem key={v} value={v}>{v}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="roadWidth">Road Width to Property (feet)</Label>
            <Input id="roadWidth" type="number" value={flatData.roadWidthFeet?.toString() || ''} onChange={(e) => updateFlatData({ roadWidthFeet: e.target.value === '' ? undefined : parseInt(e.target.value) || 0 })} className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
          </div>
        </div>
      </div>

      {/* Legal Documentation */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Legal Documentation</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-2"><Checkbox checked={!!flatData.approvedBuildingPlan} onCheckedChange={(v) => updateFlatData({ approvedBuildingPlan: !!v })} /><Label>Approved Building Plan</Label></div>
          <div>
            <Label htmlFor="rera">RERA Registration Number</Label>
            <Input id="rera" value={flatData.reraRegistrationNumber || ''} onChange={(e) => updateFlatData({ reraRegistrationNumber: e.target.value || null })} className="mt-2" />
          </div>
          <div>
            <Label>Title Status</Label>
            <Select value={flatData.titleStatus} onValueChange={(value) => updateFlatData({ titleStatus: value as NonNullable<FlatApartmentData['titleStatus']> })}>
              <SelectTrigger className="mt-2"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {Object.values(TITLE_STATUS).map((v) => (<SelectItem key={v} value={v}>{v}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-6">
          <Label htmlFor="loanBanks">Loan Approval by Banks (comma-separated)</Label>
          <Textarea id="loanBanks" value={(flatData.loanApprovedBanks || []).join(', ')} onChange={(e) => updateFlatData({ loanApprovedBanks: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} className="mt-2" rows={2} />
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Pricing</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="pricePerSqFt">Price per Sq.Ft</Label>
            <Input id="pricePerSqFt" type="number" value={flatData.pricePerSqFt?.toString() || ''} onChange={(e) => updateFlatData({ pricePerSqFt: e.target.value === '' ? undefined : parseInt(e.target.value) || 0 })} className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
          </div>
          <div>
            <Label htmlFor="maintenanceMonthly">Maintenance Charges (Monthly)</Label>
            <Input id="maintenanceMonthly" type="number" value={flatData.maintenanceMonthly?.toString() || ''} onChange={(e) => updateFlatData({ maintenanceMonthly: e.target.value === '' ? undefined : parseInt(e.target.value) || 0 })} className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
          </div>
          <div className="flex items-center space-x-2 mt-8">
            <Checkbox checked={!!flatData.negotiable} onCheckedChange={(v) => updateFlatData({ negotiable: !!v })} />
            <Label>Negotiable?</Label>
          </div>
        </div>
      </div>

      {/* Media */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Media</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Interior Photos</Label>
            <input type="file" accept="image/*" multiple onChange={async (e) => {
              const files = Array.from(e.target.files || []);
              if (!files.length) return;
              const urls = await Promise.all(files.map(async (file) => {
                const fd = new FormData();
                fd.append('file', file);
                fd.append('folder', 'property-flat/interior');
                const res = await fetch('/api/upload-image', { method: 'POST', body: fd });
                const json = await res.json();
                if (!res.ok || !json?.success || !json?.url) throw new Error(json?.error || 'Upload failed');
                return json.url as string;
              }));
              updateFlatData({ interiorPhotoUrls: [...(flatData.interiorPhotoUrls || []), ...urls] });
              e.currentTarget.value = '';
            }} className="mt-2" />
            {(flatData.interiorPhotoUrls || []).length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {(flatData.interiorPhotoUrls || []).map((u, i) => (
                  <div key={u + i} className="relative">
                    <Image src={u} alt="interior" width={160} height={120} className="w-full h-24 object-cover rounded" />
                    <button type="button" className="absolute top-1 right-1 text-xs bg-zinc-900 text-white px-2 py-0.5 rounded" onClick={() => updateFlatData({ interiorPhotoUrls: (flatData.interiorPhotoUrls || []).filter((_, idx) => idx !== i) })}>Remove</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <Label>Exterior Photos</Label>
            <input type="file" accept="image/*" multiple onChange={async (e) => {
              const files = Array.from(e.target.files || []);
              if (!files.length) return;
              const urls = await Promise.all(files.map(async (file) => {
                const fd = new FormData();
                fd.append('file', file);
                fd.append('folder', 'property-flat/exterior');
                const res = await fetch('/api/upload-image', { method: 'POST', body: fd });
                const json = await res.json();
                if (!res.ok || !json?.success || !json?.url) throw new Error(json?.error || 'Upload failed');
                return json.url as string;
              }));
              updateFlatData({ exteriorPhotoUrls: [...(flatData.exteriorPhotoUrls || []), ...urls] });
              e.currentTarget.value = '';
            }} className="mt-2" />
            {(flatData.exteriorPhotoUrls || []).length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {(flatData.exteriorPhotoUrls || []).map((u, i) => (
                  <div key={u + i} className="relative">
                    <Image src={u} alt="exterior" width={160} height={120} className="w-full h-24 object-cover rounded" />
                    <button type="button" className="absolute top-1 right-1 text-xs bg-zinc-900 text-white px-2 py-0.5 rounded" onClick={() => updateFlatData({ exteriorPhotoUrls: (flatData.exteriorPhotoUrls || []).filter((_, idx) => idx !== i) })}>Remove</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <Label htmlFor="floorPlanUrls">Floor Plan URLs (optional)</Label>
            <Textarea id="floorPlanUrls" value={(flatData.floorPlanUrls || []).join(', ')} onChange={(e) => updateFlatData({ floorPlanUrls: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} className="mt-2" rows={2} />
          </div>
          <div>
            <Label htmlFor="videoTourUrl">Video Tour / Drone Shot URL (optional)</Label>
            <Input id="videoTourUrl" value={flatData.videoTourUrl || ''} onChange={(e) => updateFlatData({ videoTourUrl: e.target.value || null })} className="mt-2" />
          </div>
        </div>
      </div>

      {/* Resale Specific */}
      {flatData.transactionType === 'Resale' && (
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
          <h3 className="text-lg font-semibold text-zinc-900 mb-4">Resale Specific</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label>Number of Previous Owners</Label>
              <Select value={flatData.previousOwners} onValueChange={(value) => updateFlatData({ previousOwners: value as NonNullable<FlatApartmentData['previousOwners']> })}>
                <SelectTrigger className="mt-2"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {['Single','Multiple'].map((v) => (<SelectItem key={v} value={v}>{v}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="originalYear">Year of Original Construction</Label>
              <Input id="originalYear" type="number" value={flatData.originalConstructionYear?.toString() || ''} onChange={(e) => updateFlatData({ originalConstructionYear: e.target.value === '' ? undefined : parseInt(e.target.value) || 0 })} className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
            </div>
            <div>
              <Label htmlFor="purchaseYear">Year of Purchase by Current Owner</Label>
              <Input id="purchaseYear" type="number" value={flatData.purchaseYearCurrentOwner?.toString() || ''} onChange={(e) => updateFlatData({ purchaseYearCurrentOwner: e.target.value === '' ? undefined : parseInt(e.target.value) || 0 })} className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="flex items-center space-x-2"><Checkbox checked={!!flatData.renovationsDone} onCheckedChange={(v) => updateFlatData({ renovationsDone: !!v })} /><Label>Renovations / Modifications Done?</Label></div>
            {flatData.renovationsDone && (
              <div className="md:col-span-2">
                <Label htmlFor="renovationsDesc">Renovations Description</Label>
                <Textarea id="renovationsDesc" value={flatData.renovationsDescription || ''} onChange={(e) => updateFlatData({ renovationsDescription: e.target.value })} className="mt-2" rows={3} />
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div>
              <Label>Occupancy Status</Label>
              <Select value={flatData.occupancyStatus} onValueChange={(value) => updateFlatData({ occupancyStatus: value as NonNullable<FlatApartmentData['occupancyStatus']> })}>
                <SelectTrigger className="mt-2"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {['Owner-occupied','Tenanted','Vacant'].map((v) => (<SelectItem key={v} value={v}>{v}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2"><Checkbox checked={!!flatData.existingLoanOrMortgage} onCheckedChange={(v) => updateFlatData({ existingLoanOrMortgage: !!v })} /><Label>Existing Loan / Mortgage?</Label></div>
            <div>
              <Label htmlFor="societyCharges">Society Transfer Charges</Label>
              <Input id="societyCharges" type="number" value={flatData.societyTransferCharges?.toString() || ''} onChange={(e) => updateFlatData({ societyTransferCharges: e.target.value === '' ? undefined : parseInt(e.target.value) || 0 })} className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="flex items-center space-x-2"><Checkbox checked={!!flatData.pendingMaintenanceDues} onCheckedChange={(v) => updateFlatData({ pendingMaintenanceDues: !!v })} /><Label>Pending Maintenance Dues?</Label></div>
            {flatData.pendingMaintenanceDues && (
              <div>
                <Label htmlFor="pendingMaintenanceAmount">Pending Amount</Label>
                <Input id="pendingMaintenanceAmount" type="number" value={flatData.pendingMaintenanceAmount?.toString() || ''} onChange={(e) => updateFlatData({ pendingMaintenanceAmount: e.target.value === '' ? undefined : parseInt(e.target.value) || 0 })} className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              </div>
            )}
            <div>
              <Label>Utility Connections Active</Label>
              <Textarea id="utilActive" value={(flatData.utilityConnectionsActive || []).join(', ')} onChange={(e) => updateFlatData({ utilityConnectionsActive: e.target.value.split(',').map(s => s.trim()).filter(Boolean) as Array<'Electricity'|'Water'|'Gas'> })} className="mt-2" rows={2} />
            </div>
          </div>
        </div>
      )}
    </BasePropertyForm>
  );
}