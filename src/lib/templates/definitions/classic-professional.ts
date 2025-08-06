/**
 * Classic Professional Template
 * Traditional, trustworthy design with blue accents
 */

import { Template } from '@/types/template';

export const classicProfessionalTemplate: Template = {
  id: 'classic-professional',
  name: 'Classic Professional',
  description: 'Traditional and trustworthy design with clean blue accents. Perfect for established agents who want to convey experience and reliability.',
  category: 'Professional',
  previewImage: '/images/templates/classic-professional-preview.jpg',
  
  colors: {
    primary: '#3B82F6', // blue-500
    primaryHover: '#2563EB', // blue-600
    primaryLight: '#DBEAFE', // blue-100
    secondary: '#64748B', // slate-500
    secondaryHover: '#475569', // slate-600
    secondaryLight: '#F1F5F9', // slate-100
    textPrimary: '#0F172A', // slate-900
    textSecondary: '#334155', // slate-700
    textMuted: '#64748B', // slate-500
    background: '#FFFFFF',
    backgroundSecondary: '#F8FAFC', // slate-50
    backgroundAccent: '#F0F9FF', // sky-50
    border: '#E2E8F0', // slate-200
    borderLight: '#F1F5F9', // slate-100
    shadow: 'rgba(15, 23, 42, 0.1)', // slate-900 with opacity
  },
  
  typography: {
    headingFont: '"Inter", system-ui, -apple-system, sans-serif',
    bodyFont: '"Inter", system-ui, -apple-system, sans-serif',
    headingWeight: 600,
    bodyWeight: 400,
    buttonWeight: 500,
    headingSizes: {
      h1: '2.5rem', // 40px
      h2: '2rem', // 32px
      h3: '1.5rem', // 24px
      h4: '1.25rem', // 20px
    },
    headingLineHeight: '1.2',
    bodyLineHeight: '1.6',
    headingLetterSpacing: '-0.025em',
    bodyLetterSpacing: '0',
  },
  
  layout: {
    maxWidth: '1200px',
    padding: {
      section: '4rem 1rem',
      container: '0 1rem',
    },
    sectionSpacing: '4rem',
    elementSpacing: '1.5rem',
    borderRadius: {
      small: '0.375rem', // 6px
      medium: '0.5rem', // 8px
      large: '0.75rem', // 12px
    },
    shadows: {
      small: '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
      medium: '0 4px 6px -1px rgba(15, 23, 42, 0.1)',
      large: '0 10px 15px -3px rgba(15, 23, 42, 0.1)',
    },
  },
  
  components: {
    hero: {
      layout: 'split',
      showImage: true,
      imagePosition: 'right',
      titleSize: 'large',
      showSubtitle: true,
    },
    header: {
      style: 'standard',
      showLogo: true,
      navigation: 'simple',
    },
    about: {
      layout: 'two-column',
      showStats: true,
      imageStyle: 'rounded',
    },
    properties: {
      layout: 'grid',
      cardsPerRow: 3,
      cardStyle: 'detailed',
      showFilters: true,
    },
    testimonials: {
      layout: 'grid',
      showImages: true,
      cardStyle: 'card',
    },
    contact: {
      layout: 'split',
      showMap: true,
      formStyle: 'detailed',
    },
    faq: {
      style: 'accordion',
      showSearch: false,
    },
    footer: {
      style: 'detailed',
      showSocial: true,
      showCopyright: true,
    },
  },
  
  customCSS: `
    .template-classic-professional {
      font-family: var(--template-body-font);
    }
    
    .template-classic-professional .hero-section {
      background: linear-gradient(135deg, var(--template-background) 0%, var(--template-background-accent) 100%);
    }
    
    .template-classic-professional .section-header {
      text-align: center;
      margin-bottom: 3rem;
    }
    
    .template-classic-professional .section-header h2 {
      color: var(--template-text-primary);
      font-size: var(--template-h2-size);
      font-weight: var(--template-heading-weight);
      margin-bottom: 1rem;
    }
    
    .template-classic-professional .section-header p {
      color: var(--template-text-muted);
      font-size: 1.125rem;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .template-classic-professional .btn-primary {
      background-color: var(--template-primary);
      color: white;
      font-weight: var(--template-button-weight);
      padding: 0.75rem 2rem;
      border-radius: var(--template-border-radius-md);
      transition: all 0.2s ease;
    }
    
    .template-classic-professional .btn-primary:hover {
      background-color: var(--template-primary-hover);
      transform: translateY(-1px);
      box-shadow: var(--template-shadow-md);
    }
    
    .template-classic-professional .card {
      background: var(--template-background);
      border: 1px solid var(--template-border);
      border-radius: var(--template-border-radius-lg);
      box-shadow: var(--template-shadow-sm);
      transition: all 0.2s ease;
    }
    
    .template-classic-professional .card:hover {
      box-shadow: var(--template-shadow-md);
      transform: translateY(-2px);
    }
  `,
  
  isActive: true,
  isDefault: true,
  version: '1.0.0',
  createdAt: new Date(),
  updatedAt: new Date(),
};