'use client';

import { useState, useEffect, useCallback } from 'react';
import { FreeTierCapacityCalculator, SCALING_STRATEGIES } from '@/lib/free-tier-optimizer';

interface CapacityData {
  storage: number;
  compute: number;
  bandwidth: number;
  bottleneck: string;
  maxUsers: number;
}

interface UsageData {
  storage: UsageEntry;
  compute: UsageEntry;
  bandwidth: UsageEntry;
}

interface UsageEntry {
  percentage: number;
  used: number;
  limit: number;
  unit: string;
}

/**
 * 📊 USAGE MONITOR COMPONENT
 * 
 * Real-time monitoring of free tier usage with alerts and optimization suggestions
 */
export default function UsageMonitor() {
  const [currentUsers, setCurrentUsers] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [capacity, setCapacity] = useState<CapacityData | null>(null);
  const [usage, setUsage] = useState<UsageData | null>(null);

  const fetchCurrentUserCount = async (): Promise<number> => {
    // Simulate API call - replace with real implementation
    try {
      // const response = await fetch('/api/admin/user-count');
      // const data = await response.json();
      // return data.activeUsers;
      
      // For demo, return a simulated count
      return Math.floor(Math.random() * 100) + 20;
    } catch (error) {
      console.error('Failed to fetch user count:', error);
      return 0;
    }
  };

  const updateMetrics = useCallback(async () => {
    // In a real app, you'd fetch current user count from your API
    // For demo purposes, we'll simulate
    const userCount = await fetchCurrentUserCount();
    setCurrentUsers(userCount);
    
    const capacityData = FreeTierCapacityCalculator.calculateMaxUsers();
    const usageData = FreeTierCapacityCalculator.getUsageBreakdown(userCount);
    
    setCapacity(capacityData);
    setUsage(usageData);
  }, []);

  useEffect(() => {
    // Only show in development or for admins
    const isDev = process.env.NODE_ENV === 'development';
    const isAdmin = localStorage.getItem('admin_mode') === 'true';
    
    if (isDev || isAdmin) {
      setIsVisible(true);
      updateMetrics();
      
      // Update every 5 minutes
      const interval = setInterval(updateMetrics, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [updateMetrics]);

  const getStatusColor = (percentage: number) => {
    if (percentage < 50) return 'text-green-400';
    if (percentage < 70) return 'text-yellow-400';
    if (percentage < 90) return 'text-orange-400';
    return 'text-red-400';
  };

  const getStatusBg = (percentage: number) => {
    if (percentage < 50) return 'bg-green-500';
    if (percentage < 70) return 'bg-yellow-500';
    if (percentage < 90) return 'bg-orange-500';
    return 'bg-brand';
  };

  const shouldShowAlert = (percentage: number) => {
    return percentage >= SCALING_STRATEGIES.earlyWarning.threshold * 100;
  };

  if (!isVisible || !capacity || !usage) return null;

  return (
    <div className="fixed top-4 left-4 bg-black/90 text-white p-4 rounded-lg text-xs font-mono z-50 max-w-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-blue-400">🆓 Free Tier Monitor</h3>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-red-400 hover:text-red-300"
        >
          ✕
        </button>
      </div>
      
      {/* Current Status */}
      <div className="space-y-2 mb-3">
        <div className="flex justify-between">
          <span>Active Users:</span>
          <span className="text-blue-400">{currentUsers}</span>
        </div>
        <div className="flex justify-between">
          <span>Max Capacity:</span>
          <span className="text-blue-400">{capacity.maxUsers}</span>
        </div>
        <div className="flex justify-between">
          <span>Bottleneck:</span>
          <span className="text-yellow-400">{capacity.bottleneck}</span>
        </div>
      </div>

      {/* Usage Bars */}
      <div className="space-y-3 mb-3">
        {Object.entries(usage).map(([key, data]: [string, UsageEntry]) => (
          <div key={key}>
            <div className="flex justify-between text-xs mb-1">
              <span className="capitalize">{key}:</span>
              <span className={getStatusColor(data.percentage)}>
                {data.percentage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getStatusBg(data.percentage)}`}
                style={{ width: `${Math.min(data.percentage, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs mt-1 text-gray-400">
              <span>{data.used.toFixed(1)} {data.unit}</span>
              <span>{data.limit} {data.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {Object.entries(usage).some(([, data]: [string, UsageEntry]) => shouldShowAlert(data.percentage)) && (
        <div className="border-t border-gray-600 pt-2 mt-2">
          <div className="text-red-400 font-semibold mb-1">🚨 Alerts:</div>
          {Object.entries(usage).map(([key, data]: [string, UsageEntry]) => 
            shouldShowAlert(data.percentage) ? (
              <div key={key} className="text-xs text-red-300">
                • {key} usage high ({data.percentage.toFixed(1)}%)
              </div>
            ) : null
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="border-t border-gray-600 pt-2 mt-2">
        <div className="text-blue-400 font-semibold mb-1">Quick Actions:</div>
        <div className="space-y-1">
          <button 
            onClick={() => {
              // Implement emergency performance mode
              console.log('Emergency mode enabled');
            }}
            className="w-full bg-brand hover:bg-brand-hover text-white px-2 py-1 rounded text-xs"
          >
            🚨 Emergency Mode
          </button>
          <button 
            onClick={() => {
              // Open upgrade modal
              console.log('Upgrade modal opened');
            }}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs"
          >
            💎 Upgrade Plans
          </button>
        </div>
      </div>

      {/* Optimization Tips */}
      <div className="border-t border-gray-600 pt-2 mt-2">
        <div className="text-green-400 font-semibold mb-1">💡 Tips:</div>
        <div className="text-xs space-y-1">
          {capacity.bottleneck === 'storage' && (
            <div>• Compress images more aggressively</div>
          )}
          {capacity.bottleneck === 'compute' && (
            <div>• Enable more caching layers</div>
          )}
          {capacity.bottleneck === 'bandwidth' && (
            <div>• Reduce image sizes & enable CDN</div>
          )}
          <div>• Clean up old user data</div>
          <div>• Enable auto-suspend for databases</div>
        </div>
      </div>
    </div>
  );
}

// Keyboard shortcut to toggle monitor
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'U') {
      const monitor = document.querySelector('[data-usage-monitor]');
      if (monitor) {
        (monitor as HTMLElement).style.display = 
          (monitor as HTMLElement).style.display === 'none' ? 'block' : 'none';
      }
    }
  });
}