'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Building2,
  Users,
  BarChart3,
  Settings,
} from 'lucide-react';
import { useInstantNav } from '@/components/InstantNavProvider';
import type { Plan } from '@/lib/subscriptions';

interface ModernDashboardMobileNavProps {
  plan?: Plan;
}

export default function ModernDashboardMobileNav(_: ModernDashboardMobileNavProps) {
  const pathname = usePathname();
  const { navigateInstantly } = useInstantNav();

  const navItems = [
    {
      name: 'Dashboard',
      href: '/agent/dashboard',
      icon: LayoutDashboard,
      emoji: '🏠'
    },
    {
      name: 'Properties',
      href: '/agent/dashboard/properties',
      icon: Building2,
      emoji: '🏢'
    },
    {
      name: 'Leads',
      href: '/agent/dashboard/leads',
      icon: Users,
      emoji: '👥'
    },
    {
      name: 'Analytics',
      href: '/agent/dashboard/analytics',
      icon: BarChart3,
      emoji: '📊'
    },
    {
      name: 'Settings',
      href: '/agent/dashboard/settings',
      icon: Settings,
      emoji: '⚙️'
    },
  ];

  const isActiveLink = (href: string) => {
    if (href === '/agent/dashboard') {
      return pathname === '/agent/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActiveLink(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                navigateInstantly(item.href);
              }}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-brand text-white shadow-lg'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
                {isActive && (
                  <div className="absolute -top-1 -right-1 text-xs">
                    {item.emoji}
                  </div>
                )}
              </div>
              <span className={`text-xs font-medium ${isActive ? 'text-white' : 'text-zinc-600'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
