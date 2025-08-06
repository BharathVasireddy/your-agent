'use client';

import { usePathname } from 'next/navigation';
import { Home, Building, User, TrendingUp, Settings } from 'lucide-react';
import { useInstantNav } from '@/components/InstantNavProvider';

export default function DashboardMobileNav() {
  const pathname = usePathname();
  const { pendingPath, navigateInstantly } = useInstantNav();

  const navigationItems = [
    {
      name: 'Home',
      href: '/agent/dashboard',
      icon: Home,
    },
    {
      name: 'Properties',
      href: '/agent/dashboard/properties',
      icon: Building,
    },
    {
      name: 'Analytics',
      href: '/agent/dashboard/analytics',
      icon: TrendingUp,
    },
    {
      name: 'Profile',
      href: '/agent/dashboard/profile',
      icon: User,
    },
    {
      name: 'Settings',
      href: '/agent/dashboard/settings',
      icon: Settings,
    },
  ];

  const isActiveLink = (href: string) => {
    // Check if this is the pending navigation target (instant active state)
    if (pendingPath) {
      if (href === '/agent/dashboard') {
        return pendingPath === '/agent/dashboard';
      }
      return pendingPath.startsWith(href);
    }
    
    // Fallback to current pathname
    if (href === '/agent/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <nav id="bottom-nav" className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200">
      <div className="grid grid-cols-5 h-16">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActiveLink(item.href);
          
          return (
            <button
              key={item.name}
              onClick={() => navigateInstantly(item.href)}
              className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
                isActive
                  ? 'text-red-600'
                  : 'text-zinc-600 hover:text-red-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs">{item.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}