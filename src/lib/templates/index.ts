/**
 * Template Registry and Management
 * Central location for template definitions and utilities
 */

import { Template, TemplatePreview } from '@/types/template';

// Import template definitions
import { modernMinimalTemplate } from './definitions/modern-minimal';
import { classicProfessionalTemplate } from './definitions/classic-professional';
import { boldRedTemplate } from './definitions/bold-red';
import { blackWhiteTemplate } from './definitions/black-white';
import { freshMinimalTemplate } from './definitions/fresh-minimal';

/**
 * Registry of all available templates
 */
export const TEMPLATE_REGISTRY: Record<string, Template> = {
  'modern-minimal': modernMinimalTemplate,
  'classic-professional': classicProfessionalTemplate,
  'bold-red': boldRedTemplate,
  'black-white': blackWhiteTemplate,
  'fresh-minimal': freshMinimalTemplate,
};

/**
 * Get all available templates for selection
 */
export function getAvailableTemplates(): TemplatePreview[] {
  return Object.values(TEMPLATE_REGISTRY).map(template => ({
    id: template.id,
    name: template.name,
    description: template.description,
    previewImage: template.previewImage || `/images/templates/${template.id}-preview.jpg`,
    category: template.category,
    isDefault: template.isDefault,
  }));
}

/**
 * Get a specific template by ID
 */
export function getTemplate(templateId: string): Template | null {
  return TEMPLATE_REGISTRY[templateId] || null;
}

/**
 * Get the default template
 */
export function getDefaultTemplate(): Template {
  const defaultTemplate = Object.values(TEMPLATE_REGISTRY).find(t => t.isDefault);
  return defaultTemplate || TEMPLATE_REGISTRY['classic-professional'];
}

/**
 * Validate template ID
 */
export function isValidTemplateId(templateId: string): boolean {
  return templateId in TEMPLATE_REGISTRY;
}

/**
 * Generate CSS variables for a template
 */
export function generateTemplateCSS(template: Template): string {
  const { colors, typography, layout } = template;
  
  return `
    :root {
      /* Colors */
      --template-primary: ${colors.primary};
      --template-primary-hover: ${colors.primaryHover};
      --template-primary-light: ${colors.primaryLight};
      --template-secondary: ${colors.secondary};
      --template-secondary-hover: ${colors.secondaryHover};
      --template-secondary-light: ${colors.secondaryLight};
      --template-text-primary: ${colors.textPrimary};
      --template-text-secondary: ${colors.textSecondary};
      --template-text-muted: ${colors.textMuted};
      --template-background: ${colors.background};
      --template-background-secondary: ${colors.backgroundSecondary};
      --template-background-accent: ${colors.backgroundAccent};
      --template-border: ${colors.border};
      --template-border-light: ${colors.borderLight};
      --template-shadow: ${colors.shadow};
      
      /* Typography */
      --template-heading-font: ${typography.headingFont};
      --template-body-font: ${typography.bodyFont};
      --template-heading-weight: ${typography.headingWeight};
      --template-body-weight: ${typography.bodyWeight};
      --template-button-weight: ${typography.buttonWeight};
      --template-h1-size: ${typography.headingSizes.h1};
      --template-h2-size: ${typography.headingSizes.h2};
      --template-h3-size: ${typography.headingSizes.h3};
      --template-h4-size: ${typography.headingSizes.h4};
      --template-heading-line-height: ${typography.headingLineHeight};
      --template-body-line-height: ${typography.bodyLineHeight};
      --template-heading-letter-spacing: ${typography.headingLetterSpacing};
      --template-body-letter-spacing: ${typography.bodyLetterSpacing};
      
      /* Layout */
      --template-max-width: ${layout.maxWidth};
      --template-section-padding: ${layout.padding.section};
      --template-container-padding: ${layout.padding.container};
      --template-section-spacing: ${layout.sectionSpacing};
      --template-element-spacing: ${layout.elementSpacing};
      --template-border-radius-sm: ${layout.borderRadius.small};
      --template-border-radius-md: ${layout.borderRadius.medium};
      --template-border-radius-lg: ${layout.borderRadius.large};
      --template-shadow-sm: ${layout.shadows.small};
      --template-shadow-md: ${layout.shadows.medium};
      --template-shadow-lg: ${layout.shadows.large};
    }
    
    ${template.customCSS || ''}
  `;
}

/**
 * Get template class name for CSS targeting
 */
export function getTemplateClassName(templateId: string): string {
  return `template-${templateId}`;
}

/**
 * Migrate from old theme system to new template system
 */
export function migrateThemeToTemplate(oldTheme: string): string {
  const themeToTemplateMap: Record<string, string> = {
    'professional-blue': 'classic-professional',
    'elegant-dark': 'modern-minimal',
    'modern-red': 'bold-red',
  };
  
  return themeToTemplateMap[oldTheme] || 'classic-professional';
}