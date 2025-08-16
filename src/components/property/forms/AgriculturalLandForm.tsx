"use client";

import { useState } from 'react';
import BasePropertyForm from './BasePropertyForm';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { type ListingType, type PropertyType, type BasePropertyFormData, type AgriculturalLandData, FACING_DIRECTIONS, AGRICULTURAL_PURPOSES } from '@/types/property';
import { HelpCircle } from 'lucide-react';

interface AgriculturalLandFormProps {
  listingType: ListingType;
  propertyType: PropertyType;
  onSubmit: (data: BasePropertyFormData) => void;
  onCancel: () => void;
}

export default function AgriculturalLandForm({ 
  listingType, 
  propertyType, 
  onSubmit, 
  onCancel 
}: AgriculturalLandFormProps) {
  const [agriculturalData, setAgriculturalData] = useState<AgriculturalLandData>({
    village: '',
    city: '',
    district: '',
    extentAcres: 0,
    extentGuntas: 0,
    facing: 'East',
    roadWidth: 0,
    boundaryWall: false,
    openSides: 0,
    purpose: 'Farming'
  });
  const [newDroneUrl, setNewDroneUrl] = useState('');

  const handleSubmit = (baseData: BasePropertyFormData) => {
    const completeData: BasePropertyFormData = {
      ...baseData,
      agriculturalLandData: agriculturalData
    };
    onSubmit(completeData);
  };

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
        `Prime Agricultural Land for ${listingType} - Fertile Farming Opportunity`,
        `Excellent Agricultural Land - Ready for Cultivation`,
        `Premium Farmland for ${listingType} - High Yield Potential`,
        `Fertile Agricultural Land - Perfect for Farming Operations`
      ],
      'Real Estate Development': [
        `Strategic Agricultural Land for ${listingType} - Development Potential`,
        `Prime Land for Development - Excellent Growth Prospects`,
        `Agricultural Land with Development Opportunity`,
        `Premium Land for Real Estate Development`
      ],
      'Mixed Use': [
        `Versatile Agricultural Land for ${listingType} - Multi-Purpose`,
        `Agricultural Land with Development Potential`,
        `Prime Land - Farming & Future Development Opportunity`,
        `Strategic Agricultural Investment - Dual Purpose Land`
      ]
    };
    
    const templates = titleTemplates[agriculturalData.purpose];
    return templates[Math.floor(Math.random() * templates.length)];
  };

  const updateAgriculturalData = (updates: Partial<AgriculturalLandData>) => {
    setAgriculturalData(prev => ({ ...prev, ...updates }));
  };

  const Tooltip = ({ text }: { text: string }) => (
    <div className="group relative inline-block ml-1">
      <HelpCircle className="h-4 w-4 text-zinc-400 cursor-help" />
      <div className="invisible group-hover:visible absolute left-0 top-5 z-10 w-64 p-2 text-xs bg-zinc-900 text-white rounded shadow-lg">
        {text}
      </div>
    </div>
  );





  return (
    <BasePropertyForm
      listingType={listingType}
      propertyType={propertyType}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      customTitleGenerator={generatePurposeAwareTitle}
      customDescriptionGenerator={generatePurposeAwareDescription}
    >
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
        {/* Total Area (Acres/Hectares) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-2">
            <Label htmlFor="totalAreaValue" className="flex items-center">
              Total Area
            </Label>
            <Input
              id="totalAreaValue"
              type="number"
              min="0"
              step="0.01"
              value={agriculturalData.totalAreaValue === undefined || agriculturalData.totalAreaValue === 0 ? '' : agriculturalData.totalAreaValue}
              onChange={(e) => updateAgriculturalData({ totalAreaValue: e.target.value === '' ? undefined : parseFloat(e.target.value) || 0 })}
              placeholder="e.g., 3.5"
              className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div>
            <Label className="flex items-center">Unit</Label>
            <Select value={(agriculturalData.totalAreaUnit as string) || ''} onValueChange={(value) => updateAgriculturalData({ totalAreaUnit: value as 'Acres' | 'Hectares' })}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Acres">Acres</SelectItem>
                <SelectItem value="Hectares">Hectares</SelectItem>
              </SelectContent>
            </Select>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <Label className="flex items-center">Road Access</Label>
            <RadioGroup 
              value={(agriculturalData.hasRoadAccess ?? false).toString()} 
              onValueChange={(value) => updateAgriculturalData({ hasRoadAccess: value === 'true' })}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="roadaccess-yes" />
                <Label htmlFor="roadaccess-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="roadaccess-no" />
                <Label htmlFor="roadaccess-no">No</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label htmlFor="distanceMarket" className="flex items-center">Distance to Market/Town (km)</Label>
            <Input
              id="distanceMarket"
              type="number"
              min="0"
              step="0.1"
              value={agriculturalData.distanceToMarketKm === undefined || agriculturalData.distanceToMarketKm === 0 ? '' : agriculturalData.distanceToMarketKm}
              onChange={(e) => updateAgriculturalData({ distanceToMarketKm: e.target.value === '' ? undefined : parseFloat(e.target.value) || 0 })}
              placeholder="e.g., 5"
              className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div>
            <Label className="flex items-center">Zoning Type (Hyderabad)</Label>
            <Select value={(agriculturalData.zoningType as string) || ''} onValueChange={(value) => updateAgriculturalData({ zoningType: value as AgriculturalLandData['zoningType'] })}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select zoning" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="R1">R1</SelectItem>
                <SelectItem value="R2">R2</SelectItem>
                <SelectItem value="R3">R3</SelectItem>
                <SelectItem value="R4">R4</SelectItem>
                <SelectItem value="Commercial">Commercial</SelectItem>
                <SelectItem value="Peri-Urban Zone">Peri Urban Zone</SelectItem>
                <SelectItem value="Conservation">Conservation</SelectItem>
                <SelectItem value="Industrial">Industrial</SelectItem>
                <SelectItem value="Mixed Use Zone">Mixed Use Zone</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Agricultural Details */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Agricultural Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="surveyNumbers" className="flex items-center">Survey Number(s)</Label>
            <Input
              id="surveyNumbers"
              value={agriculturalData.surveyNumbers || ''}
              onChange={(e) => updateAgriculturalData({ surveyNumbers: e.target.value })}
              placeholder="e.g., 123/AA, 124/B"
              className="mt-2"
            />
          </div>
          <div>
            <Label className="flex items-center">Soil Type</Label>
            <Select value={(agriculturalData.soilType as string) || ''} onValueChange={(value) => updateAgriculturalData({ soilType: value as 'Red' | 'Black' | 'Sandy' | 'Mixed' })}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select soil type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Red">Red</SelectItem>
                <SelectItem value="Black">Black</SelectItem>
                <SelectItem value="Sandy">Sandy</SelectItem>
                <SelectItem value="Mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="flex items-center">Irrigation Source</Label>
            <Select value={(agriculturalData.irrigationSource as string) || ''} onValueChange={(value) => updateAgriculturalData({ irrigationSource: value as 'Borewell' | 'Canal' | 'Rainfed' })}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select irrigation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Borewell">Borewell</SelectItem>
                <SelectItem value="Canal">Canal</SelectItem>
                <SelectItem value="Rainfed">Rainfed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <Label className="flex items-center">Borewells Present</Label>
            <RadioGroup 
              value={(!!(agriculturalData.borewellsCount && agriculturalData.borewellsCount > 0)).toString()} 
              onValueChange={(value) => updateAgriculturalData({ borewellsCount: value === 'true' ? (agriculturalData.borewellsCount && agriculturalData.borewellsCount > 0 ? agriculturalData.borewellsCount : 1) : 0 })}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="borewell-yes" />
                <Label htmlFor="borewell-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="borewell-no" />
                <Label htmlFor="borewell-no">No</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label htmlFor="borewellsCount" className="flex items-center">Quantity</Label>
            <Input
              id="borewellsCount"
              type="number"
              min="0"
              step="1"
              value={agriculturalData.borewellsCount === undefined ? '' : agriculturalData.borewellsCount}
              onChange={(e) => updateAgriculturalData({ borewellsCount: e.target.value === '' ? undefined : Math.max(0, parseInt(e.target.value) || 0) })}
              placeholder="e.g., 2"
              className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div>
            <Label htmlFor="cropsGrown" className="flex items-center">Crops Grown (if applicable)</Label>
            <Input
              id="cropsGrown"
              value={agriculturalData.cropsGrown || ''}
              onChange={(e) => updateAgriculturalData({ cropsGrown: e.target.value })}
              placeholder="e.g., Cotton, Maize"
              className="mt-2"
            />
          </div>
        </div>
      </div>

      {/* Documentation */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Documentation</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label className="flex items-center">Sale Deed Available</Label>
            <RadioGroup 
              value={(agriculturalData.saleDeedAvailable ?? false).toString()} 
              onValueChange={(value) => updateAgriculturalData({ saleDeedAvailable: value === 'true' })}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="sd-yes" />
                <Label htmlFor="sd-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="sd-no" />
                <Label htmlFor="sd-no">No</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label className="flex items-center">Pattadar Passbook</Label>
            <RadioGroup 
              value={(agriculturalData.pattadarPassbookAvailable ?? false).toString()} 
              onValueChange={(value) => updateAgriculturalData({ pattadarPassbookAvailable: value === 'true' })}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="pp-yes" />
                <Label htmlFor="pp-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="pp-no" />
                <Label htmlFor="pp-no">No</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label className="flex items-center">EC (Encumbrance Certificate)</Label>
            <RadioGroup 
              value={(agriculturalData.encumbranceCertificateAvailable ?? false).toString()} 
              onValueChange={(value) => updateAgriculturalData({ encumbranceCertificateAvailable: value === 'true' })}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="ec-yes" />
                <Label htmlFor="ec-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="ec-no" />
                <Label htmlFor="ec-no">No</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <Label className="flex items-center">Pahani/Adangal</Label>
            <RadioGroup 
              value={(agriculturalData.pahaniAdangalAvailable ?? false).toString()} 
              onValueChange={(value) => updateAgriculturalData({ pahaniAdangalAvailable: value === 'true' })}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="pa-yes" />
                <Label htmlFor="pa-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="pa-no" />
                <Label htmlFor="pa-no">No</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label className="flex items-center">Survey Map / FMB</Label>
            <RadioGroup 
              value={(agriculturalData.surveyMapAvailable ?? false).toString()} 
              onValueChange={(value) => updateAgriculturalData({ surveyMapAvailable: value === 'true' })}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="sm-yes" />
                <Label htmlFor="sm-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="sm-no" />
                <Label htmlFor="sm-no">No</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Pricing</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="pricePerAcre" className="flex items-center">Price per Acre</Label>
            <div className="relative mt-2">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 text-sm">₹</span>
              <Input
                id="pricePerAcre"
                type="number"
                min="0"
                step="1"
                value={agriculturalData.pricePerAcre === undefined || agriculturalData.pricePerAcre === 0 ? '' : agriculturalData.pricePerAcre}
                onChange={(e) => updateAgriculturalData({ pricePerAcre: e.target.value === '' ? undefined : parseInt(e.target.value) || 0 })}
                placeholder="e.g., 1200000"
                className="pl-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>
          <div>
            <Label className="flex items-center">Negotiable</Label>
            <RadioGroup 
              value={(agriculturalData.negotiable ?? false).toString()} 
              onValueChange={(value) => updateAgriculturalData({ negotiable: value === 'true' })}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="neg-yes" />
                <Label htmlFor="neg-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="neg-no" />
                <Label htmlFor="neg-no">No</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      {/* Additional Media */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Additional Media</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Label htmlFor="droneUrl" className="flex items-center">Drone Shot URL</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="droneUrl"
                value={newDroneUrl}
                onChange={(e) => setNewDroneUrl(e.target.value)}
                placeholder="Paste a drone shot image URL and click Add"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const url = newDroneUrl.trim();
                  if (!url) return;
                  const existing = agriculturalData.droneShotUrls || [];
                  updateAgriculturalData({ droneShotUrls: [...existing, url] });
                  setNewDroneUrl('');
                }}
              >
                Add
              </Button>
            </div>
            {(agriculturalData.droneShotUrls || []).length > 0 && (
              <div className="mt-3 space-y-2">
                {(agriculturalData.droneShotUrls || []).map((u, idx) => (
                  <div key={idx} className="flex items-center justify-between border border-zinc-200 rounded-md px-3 py-2 text-sm">
                    <span className="truncate mr-3">{u}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        const next = (agriculturalData.droneShotUrls || []).filter((_, i) => i !== idx);
                        updateAgriculturalData({ droneShotUrls: next });
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <Label htmlFor="locationMapUrl" className="flex items-center">Location Map URL</Label>
            <Input
              id="locationMapUrl"
              value={agriculturalData.locationMapUrl || ''}
              onChange={(e) => updateAgriculturalData({ locationMapUrl: e.target.value })}
              placeholder="Paste a map image URL"
              className="mt-2"
            />
          </div>
        </div>
      </div>
    </BasePropertyForm>
  );
}