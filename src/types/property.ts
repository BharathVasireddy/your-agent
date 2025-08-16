/**
 * 🏡 PROPERTY TYPES AND CATEGORIES
 * 
 * Defines all available property types for sale and rent
 */

export const LISTING_TYPES = {
  SALE: 'Sale',
  RENT: 'Rent'
} as const;

export type ListingType = typeof LISTING_TYPES[keyof typeof LISTING_TYPES];

// Property types available for sale
export const SALE_PROPERTY_TYPES = {
  AGRICULTURAL_LAND: 'Agricultural Land',
  PLOT: 'Plot',
  FLAT_APARTMENT: 'Flat/Apartment',
  VILLA_INDEPENDENT_HOUSE: 'Villa/Independent House',
  IT_COMMERCIAL_SPACE: 'IT Commercial Space',
  FARM_HOUSE: 'Farm House'
} as const;

// Property types available for rent
export const RENT_PROPERTY_TYPES = {
  FLAT_APARTMENT: 'Flat/Apartment',
  VILLA_INDEPENDENT_HOUSE: 'Villa/Independent House',
  IT_COMMERCIAL_SPACE: 'IT Commercial Space'
} as const;

export type SalePropertyType = typeof SALE_PROPERTY_TYPES[keyof typeof SALE_PROPERTY_TYPES];
export type RentPropertyType = typeof RENT_PROPERTY_TYPES[keyof typeof RENT_PROPERTY_TYPES];

// Combined property types
export const ALL_PROPERTY_TYPES = {
  ...SALE_PROPERTY_TYPES,
  ...RENT_PROPERTY_TYPES
} as const;

export type PropertyType = SalePropertyType | RentPropertyType;

// Helper function to get available property types based on listing type
export const getPropertyTypesForListing = (listingType: ListingType): PropertyType[] => {
  switch (listingType) {
    case LISTING_TYPES.SALE:
      return Object.values(SALE_PROPERTY_TYPES);
    case LISTING_TYPES.RENT:
      return Object.values(RENT_PROPERTY_TYPES);
    default:
      return [];
  }
};

// Helper function to check if a property type is available for a listing type
export const isPropertyTypeValidForListing = (
  propertyType: PropertyType, 
  listingType: ListingType
): boolean => {
  const availableTypes = getPropertyTypesForListing(listingType);
  return availableTypes.includes(propertyType);
};

// Property categories for UI organization
export const PROPERTY_CATEGORIES = {
  RESIDENTIAL: {
    label: 'Residential',
    types: [
      ALL_PROPERTY_TYPES.FLAT_APARTMENT,
      ALL_PROPERTY_TYPES.VILLA_INDEPENDENT_HOUSE,
      ALL_PROPERTY_TYPES.FARM_HOUSE
    ]
  },
  COMMERCIAL: {
    label: 'Commercial',
    types: [
      ALL_PROPERTY_TYPES.IT_COMMERCIAL_SPACE
    ]
  },
  LAND: {
    label: 'Land',
    types: [
      ALL_PROPERTY_TYPES.AGRICULTURAL_LAND,
      ALL_PROPERTY_TYPES.PLOT
    ]
  }
} as const;

// Facing direction options
export const FACING_DIRECTIONS = {
  EAST: 'East',
  WEST: 'West',
  NORTH: 'North',
  SOUTH: 'South',
  NORTH_EAST: 'North-East',
  NORTH_WEST: 'North-West',
  SOUTH_EAST: 'South-East',
  SOUTH_WEST: 'South-West'
} as const;

export type FacingDirection = typeof FACING_DIRECTIONS[keyof typeof FACING_DIRECTIONS];

// Agricultural Land purposes
export const AGRICULTURAL_PURPOSES = {
  FARMING: 'Farming',
  REAL_ESTATE_DEVELOPMENT: 'Real Estate Development',
  MIXED_USE: 'Mixed Use'
} as const;

export type AgriculturalPurpose = typeof AGRICULTURAL_PURPOSES[keyof typeof AGRICULTURAL_PURPOSES];

