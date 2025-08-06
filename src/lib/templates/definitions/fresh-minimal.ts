/**
 * Fresh Minimal Template Definition
 * Light, minimalist, airy design with green accent color
 */

import { Template } from '@/types/template';

export const freshMinimalTemplate: Template = {
  id: 'fresh-minimal',
  name: 'Fresh Minimal',
  description: 'Clean, modern design with light colors and minimal aesthetic. Perfect for agents who prefer a fresh, airy feel.',
  category: 'minimal',
  isDefault: false,
  previewImage: '/images/templates/fresh-minimal-preview.jpg',

  // Color scheme - Light and airy with green accents
  colors: {
    primary: '#16a34a', // Green-600
    primaryHover: '#15803d', // Green-700
    primaryLight: '#f0fdf4', // Green-50
    secondary: '#9ca3af', // Gray-400
    secondaryHover: '#6b7280', // Gray-500
    secondaryLight: '#f9fafb', // Gray-50
    textPrimary: '#111827', // Gray-900
    textSecondary: '#374151', // Gray-700
    textMuted: '#6b7280', // Gray-500
    background: '#ffffff', // White
    backgroundSecondary: '#f9fafb', // Gray-50
    backgroundAccent: '#f3f4f6', // Gray-100
    border: '#e5e7eb', // Gray-200
    borderLight: '#f3f4f6', // Gray-100
    shadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  },

  // Typography - Poppins for modern, minimal feel
  typography: {
    headingFont: "'Poppins', sans-serif",
    bodyFont: "'Poppins', sans-serif",
    headingWeight: 700,
    bodyWeight: 400,
    buttonWeight: 600,
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

  // Layout - More compact for minimal feel
  layout: {
    maxWidth: '1280px',
    padding: {
      section: '4rem', // Less padding for airy feel
      container: '1rem',
    },
    sectionSpacing: '6rem',
    elementSpacing: '1.5rem',
    borderRadius: {
      small: '0.25rem', // Sharp corners for minimal look
      medium: '0.25rem',
      large: '0.25rem',
    },
    shadows: {
      small: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      medium: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      large: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    },
  },

  // Component configuration for fresh minimal template
  components: {
    hero: {
      layout: 'split',
      showImage: true,
      imagePosition: 'right',
      titleSize: 'xl',
      showSubtitle: true,
    },
    header: {
      style: 'minimal',
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
      cardStyle: 'minimal',
      showFilters: false,
    },
    testimonials: {
      layout: 'grid',
      showImages: false,
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
      showSocial: false,
      showCopyright: true,
    },
  },

  // Custom CSS for template-specific styles
  customCSS: `
    .template-fresh-minimal {
      font-feature-settings: 'kern' 1, 'liga' 1;
    }
    
    .template-fresh-minimal h1,
    .template-fresh-minimal h2,
    .template-fresh-minimal h3,
    .template-fresh-minimal h4 {
      font-weight: 700;
      letter-spacing: -0.025em;
    }
    
    .template-fresh-minimal .btn-primary {
      transition: all 0.2s ease-in-out;
    }
    
    .template-fresh-minimal .btn-primary:hover {
      transform: translateY(-1px);
    }
  `,
  
  isActive: true,
  version: '1.0.0',
  createdAt: new Date(),
  updatedAt: new Date(),
};