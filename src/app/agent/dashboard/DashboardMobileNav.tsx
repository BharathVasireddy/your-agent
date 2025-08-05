'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Building, User, LogOut } from 'lucide-react';
import SignOutButton from './SignOutButton';

export default function DashboardMobileNav() {
  const pathname = usePathname();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/agent/dashboard',
      icon: Home,
    },
    {
      name: 'Properties',
      href: '/agent/dashboard/properties',
      icon: Building,
    },
    {
      name: 'Profile',
      href: '/agent/dashboard/profile',
      icon: User,
    },
  ];

  const isActiveLink = (href: string) => {
    if (href === '/agent/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <nav id="bottom-nav" className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200">
      <div className="grid grid-cols-4 h-16">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActiveLink(item.href);
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                isActive
                  ? 'text-red-600'
                  : 'text-zinc-600 hover:text-red-600'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{item.name}</span>
            </Link>
          );
        })}
        
        <SignOutButton className="flex flex-col items-center justify-center space-y-1 text-zinc-600 hover:text-red-600 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="text-xs">Sign Out</span>
        </SignOutButton>
      </div>
    </nav>
  );
}