'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, HelpCircle, Copy, ExternalLink, ChevronDown, ChevronRight, User } from 'lucide-react';
import { useState, useEffect, useMemo, type ReactNode } from 'react';
import SignOutButton from './SignOutButton';
import { useInstantNav } from '@/components/InstantNavProvider';
import { getNavItems } from '@/lib/nav';
import type { Plan } from '@/lib/subscriptions';

interface ModernDashboardSidebarProps {
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
  plan?: Plan;
}

export default function ModernDashboardSidebar({ user, agent, plan = 'starter' }: ModernDashboardSidebarProps) {
  const [copied, setCopied] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const pathname = usePathname();
  const router = useRouter();
  const { pendingPath, navigateInstantly } = useInstantNav();

  // Prefetch routes on intent (hover) to reduce initial cost
  const prefetchOnHover = (route: string) => {
    try { router.prefetch(route); } catch {}
  };

  // Get navigation items with memoization
  const navigationItems = useMemo(() => getNavItems('agent', { plan }) || [], [plan]);

  // Check if link is active
  const isActiveLink = (href: string) => {
    if (href === '/agent/dashboard') {
      return pathname === '/agent/dashboard';
    }
    return pathname.startsWith(href);
  };

  // Auto-expand menus based on current path
  useEffect(() => {
    const newExpandedMenus: Record<string, boolean> = {};
    if (navigationItems && navigationItems.length > 0) {
      navigationItems.forEach(item => {
        if (item.subItems) {
          const isSubItemActive = item.subItems.some(subItem => pathname.startsWith(subItem.href));
          if (isSubItemActive) {
            newExpandedMenus[item.name] = true;
          }
        }
      });
    }
    
    setExpandedMenus(prev => ({ ...prev, ...newExpandedMenus }));
  }, [pathname, navigationItems]);

  const toggleMenu = (menuName: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  const copyProfileUrl = async () => {
    if (!agent?.slug) return;
    
    try {
      await navigator.clipboard.writeText(`https://youragent.in/${agent.slug}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = `https://youragent.in/${agent.slug}`;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-zinc-200 flex flex-col">
      {/* Modern Header */}
      <div className="p-6 border-b border-zinc-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            {user.image || agent?.profilePhotoUrl ? (
              <Image
                src={user.image || agent?.profilePhotoUrl || ''}
                alt={user.name || 'User'}
                width={40}
                height={40}
                className="w-10 h-10 rounded-xl object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-zinc-950 truncate">{user.name}</p>
            <p className="text-xs text-zinc-500 truncate">{user.email}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Image src="/images/Your-Agent-Logo.png" alt="YourAgent" width={140} height={28} className="h-6 w-auto" />
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigationItems && navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActiveLink(item.href);
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isExpanded = expandedMenus[item.name];
          const isLoading = pendingPath === item.href;

          if (!hasSubItems) {
            return (
              <Link
                key={item.name}
                href={item.href}
                onMouseEnter={() => prefetchOnHover(item.href)}
                onClick={(e) => {
                  e.preventDefault();
                  navigateInstantly(item.href);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive 
                    ? 'bg-brand text-white shadow-lg hover:bg-brand-hover' 
                    : 'text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50'
                } ${isLoading ? 'opacity-50' : ''}`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-700'}`} />
                <span className="flex-1">{item.name}</span>
                {'badge' in item && (item as { badge?: ReactNode }).badge && (
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-zinc-100 text-zinc-600'
                  }`}>
                    {(item as { badge?: ReactNode }).badge}
                  </span>
                )}
              </Link>
            );
          }

          return (
            <div key={item.name}>
              <button
                onClick={() => toggleMenu(item.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive 
                    ? 'bg-brand text-white shadow-lg hover:bg-brand-hover' 
                    : 'text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-700'}`} />
                <span className="flex-1 text-left">{item.name}</span>
                {'badge' in item && (item as { badge?: ReactNode }).badge && (
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-zinc-100 text-zinc-600'
                  }`}>
                    {(item as { badge?: ReactNode }).badge}
                  </span>
                )}
                {isExpanded ? (
                  <ChevronDown className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                ) : (
                  <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                )}
              </button>
              
              {isExpanded && item.subItems && (
                <div className="mt-2 ml-4 space-y-1">
                  {item.subItems.map((subItem) => {
                    const SubIcon = subItem.icon;
                    const isSubActive = pathname.startsWith(subItem.href);
                    const isSubLoading = pendingPath === subItem.href;

                    return (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        onMouseEnter={() => prefetchOnHover(subItem.href)}
                        onClick={(e) => {
                          e.preventDefault();
                          navigateInstantly(subItem.href);
                        }}
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                          isSubActive 
                            ? 'bg-brand-light text-brand font-medium hover:bg-brand-muted' 
                            : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                        } ${isSubLoading ? 'opacity-50' : ''}`}
                      >
                        <SubIcon className={`w-4 h-4 ${isSubActive ? 'text-brand' : 'text-zinc-400'}`} />
                        <span>{subItem.name}</span>
                        {'badge' in subItem && (subItem as { badge?: ReactNode }).badge && (
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            isSubActive 
                              ? 'bg-brand text-white' 
                              : 'bg-zinc-100 text-zinc-600'
                          }`}>
                            {(subItem as { badge?: ReactNode }).badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Modern Footer */}
      <div className="p-4 border-t border-zinc-200 space-y-3">
        {/* Profile URL Share */}
        {agent?.slug && (
          <div className="bg-zinc-50 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-zinc-700">Your Profile URL</span>
              <div className="flex items-center gap-1">
                <Link
                  href={`/${agent.slug}`}
                  target="_blank"
                  className="p-1 rounded hover:bg-zinc-200 transition-colors"
                >
                  <ExternalLink className="w-3 h-3 text-zinc-500" />
                </Link>
                <button
                  onClick={copyProfileUrl}
                  className="p-1 rounded hover:bg-zinc-200 transition-colors"
                >
                  <Copy className="w-3 h-3 text-zinc-500" />
                </button>
              </div>
            </div>
            <p className="text-xs text-zinc-600 truncate">
              youragent.in/{agent.slug}
            </p>
            {copied && (
              <p className="text-xs text-green-600 mt-1">Copied to clipboard!</p>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/agent/dashboard/help"
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors text-sm font-medium text-zinc-700"
          >
            <HelpCircle className="w-4 h-4" />
            Help
          </Link>
          <SignOutButton className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors text-sm font-medium text-red-700 hover:text-red-800">
            <LogOut className="w-4 h-4" />
            Sign Out
          </SignOutButton>
        </div>
      </div>
    </div>
  );
}
