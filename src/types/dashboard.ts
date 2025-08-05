import type { Session } from 'next-auth';

export interface AgentProfile {
  id: string;
  slug: string;
  profilePhotoUrl: string | null;
  experience: number | null;
  city: string | null;
  area: string | null;
  bio: string | null;
  hasSeenTour: boolean;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

export interface Property {
  id: string;
  slug: string; // Human-friendly URL slug
  agentId: string;
  title: string;
  description: string;
  price: number;
  area: number; // in sqft
  bedrooms: number;
  bathrooms: number;
  location: string;
  amenities: string[];
  photos: string[]; // Array of Cloudinary URLs
  status: string; // Available, Sold, Rented
  listingType: string; // Sale or Rent
  propertyType: string; // Plots, Villas, Flats, Farms, etc.
  createdAt: Date;
  updatedAt: Date;
}

export interface ExtendedSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}