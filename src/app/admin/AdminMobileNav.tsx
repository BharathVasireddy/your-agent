'use client';

import { usePathname } from 'next/navigation';
import { Home, Users, UserCheck, Building, CreditCard, Settings } from 'lucide-react';
import Link from 'next/link';

export default function AdminMobileNav() {
  const pathname = usePathname();

  const navigationItems = [
    {
      name: 'Home',
      href: '/admin/dashboard',
      icon: Home,
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: Users,
    },
    {
      name: 'Agents',
      href: '/admin/agents',
      icon: UserCheck,
    },
    {
      name: 'Properties',
      href: '/admin/properties',
      icon: Building,
    },
    {
      name: 'System',
      href: '/admin/system',
      icon: Settings,
    },
  ];

  const isActiveLink = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200">
      <div className="grid grid-cols-5 h-16">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActiveLink(item.href);
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
                isActive
                  ? 'text-red-600'
                  : 'text-zinc-600 hover:text-red-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
