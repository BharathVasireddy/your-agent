import { Bath, Bed, Square, MapPin, Trees, Ruler, Navigation } from 'lucide-react';
import { type Property } from '@/types/dashboard';
import { type AgriculturalLandData } from '@/types/property';

interface PropertyFeature {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

export function getPropertyFeatures(property: Property): PropertyFeature[] {
  const features: PropertyFeature[] = [];

  // For Agricultural Land, show specific agricultural features
  if (property.propertyType === 'Agricultural Land' && property.propertyData) {
    const data = property.propertyData as unknown as AgriculturalLandData;
    
    // Land extent (combination of acres and guntas)
    if (data.extentAcres || data.extentGuntas) {
      const acresText = data.extentAcres ? `${data.extentAcres}A` : '';
      const guntasText = data.extentGuntas ? `${data.extentGuntas}G` : '';
      const extentText = [acresText, guntasText].filter(Boolean).join(' ');
      
      features.push({
        icon: Trees,
        label: 'Extent',
        value: extentText
      });
    }

    // Facing direction
    if (data.facing) {
      features.push({
        icon: MapPin,
        label: 'Facing',
        value: data.facing
      });
    }

    // Road width
    if (data.roadWidth) {
      features.push({
        icon: Navigation,
        label: 'Road',
        value: `${data.roadWidth}ft`
      });
    }

    // If we have less than 3 features, add area as backup
    if (features.length < 3 && property.area) {
      features.push({
        icon: Ruler,
        label: 'Area',
        value: formatArea(property.area)
      });
    }

  } else {
    // For other property types, show traditional bed/bath/area
    if (property.bedrooms !== null && property.bedrooms !== undefined) {
      features.push({
        icon: Bed,
        label: 'Beds',
        value: property.bedrooms.toString()
      });
    }

    if (property.bathrooms !== null && property.bathrooms !== undefined) {
      features.push({
        icon: Bath,
        label: 'Baths',
        value: property.bathrooms.toString()
      });
    }

    if (property.area) {
      features.push({
        icon: Square,
        label: 'Area',
        value: formatArea(property.area)
      });
    }
  }

  return features;
}

export function formatArea(area: number): string {
  if (area >= 43560) {
    // Convert to acres if area is large (1 acre = 43,560 sq ft)
    const acres = (area / 43560).toFixed(1);
    return `${acres} acres`;
  } else if (area >= 10000) {
    // Show in thousands for large areas
    const thousands = (area / 1000).toFixed(1);
    return `${thousands}k sq ft`;
  } else {
    return `${area.toLocaleString()} sq ft`;
  }
}

export function formatPrice(price: number): string {
  if (price >= 10000000) {
    return `${(price / 10000000).toFixed(1)} Cr`;
  } else if (price >= 100000) {
    return `${(price / 100000).toFixed(1)} L`;
  } else {
    return `${price.toLocaleString()}`;
  }
}

export function getPropertyPurposeInfo(property: Property): { purpose: string; description: string } | null {
  if (property.propertyType === 'Agricultural Land' && property.propertyData) {
    const data = property.propertyData as unknown as AgriculturalLandData;
    if (data.purpose) {
    const purposeDescriptions = {
      'Farming': 'Suitable for cultivation and agricultural activities',
      'Real Estate Development': 'Prime land with development potential',
      'Mixed Use': 'Versatile land for farming or future development'
    };
    
      return {
        purpose: data.purpose,
        description: purposeDescriptions[data.purpose as keyof typeof purposeDescriptions] || ''
      };
    }
  }
  
  return null;
}