// Plot approvals
export const PLOT_APPROVALS = {
  HMDA: 'HMDA',
  DTCP: 'DTCP',
  GHMC: 'GHMC',
  PANCHAYAT: 'Panchayat',
  GP: 'GP',
  OTHER: 'Other'
} as const;

export type PlotApproval = typeof PLOT_APPROVALS[keyof typeof PLOT_APPROVALS];

// Flat/Apartment constants
export const BHK_OPTIONS = {
  ONE: '1BHK',
  TWO: '2BHK',
  THREE: '3BHK',
  FOUR: '4BHK',
  FIVE: '5BHK'
} as const;

export type BhkOption = typeof BHK_OPTIONS[keyof typeof BHK_OPTIONS];

export const COMMUNITY_STATUS = {
  STANDALONE: 'Standalone',
  GATED: 'Gated'
} as const;

export type CommunityStatus = typeof COMMUNITY_STATUS[keyof typeof COMMUNITY_STATUS];

export const TRANSACTION_TYPES = {
  RESALE: 'Resale',
  BRAND_NEW: 'Brand New'
} as const;

export type TransactionType = typeof TRANSACTION_TYPES[keyof typeof TRANSACTION_TYPES];

export const FLAT_CONSTRUCTION_STATUS = {
  READY_TO_MOVE: 'Ready to move',
  HANDOVER_IN: 'Handover in'
} as const;

export type FlatConstructionStatus = typeof FLAT_CONSTRUCTION_STATUS[keyof typeof FLAT_CONSTRUCTION_STATUS];

// Furnishing status (common for residential)
export const FURNISHING_STATUS = {
  UNFURNISHED: 'Unfurnished',
  SEMI_FURNISHED: 'Semi furnished',
  FULLY_FURNISHED: 'Fully furnished'
} as const;

export type FurnishingStatus = typeof FURNISHING_STATUS[keyof typeof FURNISHING_STATUS];

// New common enums for extended residential specs
export const AGE_OF_PROPERTY = {
  NEW: 'New',
  YRS_0_5: '0-5 yrs',
  YRS_5_10: '5-10 yrs',
  YRS_10_PLUS: '10+ yrs'
} as const;

export type AgeOfProperty = typeof AGE_OF_PROPERTY[keyof typeof AGE_OF_PROPERTY];

export const FLOORING_TYPES = {
  VITRIFIED: 'Vitrified',
  MARBLE: 'Marble',
  WOODEN: 'Wooden',
  OTHERS: 'Others'
} as const;

export type FlooringType = typeof FLOORING_TYPES[keyof typeof FLOORING_TYPES];

export const POWER_BACKUP = {
  FULL: 'Full',
  PARTIAL: 'Partial',
  NONE: 'None'
} as const;

export type PowerBackup = typeof POWER_BACKUP[keyof typeof POWER_BACKUP];

export const PARKING_TYPES = {
  COVERED: 'Covered',
  OPEN: 'Open',
  BOTH: 'Both'
} as const;

export type ParkingType = typeof PARKING_TYPES[keyof typeof PARKING_TYPES];

export const WATER_SUPPLY = {
  BOREWELL: 'Borewell',
  MUNICIPAL: 'Municipal',
  BOTH: 'Both'
} as const;

export type WaterSupply = typeof WATER_SUPPLY[keyof typeof WATER_SUPPLY];

export const TITLE_STATUS = {
  CLEAR: 'Clear',
  DISPUTED: 'Disputed',
  IN_PROCESS: 'In process'
} as const;

export type TitleStatus = typeof TITLE_STATUS[keyof typeof TITLE_STATUS];

export type AreaUnit = 'Acres' | 'Sq.Yds' | 'Sq.Ft';

