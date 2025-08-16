import { headers } from 'next/headers';
import { requireAdmin } from '@/lib/admin';
import { Users, Building2, MapPin, CreditCard, TrendingUp, AlertCircle, DollarSign, Activity } from 'lucide-react';
import DashboardCard from '@/components/admin/dashboard/DashboardCard';
import DashboardChart from '@/components/admin/dashboard/DashboardChart';
import RecentActivity from '@/components/admin/dashboard/RecentActivity';
import QuickActionsGrid from '@/components/admin/dashboard/QuickActionsGrid';
import TopPerformers from '@/components/admin/dashboard/TopPerformers';
import UsersVsAgentsChart from '@/components/admin/dashboard/UsersVsAgentsChart';
import DateRangePicker from '@/components/admin/dashboard/DateRangePicker';
import { Separator } from '@/components/ui/separator';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();
  if (!admin) return null;

  const h = await headers();
  const host = h.get('host')!;
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  
  const [analyticsRes, kpisRes] = await Promise.all([
    fetch(`${protocol}://${host}/api/admin/analytics`, {
      headers: { cookie: h.get('cookie') ?? '' },
      cache: 'no-store',
    }),
    fetch(`${protocol}://${host}/api/admin/kpis`, {
    headers: { cookie: h.get('cookie') ?? '' },
    cache: 'no-store',
    })
  ]);

  if (!analyticsRes.ok || !kpisRes.ok) {
    throw new Error('Failed to load dashboard data');
  }

  const analytics = await analyticsRes.json();
  await kpisRes.json();

  // Calculate growth percentages
  const calculateGrowth = (current: number, recent: number) => {
    if (current === 0) return 0;
    const previous = current - recent;
    if (previous === 0) return recent > 0 ? 100 : 0;
    return ((recent / previous) * 100);
  };

  const userGrowth = calculateGrowth(analytics.overview.totalUsers, analytics.overview.growth.users);
  const agentGrowth = calculateGrowth(analytics.overview.totalAgents, analytics.overview.growth.agents);
  const propertyGrowth = calculateGrowth(analytics.overview.totalProperties, analytics.overview.growth.properties);
  const leadGrowth = calculateGrowth(analytics.overview.totalLeads, analytics.overview.growth.leads);

  // Prepare activity feed data
  type UserActivity = { id: string; name?: string | null; email?: string | null; createdAt: string };
  type AgentActivity = { id: string; name: string; createdAt: string };
  type PropertyActivity = { id: string; title: string; location: string; createdAt: string };
  type LeadActivity = { id: string; agent?: { name?: string | null } | null; timestamp: string };

  const recentActivities = [
    ...analytics.recentActivity.users.map((user: UserActivity) => ({
      id: `user-${user.id}`,
      type: 'user' as const,
      title: `New user registered`,
      subtitle: user.name || user.email,
      timestamp: user.createdAt,
    })),
    ...analytics.recentActivity.agents.map((agent: AgentActivity) => ({
      id: `agent-${agent.id}`,
      type: 'agent' as const,
      title: `New agent profile created`,
      subtitle: agent.name,
      timestamp: agent.createdAt,
    })),
    ...analytics.recentActivity.properties.map((property: PropertyActivity) => ({
      id: `property-${property.id}`,
      type: 'property' as const,
      title: `New property listed`,
      subtitle: `${property.title} in ${property.location}`,
      timestamp: property.createdAt,
    })),
    ...analytics.recentActivity.leads.map((lead: LeadActivity) => ({
      id: `lead-${lead.id}`,
      type: 'lead' as const,
      title: `New lead received`,
      subtitle: lead.agent?.name ? `For ${lead.agent.name}` : 'Lead inquiry',
      timestamp: lead.timestamp,
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here&apos;s what&apos;s happening with your platform.</p>
        </div>
        <DateRangePicker />
      </div>

      <Separator />

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Users"
          value={analytics.overview.totalUsers}
          icon={<Users className="w-4 h-4" />}
          trend={userGrowth > 0 ? 'up' : userGrowth < 0 ? 'down' : 'neutral'}
          trendValue={`${userGrowth.toFixed(1)}%`}
          description="vs last 30 days"
        />
        <DashboardCard
          title="Active Agents"
          value={analytics.overview.totalAgents}
          icon={<Building2 className="w-4 h-4" />}
          trend={agentGrowth > 0 ? 'up' : agentGrowth < 0 ? 'down' : 'neutral'}
          trendValue={`${agentGrowth.toFixed(1)}%`}
          description="vs last 30 days"
        />
        <DashboardCard
          title="Properties"
          value={analytics.overview.totalProperties}
          icon={<MapPin className="w-4 h-4" />}
          trend={propertyGrowth > 0 ? 'up' : propertyGrowth < 0 ? 'down' : 'neutral'}
          trendValue={`${propertyGrowth.toFixed(1)}%`}
          description="vs last 30 days"
        />
        <DashboardCard
          title="Total Revenue"
          value={`₹${Intl.NumberFormat('en-IN').format(analytics.overview.totalRevenue)}`}
          icon={<DollarSign className="w-4 h-4" />}
          trend="up"
          trendValue={`₹${Intl.NumberFormat('en-IN').format(analytics.overview.recentRevenue)}`}
          description="last 30 days"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Subscriptions"
          value={analytics.overview.activeSubscriptions}
          icon={<CreditCard className="w-4 h-4" />}
          description="active subscriptions"
        />
        <DashboardCard
          title="Total Leads"
          value={analytics.overview.totalLeads}
          icon={<TrendingUp className="w-4 h-4" />}
          trend={leadGrowth > 0 ? 'up' : leadGrowth < 0 ? 'down' : 'neutral'}
          trendValue={`${leadGrowth.toFixed(1)}%`}
          description="vs last 30 days"
        />
        <DashboardCard
          title="Page Views"
          value={analytics.overview.totalPageViews}
          icon={<Activity className="w-4 h-4" />}
          trendValue={`${Intl.NumberFormat('en-IN').format(analytics.overview.growth.pageViews)}`}
          description="last 30 days"
        />
        <DashboardCard
          title="Pending Moderation"
          value={analytics.systemHealth.moderationPending}
          icon={<AlertCircle className="w-4 h-4" />}
          trend={analytics.systemHealth.moderationPending > 0 ? 'down' : 'neutral'}
          description="items to review"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardChart
          title="Agent Growth"
          description="Weekly agent registrations over the last 8 weeks"
          data={analytics.charts.weeklyUserGrowth.map((item: { week: string; users: number }) => ({
            label: item.week,
            users: item.users,
          }))}
          type="line"
          dataKey="users"
          xAxisKey="label"
          color="#F55625"
        />

        <DashboardChart
          title="Daily Activity"
          description="Platform activity over the last 7 days"
          data={analytics.charts.dailyActivity.map((item: { date: string; leads: number; pageViews: number; properties: number }) => ({
            label: new Date(item.date).toLocaleDateString('en-IN', { weekday: 'short' }),
            activity: item.leads + item.pageViews + item.properties,
          }))}
          type="bar"
          dataKey="activity"
          xAxisKey="label"
          color="#F55625"
        />
      </div>

      {/* Property Types and Users vs Agents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UsersVsAgentsChart 
          totalUsers={analytics.overview.totalUsers}
          totalAgents={analytics.overview.totalAgents}
        />

        <DashboardChart
          title="Property Types"
          description="Distribution of property types on the platform"
          data={analytics.charts.propertyTypes.slice(0, 6).map((item: { type: string; count: number }) => ({
            label: item.type.length > 10 ? item.type.substring(0, 10) + '...' : item.type,
            count: item.count,
          }))}
          type="bar"
          dataKey="count"
          xAxisKey="label"
          color="#F55625"
        />
      </div>

      {/* Activity and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity activities={recentActivities} />
        
        {/* Top Performers */}
        {analytics.topPerformers.agents.length > 0 && (
          <TopPerformers agents={analytics.topPerformers.agents} />
        )}
      </div>

            {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Quick Actions</h2>
        <QuickActionsGrid />
      </div>
    </div>
  );
}


