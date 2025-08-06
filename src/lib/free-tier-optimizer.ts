/**
 * 🆓 FREE TIER OPTIMIZER
 * 
 * Maximize users on Vercel + Neon free tiers without performance issues
 * Based on current 2024 limits and real-world optimization techniques
 */

import { getPerformanceConfig } from './performance';

/**
 * 📊 FREE TIER LIMITS (2024)
 */
export const FREE_TIER_LIMITS = {
  vercel: {
    // Hobby Plan Limits (Personal use only)
    bandwidth: 100, // GB/month - Fast Data Transfer
    functions: {
      executions: 100, // GB-Hours/month
      invocations: 1_000_000, // requests/month (included)
    },
    builds: 100, // hours/month
    deployments: 'unlimited',
    domains: 'unlimited',
    edgeRequests: 1_000_000, // requests/month
    // Commercial use: NOT ALLOWED
  },
  neon: {
    // Free Plan (Much improved since Vercel Postgres transition)
    projects: 10, // databases
    storage: 0.5, // GB total (data + history)
    compute: 191.9, // hours/month (enough for 24/7 0.25 vCPU)
    branches: 10, // per project
    databases: 500, // per branch
    dataTransfer: 5, // GB/month
    // Point-in-time recovery: 24 hours
    // Auto-suspend after 5 min inactivity
  }
} as const;

/**
 * 🎯 OPTIMIZED LIMITS FOR AGENT PLATFORM
 */
export const OPTIMIZED_USAGE = {
  // Per active user (agent with profile)
  perUser: {
    storage: 50, // MB (profile + 5-10 properties + photos)
    compute: 2, // hours/month (with smart caching)
    bandwidth: 500, // MB/month (optimized images + caching)
  },
  
  // Platform overhead
  platform: {
    storage: 100, // MB (users table, sessions, etc.)
    compute: 10, // hours/month (auth, admin, background tasks)
    bandwidth: 2000, // MB/month (assets, auth, API)
  }
} as const;

/**
 * 📈 USER CAPACITY CALCULATOR
 */
export class FreeTierCapacityCalculator {
  static calculateMaxUsers(): {
    storage: number;
    compute: number;
    bandwidth: number;
    bottleneck: string;
    maxUsers: number;
  } {
    const limits = FREE_TIER_LIMITS;
    const usage = OPTIMIZED_USAGE;
    
    // Available resources after platform overhead
    const availableStorage = (limits.neon.storage * 1024) - usage.platform.storage; // MB
    const availableCompute = limits.neon.compute - usage.platform.compute; // hours
    const availableBandwidth = (limits.vercel.bandwidth * 1024) - usage.platform.bandwidth; // MB
    
    // Max users based on each constraint
    const maxByStorage = Math.floor(availableStorage / usage.perUser.storage);
    const maxByCompute = Math.floor(availableCompute / usage.perUser.compute);
    const maxByBandwidth = Math.floor(availableBandwidth / usage.perUser.bandwidth);
    
    // Find the bottleneck
    const constraints = {
      storage: maxByStorage,
      compute: maxByCompute,
      bandwidth: maxByBandwidth,
    };
    
    const bottleneck = Object.entries(constraints).reduce((min, [key, value]) => 
      value < constraints[min as keyof typeof constraints] ? key : min, 'storage');
    
    const maxUsers = Math.min(maxByStorage, maxByCompute, maxByBandwidth);
    
    return {
      storage: maxByStorage,
      compute: maxByCompute,
      bandwidth: maxByBandwidth,
      bottleneck,
      maxUsers,
    };
  }
  
  static getUsageBreakdown(userCount: number) {
    const usage = OPTIMIZED_USAGE;
    const limits = FREE_TIER_LIMITS;
    
    const totalStorage = usage.platform.storage + (userCount * usage.perUser.storage);
    const totalCompute = usage.platform.compute + (userCount * usage.perUser.compute);
    const totalBandwidth = usage.platform.bandwidth + (userCount * usage.perUser.bandwidth);
    
    return {
      storage: {
        used: totalStorage,
        limit: limits.neon.storage * 1024,
        percentage: (totalStorage / (limits.neon.storage * 1024)) * 100,
        unit: 'MB'
      },
      compute: {
        used: totalCompute,
        limit: limits.neon.compute,
        percentage: (totalCompute / limits.neon.compute) * 100,
        unit: 'hours/month'
      },
      bandwidth: {
        used: totalBandwidth,
        limit: limits.vercel.bandwidth * 1024,
        percentage: (totalBandwidth / (limits.vercel.bandwidth * 1024)) * 100,
        unit: 'MB/month'
      }
    };
  }
}

/**
 * 🔧 FREE TIER OPTIMIZATIONS
 */
