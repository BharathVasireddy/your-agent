/**
 * Modern Minimal Template Renderer
 * Clean, contemporary design with emphasis on whitespace and typography
 */

import React from 'react';
import { Template, AgentData } from '@/types/template';
import { EditModeProvider } from '@/components/EditModeProvider';
import EditToggleButton from '@/components/EditToggleButton';

// Import generic section components
import Header from '@/components/sections/Header';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import PropertiesSection from '@/components/sections/PropertiesSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import FaqSection from '@/components/sections/FaqSection';
import ContactSection from '@/components/sections/ContactSection';
import Footer from '@/components/sections/Footer';

interface ModernMinimalRendererProps {
  template: Template;
  agent: AgentData;
  isEditMode?: boolean;
  isOwner?: boolean;
}

export function ModernMinimalRenderer({ 
  template, 
  agent, 
  isEditMode = false, 
  isOwner = false 
}: ModernMinimalRendererProps) {
  return (
    <EditModeProvider isOwner={isOwner}>
      <main className="template-modern-minimal">
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