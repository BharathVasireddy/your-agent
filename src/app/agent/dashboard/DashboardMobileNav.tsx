'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useInstantNav } from '@/components/InstantNavProvider';
import { useEffect } from 'react';
import { getNavItems } from '@/lib/nav';
import type { Plan } from '@/lib/subscriptions';

export default function DashboardMobileNav({ plan = 'starter' }: { plan?: Plan }) {
  const pathname = usePathname();
  const router = useRouter();
  const { pendingPath, navigateInstantly } = useInstantNav();

  // Prefetch all dashboard routes for instant mobile navigation
  const items = getNavItems('agent', { plan });

  useEffect(() => {
    items.forEach((item) => {
      try { router.prefetch(item.href); } catch {}
      item.subItems?.forEach((sub) => {
        try { router.prefetch(sub.href); } catch {}
      });
    });
  }, [router, items]);

  const navigationItems = items.filter((i) => !i.subItems);

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

  const columnCount = Math.max(1, navigationItems.length);
  return (
    <nav id="bottom-nav" className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200">
      <div className="h-16" style={{ display: 'grid', gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActiveLink(item.href);
          
          return (
            <button
              key={item.name}
              onClick={() => navigateInstantly(item.href)}
              className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
                isActive
                  ? 'text-brand'
                  : 'text-zinc-600 hover:text-brand'
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