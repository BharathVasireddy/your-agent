import type { LucideIcon } from 'lucide-react';
import {
  Home,
  Users,
  User as UserIcon,
  UserCheck,
  Building,
  CreditCard,
  Settings,
  TrendingUp,
  Palette,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';
import { ENTITLEMENTS, type Plan } from '@/lib/subscriptions';

export type NavRole = 'admin' | 'agent';

export type NavVisibilityContext = {
  role: NavRole;
  plan?: Plan;
  subscriptionActive?: boolean;
};

export type NavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
  subItems?: NavItem[];
  isVisible?: (ctx: NavVisibilityContext) => boolean;
};

const adminNav: NavItem[] = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Agents', href: '/admin/agents', icon: UserCheck },
  { name: 'Properties', href: '/admin/properties', icon: Building },
  { name: 'Payments', href: '/admin/payments', icon: CreditCard },
  { name: 'System', href: '/admin/system', icon: Settings },
];

const agentNav: NavItem[] = [
  { name: 'Dashboard', href: '/agent/dashboard', icon: Home },
  { name: 'Properties', href: '/agent/dashboard/properties', icon: Building },
  { name: 'Leads', href: '/agent/dashboard/leads', icon: MessageSquare },
  { name: 'Profile', href: '/agent/dashboard/profile', icon: UserIcon },
  {
    name: 'Customise Website',
    href: '/agent/dashboard/customise-website',
    icon: Palette,
    subItems: [
      { name: 'Testimonials', href: '/agent/dashboard/customise-website/testimonials', icon: MessageSquare },
      { name: 'FAQs', href: '/agent/dashboard/customise-website/faqs', icon: HelpCircle },
    ],
  },
  {
    name: 'Analytics',
    href: '/agent/dashboard/analytics',
    icon: TrendingUp,
    isVisible: (ctx) => {
      const plan = ctx.plan ?? 'starter';
      return !!ENTITLEMENTS[plan].analytics;
    },
  },
  { name: 'Subscription', href: '/agent/dashboard/subscription', icon: CreditCard },
  { name: 'Settings', href: '/agent/dashboard/settings', icon: Settings },
];

export const NAV_CONFIG: Record<NavRole, NavItem[]> = {
  admin: adminNav,
  agent: agentNav,
};

export function getNavItems(role: NavRole, context: Partial<NavVisibilityContext> = {}): NavItem[] {
  const ctx: NavVisibilityContext = {
    role,
    plan: context.plan ?? 'starter',
    subscriptionActive: context.subscriptionActive ?? false,
  };

  const filterVisible = (item: NavItem): NavItem | null => {
    const visible = item.isVisible ? item.isVisible(ctx) : true;
    if (!visible) return null;
    const subItems = item.subItems
      ? (item.subItems.map(filterVisible).filter(Boolean) as NavItem[])
      : undefined;
    return { ...item, subItems };
  };

  return NAV_CONFIG[role].map(filterVisible).filter(Boolean) as NavItem[];
}


