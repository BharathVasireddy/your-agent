/**
 * Modern Minimal Template
 * Clean, contemporary design with emphasis on whitespace and typography
 */

import { Template } from '@/types/template';

export const modernMinimalTemplate: Template = {
  id: 'modern-minimal',
  name: 'Modern Minimal',
  description: 'Clean and contemporary design with emphasis on whitespace and typography. Perfect for modern agents who prefer simplicity and elegance.',
  category: 'Modern',
  previewImage: '/images/templates/modern-minimal-preview.jpg',
  
  colors: {
    primary: '#0F172A', // slate-900
    primaryHover: '#1E293B', // slate-800
    primaryLight: '#F1F5F9', // slate-100
    secondary: '#6366F1', // indigo-500
    secondaryHover: '#4F46E5', // indigo-600
    secondaryLight: '#E0E7FF', // indigo-100
    textPrimary: '#0F172A', // slate-900
    textSecondary: '#475569', // slate-600
    textMuted: '#94A3B8', // slate-400
    background: '#FFFFFF',
    backgroundSecondary: '#FAFAFA', // neutral-50
    backgroundAccent: '#F8FAFC', // slate-50
    border: '#F1F5F9', // slate-100
    borderLight: '#F8FAFC', // slate-50
    shadow: 'rgba(15, 23, 42, 0.08)', // slate-900 with opacity
  },
  
  typography: {
    headingFont: '"Inter", system-ui, -apple-system, sans-serif',
    bodyFont: '"Inter", system-ui, -apple-system, sans-serif',
    headingWeight: 700,
    bodyWeight: 400,
    buttonWeight: 600,
    headingSizes: {
      h1: '3rem', // 48px
      h2: '2.25rem', // 36px
      h3: '1.75rem', // 28px
      h4: '1.375rem', // 22px
    },
    headingLineHeight: '1.1',
    bodyLineHeight: '1.7',
    headingLetterSpacing: '-0.05em',
    bodyLetterSpacing: '0',
  },
  
  layout: {
    maxWidth: '1100px',
    padding: {
      section: '5rem 1rem',
      container: '0 1rem',
    },
    sectionSpacing: '5rem',
    elementSpacing: '2rem',
    borderRadius: {
      small: '0.25rem', // 4px
      medium: '0.375rem', // 6px
      large: '0.5rem', // 8px
    },
    shadows: {
      small: '0 1px 3px 0 rgba(15, 23, 42, 0.05)',
      medium: '0 2px 4px 0 rgba(15, 23, 42, 0.08)',
      large: '0 4px 8px 0 rgba(15, 23, 42, 0.12)',
    },
  },
  
  components: {
    hero: {
      layout: 'centered',
      showImage: true,
      imagePosition: 'background',
      titleSize: 'xl',
      showSubtitle: true,
    },
    header: {
      style: 'minimal',
      showLogo: false,
      navigation: 'none',
    },
    about: {
      layout: 'single-column',
      showStats: false,
      imageStyle: 'square',
    },
    properties: {
      layout: 'grid',
      cardsPerRow: 2,
      cardStyle: 'minimal',
      showFilters: false,
    },
    testimonials: {
      layout: 'slider',
      showImages: false,
      cardStyle: 'minimal',
    },
    contact: {
      layout: 'form-only',
      showMap: false,
      formStyle: 'minimal',
    },
    faq: {
      style: 'simple',
      showSearch: false,
    },
    footer: {
      style: 'minimal',
      showSocial: false,
      showCopyright: true,
    },
  },
  
  customCSS: `
    .template-modern-minimal {
      font-family: var(--template-body-font);
      background: var(--template-background);
    }
    
    .template-modern-minimal .hero-section {
      min-height: 80vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      background: var(--template-background);
    }
    
    .template-modern-minimal .hero-title {
      font-size: var(--template-h1-size);
      font-weight: var(--template-heading-weight);
      letter-spacing: var(--template-heading-letter-spacing);
      line-height: var(--template-heading-line-height);
      color: var(--template-text-primary);
      margin-bottom: 1.5rem;
    }
    
    .template-modern-minimal .hero-subtitle {
      font-size: 1.5rem;
      color: var(--template-text-muted);
      font-weight: 300;
      margin-bottom: 2rem;
    }
    
    .template-modern-minimal .section {
      padding: var(--template-section-spacing) 0;
      max-width: var(--template-max-width);
      margin: 0 auto;
    }
    
    .template-modern-minimal .section-title {
      font-size: var(--template-h2-size);
      font-weight: var(--template-heading-weight);
      letter-spacing: var(--template-heading-letter-spacing);
      color: var(--template-text-primary);
      margin-bottom: 3rem;
      text-align: center;
    }
    
    .template-modern-minimal .btn-primary {
      background-color: var(--template-primary);
      color: white;
      font-weight: var(--template-button-weight);
      padding: 1rem 2.5rem;
      border-radius: var(--template-border-radius-sm);
      border: none;
      font-size: 1rem;
      transition: all 0.15s ease;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .template-modern-minimal .btn-primary:hover {
      background-color: var(--template-primary-hover);
    }
    
    .template-modern-minimal .btn-secondary {
      background-color: transparent;
      color: var(--template-secondary);
      font-weight: var(--template-button-weight);
      padding: 1rem 2.5rem;
      border: 2px solid var(--template-secondary);
      border-radius: var(--template-border-radius-sm);
      font-size: 1rem;
      transition: all 0.15s ease;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .template-modern-minimal .btn-secondary:hover {
      background-color: var(--template-secondary);
      color: white;
    }
    
    .template-modern-minimal .card {
      background: var(--template-background);
      border: 1px solid var(--template-border);
      border-radius: var(--template-border-radius-lg);
      padding: 2rem;
      transition: all 0.2s ease;
    }
    
    .template-modern-minimal .card:hover {
      border-color: var(--template-secondary-light);
      box-shadow: var(--template-shadow-medium);
    }
    
    .template-modern-minimal .text-large {
      font-size: 1.25rem;
      line-height: var(--template-body-line-height);
      color: var(--template-text-secondary);
    }
    
    .template-modern-minimal .divider {
      width: 4rem;
      height: 2px;
      background-color: var(--template-secondary);
      margin: 2rem auto;
    }
  `,
  
  isActive: true,
  isDefault: false,
  version: '1.0.0',
  createdAt: new Date(),
  updatedAt: new Date(),
};