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
}