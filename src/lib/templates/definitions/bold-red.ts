/**
 * Bold Red Template
 * Energetic and attention-grabbing design with red accents
 */

import { Template } from '@/types/template';

export const boldRedTemplate: Template = {
  id: 'bold-red',
  name: 'Bold Red',
  description: 'Energetic and attention-grabbing design with bold red accents. Perfect for dynamic agents who want to make a strong impression.',
  category: 'Bold',
  previewImage: '/images/templates/bold-red-preview.jpg',
  
  colors: {
    primary: '#DC2626', // red-600
    primaryHover: '#B91C1C', // red-700
    primaryLight: '#FEE2E2', // red-100
    secondary: '#1F2937', // gray-800
    secondaryHover: '#111827', // gray-900
    secondaryLight: '#F3F4F6', // gray-100
    textPrimary: '#111827', // gray-900
    textSecondary: '#374151', // gray-700
    textMuted: '#6B7280', // gray-500
    background: '#FFFFFF',
    backgroundSecondary: '#F9FAFB', // gray-50
    backgroundAccent: '#FEF2F2', // red-50
    border: '#E5E7EB', // gray-200
    borderLight: '#F3F4F6', // gray-100
    shadow: 'rgba(220, 38, 38, 0.1)', // red-600 with opacity
  },
  
  typography: {
    headingFont: '"Inter", system-ui, -apple-system, sans-serif',
    bodyFont: '"Inter", system-ui, -apple-system, sans-serif',
    headingWeight: 800,
    bodyWeight: 400,
    buttonWeight: 700,
    headingSizes: {
      h1: '3.5rem', // 56px
      h2: '2.5rem', // 40px
      h3: '2rem', // 32px
      h4: '1.5rem', // 24px
    },
    headingLineHeight: '1.1',
    bodyLineHeight: '1.6',
    headingLetterSpacing: '-0.03em',
    bodyLetterSpacing: '0',
  },
  
  layout: {
    maxWidth: '1280px',
    padding: {
      section: '4rem 1rem',
      container: '0 1rem',
    },
    sectionSpacing: '4rem',
    elementSpacing: '1.5rem',
    borderRadius: {
      small: '0.5rem', // 8px
      medium: '0.75rem', // 12px
      large: '1rem', // 16px
    },
    shadows: {
      small: '0 2px 4px 0 rgba(220, 38, 38, 0.06)',
      medium: '0 4px 8px 0 rgba(220, 38, 38, 0.1)',
      large: '0 8px 16px 0 rgba(220, 38, 38, 0.15)',
    },
  },
  
  components: {
    hero: {
      layout: 'fullwidth',
      showImage: true,
      imagePosition: 'background',
      titleSize: 'xl',
      showSubtitle: true,
    },
    header: {
      style: 'bold',
      showLogo: true,
      navigation: 'advanced',
    },
    about: {
      layout: 'card-based',
      showStats: true,
      imageStyle: 'rounded',
    },
    properties: {
      layout: 'grid',
      cardsPerRow: 3,
      cardStyle: 'modern',
      showFilters: true,
    },
    testimonials: {
      layout: 'slider',
      showImages: true,
      cardStyle: 'quote',
    },
    contact: {
      layout: 'card-based',
      showMap: true,
      formStyle: 'detailed',
    },
    faq: {
      style: 'card',
      showSearch: true,
    },
    footer: {
      style: 'detailed',
      showSocial: true,
      showCopyright: true,
    },
  },
  
  customCSS: `
    .template-bold-red {
      font-family: var(--template-body-font);
    }
    
    .template-bold-red .hero-section {
      background: linear-gradient(135deg, var(--template-primary) 0%, var(--template-secondary) 100%);
      color: white;
      position: relative;
      overflow: hidden;
    }
    
    .template-bold-red .hero-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);
      z-index: 1;
    }
    
    .template-bold-red .hero-content {
      position: relative;
      z-index: 2;
    }
    
    .template-bold-red .hero-title {
      font-size: var(--template-h1-size);
      font-weight: var(--template-heading-weight);
      letter-spacing: var(--template-heading-letter-spacing);
      line-height: var(--template-heading-line-height);
      color: white;
      margin-bottom: 1.5rem;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }
    
    .template-bold-red .hero-subtitle {
      font-size: 1.5rem;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 2rem;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }
    
    .template-bold-red .section-header {
      text-align: center;
      margin-bottom: 3rem;
      position: relative;
    }
    
    .template-bold-red .section-header h2 {
      color: var(--template-text-primary);
      font-size: var(--template-h2-size);
      font-weight: var(--template-heading-weight);
      margin-bottom: 1rem;
      position: relative;
    }
    
    .template-bold-red .section-header h2::after {
      content: '';
      position: absolute;
      bottom: -0.5rem;
      left: 50%;
      transform: translateX(-50%);
      width: 4rem;
      height: 3px;
      background: var(--template-primary);
      border-radius: 2px;
    }
    
    .template-bold-red .btn-primary {
      background: linear-gradient(135deg, var(--template-primary) 0%, var(--template-primary-hover) 100%);
      color: white;
      font-weight: var(--template-button-weight);
      padding: 1rem 2.5rem;
      border-radius: var(--template-border-radius-md);
      border: none;
      font-size: 1.125rem;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      box-shadow: var(--template-shadow-medium);
    }
    
    .template-bold-red .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: var(--template-shadow-large);
    }
    
    .template-bold-red .btn-secondary {
      background-color: transparent;
      color: var(--template-primary);
      font-weight: var(--template-button-weight);
      padding: 1rem 2.5rem;
      border: 2px solid var(--template-primary);
      border-radius: var(--template-border-radius-md);
      font-size: 1.125rem;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .template-bold-red .btn-secondary:hover {
      background-color: var(--template-primary);
      color: white;
      transform: translateY(-2px);
      box-shadow: var(--template-shadow-medium);
    }
    
    .template-bold-red .card {
      background: var(--template-background);
      border: 1px solid var(--template-border);
      border-radius: var(--template-border-radius-lg);
      box-shadow: var(--template-shadow-small);
      transition: all 0.3s ease;
      overflow: hidden;
    }
    
    .template-bold-red .card:hover {
      box-shadow: var(--template-shadow-large);
      transform: translateY(-4px);
    }
    
    .template-bold-red .card-header {
      background: var(--template-background-accent);
      padding: 1.5rem;
      border-bottom: 1px solid var(--template-border);
    }
    
    .template-bold-red .accent-text {
      color: var(--template-primary);
      font-weight: 600;
    }
    
    .template-bold-red .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
      margin: 3rem 0;
    }
    
    .template-bold-red .stat-card {
      text-align: center;
      padding: 2rem;
      background: var(--template-background-accent);
      border-radius: var(--template-border-radius-lg);
      border: 2px solid var(--template-primary-light);
    }
    
    .template-bold-red .stat-number {
      font-size: 3rem;
      font-weight: var(--template-heading-weight);
      color: var(--template-primary);
      display: block;
    }
    
    .template-bold-red .stat-label {
      color: var(--template-text-muted);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-size: 0.875rem;
    }
  `,
  
  isActive: true,
  isDefault: false,
  version: '1.0.0',
  createdAt: new Date(),
  updatedAt: new Date(),
};