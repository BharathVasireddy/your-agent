'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Building, MapPin, AlertTriangle, Settings } from 'lucide-react';

interface QuickAction {
  label: string;
  href: string;
  icon: React.ReactNode;
  description: string;
  variant: 'default' | 'secondary' | 'outline' | 'destructive';
  badge?: string;
}

interface QuickActionsGridProps {
  className?: string;
}

export default function QuickActionsGrid({ className = '' }: QuickActionsGridProps) {
  const actions: QuickAction[] = [
    {
      label: 'Create Deal',
      href: '/admin/deals/new',
      icon: <Plus className="w-5 h-5" />,
      description: 'Add a new deal for agents',
      variant: 'default',
    },
    {
      label: 'Manage Users',
      href: '/admin/users',
      icon: <Users className="w-5 h-5" />,
      description: 'View and manage user accounts',
      variant: 'secondary',
    },
    {
      label: 'View Agents',
      href: '/admin/agents',
      icon: <Building className="w-5 h-5" />,
      description: 'Browse agent profiles',
      variant: 'outline',
    },
    {
      label: 'Properties',
      href: '/admin/properties',
      icon: <MapPin className="w-5 h-5" />,
      description: 'Manage property listings',
      variant: 'secondary',
    },
    {
      label: 'Moderation',
      href: '/admin/moderation',
      icon: <AlertTriangle className="w-5 h-5" />,
      description: 'Review pending content',
      variant: 'destructive',
      badge: 'Urgent',
    },
    {
      label: 'System Health',
      href: '/admin/system',
      icon: <Settings className="w-5 h-5" />,
      description: 'Monitor system status',
      variant: 'outline',
    },
  ];

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {actions.map((action) => (
        <Card key={action.href} className="group hover:shadow-md transition-all duration-200">
          <CardContent className="p-0">
            <Button
              asChild
              variant="ghost"
              className="w-full h-auto p-4 justify-start text-left group-hover:bg-muted/50"
            >
              <Link href={action.href}>
                <div className="flex items-start gap-3 w-full">
                  <div className={`p-2 rounded-lg border ${
                    action.variant === 'default' ? 'bg-primary text-primary-foreground border-primary' :
                    action.variant === 'destructive' ? 'bg-destructive text-destructive-foreground border-destructive' :
                    action.variant === 'secondary' ? 'bg-secondary text-secondary-foreground border-secondary' :
                    'bg-background text-foreground border-border'
                  } group-hover:scale-110 transition-transform`}>
                    {action.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-foreground group-hover:text-foreground/80">
                        {action.label}
                      </h3>
                      {action.badge && (
                        <Badge variant="destructive" className="text-xs">
                          {action.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