export const FREE_TIER_OPTIMIZATIONS = {
  database: {
    // Ultra-aggressive caching for free tier
    enableQueryCaching: true,
    cacheTimeout: 300, // 5 minutes
    
    // Minimal data loading
    limits: {
      properties: 5, // Only show 5 properties on free profiles
      testimonials: 3,
      faqs: 5,
    },
    
    // Auto-suspend settings
    suspendAfter: 300, // 5 minutes (Neon default)
    enableScaleToZero: true,
    
    // Optimize storage
    cleanupSettings: {
      deleteOldSessions: 30, // days
      compressImages: true,
      maxImageSize: 500, // KB
    }
  },
  
  images: {
    // Aggressive image optimization for free tier
    quality: 60, // Lower quality for free tier
    enableWebP: true,
    enableAVIF: true,
    maxWidth: 800, // Smaller images
    lazy: true,
    placeholder: 'blur',
  },
  
  caching: {
    // Maximum caching for free tier
    staticAssets: 31536000, // 1 year
    pages: 3600, // 1 hour
    api: 300, // 5 minutes
    images: 2592000, // 30 days
  },
  
  features: {
    // Limit features for free tier
    maxProperties: 5,
    maxPhotosPerProperty: 3,
    maxTestimonials: 3,
    maxFAQs: 5,
    enableAnalytics: false, // Disable analytics to save function calls
    enableRealTimeUpdates: false, // Disable websockets
  }
} as const;

/**
 * 💡 SCALING STRATEGIES
 */
export const SCALING_STRATEGIES = {
  // When approaching 70% of limits
  earlyWarning: {
    threshold: 0.7,
    actions: [
      'Send upgrade notification to users',
      'Reduce image quality slightly',
      'Increase cache times',
      'Optimize database queries',
    ]
  },
  
  // When approaching 90% of limits
  urgentOptimization: {
    threshold: 0.9,
    actions: [
      'Enable emergency performance mode',
      'Pause new user registrations',
      'Compress existing images',
      'Clean up old data',
      'Show upgrade prompts',
    ]
  },
  
  // Upgrade paths
  upgradePaths: {
    vercel: {
      nextTier: 'Pro Plan',
      cost: '$20/month',
      benefits: [
        '10x more bandwidth (1TB)',
        '10x more function execution',
        'Commercial use allowed',
        'Team collaboration',
        'Priority support'
      ]
    },
    neon: {
      nextTier: 'Launch Plan',
      cost: '$19/month',
      benefits: [
        '20x more storage (10GB)',
        '1.5x more compute (300 hours)',
        'More projects (100)',
        '7-day point-in-time recovery',
        'Standard support'
      ]
    }
  }
} as const;

/**
 * 🚨 EMERGENCY PERFORMANCE MODE
 */
export class EmergencyPerformanceMode {
  static enable() {
    return {
      images: {
        quality: 40, // Very low quality
        disableLazyLoading: false,
        enablePlaceholders: true,
      },
      database: {
        limits: {
          properties: 3, // Show only 3 properties
          testimonials: 2,
          faqs: 3,
        },
        enableAggressiveCaching: true,
        cacheTimeout: 900, // 15 minutes
      },
      features: {
        disableNonEssentialFeatures: true,
        showUpgradePrompts: true,
        enableMaintenanceMode: false, // Keep running but degraded
      }
    };
  }
  
  static getPerformanceReport() {
    const config = getPerformanceConfig();
    const capacity = FreeTierCapacityCalculator.calculateMaxUsers();
    
    return {
      maxUsers: capacity.maxUsers,
      bottleneck: capacity.bottleneck,
      optimizationsEnabled: config.database.enabled,
      emergencyMode: false, // Would be determined by current usage
      recommendations: [
        capacity.bottleneck === 'storage' ? 'Optimize image compression' : null,
        capacity.bottleneck === 'compute' ? 'Enable more aggressive caching' : null,
        capacity.bottleneck === 'bandwidth' ? 'Reduce image sizes' : null,
      ].filter(Boolean)
    };
  }
}

/**
 * 📊 USAGE EXAMPLES:
 * 
 * // Check current capacity
 * const capacity = FreeTierCapacityCalculator.calculateMaxUsers();
 * console.log(`Max users: ${capacity.maxUsers} (limited by ${capacity.bottleneck})`);
 * 
 * // Get usage for 50 users
 * const usage = FreeTierCapacityCalculator.getUsageBreakdown(50);
 * console.log(`Storage: ${usage.storage.percentage}% used`);
 * 
 * // Enable emergency mode
 * const emergencyConfig = EmergencyPerformanceMode.enable();
 * 
 * // Get performance report
 * const report = EmergencyPerformanceMode.getPerformanceReport();
 */