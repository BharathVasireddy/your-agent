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
import { Checkbox } from '@/components/ui/checkbox';
import { Sparkles, Upload, X, HelpCircle } from 'lucide-react';
import { type BasePropertyFormData, type ListingType, type PropertyType, type AgriculturalLandData, type PlotData, type FlatApartmentData, type ITCommercialSpaceData, type VillaIndependentHouseData, type FarmHouseData, FACING_DIRECTIONS, AGRICULTURAL_PURPOSES, PLOT_APPROVALS, BHK_OPTIONS, COMMUNITY_STATUS, TRANSACTION_TYPES, FLAT_CONSTRUCTION_STATUS, FURNISHING_STATUS, FLOORING_TYPES, AGE_OF_PROPERTY, POWER_BACKUP, PARKING_TYPES, WATER_SUPPLY, TITLE_STATUS } from '@/types/property';
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
    agriculturalLandData: property.propertyType === 'Agricultural Land' ? (property.propertyData as unknown as AgriculturalLandData) : undefined,
    plotData: property.propertyType === 'Plot' ? (property.propertyData as unknown as PlotData) : undefined,
    villaIndependentHouseData: property.propertyType === 'Villa/Independent House' ? (property.propertyData as unknown as VillaIndependentHouseData) : undefined
  });

  // Initialize agricultural land data if it exists
  const propertyDataObj = property.propertyType === 'Agricultural Land'
    ? (property.propertyData as unknown as AgriculturalLandData | null)
    : null;
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
    purpose: propertyDataObj?.purpose || 'Farming',
    totalAreaValue: propertyDataObj?.totalAreaValue,
    totalAreaUnit: propertyDataObj?.totalAreaUnit,
    surveyNumbers: propertyDataObj?.surveyNumbers,
    soilType: propertyDataObj?.soilType,
    irrigationSource: propertyDataObj?.irrigationSource,
    borewellsCount: propertyDataObj?.borewellsCount,
    cropsGrown: propertyDataObj?.cropsGrown,
    hasRoadAccess: propertyDataObj?.hasRoadAccess,
    distanceToMarketKm: propertyDataObj?.distanceToMarketKm,
    zoningType: propertyDataObj?.zoningType,
    saleDeedAvailable: propertyDataObj?.saleDeedAvailable,
    pattadarPassbookAvailable: propertyDataObj?.pattadarPassbookAvailable,
    encumbranceCertificateAvailable: propertyDataObj?.encumbranceCertificateAvailable,
    pahaniAdangalAvailable: propertyDataObj?.pahaniAdangalAvailable,
    surveyMapAvailable: propertyDataObj?.surveyMapAvailable,
    pricePerAcre: propertyDataObj?.pricePerAcre,
    negotiable: propertyDataObj?.negotiable,
    droneShotUrls: propertyDataObj?.droneShotUrls,
    locationMapUrl: propertyDataObj?.locationMapUrl
  });

  // Initialize plot data if property is Plot
  const propertyPlotDataObj = property.propertyType === 'Plot'
    ? (property.propertyData as unknown as PlotData | null)
    : null;
  const [plotData, setPlotData] = useState<PlotData>({
    village: propertyPlotDataObj?.village || '',
    mandal: propertyPlotDataObj?.mandal || '',
    city: propertyPlotDataObj?.city || '',
    district: propertyPlotDataObj?.district || '',
    extentSqYds: propertyPlotDataObj?.extentSqYds || 0, // legacy fallback if present
    sizeValue: propertyPlotDataObj?.sizeValue || (propertyPlotDataObj?.extentSqYds || 0),
    sizeUnit: propertyPlotDataObj?.sizeUnit || (typeof propertyPlotDataObj?.extentSqYds === 'number' ? 'Sq.Yds' : 'Sq.Yds'),
    length: propertyPlotDataObj?.length,
    breadth: propertyPlotDataObj?.breadth,
    dimensionUnit: propertyPlotDataObj?.dimensionUnit || 'feet',
    shape: propertyPlotDataObj?.shape || 'Rectangular',
    facing: propertyPlotDataObj?.facing || 'East',
    roadWidth: propertyPlotDataObj?.roadWidth || 0,
    roadUnit: propertyPlotDataObj?.roadUnit || 'feet',
    openSides: propertyPlotDataObj?.openSides || 0,
    cornerPlot: propertyPlotDataObj?.cornerPlot || false,
    plotNumber: propertyPlotDataObj?.plotNumber || '',
    approval: propertyPlotDataObj?.approval || 'HMDA',
    approvalRef: propertyPlotDataObj?.approvalRef || '',
    zoningType: propertyPlotDataObj?.zoningType || 'R1',
    layoutName: propertyPlotDataObj?.layoutName || '',
    encumbranceCertificate: propertyPlotDataObj?.encumbranceCertificate || 'Pending',
    linkDocuments: propertyPlotDataObj?.linkDocuments || false,
    saleDeedOrGpa: propertyPlotDataObj?.saleDeedOrGpa || false,
    nocAvailable: propertyPlotDataObj?.nocAvailable || false,
    pricePerUnit: propertyPlotDataObj?.pricePerUnit,
    pricePerUnitUnit: propertyPlotDataObj?.pricePerUnitUnit,
    negotiable: propertyPlotDataObj?.negotiable || false,
    bookingAmount: propertyPlotDataObj?.bookingAmount,
    paymentModes: propertyPlotDataObj?.paymentModes || [],
    loanApprovedBanks: propertyPlotDataObj?.loanApprovedBanks || [],
    layoutPlanUrls: propertyPlotDataObj?.layoutPlanUrls || [],
    locationMapUrl: propertyPlotDataObj?.locationMapUrl || null,
  });

  // Initialize villa data if property is Villa/Independent House
  const propertyVillaDataObj = property.propertyType === 'Villa/Independent House'
    ? (property.propertyData as unknown as VillaIndependentHouseData | null)
    : null;
  const [villaData, setVillaData] = useState<VillaIndependentHouseData>({
    city: propertyVillaDataObj?.city || '',
    projectName: propertyVillaDataObj?.projectName || '',
    projectArea: propertyVillaDataObj?.projectArea || '',
    numUnits: propertyVillaDataObj?.numUnits || 0,
    villaAreaSqFt: propertyVillaDataObj?.villaAreaSqFt || 0,
    bhk: propertyVillaDataObj?.bhk || '2BHK',
    communityStatus: propertyVillaDataObj?.communityStatus || 'Standalone',
    constructionStatus: propertyVillaDataObj?.constructionStatus || 'Ready to move',
    handoverInMonths: propertyVillaDataObj?.handoverInMonths,
    numFloors: propertyVillaDataObj?.numFloors || 0,
    parkingCount: propertyVillaDataObj?.parkingCount || 0,
    transactionType: propertyVillaDataObj?.transactionType || 'Resale',
    facing: propertyVillaDataObj?.facing || 'East',
    furnishingStatus: propertyVillaDataObj?.furnishingStatus || 'Unfurnished',
    readinessStatus: (propertyVillaDataObj as any)?.readinessStatus || 'Ready to Move',
    possessionDateIso: (propertyVillaDataObj as any)?.possessionDateIso || '',
    ageOfProperty: (propertyVillaDataObj as any)?.ageOfProperty,
    builtUpAreaSqFt: (propertyVillaDataObj as any)?.builtUpAreaSqFt,
    carpetAreaSqFt: (propertyVillaDataObj as any)?.carpetAreaSqFt,
    bathroomsCount: (propertyVillaDataObj as any)?.bathroomsCount,
    balconiesCount: (propertyVillaDataObj as any)?.balconiesCount,
    flooringType: (propertyVillaDataObj as any)?.flooringType,
    ceilingHeightFeet: (propertyVillaDataObj as any)?.ceilingHeightFeet,
    plotSizeValue: (propertyVillaDataObj as any)?.plotSizeValue,
    plotSizeUnit: (propertyVillaDataObj as any)?.plotSizeUnit,
    hasClubhouse: (propertyVillaDataObj as any)?.hasClubhouse,
    hasGym: (propertyVillaDataObj as any)?.hasGym,
    hasSwimmingPool: (propertyVillaDataObj as any)?.hasSwimmingPool,
    hasChildrenPlayArea: (propertyVillaDataObj as any)?.hasChildrenPlayArea,
    hasGardenPark: (propertyVillaDataObj as any)?.hasGardenPark,
    hasSecurityCctv: (propertyVillaDataObj as any)?.hasSecurityCctv,
    hasLift: (propertyVillaDataObj as any)?.hasLift,
    powerBackup: (propertyVillaDataObj as any)?.powerBackup,
    parkingType: (propertyVillaDataObj as any)?.parkingType,
    parkingSlots: (propertyVillaDataObj as any)?.parkingSlots,
    waterSupply: (propertyVillaDataObj as any)?.waterSupply,
    roadWidthFeet: (propertyVillaDataObj as any)?.roadWidthFeet,
    approvedBuildingPlan: (propertyVillaDataObj as any)?.approvedBuildingPlan,
    reraRegistrationNumber: (propertyVillaDataObj as any)?.reraRegistrationNumber,
    titleStatus: (propertyVillaDataObj as any)?.titleStatus,
    loanApprovedBanks: (propertyVillaDataObj as any)?.loanApprovedBanks || [],
    pricePerSqFt: (propertyVillaDataObj as any)?.pricePerSqFt,
    maintenanceMonthly: (propertyVillaDataObj as any)?.maintenanceMonthly,
    negotiable: (propertyVillaDataObj as any)?.negotiable,
    interiorPhotoUrls: (propertyVillaDataObj as any)?.interiorPhotoUrls || [],
    exteriorPhotoUrls: (propertyVillaDataObj as any)?.exteriorPhotoUrls || [],
    floorPlanUrls: (propertyVillaDataObj as any)?.floorPlanUrls || [],
    videoTourUrl: (propertyVillaDataObj as any)?.videoTourUrl || null,
    previousOwners: (propertyVillaDataObj as any)?.previousOwners,
    originalConstructionYear: (propertyVillaDataObj as any)?.originalConstructionYear,
    purchaseYearCurrentOwner: (propertyVillaDataObj as any)?.purchaseYearCurrentOwner,
    renovationsDone: (propertyVillaDataObj as any)?.renovationsDone,
    renovationsDescription: (propertyVillaDataObj as any)?.renovationsDescription,
    occupancyStatus: (propertyVillaDataObj as any)?.occupancyStatus,
    existingLoanOrMortgage: (propertyVillaDataObj as any)?.existingLoanOrMortgage,
    societyTransferCharges: (propertyVillaDataObj as any)?.societyTransferCharges,
    pendingMaintenanceDues: (propertyVillaDataObj as any)?.pendingMaintenanceDues,
    pendingMaintenanceAmount: (propertyVillaDataObj as any)?.pendingMaintenanceAmount,
    utilityConnectionsActive: (propertyVillaDataObj as any)?.utilityConnectionsActive || [],
  });

  // Initialize flat/apartment data if property is Flat/Apartment
  const propertyFlatDataObj = property.propertyType === 'Flat/Apartment'
    ? (property.propertyData as unknown as FlatApartmentData | null)
    : null;
  const [flatData, setFlatData] = useState<FlatApartmentData>({
    city: propertyFlatDataObj?.city || '',
    projectName: propertyFlatDataObj?.projectName || '',
    projectArea: propertyFlatDataObj?.projectArea || '',
    numUnits: propertyFlatDataObj?.numUnits || 0,
    flatAreaSqFt: propertyFlatDataObj?.flatAreaSqFt || 0,
    bhk: propertyFlatDataObj?.bhk || '2BHK',
    communityStatus: propertyFlatDataObj?.communityStatus || 'Standalone',
    constructionStatus: propertyFlatDataObj?.constructionStatus || 'Ready to move',
    handoverInMonths: propertyFlatDataObj?.handoverInMonths,
    floor: propertyFlatDataObj?.floor || 0,
    parkingCount: propertyFlatDataObj?.parkingCount || 0,
    transactionType: propertyFlatDataObj?.transactionType || 'Resale',
    facing: propertyFlatDataObj?.facing || 'East',
    readinessStatus: (propertyFlatDataObj as any)?.readinessStatus || (propertyFlatDataObj?.constructionStatus ? (propertyFlatDataObj?.handoverInMonths ? 'Under Construction' : 'Ready to Move') : 'Ready to Move'),
    possessionDateIso: (propertyFlatDataObj as any)?.possessionDateIso || '',
    ageOfProperty: (propertyFlatDataObj as any)?.ageOfProperty,
    builtUpAreaSqFt: (propertyFlatDataObj as any)?.builtUpAreaSqFt,
    carpetAreaSqFt: (propertyFlatDataObj as any)?.carpetAreaSqFt,
    totalFloors: (propertyFlatDataObj as any)?.totalFloors,
    bathroomsCount: (propertyFlatDataObj as any)?.bathroomsCount,
    balconiesCount: (propertyFlatDataObj as any)?.balconiesCount,
    furnishingStatus: (propertyFlatDataObj as any)?.furnishingStatus,
    flooringType: (propertyFlatDataObj as any)?.flooringType,
    ceilingHeightFeet: (propertyFlatDataObj as any)?.ceilingHeightFeet,
    propertyAreaValue: (propertyFlatDataObj as any)?.propertyAreaValue,
    propertyAreaUnit: (propertyFlatDataObj as any)?.propertyAreaUnit,
    hasClubhouse: (propertyFlatDataObj as any)?.hasClubhouse,
    hasGym: (propertyFlatDataObj as any)?.hasGym,
    hasSwimmingPool: (propertyFlatDataObj as any)?.hasSwimmingPool,
    hasChildrenPlayArea: (propertyFlatDataObj as any)?.hasChildrenPlayArea,
    hasGardenPark: (propertyFlatDataObj as any)?.hasGardenPark,
    hasSecurityCctv: (propertyFlatDataObj as any)?.hasSecurityCctv,
    hasLift: (propertyFlatDataObj as any)?.hasLift,
    powerBackup: (propertyFlatDataObj as any)?.powerBackup,
    parkingType: (propertyFlatDataObj as any)?.parkingType,
    parkingSlots: (propertyFlatDataObj as any)?.parkingSlots,
    waterSupply: (propertyFlatDataObj as any)?.waterSupply,
    roadWidthFeet: (propertyFlatDataObj as any)?.roadWidthFeet,
    approvedBuildingPlan: (propertyFlatDataObj as any)?.approvedBuildingPlan,
    reraRegistrationNumber: (propertyFlatDataObj as any)?.reraRegistrationNumber,
    titleStatus: (propertyFlatDataObj as any)?.titleStatus,
    loanApprovedBanks: (propertyFlatDataObj as any)?.loanApprovedBanks || [],
    pricePerSqFt: (propertyFlatDataObj as any)?.pricePerSqFt,
    maintenanceMonthly: (propertyFlatDataObj as any)?.maintenanceMonthly,
    negotiable: (propertyFlatDataObj as any)?.negotiable,
    interiorPhotoUrls: (propertyFlatDataObj as any)?.interiorPhotoUrls || [],
    exteriorPhotoUrls: (propertyFlatDataObj as any)?.exteriorPhotoUrls || [],
    floorPlanUrls: (propertyFlatDataObj as any)?.floorPlanUrls || [],
    videoTourUrl: (propertyFlatDataObj as any)?.videoTourUrl || null,
    previousOwners: (propertyFlatDataObj as any)?.previousOwners,
    originalConstructionYear: (propertyFlatDataObj as any)?.originalConstructionYear,
    purchaseYearCurrentOwner: (propertyFlatDataObj as any)?.purchaseYearCurrentOwner,
    renovationsDone: (propertyFlatDataObj as any)?.renovationsDone,
    renovationsDescription: (propertyFlatDataObj as any)?.renovationsDescription,
    occupancyStatus: (propertyFlatDataObj as any)?.occupancyStatus,
    existingLoanOrMortgage: (propertyFlatDataObj as any)?.existingLoanOrMortgage,
    societyTransferCharges: (propertyFlatDataObj as any)?.societyTransferCharges,
    pendingMaintenanceDues: (propertyFlatDataObj as any)?.pendingMaintenanceDues,
    pendingMaintenanceAmount: (propertyFlatDataObj as any)?.pendingMaintenanceAmount,
    utilityConnectionsActive: (propertyFlatDataObj as any)?.utilityConnectionsActive || [],
  });

  // Initialize IT Commercial Space data if property type matches
  const propertyItDataObj = property.propertyType === 'IT Commercial Space'
    ? (property.propertyData as unknown as ITCommercialSpaceData | null)
    : null;
  const [itData, setItData] = useState<ITCommercialSpaceData>({
    city: propertyItDataObj?.city || '',
    projectName: propertyItDataObj?.projectName || '',
    projectAreaSqFt: propertyItDataObj?.projectAreaSqFt || 0,
    numUnits: propertyItDataObj?.numUnits || 0,
    perUnitAreaSqFt: propertyItDataObj?.perUnitAreaSqFt || 0,
    constructionStatus: propertyItDataObj?.constructionStatus || 'Ready to move',
    handoverInMonths: propertyItDataObj?.handoverInMonths,
    floorInfo: propertyItDataObj?.floorInfo || '',
    facing: propertyItDataObj?.facing || 'East',
    carParkingCount: propertyItDataObj?.carParkingCount || 0,
    bikeParkingCount: propertyItDataObj?.bikeParkingCount || 0,
    transactionType: propertyItDataObj?.transactionType || 'Resale',
    furnishingStatus: propertyItDataObj?.furnishingStatus || 'Unfurnished',
    airConditioned: propertyItDataObj?.airConditioned || false
  });
  
  // Initialize Farm House data if property type matches
  const propertyFarmDataObj = property.propertyType === 'Farm House'
    ? (property.propertyData as unknown as FarmHouseData | null)
    : null;
  const [farmData, setFarmData] = useState<FarmHouseData>({
    city: propertyFarmDataObj?.city || '',
    overallAreaSqFt: propertyFarmDataObj?.overallAreaSqFt || 0,
    builtUpAreaSqFt: propertyFarmDataObj?.builtUpAreaSqFt || 0,
    numFloors: propertyFarmDataObj?.numFloors || 0,
    bhk: propertyFarmDataObj?.bhk || '2BHK',
    swimmingPool: propertyFarmDataObj?.swimmingPool || false,
    ageYears: propertyFarmDataObj?.ageYears || 0,
    furnishingStatus: propertyFarmDataObj?.furnishingStatus || 'Unfurnished'
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
        agriculturalLandData: property.propertyType === 'Agricultural Land' ? agriculturalData : undefined,
        plotData: property.propertyType === 'Plot' ? plotData : undefined,
        flatApartmentData: property.propertyType === 'Flat/Apartment' ? flatData : undefined,
        itCommercialSpaceData: property.propertyType === 'IT Commercial Space' ? itData : undefined,
        villaIndependentHouseData: property.propertyType === 'Villa/Independent House' ? villaData : undefined,
        farmHouseData: property.propertyType === 'Farm House' ? farmData : undefined
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
    } else if (property.propertyType === 'Flat/Apartment') {
      const parts: string[] = [];
      if (flatData.projectName) parts.push(flatData.projectName);
      parts.push(flatData.bhk);
      if (flatData.flatAreaSqFt > 0) parts.push(`${flatData.flatAreaSqFt} Sq.ft`);
      if (flatData.city) parts.push(flatData.city);
      updateFormData({ title: parts.join(' - ') });
    } else if (property.propertyType === 'Plot') {
      const parts: string[] = [];
      if (plotData.layoutName) parts.push(plotData.layoutName);
      parts.push('Plot');
      if (plotData.sizeValue && plotData.sizeUnit) parts.push(`${plotData.sizeValue} ${plotData.sizeUnit}`);
      else if (plotData.extentSqYds && plotData.extentSqYds > 0) parts.push(`${plotData.extentSqYds} Sq. Yds`);
      if (plotData.city) parts.push(plotData.city);
      updateFormData({ title: parts.join(' - ') });
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
    } else if (property.propertyType === 'Flat/Apartment') {
      const statusText = flatData.constructionStatus === 'Ready to move'
        ? 'Ready to move'
        : `Handover in ${flatData.handoverInMonths || 0} months`;
      const description = `${flatData.bhk} apartment in ${flatData.projectName}, ${flatData.city}. ${flatData.flatAreaSqFt} Sq.ft, ${flatData.communityStatus} community, ${statusText}. ${flatData.parkingCount} car parking(s). ${flatData.transactionType}. ${flatData.facing} facing.`;
      updateFormData({ description });
    } else if (property.propertyType === 'Plot') {
      const facingText = plotData.facing ? `${plotData.facing} facing` : '';
      const roadText = plotData.roadWidth ? `, ${plotData.roadWidth} ${plotData.roadUnit === 'meters' ? 'm' : 'ft'} road` : '';
      const approvalText = plotData.approval ? `, ${plotData.approval} approved` : '';
      const locationText = [plotData.village, plotData.city, plotData.district].filter(Boolean).join(', ');
      const layoutText = plotData.layoutName ? ` in ${plotData.layoutName}` : '';
      const sizeText = plotData.sizeValue && plotData.sizeUnit ? `${plotData.sizeValue} ${plotData.sizeUnit}` : (plotData.extentSqYds ? `${plotData.extentSqYds} Sq. Yds` : '');
      const dimText = plotData.length && plotData.breadth ? `, Dimensions ${plotData.length}×${plotData.breadth} ${plotData.dimensionUnit === 'meters' ? 'm' : 'ft'}` : '';
      const description = `Premium residential/commercial plot${layoutText} measuring ${sizeText}${dimText}, ${facingText}${roadText}${approvalText}. Located at ${locationText}. Ideal for immediate construction and great investment potential.`;
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
                      className="absolute -top-2 -right-2 bg-brand hover:bg-brand-hover text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
                    value={""}
                    onChange={() => { /* noop: single-add via prompt */ }}
                    placeholder="Paste a drone shot image URL and click Add"
                    disabled
                  />
                </div>
                {(agriculturalData.droneShotUrls || []).length > 0 && (
                  <div className="mt-3 space-y-2">
                    {(agriculturalData.droneShotUrls || []).map((u, idx) => (
                      <div key={idx} className="flex items-center justify-between border border-zinc-200 rounded-md px-3 py-2 text-sm">
                        <span className="truncate mr-3">{u}</span>
                        <button
                          type="button"
                          className="text-sm text-brand hover:text-brand-hover"
                          onClick={() => {
                            const url = window.prompt('Update drone shot URL', u) || '';
                            if (!url) return;
                            const cloned = [...(agriculturalData.droneShotUrls || [])];
                            cloned[idx] = url;
                            updateAgriculturalData({ droneShotUrls: cloned });
                          }}
                        >Edit</button>
                        <button
                          type="button"
                          className="text-sm text-zinc-600 hover:text-zinc-800 ml-3"
                          onClick={() => {
                            const next = (agriculturalData.droneShotUrls || []).filter((_, i) => i !== idx);
                            updateAgriculturalData({ droneShotUrls: next });
                          }}
                        >Remove</button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-2">
                  <button
                    type="button"
                    className="px-3 py-2 rounded-md border border-zinc-300 text-sm"
                    onClick={() => {
                      const url = window.prompt('Add a drone shot image URL') || '';
                      const trimmed = url.trim();
                      if (!trimmed) return;
                      const existing = agriculturalData.droneShotUrls || [];
                      updateAgriculturalData({ droneShotUrls: [...existing, trimmed] });
                    }}
                  >Add Drone URL</button>
                </div>
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
        </>
      )}

      {/* Flat/Apartment Specific Fields */}
      {property.propertyType === 'Flat/Apartment' && (
        <>
          {/* Project & Location */}
          <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
            <h3 className="text-lg font-semibold text-zinc-900 mb-4">Project & Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={flatData.city}
                  onChange={(e) => setFlatData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="e.g., Hyderabad"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  value={flatData.projectName}
                  onChange={(e) => setFlatData(prev => ({ ...prev, projectName: e.target.value }))}
                  placeholder="e.g., Sunshine Towers"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="projectArea">Project Area</Label>
                <Input
                  id="projectArea"
                  value={flatData.projectArea}
                  onChange={(e) => setFlatData(prev => ({ ...prev, projectArea: e.target.value }))}
                  placeholder="e.g., 5 Acres"
                  className="mt-2"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <Label htmlFor="numUnits">No. of Units</Label>
                <Input
                  id="numUnits"
                  type="number"
                  value={flatData.numUnits === 0 ? '' : flatData.numUnits.toString()}
                  onChange={(e) => setFlatData(prev => ({ ...prev, numUnits: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 }))}
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
                  onChange={(e) => setFlatData(prev => ({ ...prev, flatAreaSqFt: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 }))}
                  placeholder="e.g., 1450"
                  className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div>
                <Label>Facing</Label>
                <Select value={flatData.facing} onValueChange={(value) => setFlatData(prev => ({ ...prev, facing: value as FlatApartmentData['facing'] }))}>
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

          {/* Configuration & Status */}
          <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
            <h3 className="text-lg font-semibold text-zinc-900 mb-4">Configuration & Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label>BHK</Label>
                <Select value={flatData.bhk} onValueChange={(value) => setFlatData(prev => ({ ...prev, bhk: value as FlatApartmentData['bhk'] }))}>
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
                <Select value={flatData.communityStatus} onValueChange={(value) => setFlatData(prev => ({ ...prev, communityStatus: value as FlatApartmentData['communityStatus'] }))}>
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
                <Select value={flatData.constructionStatus} onValueChange={(value) => setFlatData(prev => ({ ...prev, constructionStatus: value as FlatApartmentData['constructionStatus'] }))}>
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
                    onChange={(e) => setFlatData(prev => ({ ...prev, handoverInMonths: e.target.value === '' ? undefined : parseInt(e.target.value) || 0 }))}
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
                  onChange={(e) => setFlatData(prev => ({ ...prev, floor: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 }))}
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
                  onChange={(e) => setFlatData(prev => ({ ...prev, parkingCount: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 }))}
                  placeholder="e.g., 2"
                  className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div>
                <Label>Transaction</Label>
                <Select value={flatData.transactionType} onValueChange={(value) => setFlatData(prev => ({ ...prev, transactionType: value as FlatApartmentData['transactionType'] }))}>
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
          </div>
        </>
      )}

      {/* IT Commercial Space Specific Fields */}
      {property.propertyType === 'IT Commercial Space' && (
        <>
          {/* Project & Location */}
          <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
            <h3 className="text-lg font-semibold text-zinc-900 mb-4">Project & Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={itData.city}
                  onChange={(e) => setItData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="e.g., Hyderabad"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  value={itData.projectName}
                  onChange={(e) => setItData(prev => ({ ...prev, projectName: e.target.value }))}
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
                  onChange={(e) => setItData(prev => ({ ...prev, projectAreaSqFt: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 }))}
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
                  onChange={(e) => setItData(prev => ({ ...prev, numUnits: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 }))}
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
                  onChange={(e) => setItData(prev => ({ ...prev, perUnitAreaSqFt: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 }))}
                  placeholder="e.g., 5000"
                  className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div>
                <Label htmlFor="floorInfo">Floor (e.g., 3/10)</Label>
                <Input
                  id="floorInfo"
                  value={itData.floorInfo}
                  onChange={(e) => setItData(prev => ({ ...prev, floorInfo: e.target.value }))}
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
                <Select value={itData.constructionStatus} onValueChange={(value) => setItData(prev => ({ ...prev, constructionStatus: value as ITCommercialSpaceData['constructionStatus'] }))}>
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
                    onChange={(e) => setItData(prev => ({ ...prev, handoverInMonths: e.target.value === '' ? undefined : parseInt(e.target.value) || 0 }))}
                    placeholder="e.g., 6"
                    className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              )}
              <div>
                <Label>Facing</Label>
                <Select value={itData.facing} onValueChange={(value) => setItData(prev => ({ ...prev, facing: value as ITCommercialSpaceData['facing'] }))}>
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
                  onChange={(e) => setItData(prev => ({ ...prev, carParkingCount: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 }))}
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
                  onChange={(e) => setItData(prev => ({ ...prev, bikeParkingCount: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 }))}
                  placeholder="e.g., 10"
                  className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div>
                <Label>Transaction Type</Label>
                <Select value={itData.transactionType} onValueChange={(value) => setItData(prev => ({ ...prev, transactionType: value as ITCommercialSpaceData['transactionType'] }))}>
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
                <Select value={itData.furnishingStatus} onValueChange={(value) => setItData(prev => ({ ...prev, furnishingStatus: value as ITCommercialSpaceData['furnishingStatus'] }))}>
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
                  onValueChange={(value) => setItData(prev => ({ ...prev, airConditioned: value === 'true' }))}
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
        </>
      )}

      {/* Plot Specific Fields */}
      {property.propertyType === 'Plot' && (
        <>
          {/* Location Details */}
          <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
            <h3 className="text-lg font-semibold text-zinc-900 mb-4">Location Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="village">Village</Label>
                <Input
                  id="village"
                  value={plotData.village}
                  onChange={(e) => setPlotData(prev => ({ ...prev, village: e.target.value }))}
                  placeholder="e.g., Narsingi"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={plotData.city}
                  onChange={(e) => setPlotData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="e.g., Hyderabad"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  value={plotData.district}
                  onChange={(e) => setPlotData(prev => ({ ...prev, district: e.target.value }))}
                  placeholder="e.g., Ranga Reddy"
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          {/* Plot Specifications */}
          <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
            <h3 className="text-lg font-semibold text-zinc-900 mb-4">Plot Specifications</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="extent">Extent (Sq. Yds)</Label>
                <Input
                  id="extent"
                  type="number"
                  value={(plotData.extentSqYds ?? 0) === 0 ? '' : (plotData.extentSqYds ?? 0).toString()}
                  onChange={(e) => setPlotData(prev => ({ ...prev, extentSqYds: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 }))}
                  placeholder="e.g., 200"
                  className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              <div>
                <Label>Facing</Label>
                <Select value={plotData.facing} onValueChange={(value) => setPlotData(prev => ({ ...prev, facing: value as PlotData['facing'] }))}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select facing" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(FACING_DIRECTIONS).map((dir) => (
                      <SelectItem key={dir} value={dir}>
                        {dir}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="roadWidth">Width of road facing (ft)</Label>
                <Input
                  id="roadWidth"
                  type="number"
                  value={plotData.roadWidth === 0 ? '' : plotData.roadWidth.toString()}
                  onChange={(e) => setPlotData(prev => ({ ...prev, roadWidth: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 }))}
                  placeholder="e.g., 30"
                  className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <Label htmlFor="openSides">Open sides</Label>
                <Input
                  id="openSides"
                  type="number"
                  value={plotData.openSides === 0 ? '' : plotData.openSides.toString()}
                  onChange={(e) => setPlotData(prev => ({ ...prev, openSides: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 }))}
                  placeholder="e.g., 2"
                  className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              <div>
                <Label>Approval</Label>
                <Select value={plotData.approval} onValueChange={(value) => setPlotData(prev => ({ ...prev, approval: value as PlotData['approval'] }))}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select approval" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(PLOT_APPROVALS).map((appr) => (
                      <SelectItem key={appr} value={appr}>
                        {appr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="layoutName">Layout Name</Label>
                <Input
                  id="layoutName"
                  value={plotData.layoutName}
                  onChange={(e) => setPlotData(prev => ({ ...prev, layoutName: e.target.value }))}
                  placeholder="e.g., Green Meadows"
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Villa/Independent House Specific Fields */}
      {property.propertyType === 'Villa/Independent House' && (
        <>
          {/* Project & Location */}
          <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
            <h3 className="text-lg font-semibold text-zinc-900 mb-4">Project & Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="location-hint">Location</Label>
                <Input id="location-hint" placeholder="e.g., Jubilee Hills" className="mt-2" disabled />
              </div>
              <div>
                <Label htmlFor="villa-city">City</Label>
                <Input
                  id="villa-city"
                  value={villaData.city}
                  onChange={(e) => setVillaData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="e.g., Hyderabad"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="villa-projectName">Project Name</Label>
                <Input
                  id="villa-projectName"
                  value={villaData.projectName}
                  onChange={(e) => setVillaData(prev => ({ ...prev, projectName: e.target.value }))}
                  placeholder="e.g., Elite Enclave"
                  className="mt-2"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <Label htmlFor="villa-projectArea">Project Area</Label>
                <Input
                  id="villa-projectArea"
                  value={villaData.projectArea}
                  onChange={(e) => setVillaData(prev => ({ ...prev, projectArea: e.target.value }))}
                  placeholder="e.g., 5 Acres"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="villa-numUnits">No. of Units</Label>
                <Input
                  id="villa-numUnits"
                  type="number"
                  value={villaData.numUnits === 0 ? '' : villaData.numUnits.toString()}
                  onChange={(e) => setVillaData(prev => ({ ...prev, numUnits: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 }))}
                  placeholder="e.g., 50"
                  className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div>
                <Label htmlFor="villa-areaSqFt">Villa Area (Sq.ft)</Label>
                <Input
                  id="villa-areaSqFt"
                  type="number"
                  value={villaData.villaAreaSqFt === 0 ? '' : villaData.villaAreaSqFt.toString()}
                  onChange={(e) => setVillaData(prev => ({ ...prev, villaAreaSqFt: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 }))}
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
                <Select value={villaData.bhk} onValueChange={(value) => setVillaData(prev => ({ ...prev, bhk: value as VillaIndependentHouseData['bhk'] }))}>
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
                <Select value={villaData.communityStatus} onValueChange={(value) => setVillaData(prev => ({ ...prev, communityStatus: value as VillaIndependentHouseData['communityStatus'] }))}>
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
                <Select value={villaData.constructionStatus} onValueChange={(value) => setVillaData(prev => ({ ...prev, constructionStatus: value as VillaIndependentHouseData['constructionStatus'] }))}>
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
                  <Label htmlFor="villa-handoverIn">Handover In (months)</Label>
                  <Input
                    id="villa-handoverIn"
                    type="number"
                    value={villaData.handoverInMonths?.toString() || ''}
                    onChange={(e) => setVillaData(prev => ({ ...prev, handoverInMonths: e.target.value === '' ? undefined : parseInt(e.target.value) || 0 }))}
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
                <Label htmlFor="villa-numFloors">Number of Floors</Label>
                <Input
                  id="villa-numFloors"
                  type="number"
                  value={villaData.numFloors === 0 ? '' : villaData.numFloors.toString()}
                  onChange={(e) => setVillaData(prev => ({ ...prev, numFloors: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 }))}
                  placeholder="e.g., 2"
                  className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div>
                <Label htmlFor="villa-parkingCount">Parking (No. of Car Parkings)</Label>
                <Input
                  id="villa-parkingCount"
                  type="number"
                  value={villaData.parkingCount === 0 ? '' : villaData.parkingCount.toString()}
                  onChange={(e) => setVillaData(prev => ({ ...prev, parkingCount: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 }))}
                  placeholder="e.g., 2"
                  className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div>
                <Label>Transaction</Label>
                <Select value={villaData.transactionType} onValueChange={(value) => setVillaData(prev => ({ ...prev, transactionType: value as VillaIndependentHouseData['transactionType'] }))}>
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
                <Select value={villaData.facing} onValueChange={(value) => setVillaData(prev => ({ ...prev, facing: value as VillaIndependentHouseData['facing'] }))}>
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
                <Select value={villaData.furnishingStatus} onValueChange={(value) => setVillaData(prev => ({ ...prev, furnishingStatus: value as VillaIndependentHouseData['furnishingStatus'] }))}>
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
        </>
      )}

      {/* Farm House Specific Fields */}
      {property.propertyType === 'Farm House' && (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6">
            <h3 className="text-lg font-semibold text-zinc-900 mb-4">Farm House Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="farm-city">City</Label>
                <Input
                  id="farm-city"
                  value={farmData.city}
                  onChange={(e) => setFarmData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="e.g., Hyderabad"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="farm-overallArea">Overall Area (Sq.ft)</Label>
                <Input
                  id="farm-overallArea"
                  type="number"
                  value={farmData.overallAreaSqFt === 0 ? '' : farmData.overallAreaSqFt.toString()}
                  onChange={(e) => setFarmData(prev => ({ ...prev, overallAreaSqFt: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 }))}
                  placeholder="e.g., 10000"
                  className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div>
                <Label htmlFor="farm-builtUpArea">Built Up Area (Sq.ft)</Label>
                <Input
                  id="farm-builtUpArea"
                  type="number"
                  value={farmData.builtUpAreaSqFt === 0 ? '' : farmData.builtUpAreaSqFt.toString()}
                  onChange={(e) => setFarmData(prev => ({ ...prev, builtUpAreaSqFt: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 }))}
                  placeholder="e.g., 3500"
                  className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <Label htmlFor="farm-numFloors">Number of Floors</Label>
                <Input
                  id="farm-numFloors"
                  type="number"
                  value={farmData.numFloors === 0 ? '' : farmData.numFloors.toString()}
                  onChange={(e) => setFarmData(prev => ({ ...prev, numFloors: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 }))}
                  placeholder="e.g., 2"
                  className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div>
                <Label>BHK</Label>
                <Select value={farmData.bhk} onValueChange={(value) => setFarmData(prev => ({ ...prev, bhk: value as FarmHouseData['bhk'] }))}>
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
                  onValueChange={(value) => setFarmData(prev => ({ ...prev, swimmingPool: value === 'true' }))}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="farm-pool-yes" />
                    <Label htmlFor="farm-pool-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="farm-pool-no" />
                    <Label htmlFor="farm-pool-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <Label htmlFor="farm-ageYears">Age of the Property (years)</Label>
                <Input
                  id="farm-ageYears"
                  type="number"
                  value={farmData.ageYears === 0 ? '' : farmData.ageYears.toString()}
                  onChange={(e) => setFarmData(prev => ({ ...prev, ageYears: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 }))}
                  placeholder="e.g., 3"
                  className="mt-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div>
                <Label>Furnishing Status</Label>
                <Select value={farmData.furnishingStatus} onValueChange={(value) => setFarmData(prev => ({ ...prev, furnishingStatus: value as FarmHouseData['furnishingStatus'] }))}>
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
          className="bg-brand hover:bg-brand-hover text-white"
        >
          Update Property
        </Button>
      </div>
    </form>
  );
}