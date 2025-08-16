'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Building2, Users, TrendingUp } from 'lucide-react';

interface CityData {
  id: string;
  name: string;
  state: string;
  agentCount: number;
  activeAgents: number;
  areas: number;
  growth: number; // percentage growth
}

interface CityAnalyticsProps {
  cities: CityData[];
  loading?: boolean;
  className?: string;
}

export default function CityAnalytics({
  cities,
  loading = false,
  className,
}: CityAnalyticsProps) {
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>City Analytics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-32"></div>
                  <div className="h-3 bg-muted rounded w-24"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-16"></div>
                <div className="h-3 bg-muted rounded w-12"></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const topCities = cities
    .sort((a, b) => b.agentCount - a.agentCount)
    .slice(0, 10);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Top Cities by Agents
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {topCities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No cities with agents yet</p>
          </div>
        ) : (
          topCities.map((city, index) => (
            <div key={city.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                  index === 0 ? 'bg-primary' : 
                  index === 1 ? 'bg-orange-500' : 
                  index === 2 ? 'bg-yellow-500' : 'bg-gray-400'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium text-foreground">
                    {city.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {city.state} • {city.areas} areas
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">
                    {city.agentCount}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Badge 
                    variant={city.activeAgents === city.agentCount ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {city.activeAgents} active
                  </Badge>
                  {city.growth > 0 && (
                    <div className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="w-3 h-3" />
                      <span className="text-xs">+{city.growth}%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        
        {cities.length > 0 && (
          <div className="pt-4 border-t">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {cities.length}
                </div>
                <div className="text-xs text-muted-foreground">
                  Total Cities
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {cities.reduce((sum, city) => sum + city.areas, 0)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Total Areas
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {cities.reduce((sum, city) => sum + city.agentCount, 0)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Total Agents
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
