'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Building, User, LogOut, TrendingUp, Settings, HelpCircle, Copy, Palette, MessageSquare, ExternalLink, ChevronDown, ChevronRight, CreditCard } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import SignOutButton from './SignOutButton';
import { useInstantNav } from '@/components/InstantNavProvider';

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
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const pathname = usePathname();
  const router = useRouter();
  const { pendingPath, navigateInstantly } = useInstantNav();

  // Prefetch routes on intent (hover) to reduce initial cost
  const prefetchOnHover = (route: string) => {
    try { router.prefetch(route); } catch {}
  };

  // Prefetch core dashboard routes on mount for faster first navigation
  useEffect(() => {
    const routes = [
      '/agent/dashboard',
      '/agent/dashboard/properties',
      '/agent/dashboard/leads',
      '/agent/dashboard/profile',
      '/agent/dashboard/customise-website',
      '/agent/dashboard/customise-website/testimonials',
      '/agent/dashboard/customise-website/faqs',
      '/agent/dashboard/analytics',
      '/agent/dashboard/subscription',
      '/agent/dashboard/settings',
    ];
    routes.forEach((r) => {
      try { router.prefetch(r); } catch {}
    });
  }, [router]);

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

  const navigationItems = useMemo(() => [
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
      name: 'Leads',
      href: '/agent/dashboard/leads',
      icon: MessageSquare,
    },
    {
      name: 'Profile',
      href: '/agent/dashboard/profile',
      icon: User,
    },
    {
      name: 'Customise Website',
      href: '/agent/dashboard/customise-website',
      icon: Palette,
      subItems: [
        {
          name: 'Testimonials',
          href: '/agent/dashboard/customise-website/testimonials',
          icon: MessageSquare,
        },
        {
          name: 'FAQs',
          href: '/agent/dashboard/customise-website/faqs',
          icon: HelpCircle,
        },
      ]
    },
    {
      name: 'Analytics',
      href: '/agent/dashboard/analytics',
      icon: TrendingUp,
    },
    {
      name: 'Subscription',
      href: '/agent/dashboard/subscription',
      icon: CreditCard,
    },
    {
      name: 'Settings',
      href: '/agent/dashboard/settings',
      icon: Settings,
    },
  ], []);

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

  // Auto-expand menus when user is on a sub-page
  useEffect(() => {
    const newExpandedMenus: Record<string, boolean> = {};
    
    navigationItems.forEach((item) => {
      if (item.subItems) {
        // Check if current path matches any sub-item
        const isSubItemActive = item.subItems.some(subItem => pathname.startsWith(subItem.href));
        if (isSubItemActive) {
          newExpandedMenus[item.name] = true;
        }
      }
    });
    
    setExpandedMenus(prev => ({ ...prev, ...newExpandedMenus }));
  }, [pathname, navigationItems]);

  const toggleMenu = (menuName: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
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
          const hasSubItems = item.subItems && item.subItems.length > 0;
          
          return (
            <div key={item.name}>
              {/* Main Navigation Item */}
              <div
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-red-600' : 'text-zinc-500'}`} />
                <button
                  onMouseEnter={() => prefetchOnHover(item.href)}
                  onClick={() => navigateInstantly(item.href)}
                  className="flex-1 text-left no-underline"
                >
                  {item.name}
                </button>
                {hasSubItems && (
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className="ml-auto p-1 hover:bg-black/5 rounded transition-colors"
                  >
                    {expandedMenus[item.name] ? (
                      <ChevronDown className={`w-4 h-4 ${isActive ? 'text-red-600' : 'text-zinc-500'}`} />
                    ) : (
                      <ChevronRight className={`w-4 h-4 ${isActive ? 'text-red-600' : 'text-zinc-500'}`} />
                    )}
                  </button>
                )}
              </div>
              
              {/* Sub Items */}
              {hasSubItems && expandedMenus[item.name] && (
                <div className="ml-4 mt-1 space-y-1 animate-in slide-in-from-top-1 duration-200">
                  {item.subItems!.map((subItem) => {
                    const SubIcon = subItem.icon;
                    const isSubActive = isActiveLink(subItem.href);
                    
                    return (
                      <button
                        key={subItem.name}
                        onClick={() => navigateInstantly(subItem.href)}
                        className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                          isSubActive
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700'
                        }`}
                      >
                        <SubIcon className={`w-4 h-4 ${isSubActive ? 'text-red-600' : 'text-zinc-400'}`} />
                        <span>{subItem.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-zinc-200 space-y-1">
        {/* Visit My Website Button */}
        {agent?.slug && (
          <Link
            href={`/${agent.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors w-full"
          >
            <ExternalLink className="w-5 h-5 text-white" />
            <span>Visit My Website</span>
          </Link>
        )}
        
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