// Agricultural Land specific fields
export interface AgriculturalLandData {
  village: string;
  city: string;
  district: string;
  extentAcres: number;
  extentGuntas: number;
  facing: FacingDirection;
  roadWidth: number; // in feet
  boundaryWall: boolean;
  openSides: number;
  purpose: AgriculturalPurpose;
  // New fields for Agricultural Land (capture richer details)
  // Area helpers
  totalAreaValue?: number; // Numeric value corresponding to total area
  totalAreaUnit?: 'Acres' | 'Hectares';
  // Basic information
  surveyNumbers?: string; // Comma-separated survey numbers
  soilType?: 'Red' | 'Black' | 'Sandy' | 'Mixed';
  irrigationSource?: 'Borewell' | 'Canal' | 'Rainfed';
  borewellsCount?: number; // 0 when none
  cropsGrown?: string; // Free text if applicable
  hasRoadAccess?: boolean; // Explicit yes/no for road access
  distanceToMarketKm?: number; // Distance to nearest market/town in km
  zoningType?: 'R1' | 'R2' | 'R3' | 'R4' | 'Commercial' | 'Peri-Urban Zone' | 'Conservation' | 'Industrial' | 'Mixed Use Zone';
  // Documentation
  saleDeedAvailable?: boolean;
  pattadarPassbookAvailable?: boolean;
  encumbranceCertificateAvailable?: boolean; // EC
  pahaniAdangalAvailable?: boolean;
  surveyMapAvailable?: boolean; // Survey Map / FMB
  // Pricing
  pricePerAcre?: number;
  negotiable?: boolean;
  // Media
  droneShotUrls?: string[];
  locationMapUrl?: string | null;
}

// Plot specific fields
export type PlotSizeUnit = 'Sq.Yds' | 'Sq.Ft' | 'Acres' | 'Hectares';
export type LengthUnit = 'feet' | 'meters';
export type PlotShape = 'Rectangular' | 'Square' | 'Irregular';

export interface PlotData {
  // Location
  village: string;
  mandal?: string; // Telangana administrative unit
  city: string;
  district: string;

  // Size and dimensions
  extentSqYds?: number; // legacy compatibility
  sizeValue?: number;
  sizeUnit?: PlotSizeUnit;
  length?: number;
  breadth?: number;
  dimensionUnit?: LengthUnit; // feet/meters
  shape?: PlotShape;

  // Orientation & access
  facing: FacingDirection;
  roadWidth: number; // numeric value
  roadUnit?: LengthUnit; // feet/meters
  openSides: number;
  cornerPlot?: boolean;
  plotNumber?: string;

  // Approvals & zoning
  approval: PlotApproval; // HMDA, DTCP, GHMC, Panchayat, GP, Other
  approvalRef?: string;
  zoningType?: string; // e.g., R1, R2, Commercial, Peri-Urban, Conservation, Industrial, Mixed
  layoutName: string;

  // Legal documentation
  encumbranceCertificate?: 'Yes' | 'No' | 'Pending';
  linkDocuments?: boolean;
  saleDeedOrGpa?: boolean;
  nocAvailable?: boolean;

  // Pricing & payment
  pricePerUnit?: number; // numeric
  pricePerUnitUnit?: 'Sq.Yd' | 'Sq.Ft';
  negotiable?: boolean;
  bookingAmount?: number;
  paymentModes?: Array<'Bank Transfer' | 'Cheque' | 'Cash' | 'Loan'>;
  loanApprovedBanks?: string[];

  // Media
  layoutPlanUrls?: string[];
  locationMapUrl?: string | null;
}

