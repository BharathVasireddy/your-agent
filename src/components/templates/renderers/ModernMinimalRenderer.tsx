/**
 * Modern Minimal Template Renderer
 * Clean, contemporary design with emphasis on whitespace and typography
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

interface ModernMinimalRendererProps {
  template: Template;
  agent: AgentData;
  isEditMode?: boolean;
  isOwner?: boolean;
}

export function ModernMinimalRenderer({ 
  template, 
  agent, 
  isEditMode, 
  isOwner = false 
}: ModernMinimalRendererProps) {
  // Suppress unused variable warnings for legacy renderer
  void template;
  void isEditMode;
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