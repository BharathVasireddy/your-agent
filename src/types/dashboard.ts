import type { Session } from 'next-auth';
import type { Prisma } from '@prisma/client';

export interface AgentProfile {
  id: string;
  slug: string;
  profilePhotoUrl: string | null;
  experience: number | null;
  city: string | null;
  area: string | null;
  bio: string | null;
  phone: string | null;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

export interface Property {
  id: string;
  slug: string | null; // Human-friendly URL slug
  agentId: string;
  title: string;
  description: string;
  price: number;
  area: number | null; // in sqft (nullable for agricultural land)
  bedrooms: number | null; // nullable for agricultural land
  bathrooms: number | null; // nullable for agricultural land
  location: string;
  amenities: string[];
  photos: string[]; // Array of Cloudinary URLs
  status: string; // Available, Sold, Rented
  listingType: string; // Sale or Rent
  propertyType: string; // Plots, Villas, Flats, Farms, etc.
  propertyData?: Prisma.JsonValue; // Property type specific data (agricultural, plot, etc.)
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