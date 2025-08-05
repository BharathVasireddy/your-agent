'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Building, User, LogOut, TrendingUp, Settings, HelpCircle } from 'lucide-react';
import SignOutButton from './SignOutButton';

interface DashboardSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
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
    {
      name: 'Analytics',
      href: '/agent/dashboard/analytics',
      icon: TrendingUp,
    },
    {
      name: 'Settings',
      href: '/agent/dashboard/settings',
      icon: Settings,
    },
  ];

  const isActiveLink = (href: string) => {
    if (href === '/agent/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-zinc-200 flex flex-col">
      {/* Logo/Brand Section */}
      <div className="p-6 border-b border-zinc-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">YA</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-zinc-950">YourAgent</h1>
            <p className="text-xs text-zinc-500">Dashboard</p>
          </div>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="p-6 border-b border-zinc-200">
        <div className="flex items-center space-x-3">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name || 'User'}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-zinc-200 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-zinc-600" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-950 truncate">
              {user.name || 'User'}
            </p>
            <p className="text-xs text-zinc-500 truncate">
              {user.email}
            </p>
          </div>
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
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-red-600' : 'text-zinc-500'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-zinc-200 space-y-1">
        <Link
          href="/agent/dashboard/help"
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
        >
          <HelpCircle className="w-5 h-5 text-zinc-500" />
          <span>Help & Support</span>
        </Link>
        
        <SignOutButton className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-zinc-600 hover:bg-red-50 hover:text-red-700 transition-colors w-full text-left">
          <LogOut className="w-5 h-5 text-zinc-500" />
          <span>Sign Out</span>
        </SignOutButton>
      </div>
    </div>
  );
}