// Flat/Apartment specific fields
export interface FlatApartmentData {
  city: string;
  projectName: string;
  projectArea: string; // free-form e.g., "5 Acres"
  numUnits: number;
  flatAreaSqFt: number;
  bhk: BhkOption; // 1BHK to 5BHK
  communityStatus: CommunityStatus; // Standalone, Gated
  constructionStatus: FlatConstructionStatus; // Ready to move, Handover in
  handoverInMonths?: number; // applicable when constructionStatus is Handover in
  floor: number;
  parkingCount: number; // number of car parkings
  transactionType: TransactionType; // Resale, Brand New
  facing: FacingDirection;
  // New extended fields
  builtUpAreaSqFt?: number;
  carpetAreaSqFt?: number;
  bedroomsCount?: number;
  totalFloors?: number; // total floors in the building
  totalFlats?: number; // total number of flats in the project/building
  bathroomsCount?: number;
  balconiesCount?: number;
  furnishingStatus?: FurnishingStatus;
  flooringType?: FlooringType;
  ceilingHeightFeet?: number;
  propertyAreaValue?: number;
  propertyAreaUnit?: AreaUnit;
  readinessStatus?: 'Ready to Move' | 'Under Construction' | 'Pre-launch';
  possessionDateIso?: string; // ISO date string
  ageOfProperty?: AgeOfProperty;
  // Amenities & utilities
  hasClubhouse?: boolean;
  hasGym?: boolean;
  hasSwimmingPool?: boolean;
  hasChildrenPlayArea?: boolean;
  hasGardenPark?: boolean;
  hasSecurityCctv?: boolean;
  hasLift?: boolean;
  powerBackup?: PowerBackup;
  parkingType?: ParkingType;
  parkingSlots?: number;
  waterSupply?: WaterSupply;
  roadWidthFeet?: number;
  // Legal
  approvedBuildingPlan?: boolean;
  reraRegistrationNumber?: string | null;
  titleStatus?: TitleStatus;
  loanApprovedBanks?: string[];
  // Pricing
  pricePerSqFt?: number;
  maintenanceMonthly?: number;
  negotiable?: boolean;
  // Media (categorized)
  interiorPhotoUrls?: string[];
  exteriorPhotoUrls?: string[];
  floorPlanUrls?: string[];
  videoTourUrl?: string | null;
  // Resale specific
  previousOwners?: 'Single' | 'Multiple';
  originalConstructionYear?: number;
  purchaseYearCurrentOwner?: number;
  renovationsDone?: boolean;
  renovationsDescription?: string;
  occupancyStatus?: 'Owner-occupied' | 'Tenanted' | 'Vacant';
  existingLoanOrMortgage?: boolean;
  societyTransferCharges?: number;
  pendingMaintenanceDues?: boolean;
  pendingMaintenanceAmount?: number;
  utilityConnectionsActive?: Array<'Electricity' | 'Water' | 'Gas'>;
}

// Villa/Independent House specific fields
export interface VillaIndependentHouseData {
  city: string;
  projectName: string;
  projectArea: string; // e.g., "5 Acres"
  numUnits: number;
  villaAreaSqFt: number;
  bhk: BhkOption;
  communityStatus: CommunityStatus;
  constructionStatus: FlatConstructionStatus; // reuse same options
  handoverInMonths?: number; // when constructionStatus is Handover in
  numFloors: number;
  parkingCount: number; // number of car parkings
  transactionType: TransactionType;
  facing: FacingDirection;
  furnishingStatus: FurnishingStatus;
  // New extended fields
  builtUpAreaSqFt?: number;
  carpetAreaSqFt?: number;
  bedroomsCount?: number;
  bathroomsCount?: number;
  balconiesCount?: number;
  flooringType?: FlooringType;
  ceilingHeightFeet?: number;
  plotSizeValue?: number;
  plotSizeUnit?: AreaUnit; // Acres, Sq.Yds, Sq.Ft
  readinessStatus?: 'Ready to Move' | 'Under Construction' | 'Pre-launch';
  possessionDateIso?: string; // ISO date string
  ageOfProperty?: AgeOfProperty;
  // Amenities & utilities
  hasClubhouse?: boolean;
  hasGym?: boolean;
  hasSwimmingPool?: boolean;
  hasChildrenPlayArea?: boolean;
  hasGardenPark?: boolean;
  hasSecurityCctv?: boolean;
  hasLift?: boolean; // usually N/A but keep for independent houses in gated communities
  powerBackup?: PowerBackup;
  parkingType?: ParkingType;
  parkingSlots?: number;
  waterSupply?: WaterSupply;
  roadWidthFeet?: number;
  // Legal
  approvedBuildingPlan?: boolean;
  reraRegistrationNumber?: string | null;
  titleStatus?: TitleStatus;
  loanApprovedBanks?: string[];
  // Pricing
  pricePerSqFt?: number;
  maintenanceMonthly?: number;
  negotiable?: boolean;
  // Media (categorized)
  interiorPhotoUrls?: string[];
  exteriorPhotoUrls?: string[];
  floorPlanUrls?: string[];
  videoTourUrl?: string | null;
  // Resale specific
  previousOwners?: 'Single' | 'Multiple';
  originalConstructionYear?: number;
  purchaseYearCurrentOwner?: number;
  renovationsDone?: boolean;
  renovationsDescription?: string;
  occupancyStatus?: 'Owner-occupied' | 'Tenanted' | 'Vacant';
  existingLoanOrMortgage?: boolean;
  societyTransferCharges?: number;
  pendingMaintenanceDues?: boolean;
  pendingMaintenanceAmount?: number;
  utilityConnectionsActive?: Array<'Electricity' | 'Water' | 'Gas'>;
}

