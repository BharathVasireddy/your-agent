/**
 * Black & White Template Renderer
 * Clean monochrome design with full-width header and rounded buttons
 */

import React from 'react';
import { Template, AgentData } from '@/types/template';
import { EditModeProvider } from '@/components/EditModeProvider';
import EditToggleButton from '@/components/EditToggleButton';

// Import legacy-pro section components
import Header from '@/components/templates/legacy-pro/Header';
import HeroSection from '@/components/templates/legacy-pro/HeroSection';
import AboutSection from '@/components/templates/legacy-pro/AboutSection';
import PropertiesSection from '@/components/templates/legacy-pro/PropertiesSection';
import TestimonialsSection from '@/components/templates/legacy-pro/TestimonialsSection';
import FaqSection from '@/components/templates/legacy-pro/FaqSection';
import ContactSection from '@/components/templates/legacy-pro/ContactSection';
import Footer from '@/components/templates/legacy-pro/Footer';

interface BlackWhiteRendererProps {
  template: Template;
  agent: AgentData;
  isEditMode?: boolean;
  isOwner?: boolean;
}

export function BlackWhiteRenderer({ 
  template, 
  agent, 
  isEditMode, 
  isOwner = false 
}: BlackWhiteRendererProps) {
  // Suppress unused variable warnings for legacy renderer
  void template;
  void isEditMode;
  return (
    <EditModeProvider isOwner={isOwner}>
      <main className="template-black-white">
        <Header agent={agent} />
        <HeroSection agent={agent} />
        <AboutSection agent={agent} />
        <PropertiesSection 
          properties={agent.properties} 
          agent={agent}
        />
        <TestimonialsSection 
          testimonials={agent.testimonials.map(t => ({
            id: t.id,
            text: t.text,
            author: t.name,
            rating: t.rating
          }))}
        />
        <FaqSection 
          faqs={agent.faqs}
        />
        <ContactSection agent={agent} />
        <Footer />
        {isOwner && <EditToggleButton />}
      </main>
    </EditModeProvider>
  );
}