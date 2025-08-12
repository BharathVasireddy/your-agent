 'use client';

import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useMemo } from 'react';
import { getNavItems } from '@/lib/nav';
import { Button } from '@/components/ui/button';

interface AdminSidebarProps {
  adminEmail: string;
}

export default function AdminSidebar({ adminEmail }: AdminSidebarProps) {
  const pathname = usePathname();

  const navigationItems = useMemo(() => getNavItems('admin'), []);

  const isActiveLink = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-zinc-200 flex flex-col">
      {/* Logo/Brand Section */}
      <div className="p-6 border-b border-zinc-200">
        <div className="flex items-center space-x-3">
          <Image src="/images/Your-Agent-Logo.png" alt="YourAgent" width={150} height={30} className="h-8 w-auto" />
          <p className="text-xs text-zinc-500">Admin Panel</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActiveLink(item.href);
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
              ? 'bg-brand-light text-brand-hover border border-brand-soft'
                  : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
              }`}
            >
            <Icon className={`w-5 h-5 ${isActive ? 'text-brand' : 'text-zinc-500'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-zinc-200 space-y-1">
        <div className="px-4 py-3 text-xs text-zinc-500">
          Admin: {adminEmail}
        </div>
        
        <Button
          onClick={() => signOut({ callbackUrl: '/' })}
          variant="secondary"
          className="w-full justify-start px-4 py-3"
        >
          <span className="inline-flex items-center gap-3">
            <LogOut className="w-5 h-5 text-zinc-600" />
            <span>Sign Out</span>
          </span>
        </Button>
      </div>
    </div>
  );
}