// IT Commercial Space specific fields
export interface ITCommercialSpaceData {
  city: string;
  projectName: string;
  projectAreaSqFt: number; // total project area in sq.ft
  numUnits: number;
  perUnitAreaSqFt: number; // area per unit in sq.ft
  constructionStatus: FlatConstructionStatus; // Ready to move, Handover in
  handoverInMonths?: number; // when constructionStatus is Handover in
  floorInfo: string; // e.g., "3/10"
  facing: FacingDirection;
  carParkingCount: number;
  bikeParkingCount: number;
  transactionType: TransactionType; // Resale, Brand New
  furnishingStatus: FurnishingStatus; // Unfurnished, Semi furnished, Fully furnished
  airConditioned: boolean; // yes/no (legacy)
  // Extended commercial fields
  commercialType?: 'IT Office Space' | 'Retail Space' | 'Showroom' | 'Warehouse';
  readinessStatus?: 'Ready' | 'Under Construction' | 'Shell';
  possessionDateIso?: string; // ISO date string
  builtUpAreaSqFt?: number;
  carpetAreaSqFt?: number;
  floorLevel?: 'Ground' | 'Upper' | 'Multiple floors';
  ceilingHeightFeet?: number;
  coveredParkingSlots?: number;
  openParkingSlots?: number;
  liftType?: 'Passenger' | 'Service' | 'Freight';
  powerBackup?: PowerBackup;
  acType?: 'Central' | 'Split' | 'None';
  roadWidthFeet?: number;
  furnishingCommercial?: 'Bare shell' | 'Warm shell' | 'Fully furnished';
  // Legal
  commercialApprovalCertificate?: boolean;
  fireNoc?: boolean;
  reraRegistrationNumber?: string | null;
  // Pricing
  pricePerSqFt?: number;
  maintenanceMonthly?: number;
  negotiable?: boolean;
  // Media
  interiorPhotoUrls?: string[];
  exteriorPhotoUrls?: string[];
  floorPlanUrls?: string[];
  locationMapUrl?: string | null;
}

// Base property form interface
export interface BasePropertyFormData {
  title: string;
  description: string;
  price: number;
  location: string;
  amenities: string[];
  photos: string[];
  status: string;
  listingType: ListingType;
  propertyType: PropertyType;
  slug?: string;
  brochureUrl?: string;
  // Property type specific data
  agriculturalLandData?: AgriculturalLandData;
  plotData?: PlotData;
  flatApartmentData?: FlatApartmentData;
  villaIndependentHouseData?: VillaIndependentHouseData;
  itCommercialSpaceData?: ITCommercialSpaceData;
  farmHouseData?: FarmHouseData;
}

// Farm House specific fields
export interface FarmHouseData {
  city: string;
  overallAreaSqFt: number;
  builtUpAreaSqFt: number;
  numFloors: number;
  bhk: BhkOption;
  swimmingPool: boolean;
  ageYears: number;
  furnishingStatus: FurnishingStatus;
  // Extended fields
  plotSizeValue?: number;
  plotSizeUnit?: 'Acres' | 'Sq.Yds';
  bedrooms?: number;
  bathrooms?: number;
  landscapedGarden?: boolean;
  roadWidthFt?: number;
  facing?: FacingDirection;
  nearestCityKm?: number;
  nearestHighwayKm?: number;
  landStatus?: 'Agricultural' | 'Converted';
  titleStatus?: 'Clear' | 'Disputed';
  encumbranceCertificate?: boolean;
  pricePerUnit?: number;
  pricePerUnitUnit?: 'Acre' | 'Sq.Yd';
  negotiable?: boolean;
  interiorPhotosUrls?: string[];
  exteriorPhotosUrls?: string[];
  droneFootageUrls?: string[];
  locationMapUrl?: string | null;
}