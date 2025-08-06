/**
 * Template Renderer Component
 * Dynamically renders agent profiles based on selected template
 */

import React from 'react';
import { Template, AgentData } from '@/types/template';
import { generateTemplateCSS, getTemplateClassName } from '@/lib/templates';

// Template-specific renderers
import { ClassicProfessionalRenderer } from './renderers/ClassicProfessionalRenderer';
import { ModernMinimalRenderer } from './renderers/ModernMinimalRenderer';
import { BoldRedRenderer } from './renderers/BoldRedRenderer';

interface TemplateRendererProps {
  template: Template;
  agent: AgentData;
  isEditMode?: boolean;
  isOwner?: boolean;
}

/**
 * Template Renderer Factory
 * Maps template IDs to their specific renderer components
 */
const TemplateRenderers: Record<string, React.ComponentType<TemplateRendererProps>> = {
  'classic-professional': ClassicProfessionalRenderer,
  'modern-minimal': ModernMinimalRenderer,
  'bold-red': BoldRedRenderer,
};

/**
 * Main Template Renderer Component
 * Handles template selection and CSS injection
 */
export default function TemplateRenderer({ 
  template, 
  agent, 
  isEditMode = false, 
  isOwner = false 
}: TemplateRendererProps) {
  const RendererComponent = TemplateRenderers[template.id];
  
  if (!RendererComponent) {
    console.error(`No renderer found for template: ${template.id}`);
    // Fallback to classic professional template
    const FallbackRenderer = TemplateRenderers['classic-professional'];
    return (
      <div className={getTemplateClassName('classic-professional')}>
        <style jsx>{generateTemplateCSS(template)}</style>
        <FallbackRenderer
          template={template}
          agent={agent}
          isEditMode={isEditMode}
          isOwner={isOwner}
        />
      </div>
    );
  }

  return (
    <div className={getTemplateClassName(template.id)}>
      {/* Inject template-specific CSS */}
      <style jsx>{generateTemplateCSS(template)}</style>
      
      {/* Render template-specific component */}
      <RendererComponent
        template={template}
        agent={agent}
        isEditMode={isEditMode}
        isOwner={isOwner}
      />
    </div>
  );
}

/**
 * Template Context Provider
 * Provides template configuration to child components
 */
export const TemplateContext = React.createContext<{
  template: Template | null;
  agent: AgentData | null;
  isEditMode: boolean;
  isOwner: boolean;
}>({
  template: null,
  agent: null,
  isEditMode: false,
  isOwner: false,
});

/**
 * Hook to access template context
 */
export function useTemplate() {
  const context = React.useContext(TemplateContext);
  if (!context.template) {
    throw new Error('useTemplate must be used within a TemplateRenderer');
  }
  return context;
}

/**
 * Template Provider Component
 * Wraps template renderer with context
 */
export function TemplateProvider({ 
  template, 
  agent, 
  isEditMode = false, 
  isOwner = false,
  children 
}: TemplateRendererProps & { children: React.ReactNode }) {
  return (
    <TemplateContext.Provider value={{ template, agent, isEditMode, isOwner }}>
      {children}
    </TemplateContext.Provider>
  );
}