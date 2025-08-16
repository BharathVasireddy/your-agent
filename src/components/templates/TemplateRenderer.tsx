/**
 * Template Renderer Component
 * Dynamically renders agent profiles based on selected template
 */

import React from 'react';
// Dynamically import only the selected template's components
import type { Prisma } from '@prisma/client';

interface AgentDataForTemplateRenderer {
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
  awards?: Array<{
    id: string;
    title: string;
    issuedBy: string | null;
    year: number | null;
    description: string | null;
    imageUrl: string | null;
  }>;
  galleryImages?: Array<{
    id: string;
    imageUrl: string;
    caption: string | null;
  }>;
  builders?: Array<{
    id: string;
    name: string;
    logoUrl: string;
    websiteUrl: string | null;
  }>;
  // Optional templateData for per-agent config
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  templateData?: any;
}

interface TemplateRendererProps {
  templateName: string;
  agentData: AgentDataForTemplateRenderer;
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
  const visibility = (agentData as unknown as { templateData?: { visibility?: Record<string, boolean> } }).templateData?.visibility || {};
  const show = (key: keyof typeof visibility, fallback = true) => (typeof visibility[key] === 'boolean' ? visibility[key] : fallback);

  return (
    <main className={`template-${templateName}`}>
      <Components.Header agent={agentData} />
      {show('hero') && <Components.HeroSection agent={agentData} />}
      {show('properties') && (
        <Components.PropertiesSection properties={agentData.properties} agent={agentData} />
      )}
      {show('about') && <Components.AboutSection agent={agentData} />}
      {show('awards', true) && (Components as unknown as { AwardsSection?: React.ComponentType<{ awards?: AgentDataForTemplateRenderer['awards'] }> }).AwardsSection && (
        // @ts-expect-error dynamic template component
        <Components.AwardsSection awards={agentData.awards} />
      )}
      {show('gallery', true) && (Components as unknown as { GallerySection?: React.ComponentType<{ images?: AgentDataForTemplateRenderer['galleryImages'] }> }).GallerySection && (
        // @ts-expect-error dynamic template component
        <Components.GallerySection images={agentData.galleryImages} />
      )}
      {show('builders', true) && (Components as unknown as { BuildersSection?: React.ComponentType<{ builders?: AgentDataForTemplateRenderer['builders'] }> }).BuildersSection && (
        // @ts-expect-error dynamic template component
        <Components.BuildersSection builders={agentData.builders} />
      )}
      {show('testimonials') && <Components.TestimonialsSection testimonials={agentData.testimonials} />}
      {show('faqs') && <Components.FaqSection faqs={agentData.faqs} />}
      {show('contact') && <Components.ContactSection agent={agentData} />}
      {/* Footer expects only social fields for legacy-pro; cast to a compatible shape */}
      <Components.Footer
        agent={agentData as unknown as {
          websiteUrl?: string | null;
          facebookUrl?: string | null;
          instagramUrl?: string | null;
          linkedinUrl?: string | null;
          youtubeUrl?: string | null;
          twitterUrl?: string | null;
        }}
      />
    </main>
  );
}

