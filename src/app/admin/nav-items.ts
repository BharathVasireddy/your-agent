export type AdminNavItem = {
  href: string;
  label: string;
};

export const adminNavItems: AdminNavItem[] = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/agents', label: 'Agents' },
  { href: '/admin/properties', label: 'Properties' },
  { href: '/admin/payments', label: 'Payments' },
  { href: '/admin/system', label: 'System' },
];


