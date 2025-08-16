'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { PieChart, Pie, Cell } from 'recharts';

interface UsersVsAgentsChartProps {
  totalUsers: number;
  totalAgents: number;
  className?: string;
}

export default function UsersVsAgentsChart({
  totalUsers,
  totalAgents,
  className,
}: UsersVsAgentsChartProps) {
  const regularUsers = totalUsers - totalAgents;
  
  const data = [
    {
      name: 'Regular Users',
      value: regularUsers,
      description: 'Users without subscription',
      color: '#3B82F6',
    },
    {
      name: 'Agents',
      value: totalAgents,
      description: 'Users with subscription',
      color: '#F55625',
    },
  ];

  const chartConfig = {
    users: {
      label: 'Regular Users',
      color: '#3B82F6',
    },
    agents: {
      label: 'Agents',
      color: '#F55625',
    },
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: { cx: number; cy: number; midAngle: number; innerRadius: number; outerRadius: number; percent: number }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          Users vs Agents
        </CardTitle>
        <CardDescription>
          Distribution of regular users vs subscribed agents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-700">{regularUsers.toLocaleString()}</div>
              <div className="text-sm text-blue-600">Regular Users</div>
              <div className="text-xs text-blue-500">No subscription</div>
            </div>
            <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
              <div className="text-2xl font-bold text-primary">{totalAgents.toLocaleString()}</div>
              <div className="text-sm text-primary">Agents</div>
              <div className="text-xs text-primary/70">With subscription</div>
            </div>
          </div>

          {/* Chart */}
          <ChartContainer config={chartConfig}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const datum = payload[0] as unknown as {
                      color?: string;
                      name?: string;
                      payload?: { description?: string };
                      value?: number;
                    };
                    return (
                      <div className="bg-background border border-border rounded-lg shadow-md p-3">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: datum.color || '#999' }}
                          />
                          <span className="font-medium">{datum.name}</span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {datum.payload?.description}
                        </div>
                        <div className="font-bold text-lg">
                          {typeof datum.value === 'number' ? datum.value.toLocaleString() : ''}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ChartContainer>

          {/* Conversion Rate */}
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-lg font-bold text-green-700">
              {((totalAgents / totalUsers) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-green-600">Conversion Rate</div>
            <div className="text-xs text-green-500">Users becoming agents</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
