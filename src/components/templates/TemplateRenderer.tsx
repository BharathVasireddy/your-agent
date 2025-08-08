/**
 * Template Renderer Component
 * Dynamically renders agent profiles based on selected template
 */

import React from 'react';
// Dynamically import only the selected template's components
import type { Prisma } from '@prisma/client';

interface Agent {
  id: string;
  slug: string;
  template: string;
  phone: string | null;
  logoUrl: string | null;
  city: string | null;
  area: string | null;
  heroImage: string | null;
  heroTitle: string | null;
  heroSubtitle: string | null;
  profilePhotoUrl: string | null;
  experience: number | null;
  bio: string | null;
  user: {
    id: string;
    name: string | null;
    email: string | null;
  };
  properties: Array<{
    id: string;
    title: string;
    description: string;
    price: number;
    area: number | null;
    bedrooms: number | null;
    bathrooms: number | null;
    location: string;
    amenities: string[];
    photos: string[];
    status: string;
    listingType: string;
    propertyType: string;
    slug: string | null;
    brochureUrl: string | null;
    propertyData?: Prisma.JsonValue;
    agentId: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
  testimonials: Array<{
    id: string;
    agentId: string;
    text: string;
    author: string;
    role: string | null;
    rating: number | null;
  }>;
  faqs: Array<{
    id: string;
    agentId: string;
    question: string;
    answer: string;
  }>;
}

interface TemplateRendererProps {
  templateName: string;
  agentData: Agent;
}

async function loadTemplateComponents(templateName: string) {
  switch (templateName) {
    case 'mono-elite':
      return await import('./mono-elite');
    case 'mono-modern':
      return await import('./mono-modern');
    case 'fresh-minimal':
      return await import('./fresh-minimal');
    case 'legacy-pro':
    default:
      return await import('./legacy-pro');
  }
}

/**
 * Main Template Renderer Component
 * The brains of the operation - dynamically imports and renders correct template components
 */
export default async function TemplateRenderer({ templateName, agentData }: TemplateRendererProps) {
  const Components = await loadTemplateComponents(templateName);

  return (
    <main className={`template-${templateName}`}>
      <Components.Header agent={agentData} />
      <Components.HeroSection agent={agentData} />
      <Components.PropertiesSection properties={agentData.properties} agent={agentData} />
      <Components.AboutSection agent={agentData} />
      <Components.TestimonialsSection testimonials={agentData.testimonials} />
      <Components.FaqSection faqs={agentData.faqs} />
      <Components.ContactSection agent={agentData} />
      <Components.Footer />
    </main>
  );
}

