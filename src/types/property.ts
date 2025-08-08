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
  GP: 'GP'
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
}

// Plot specific fields
export interface PlotData {
  village: string;
  city: string;
  district: string;
  extentSqYds: number; // in square yards
  facing: FacingDirection;
  roadWidth: number; // in feet
  openSides: number;
  approval: PlotApproval; // HMDA, DTCP, GP
  layoutName: string;
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
  airConditioned: boolean; // yes/no
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
}