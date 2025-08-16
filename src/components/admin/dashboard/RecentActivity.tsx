'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Building, MapPin, MessageCircle, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityItem {
  id: string;
  type: 'user' | 'agent' | 'property' | 'lead';
  title: string;
  subtitle?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

interface RecentActivityProps {
  activities: ActivityItem[];
  loading?: boolean;
  className?: string;
}

export default function RecentActivity({
  activities,
  loading = false,
  className,
}: RecentActivityProps) {
  const getIcon = (type: ActivityItem['type']) => {
    const iconProps = { className: "w-4 h-4" };
    switch (type) {
      case 'user':
        return <User {...iconProps} />;
      case 'agent':
        return <Building {...iconProps} />;
      case 'property':
        return <MapPin {...iconProps} />;
      case 'lead':
        return <MessageCircle {...iconProps} />;
      default:
        return <Calendar {...iconProps} />;
    }
  };

  const getBadgeStyle = (type: ActivityItem['type']) => {
    switch (type) {
      case 'user':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'agent':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'property':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'lead':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // Less than 1 hour
    if (diff < 60 * 60 * 1000) {
      const minutes = Math.floor(diff / (60 * 1000));
      return `${minutes}m ago`;
    }
    
    // Less than 24 hours
    if (diff < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diff / (60 * 60 * 1000));
      return `${hours}h ago`;
    }
    
    // Less than 7 days
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      const days = Math.floor(diff / (24 * 60 * 60 * 1000));
      return `${days}d ago`;
    }
    
    // Show date
    return date.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-start gap-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-3 w-12" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8 text-muted-foreground">
          <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No recent activity</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className={cn("p-2 rounded-full border", getBadgeStyle(activity.type))}>
              {getIcon(activity.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground leading-tight">
                {activity.title}
              </p>
              {activity.subtitle && (
                <p className="text-sm text-muted-foreground truncate">
                  {activity.subtitle}
                </p>
              )}
            </div>
            
            <div className="flex-shrink-0">
              <time className="text-xs text-muted-foreground">
                {formatTimestamp(activity.timestamp)}
              </time>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
