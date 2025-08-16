"use client";

import { useState } from 'react';
import BasePropertyForm from './BasePropertyForm';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
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
  FLOORING_TYPES,
  AGE_OF_PROPERTY,
  POWER_BACKUP,
  PARKING_TYPES,
  WATER_SUPPLY,
  TITLE_STATUS,
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
    readinessStatus: 'Ready to Move',
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
    const statusText = villaData.readinessStatus === 'Under Construction'
      ? `Possession by ${(villaData.possessionDateIso && new Date(villaData.possessionDateIso).toLocaleDateString()) || 'TBD'}`
      : villaData.readinessStatus || 'Ready to Move';
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

      {/* Areas & Other Details */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Areas & Other Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="builtUpArea">Built-up Area (Sq.ft)</Label>
            <Input
              id="builtUpArea"
              type="number"
              value={villaData.builtUpAreaSqFt?.toString() || ''}
              onChange={(e) => updateVillaData({ builtUpAreaSqFt: e.target.value === '' ? undefined : parseInt(e.target.value) || 0 })}
              placeholder="e.g., 2800"
              className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div>
            <Label htmlFor="carpetArea">Carpet Area (Sq.ft)</Label>
            <Input
              id="carpetArea"
              type="number"
              value={villaData.carpetAreaSqFt?.toString() || ''}
              onChange={(e) => updateVillaData({ carpetAreaSqFt: e.target.value === '' ? undefined : parseInt(e.target.value) || 0 })}
              placeholder="e.g., 2200"
              className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
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
          <div>
            <Label>Flooring Type</Label>
            <Select value={villaData.flooringType} onValueChange={(value) => updateVillaData({ flooringType: value as NonNullable<VillaIndependentHouseData['flooringType']> })}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select flooring" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(FLOORING_TYPES).map((f) => (
                  <SelectItem key={f} value={f}>{f}</SelectItem>
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
          <div>
            <Label htmlFor="ceilingHeight">Ceiling Height (feet)</Label>
            <Input
              id="ceilingHeight"
              type="number"
              value={villaData.ceilingHeightFeet?.toString() || ''}
              onChange={(e) => updateVillaData({ ceilingHeightFeet: e.target.value === '' ? undefined : parseFloat(e.target.value) || 0 })}
              placeholder="e.g., 10"
              className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <Label htmlFor="bathrooms">No. of Bathrooms</Label>
            <Input id="bathrooms" type="number" value={villaData.bathroomsCount?.toString() || ''} onChange={(e) => updateVillaData({ bathroomsCount: e.target.value === '' ? undefined : parseInt(e.target.value) || 0 })} className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
          </div>
          <div>
            <Label htmlFor="balconies">No. of Balconies</Label>
            <Input id="balconies" type="number" value={villaData.balconiesCount?.toString() || ''} onChange={(e) => updateVillaData({ balconiesCount: e.target.value === '' ? undefined : parseInt(e.target.value) || 0 })} className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
          </div>
        </div>
      </div>

      {/* Plot & Area */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Plot & Area</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="plotSize">Plot Size</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <Input id="plotSize" type="number" value={villaData.plotSizeValue?.toString() || ''} onChange={(e) => updateVillaData({ plotSizeValue: e.target.value === '' ? undefined : parseFloat(e.target.value) || 0 })} className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              <Select value={villaData.plotSizeUnit} onValueChange={(value) => updateVillaData({ plotSizeUnit: value as NonNullable<VillaIndependentHouseData['plotSizeUnit']> })}>
                <SelectTrigger>
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  {['Acres','Sq.Yds','Sq.Ft'].map((u) => (<SelectItem key={u} value={u}>{u}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Amenities</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-2"><Checkbox checked={!!villaData.hasClubhouse} onCheckedChange={(v) => updateVillaData({ hasClubhouse: !!v })} /><Label>Clubhouse</Label></div>
          <div className="flex items-center space-x-2"><Checkbox checked={!!villaData.hasGym} onCheckedChange={(v) => updateVillaData({ hasGym: !!v })} /><Label>Gym</Label></div>
          <div className="flex items-center space-x-2"><Checkbox checked={!!villaData.hasSwimmingPool} onCheckedChange={(v) => updateVillaData({ hasSwimmingPool: !!v })} /><Label>Swimming Pool</Label></div>
          <div className="flex items-center space-x-2"><Checkbox checked={!!villaData.hasChildrenPlayArea} onCheckedChange={(v) => updateVillaData({ hasChildrenPlayArea: !!v })} /><Label>Children’s Play Area</Label></div>
          <div className="flex items-center space-x-2"><Checkbox checked={!!villaData.hasGardenPark} onCheckedChange={(v) => updateVillaData({ hasGardenPark: !!v })} /><Label>Garden / Park</Label></div>
          <div className="flex items-center space-x-2"><Checkbox checked={!!villaData.hasSecurityCctv} onCheckedChange={(v) => updateVillaData({ hasSecurityCctv: !!v })} /><Label>Security / CCTV</Label></div>
          <div className="flex items-center space-x-2"><Checkbox checked={!!villaData.hasLift} onCheckedChange={(v) => updateVillaData({ hasLift: !!v })} /><Label>Lift Availability</Label></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <Label>Power Backup</Label>
            <Select value={villaData.powerBackup} onValueChange={(value) => updateVillaData({ powerBackup: value as NonNullable<VillaIndependentHouseData['powerBackup']> })}>
              <SelectTrigger className="mt-2"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {Object.values(POWER_BACKUP).map((v) => (<SelectItem key={v} value={v}>{v}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Parking Type</Label>
            <Select value={villaData.parkingType} onValueChange={(value) => updateVillaData({ parkingType: value as NonNullable<VillaIndependentHouseData['parkingType']> })}>
              <SelectTrigger className="mt-2"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {Object.values(PARKING_TYPES).map((v) => (<SelectItem key={v} value={v}>{v}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="parkingSlots">Number of Parking Slots</Label>
            <Input id="parkingSlots" type="number" value={villaData.parkingSlots?.toString() || ''} onChange={(e) => updateVillaData({ parkingSlots: e.target.value === '' ? undefined : parseInt(e.target.value) || 0 })} className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <Label>Water Supply</Label>
            <Select value={villaData.waterSupply} onValueChange={(value) => updateVillaData({ waterSupply: value as NonNullable<VillaIndependentHouseData['waterSupply']> })}>
              <SelectTrigger className="mt-2"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {Object.values(WATER_SUPPLY).map((v) => (<SelectItem key={v} value={v}>{v}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="roadWidth">Road Width to Property (feet)</Label>
            <Input id="roadWidth" type="number" value={villaData.roadWidthFeet?.toString() || ''} onChange={(e) => updateVillaData({ roadWidthFeet: e.target.value === '' ? undefined : parseInt(e.target.value) || 0 })} className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
          </div>
        </div>
      </div>

      {/* Legal Documentation */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Legal Documentation</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-2"><Checkbox checked={!!villaData.approvedBuildingPlan} onCheckedChange={(v) => updateVillaData({ approvedBuildingPlan: !!v })} /><Label>Approved Building Plan</Label></div>
          <div>
            <Label htmlFor="rera">RERA Registration Number</Label>
            <Input id="rera" value={villaData.reraRegistrationNumber || ''} onChange={(e) => updateVillaData({ reraRegistrationNumber: e.target.value || null })} className="mt-2" />
          </div>
          <div>
            <Label>Title Status</Label>
            <Select value={villaData.titleStatus} onValueChange={(value) => updateVillaData({ titleStatus: value as NonNullable<VillaIndependentHouseData['titleStatus']> })}>
              <SelectTrigger className="mt-2"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {Object.values(TITLE_STATUS).map((v) => (<SelectItem key={v} value={v}>{v}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-6">
          <Label htmlFor="loanBanks">Loan Approval by Banks (comma-separated)</Label>
          <Textarea id="loanBanks" value={(villaData.loanApprovedBanks || []).join(', ')} onChange={(e) => updateVillaData({ loanApprovedBanks: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} className="mt-2" rows={2} />
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Pricing</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="pricePerSqFt">Price per Sq.Ft</Label>
            <Input id="pricePerSqFt" type="number" value={villaData.pricePerSqFt?.toString() || ''} onChange={(e) => updateVillaData({ pricePerSqFt: e.target.value === '' ? undefined : parseInt(e.target.value) || 0 })} className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
          </div>
          <div>
            <Label htmlFor="maintenanceMonthly">Maintenance Charges (Monthly)</Label>
            <Input id="maintenanceMonthly" type="number" value={villaData.maintenanceMonthly?.toString() || ''} onChange={(e) => updateVillaData({ maintenanceMonthly: e.target.value === '' ? undefined : parseInt(e.target.value) || 0 })} className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
          </div>
          <div className="flex items-center space-x-2 mt-8">
            <Checkbox checked={!!villaData.negotiable} onCheckedChange={(v) => updateVillaData({ negotiable: !!v })} />
            <Label>Negotiable?</Label>
          </div>
        </div>
      </div>

      {/* Media */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Additional Media</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="interiorUrls">Interior Photo URLs (comma-separated)</Label>
            <Textarea id="interiorUrls" value={(villaData.interiorPhotoUrls || []).join(', ')} onChange={(e) => updateVillaData({ interiorPhotoUrls: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} className="mt-2" rows={2} />
          </div>
          <div>
            <Label htmlFor="exteriorUrls">Exterior Photo URLs (comma-separated)</Label>
            <Textarea id="exteriorUrls" value={(villaData.exteriorPhotoUrls || []).join(', ')} onChange={(e) => updateVillaData({ exteriorPhotoUrls: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} className="mt-2" rows={2} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <Label htmlFor="floorPlanUrls">Floor Plan URLs (JPG/PNG links, comma-separated)</Label>
            <Textarea id="floorPlanUrls" value={(villaData.floorPlanUrls || []).join(', ')} onChange={(e) => updateVillaData({ floorPlanUrls: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} className="mt-2" rows={2} />
          </div>
          <div>
            <Label htmlFor="videoTourUrl">Video Tour / Drone Shot URL</Label>
            <Input id="videoTourUrl" value={villaData.videoTourUrl || ''} onChange={(e) => updateVillaData({ videoTourUrl: e.target.value || null })} className="mt-2" />
          </div>
        </div>
      </div>

      {/* Resale Specific */}
      {villaData.transactionType === 'Resale' && (
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
          <h3 className="text-lg font-semibold text-zinc-900 mb-4">Resale Specific</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label>Number of Previous Owners</Label>
              <Select value={villaData.previousOwners} onValueChange={(value) => updateVillaData({ previousOwners: value as NonNullable<VillaIndependentHouseData['previousOwners']> })}>
                <SelectTrigger className="mt-2"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {['Single','Multiple'].map((v) => (<SelectItem key={v} value={v}>{v}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="originalYear">Year of Original Construction</Label>
              <Input id="originalYear" type="number" value={villaData.originalConstructionYear?.toString() || ''} onChange={(e) => updateVillaData({ originalConstructionYear: e.target.value === '' ? undefined : parseInt(e.target.value) || 0 })} className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
            </div>
            <div>
              <Label htmlFor="purchaseYear">Year of Purchase by Current Owner</Label>
              <Input id="purchaseYear" type="number" value={villaData.purchaseYearCurrentOwner?.toString() || ''} onChange={(e) => updateVillaData({ purchaseYearCurrentOwner: e.target.value === '' ? undefined : parseInt(e.target.value) || 0 })} className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="flex items-center space-x-2"><Checkbox checked={!!villaData.renovationsDone} onCheckedChange={(v) => updateVillaData({ renovationsDone: !!v })} /><Label>Renovations / Modifications Done?</Label></div>
            {villaData.renovationsDone && (
              <div className="md:col-span-2">
                <Label htmlFor="renovationsDesc">Renovations Description</Label>
                <Textarea id="renovationsDesc" value={villaData.renovationsDescription || ''} onChange={(e) => updateVillaData({ renovationsDescription: e.target.value })} className="mt-2" rows={3} />
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div>
              <Label>Occupancy Status</Label>
              <Select value={villaData.occupancyStatus} onValueChange={(value) => updateVillaData({ occupancyStatus: value as NonNullable<VillaIndependentHouseData['occupancyStatus']> })}>
                <SelectTrigger className="mt-2"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {['Owner-occupied','Tenanted','Vacant'].map((v) => (<SelectItem key={v} value={v}>{v}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2"><Checkbox checked={!!villaData.existingLoanOrMortgage} onCheckedChange={(v) => updateVillaData({ existingLoanOrMortgage: !!v })} /><Label>Existing Loan / Mortgage?</Label></div>
            <div>
              <Label htmlFor="societyCharges">Society Transfer Charges</Label>
              <Input id="societyCharges" type="number" value={villaData.societyTransferCharges?.toString() || ''} onChange={(e) => updateVillaData({ societyTransferCharges: e.target.value === '' ? undefined : parseInt(e.target.value) || 0 })} className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="flex items-center space-x-2"><Checkbox checked={!!villaData.pendingMaintenanceDues} onCheckedChange={(v) => updateVillaData({ pendingMaintenanceDues: !!v })} /><Label>Pending Maintenance Dues?</Label></div>
            {villaData.pendingMaintenanceDues && (
              <div>
                <Label htmlFor="pendingMaintenanceAmount">Pending Amount</Label>
                <Input id="pendingMaintenanceAmount" type="number" value={villaData.pendingMaintenanceAmount?.toString() || ''} onChange={(e) => updateVillaData({ pendingMaintenanceAmount: e.target.value === '' ? undefined : parseInt(e.target.value) || 0 })} className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              </div>
            )}
            <div>
              <Label>Utility Connections Active</Label>
              <Textarea id="utilActive" value={(villaData.utilityConnectionsActive || []).join(', ')} onChange={(e) => updateVillaData({ utilityConnectionsActive: e.target.value.split(',').map(s => s.trim()).filter(Boolean) as Array<'Electricity'|'Water'|'Gas'> })} className="mt-2" rows={2} />
            </div>
          </div>
        </div>
      )}
    </BasePropertyForm>
  );
}