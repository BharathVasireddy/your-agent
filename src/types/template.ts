/**
 * Template System Types
 * Defines the structure and configuration for agent profile templates
 */

export interface TemplateColors {
  // Primary brand colors
  primary: string;
  primaryHover: string;
  primaryLight: string;
  
  // Secondary colors
  secondary: string;
  secondaryHover: string;
  secondaryLight: string;
  
  // Text colors
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  
  // Background colors
  background: string;
  backgroundSecondary: string;
  backgroundAccent: string;
  
  // Border and utility colors
  border: string;
  borderLight: string;
  shadow: string;
}

export interface TemplateTypography {
  // Font families
  headingFont: string;
  bodyFont: string;
  
  // Font weights
  headingWeight: number;
  bodyWeight: number;
  buttonWeight: number;
  
  // Font sizes (in rem)
  headingSizes: {
    h1: string;
    h2: string;
    h3: string;
    h4: string;
  };
  
  // Line heights
  headingLineHeight: string;
  bodyLineHeight: string;
  
  // Letter spacing
  headingLetterSpacing: string;
  bodyLetterSpacing: string;
}

export interface TemplateLayout {
  // Container and spacing
  maxWidth: string;
  padding: {
    section: string;
    container: string;
  };
  
  // Section spacing
  sectionSpacing: string;
  elementSpacing: string;
  
  // Border radius
  borderRadius: {
    small: string;
    medium: string;
    large: string;
  };
  
  // Shadow styles
  shadows: {
    small: string;
    medium: string;
    large: string;
  };
}

export interface TemplateComponents {
  // Hero section configuration
  hero: {
    layout: 'centered' | 'split' | 'fullwidth' | 'minimal';
    showImage: boolean;
    imagePosition: 'left' | 'right' | 'background';
    titleSize: 'small' | 'medium' | 'large' | 'xl';
    showSubtitle: boolean;
  };
  
  // Header configuration
  header: {
    style: 'minimal' | 'standard' | 'bold';
    showLogo: boolean;
    navigation: 'none' | 'simple' | 'advanced';
  };
  
  // About section configuration
  about: {
    layout: 'single-column' | 'two-column' | 'card-based';
    showStats: boolean;
    imageStyle: 'square' | 'rounded' | 'circle';
  };
  
  // Properties section configuration
  properties: {
    layout: 'grid' | 'list' | 'carousel' | 'masonry';
    cardsPerRow: number;
    cardStyle: 'minimal' | 'detailed' | 'modern';
    showFilters: boolean;
  };
  
  // Testimonials configuration
  testimonials: {
    layout: 'slider' | 'grid' | 'list';
    showImages: boolean;
    cardStyle: 'quote' | 'card' | 'minimal';
  };
  
  // Contact section configuration
  contact: {
    layout: 'form-only' | 'split' | 'card-based';
    showMap: boolean;
    formStyle: 'minimal' | 'detailed';
  };
  
  // FAQ configuration
  faq: {
    style: 'accordion' | 'card' | 'simple';
    showSearch: boolean;
  };
  
  // Footer configuration
  footer: {
    style: 'minimal' | 'detailed';
    showSocial: boolean;
    showCopyright: boolean;
  };
}

export interface Template {
  // Template metadata
  id: string;
  name: string;
  description: string;
  category?: string;
  previewImage?: string;
  
  // Template configuration
  colors: TemplateColors;
  typography: TemplateTypography;
  layout: TemplateLayout;
  components: TemplateComponents;
  
  // Additional styling
  customCSS?: string;
  
  // Template status
  isActive: boolean;
  isDefault: boolean;
  
  // Version and metadata
  version: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplatePreview {
  id: string;
  name: string;
  description: string;
  previewImage: string;
  category?: string;
  isDefault: boolean;
}

export interface TemplateContext {
  template: Template;
  agent: AgentData;
  isEditMode: boolean;
  isOwner: boolean;
}

// Agent data type (from existing system)
export interface AgentData {
  id: string;
  slug: string;
  userId: string;
  experience: number | null;
  bio: string | null;
  phone: string | null;
  city: string | null;
  area: string | null;
  template: string; // This will replace the 'theme' field
  isSubscribed: boolean;
  subscriptionEndsAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  profilePhotoUrl: string | null;
  logoUrl: string | null;
  heroImage: string | null;
  heroTitle: string | null;
  heroSubtitle: string | null;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  properties: PropertyData[];
  testimonials: TestimonialData[];
  faqs: FAQData[];
}

export interface PropertyData {
  id: string;
  title: string;
  description: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  location: string;
  amenities: string[];
  photos: string[];
  status: string;
  listingType: string;
  propertyType: string;
  slug: string | null;
  brochureUrl: string | null;
}

export interface TestimonialData {
  id: string;
  name: string;
  text: string;
  rating: number;
  createdAt: Date;
}

export interface FAQData {
  id: string;
  question: string;
  answer: string;
}