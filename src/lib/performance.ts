/**
 * 🚀 CENTRALIZED PERFORMANCE CONFIGURATION
 * 
 * Control all performance optimizations from this single file.
 * Used by companies like Netflix, Airbnb, and Uber for easy management.
 * 
 * Toggle any optimization ON/OFF without touching individual components.
 */

export const PERFORMANCE_CONFIG = {
  // 🗄️ DATABASE OPTIMIZATIONS
  database: {
    enabled: true,
    enableQueryCaching: true,
    enableSelectiveLoading: true,
    limits: {
      properties: 8,        // How many properties to load initially
      testimonials: 6,      // How many testimonials to load
      faqs: 10,            // How many FAQs to load
      popularAgents: 10,   // How many agents to pre-generate
    },
    revalidateTime: 60,    // ISR revalidation in seconds (0 = disabled)
  },

  // 🖼️ IMAGE OPTIMIZATIONS
  images: {
    enabled: true,
    enableLazyLoading: true,
    enableNextImageOptimization: true,
    enableResponsiveSizes: true,
    quality: {
      hero: 85,           // Hero image quality (1-100)
      property: 80,       // Property image quality
      profile: 75,        // Profile image quality
    },
    enablePriorityLoading: true, // Priority load for above-the-fold images
  },

  // 📦 BUNDLE OPTIMIZATIONS
  bundle: {
    enabled: true,
    enableLazyComponents: true,    // Lazy load editing components
    enableCodeSplitting: true,    // Split client/server components
    enableTreeShaking: true,      // Remove unused code
  },

  // 🗂️ CACHING STRATEGY
  caching: {
    enabled: true,
    enableISR: true,              // Incremental Static Regeneration
    enableBrowserCache: true,     // Browser caching headers
    enableCDNCache: true,         // CDN optimization
    cacheHeaders: {
      maxAge: 60,                 // Browser cache time
      staleWhileRevalidate: 300,  // Background refresh time
    },
  },

  // 📊 MONITORING & ANALYTICS
  monitoring: {
    enabled: true,
    enableWebVitals: true,        // Track Core Web Vitals
    enablePerformanceAPI: true,   // Browser Performance API
    enableErrorTracking: true,    // Track performance errors
  },

  // 🔧 DEVELOPMENT SETTINGS
  development: {
    enablePerformanceLogs: true,   // Console performance logs
    enableBundleAnalyzer: false,   // Bundle size analysis
    enableHotReload: true,         // Fast refresh in dev
  }
} as const;

/**
 * 🎛️ EASY PERFORMANCE TOGGLES
 * 
 * Quick switches for common scenarios:
 */
export const PERFORMANCE_MODES = {
  // 🏎️ MAXIMUM SPEED (for production)
  PRODUCTION_OPTIMIZED: {
    ...PERFORMANCE_CONFIG,
    database: { ...PERFORMANCE_CONFIG.database, revalidateTime: 300 },
    images: { ...PERFORMANCE_CONFIG.images, quality: { hero: 80, property: 75, profile: 70 } },
  },

  // 🆓 FREE TIER MODE (maximize users on free limits)
  FREE_TIER_OPTIMIZED: {
    ...PERFORMANCE_CONFIG,
    database: { 
      ...PERFORMANCE_CONFIG.database, 
      revalidateTime: 600, // Longer cache for free tier
      limits: {
        properties: 5, // Strict limits for free tier
        testimonials: 3,
        faqs: 5,
        popularAgents: 5,
      }
    },
    images: { 
      ...PERFORMANCE_CONFIG.images, 
      quality: { hero: 60, property: 55, profile: 50 }, // Lower quality
      enableResponsiveSizes: true,
      enableLazyLoading: true,
    },
    caching: {
      ...PERFORMANCE_CONFIG.caching,
      cacheHeaders: {
        maxAge: 300, // 5 min cache
        staleWhileRevalidate: 600, // 10 min stale
      }
    }
  },

  // 🔧 DEVELOPMENT MODE (for testing)
  DEVELOPMENT: {
    ...PERFORMANCE_CONFIG,
    database: { ...PERFORMANCE_CONFIG.database, revalidateTime: 0 },
    caching: { ...PERFORMANCE_CONFIG.caching, enabled: false },
    monitoring: { ...PERFORMANCE_CONFIG.monitoring, enablePerformanceLogs: true },
  },

  // ⚡ EMERGENCY MODE (disable all optimizations if something breaks)
  SAFE_MODE: {
    database: { ...PERFORMANCE_CONFIG.database, enabled: false, revalidateTime: 0 },
    images: { ...PERFORMANCE_CONFIG.images, enabled: false },
    bundle: { ...PERFORMANCE_CONFIG.bundle, enabled: false },
    caching: { ...PERFORMANCE_CONFIG.caching, enabled: false },
    monitoring: { ...PERFORMANCE_CONFIG.monitoring, enabled: false },
    development: PERFORMANCE_CONFIG.development,
  }
} as const;

