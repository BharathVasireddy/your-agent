import type { Session } from 'next-auth';

export interface AgentProfile {
  id: string;
  slug: string;
  profilePhotoUrl: string | null;
  specialization: string | null;
  city: string | null;
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
  title: string;
  price: number;
  photos: string[];
  status: string;
  listingType: string;
  propertyType: string;
}

export interface ExtendedSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}