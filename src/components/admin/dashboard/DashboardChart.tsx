'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis } from 'recharts';

interface DashboardChartProps<T = { [key: string]: number | string }> {
  title: string;
  description?: string;
  data: T[];
  type: 'bar' | 'line';
  dataKey: string;
  xAxisKey?: string;
  color?: string;
  loading?: boolean;
  className?: string;
}

export default function DashboardChart({
  title,
  description,
  data,
  type,
  dataKey,
  xAxisKey = 'label',
  color = '#F55625',
  loading = false,
  className,
}: DashboardChartProps) {
  const chartConfig = {
    [dataKey]: {
      label: title,
      color: color,
    },
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="h-6 bg-muted rounded w-48 mb-2"></div>
          <div className="h-4 bg-muted rounded w-32"></div>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          {type === 'bar' ? (
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.8}/>
                  <stop offset="100%" stopColor={color} stopOpacity={0.3}/>
                </linearGradient>
              </defs>
              <XAxis
                dataKey={xAxisKey}
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                fontSize={12}
                stroke="#666"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                fontSize={12}
                stroke="#666"
                tickFormatter={(value) => `${value}`}
              />
              <ChartTooltip
                cursor={{ fill: 'rgba(245, 86, 37, 0.1)' }}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey={dataKey}
                fill="url(#barGradient)"
                radius={[4, 4, 0, 0]}
                stroke={color}
                strokeWidth={1}
              />
            </BarChart>
          ) : (
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.2}/>
                  <stop offset="100%" stopColor={color} stopOpacity={0.02}/>
                </linearGradient>
              </defs>
              <XAxis
                dataKey={xAxisKey}
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                fontSize={12}
                stroke="#666"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                fontSize={12}
                stroke="#666"
                tickFormatter={(value) => `${value}`}
              />
              <ChartTooltip
                cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '3 3' }}
                content={<ChartTooltipContent />}
              />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={3}
                fill="url(#lineGradient)"
                fillOpacity={1}
                dot={{
                  fill: color,
                  strokeWidth: 2,
                  r: 4,
                  stroke: '#fff'
                }}
                activeDot={{
                  r: 6,
                  fill: color,
                  stroke: '#fff',
                  strokeWidth: 2
                }}
              />
            </LineChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