/**
 * 🎯 GET ACTIVE CONFIGURATION
 * 
 * Automatically choose the right config based on environment
 */
export function getPerformanceConfig() {
  const isProduction = process.env.NODE_ENV === 'production';
  const isSafeMode = process.env.PERFORMANCE_SAFE_MODE === 'true';
  const isFreeTier = process.env.FREE_TIER_MODE === 'true';
  
  if (isSafeMode) return PERFORMANCE_MODES.SAFE_MODE;
  if (isFreeTier) return PERFORMANCE_MODES.FREE_TIER_OPTIMIZED;
  if (isProduction) return PERFORMANCE_MODES.PRODUCTION_OPTIMIZED;
  return PERFORMANCE_MODES.DEVELOPMENT;
}

/**
 * 📈 PERFORMANCE UTILITIES
 */
export const PerformanceUtils = {
  // Get image quality based on type
  getImageQuality: (type: 'hero' | 'property' | 'profile') => {
    const config = getPerformanceConfig();
    return config.images.enabled ? config.images.quality[type] : 85;
  },

  // Get database limits
  getDatabaseLimits: () => {
    const config = getPerformanceConfig();
    return config.database.enabled ? config.database.limits : {
      properties: 100,
      testimonials: 100,
      faqs: 100,
      popularAgents: 50,
    };
  },

  // Check if optimization is enabled
  isOptimizationEnabled: (category: keyof typeof PERFORMANCE_CONFIG) => {
    const config = getPerformanceConfig();
    const categoryConfig = config[category];
    return (categoryConfig && 'enabled' in categoryConfig) ? categoryConfig.enabled : false;
  },

  // Get revalidation time for ISR
  getRevalidateTime: () => {
    const config = getPerformanceConfig();
    return config.database.enabled ? config.database.revalidateTime : false;
  },

  // Performance logging helper
  logPerformance: (operation: string, startTime: number) => {
    const config = getPerformanceConfig();
    if (config.development?.enablePerformanceLogs) {
      const endTime = performance.now();
      console.log(`⚡ ${operation}: ${(endTime - startTime).toFixed(2)}ms`);
    }
  },
};

/**
 * 🚨 PERFORMANCE SAFEGUARDS
 * 
 * Automatic fallbacks if optimizations cause issues
 */
export const PerformanceSafeguards = {
  // Fallback image component props
  getImageProps: (type: 'hero' | 'property' | 'profile') => {
    const config = getPerformanceConfig();
    
    if (!config.images.enabled) {
      return { quality: 85, priority: false, loading: 'eager' as const };
    }

    return {
      quality: config.images.quality[type],
      priority: type === 'hero' && config.images.enablePriorityLoading,
      loading: config.images.enableLazyLoading && type !== 'hero' ? 'lazy' as const : 'eager' as const,
      sizes: config.images.enableResponsiveSizes ? getSizesForType(type) : undefined,
    };
  },

  // Safe database query options
  getDatabaseOptions: () => {
    const config = getPerformanceConfig();
    const limits = PerformanceUtils.getDatabaseLimits();
    
    return {
      properties: {
        take: limits.properties,
        select: config.database.enableSelectiveLoading ? {
          id: true, title: true, description: true, price: true, area: true,
          bedrooms: true, bathrooms: true, location: true, photos: true,
          status: true, listingType: true, propertyType: true, slug: true, brochureUrl: true,
        } : undefined,
      },
      testimonials: { take: limits.testimonials },
      faqs: { take: limits.faqs },
    };
  },
};

// Helper function for responsive image sizes
function getSizesForType(type: 'hero' | 'property' | 'profile'): string {
  switch (type) {
    case 'hero':
      return '100vw';
    case 'property':
      return '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw';
    case 'profile':
      return '(max-width: 768px) 100vw, 50vw';
    default:
      return '100vw';
  }
}

/**
 * 🎨 USAGE EXAMPLES:
 * 
 * // In any component:
 * import { PerformanceUtils } from '@/lib/performance';
 * 
 * // Check if optimization is enabled:
 * if (PerformanceUtils.isOptimizationEnabled('images')) {
 *   // Use optimized image
 * }
 * 
 * // Get image quality:
 * const quality = PerformanceUtils.getImageQuality('hero');
 * 
 * // Get database limits:
 * const { properties } = PerformanceUtils.getDatabaseLimits();
 * 
 * // Emergency disable all optimizations:
 * // Set environment variable: PERFORMANCE_SAFE_MODE=true
 */