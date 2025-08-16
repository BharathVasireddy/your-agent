'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

interface Agent {
  id: string;
  name: string;
  slug: string;
  leadsCount: number;
  propertiesCount: number;
}

interface TopPerformersProps {
  agents: Agent[];
  loading?: boolean;
  className?: string;
}

export default function TopPerformers({
  agents,
  loading = false,
  className,
}: TopPerformersProps) {
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Top Performing Agents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <div className="text-right space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!agents || agents.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Top Performing Agents</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8 text-muted-foreground">
          <p>No agent data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          Top Performing Agents
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {agents.slice(0, 5).map((agent, index) => (
          <div key={agent.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                  index === 0 ? 'bg-primary' : 
                  index === 1 ? 'bg-orange-500' : 
                  index === 2 ? 'bg-yellow-500' : 'bg-gray-400'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-foreground leading-tight">
                    {agent.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    @{agent.slug}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-medium text-foreground">
                  <span className="text-primary">{agent.leadsCount}</span> leads
                </p>
                <p className="text-sm text-muted-foreground">
                  {agent.propertiesCount} properties
                </p>
              </div>
            </div>
            {index < Math.min(agents.length, 5) - 1 && (
              <Separator className="mt-4" />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
