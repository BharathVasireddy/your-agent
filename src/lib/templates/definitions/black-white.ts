/**
 * Black & White Template
 * Clean monochrome design with full-width header and rounded buttons
 */

import { Template } from '@/types/template';

export const blackWhiteTemplate: Template = {
  id: 'black-white',
  name: 'Black & White',
  description: 'Clean monochrome design with full-width header and completely rounded buttons. Perfect for agents who prefer a stark, professional aesthetic.',
  category: 'Minimal',
  previewImage: '/images/templates/black-white-preview.jpg',
  isDefault: false,
  
  colors: {
    primary: '#000000', // Pure black
    primaryHover: '#1F2937', // gray-800
    primaryLight: '#F3F4F6', // gray-100
    secondary: '#FFFFFF', // Pure white
    secondaryHover: '#F9FAFB', // gray-50
    secondaryLight: '#F3F4F6', // gray-100
    textPrimary: '#000000', // Pure black
    textSecondary: '#374151', // gray-700
    textMuted: '#6B7280', // gray-500
    background: '#FFFFFF', // Pure white
    backgroundSecondary: '#F9FAFB', // gray-50
    backgroundAccent: '#F3F4F6', // gray-100
    border: '#E5E7EB', // gray-200
    borderLight: '#F3F4F6', // gray-100
    shadow: 'rgba(0, 0, 0, 0.1)', // Pure black with opacity
  },
  
  typography: {
    headingFont: '"Inter", system-ui, -apple-system, sans-serif',
    bodyFont: '"Inter", system-ui, -apple-system, sans-serif',
    headingWeight: 700, // Bold
    bodyWeight: 400, // Normal
    buttonWeight: 600, // Semi-bold
    headingSizes: {
      h1: '3rem', // 48px
      h2: '2.25rem', // 36px
      h3: '1.875rem', // 30px
      h4: '1.5rem', // 24px
    },
    headingLineHeight: '1.2',
    bodyLineHeight: '1.6',
    headingLetterSpacing: '-0.025em',
    bodyLetterSpacing: '0',
  },
  
  layout: {
    maxWidth: '1400px', // Wider for full-width feel
    padding: {
      section: '4rem 1rem',
      container: '0 1rem',
    },
    sectionSpacing: '4rem',
    elementSpacing: '1.5rem',
    borderRadius: {
      small: '9999px', // Full rounded
      medium: '9999px', // Full rounded
      large: '9999px', // Full rounded
    },
    shadows: {
      small: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      large: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
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
      style: 'minimal',
      showLogo: true,
      navigation: 'advanced',
    },
    about: {
      layout: 'two-column',
      showStats: true,
      imageStyle: 'rounded',
    },
    properties: {
      layout: 'grid',
      cardsPerRow: 3,
      cardStyle: 'minimal',
      showFilters: true,
    },
    testimonials: {
      layout: 'grid',
      showImages: true,
      cardStyle: 'minimal',
    },
    contact: {
      layout: 'split',
      showMap: false,
      formStyle: 'minimal',
    },
    faq: {
      style: 'simple',
      showSearch: false,
    },
    footer: {
      style: 'minimal',
      showSocial: true,
      showCopyright: true,
    },
  },
  
  customCSS: `
    /* Black & White Template Specific Styles */
    .template-black-white {
      /* Header - Full width styling */
      header {
        background: #FFFFFF !important;
        border-bottom: 2px solid #000000;
        box-shadow: none;
      }
      
      .header-container {
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 2rem !important;
      }
      
      /* All buttons completely rounded */
      button, .btn, .button, a[role="button"] {
        border-radius: 9999px !important;
        font-weight: 600;
        letter-spacing: 0.025em;
        transition: all 0.2s ease;
      }
      
      /* Primary buttons - Black */
      .btn-primary, button[type="submit"], .primary-button {
        background-color: #000000 !important;
        color: #FFFFFF !important;
        border: 2px solid #000000 !important;
      }
      
      .btn-primary:hover, button[type="submit"]:hover, .primary-button:hover {
        background-color: #FFFFFF !important;
        color: #000000 !important;
        border: 2px solid #000000 !important;
      }
      
      /* Secondary buttons - White with black border */
      .btn-secondary, .secondary-button {
        background-color: #FFFFFF !important;
        color: #000000 !important;
        border: 2px solid #000000 !important;
      }
      
      .btn-secondary:hover, .secondary-button:hover {
        background-color: #000000 !important;
        color: #FFFFFF !important;
        border: 2px solid #000000 !important;
      }
      
      /* Hero section adjustments */
      .hero-content {
        z-index: 10;
        position: relative;
      }
      
      .hero-title {
        color: #FFFFFF !important;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        font-weight: 700;
        letter-spacing: -0.025em;
      }
      
      .hero-subtitle {
        color: #F9FAFB !important;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
      }
      
      /* Stats styling */
      .stats-container {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border: 2px solid #000000;
        border-radius: 9999px;
        padding: 2rem;
        margin-top: 2rem;
      }
      
      .stat-number {
        color: #000000 !important;
        font-weight: 700;
      }
      
      .stat-label {
        color: #374151 !important;
      }
      
      /* Navigation styling */
      .nav-link {
        color: #000000 !important;
        font-weight: 500;
        text-decoration: none;
        padding: 0.5rem 1rem;
        border-radius: 9999px;
        transition: all 0.2s ease;
      }
      
      .nav-link:hover {
        background-color: #F3F4F6;
        color: #000000 !important;
      }
      
      /* Card styling */
      .card, .property-card, .testimonial-card {
        border: 2px solid #E5E7EB;
        border-radius: 9999px;
        background: #FFFFFF;
        transition: all 0.2s ease;
      }
      
      .card:hover, .property-card:hover, .testimonial-card:hover {
        border-color: #000000;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      }
      
      /* Input styling */
      input, textarea, select {
        border: 2px solid #E5E7EB !important;
        border-radius: 9999px !important;
        background: #FFFFFF !important;
        color: #000000 !important;
        padding: 0.75rem 1.5rem !important;
      }
      
      input:focus, textarea:focus, select:focus {
        border-color: #000000 !important;
        box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1) !important;
        outline: none !important;
      }
      
      /* Remove default rounded corners from images in cards */
      .property-image, .agent-image {
        border-radius: 9999px !important;
      }
    }
  `,
  
  isActive: true,
  version: '1.0.0',
  createdAt: new Date(),
  updatedAt: new Date(),
};