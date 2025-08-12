'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { getNavItems } from '@/lib/nav';

export default function AdminMobileNav() {
  const pathname = usePathname();

  const navigationItems = getNavItems('admin');

  const isActiveLink = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200">
      {(() => {
        const columnCount = Math.max(1, navigationItems.length);
        return (
          <div className="h-16" style={{ display: 'grid', gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveLink(item.href);
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
                    isActive
                      ? 'text-brand'
                      : 'text-zinc-600 hover:text-brand'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs">{item.name}</span>
                </Link>
              );
            })}
          </div>
        );
      })()}
    </nav>
  );
}
