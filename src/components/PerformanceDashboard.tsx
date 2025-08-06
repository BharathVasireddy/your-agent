'use client';

import { useState, useEffect } from 'react';
import { getPerformanceConfig } from '@/lib/performance';

interface PerformanceData {
  loadTime: number;
  domContentLoaded: number;
  firstPaint: number;
  firstContentfulPaint: number;
  mode?: string;
  cacheStatus?: string;
  imageOptimization?: boolean;
}

/**
 * 📊 PERFORMANCE DASHBOARD
 * 
 * Monitor and control performance optimizations in real-time
 * Only visible in development mode
 */
export default function PerformanceDashboard() {
  const [isVisible, setIsVisible] = useState(false);
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const config = getPerformanceConfig();

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV === 'development') {
      setIsVisible(true);
      
      // Collect performance data
      if (typeof window !== 'undefined' && 'performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        setPerformanceData({
          loadTime: Math.round(navigation.loadEventEnd - navigation.fetchStart),
          domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart),
          firstPaint: Math.round(performance.getEntriesByName('first-paint')[0]?.startTime || 0),
          firstContentfulPaint: Math.round(performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0),
        });
      }
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs font-mono z-50 max-w-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-green-400">⚡ Performance</h3>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-red-400 hover:text-red-300"
        >
          ✕
        </button>
      </div>
      
      {/* Performance Metrics */}
      {performanceData && (
        <div className="space-y-1 mb-3 text-xs">
          <div className="flex justify-between">
            <span>Load Time:</span>
            <span className={performanceData.loadTime < 1000 ? 'text-green-400' : 'text-yellow-400'}>
              {performanceData.loadTime}ms
            </span>
          </div>
          <div className="flex justify-between">
            <span>FCP:</span>
            <span className={performanceData.firstContentfulPaint < 800 ? 'text-green-400' : 'text-yellow-400'}>
              {performanceData.firstContentfulPaint}ms
            </span>
          </div>
          <div className="flex justify-between">
            <span>DOM Ready:</span>
            <span className={performanceData.domContentLoaded < 500 ? 'text-green-400' : 'text-yellow-400'}>
              {performanceData.domContentLoaded}ms
            </span>
          </div>
        </div>
      )}

      {/* Optimization Status */}
      <div className="space-y-1 text-xs">
        <div className="text-blue-400 font-semibold">Optimizations:</div>
        <div className="flex justify-between">
          <span>Database:</span>
          <span className={config.database.enabled ? 'text-green-400' : 'text-red-400'}>
            {config.database.enabled ? '✓' : '✗'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Images:</span>
          <span className={config.images.enabled ? 'text-green-400' : 'text-red-400'}>
            {config.images.enabled ? '✓' : '✗'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Caching:</span>
          <span className={config.caching.enabled ? 'text-green-400' : 'text-red-400'}>
            {config.caching.enabled ? '✓' : '✗'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Bundle:</span>
          <span className={config.bundle.enabled ? 'text-green-400' : 'text-red-400'}>
            {config.bundle.enabled ? '✓' : '✗'}
          </span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-3 pt-2 border-t border-gray-600">
        <div className="text-blue-400 font-semibold mb-1">Config:</div>
        <div className="text-xs">
          <div>ISR: {config.database.revalidateTime}s</div>
          <div>Props: {config.database.limits.properties}</div>
          <div>Img Quality: {config.images.quality.hero}%</div>
        </div>
      </div>

      {/* Emergency Mode */}
      <div className="mt-2 pt-2 border-t border-gray-600">
        <button 
          onClick={() => {
            localStorage.setItem('performance_safe_mode', 'true');
            window.location.reload();
          }}
          className="w-full bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
        >
          🚨 Emergency Safe Mode
        </button>
      </div>
    </div>
  );
}

// Keyboard shortcut to toggle dashboard
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'P') {
      const dashboard = document.querySelector('[data-performance-dashboard]');
      if (dashboard) {
        (dashboard as HTMLElement).style.display = 
          (dashboard as HTMLElement).style.display === 'none' ? 'block' : 'none';
      }
    }
  });
}