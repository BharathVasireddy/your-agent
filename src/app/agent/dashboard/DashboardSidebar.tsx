'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, Building, User, LogOut, TrendingUp, Settings, HelpCircle, Copy } from 'lucide-react';
import { useState } from 'react';
import SignOutButton from './SignOutButton';

interface DashboardSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  agent: {
    id: string;
    slug: string;
    profilePhotoUrl: string | null;
    user: {
      id: string;
      name: string | null;
      email: string | null;
      image: string | null;
    };
  } | null;
}

export default function DashboardSidebar({ user, agent }: DashboardSidebarProps) {
  const [copied, setCopied] = useState(false);
  const pathname = usePathname();

  const copyWebsiteLink = async () => {
    if (!agent?.slug) return;
    
    const websiteUrl = `https://youragent.in/${agent.slug}`;
    try {
      await navigator.clipboard.writeText(websiteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

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
      {/* Logo/Brand Section with User Photo */}
      <div className="p-6 border-b border-zinc-200">
        <div className="flex items-center space-x-3">
          {/* User Profile Photo or Default Avatar */}
          {user.image || agent?.profilePhotoUrl ? (
            <Image
              src={user.image || agent?.profilePhotoUrl || ''}
              alt={user.name || 'User'}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">YA</span>
            </div>
          )}
          <div>
            <h1 className="text-lg font-bold text-zinc-950">YourAgent</h1>
            <p className="text-xs text-zinc-500">Dashboard</p>
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
        {/* Copy Website Link Button */}
        {agent?.slug && (
          <button
            onClick={copyWebsiteLink}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-zinc-600 hover:bg-blue-50 hover:text-blue-700 transition-colors w-full text-left"
          >
            <Copy className="w-5 h-5 text-zinc-500" />
            <span>{copied ? 'Copied!' : 'Copy My Website Link'}</span>
          </button>
        )}
        
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