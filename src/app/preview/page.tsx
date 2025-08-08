import React from 'react';
import TemplateRenderer from '@/components/templates/TemplateRenderer';

type SearchParams = {
  template?: string;
};

// Keep in sync with [agentSlug]/page.tsx
function getTemplateName(template: string | undefined): string {
  if (template === 'fresh-minimal') return 'fresh-minimal';
  if (template === 'mono-modern') return 'mono-modern';
  if (template === 'mono-elite') return 'mono-elite';
  return 'legacy-pro';
}

// Minimal mock data to showcase the sections with realistic content
function buildMockAgent() {
  const now = new Date();
  return {
    id: 'preview-agent',
    slug: 'preview',
    template: 'fresh-minimal',
    phone: '+91 98765 43210',
    logoUrl: null,
    city: 'Hyderabad',
    area: 'Gachibowli',
    heroImage: '/images/hero-background.jpg',
    heroTitle: 'Your Trusted Real Estate Partner',
    heroSubtitle: 'Discover properties tailored to your lifestyle and goals',
    profilePhotoUrl: null,
    experience: 7,
    bio: 'Helping clients buy, sell, and invest with confidence across Hyderabad. Focused on transparency and results.',
    user: {
      id: 'preview-user',
      name: 'Alex Agent',
      email: 'alex@example.com',
    },
    properties: [
      {
        id: 'p1',
        title: '3BHK in Financial District',
        description: 'Spacious apartment with excellent ventilation and amenities.',
        price: 14500000,
        area: 1650,
        bedrooms: 3,
        bathrooms: 3,
        location: 'Financial District, Hyderabad',
        amenities: ['Clubhouse', 'Gym', 'Pool'],
        photos: ['/images/hero-background.jpg'],
        status: 'Available',
        listingType: 'Sale',
        propertyType: 'Flat/Apartment',
        slug: '3bhk-financial-district',
        brochureUrl: null,
        propertyData: null,
        agentId: 'preview-agent',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'p2',
        title: 'HMDA Approved Plot',
        description: 'Prime residential plot with excellent road connectivity.',
        price: 5200000,
        area: 1800,
        bedrooms: null,
        bathrooms: null,
        location: 'Kollur, Hyderabad',
        amenities: [],
        photos: ['/images/hero-background.jpg'],
        status: 'Available',
        listingType: 'Sale',
        propertyType: 'Plot',
        slug: 'hmda-plot-kollur',
        brochureUrl: null,
        propertyData: null,
        agentId: 'preview-agent',
        createdAt: now,
        updatedAt: now,
      },
    ],
    testimonials: [
      { id: 't1', agentId: 'preview-agent', text: 'Professional and responsive throughout.', author: 'Rohan', role: 'Buyer', rating: 5 },
      { id: 't2', agentId: 'preview-agent', text: 'Great experience, highly recommend.', author: 'Meera', role: 'Seller', rating: 5 },
    ],
    faqs: [
      { id: 'f1', agentId: 'preview-agent', question: 'Do you assist with home loans?', answer: 'Yes, we coordinate with partner banks for fast approvals.' },
      { id: 'f2', agentId: 'preview-agent', question: 'What areas do you cover?', answer: 'We primarily serve Hyderabad and surrounding regions.' },
    ],
  };
}

export default async function PreviewPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const templateName = getTemplateName(params?.template);
  const agentData = buildMockAgent();

  return (
    <TemplateRenderer templateName={templateName} agentData={agentData as unknown as Parameters<typeof TemplateRenderer>[0]['agentData']} />
  );
}


