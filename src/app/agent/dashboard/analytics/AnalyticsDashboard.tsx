'use client';

import { 
  BarChart3, 
  Users, 
  Eye, 
  UserCheck, 
  TrendingUp,
  Smartphone,
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  FileText
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface AnalyticsData {
  totalVisitors: number;
  totalPropertyViews: number;
  totalLeads: number;
  conversionRate: number;
  trafficSources: Array<{ source: string; count: number }>;
  deviceBreakdown: Array<{ device: string; count: number }>;
  topLocations: Array<{ location: string; count: number }>;
  topProperties: Array<{ id: string; title: string; views: number }>;
  leadBreakdown: Array<{ type: string; count: number }>;
  dailyTrend: Array<{ date: string; visitors: number; property_views: number }>;
}

interface AnalyticsDashboardProps {
  data: AnalyticsData;
}

const COLORS = {
  primary: '#dc2626', // red-600
  secondary: '#2563eb', // blue-600
  success: '#16a34a', // green-600
  warning: '#d97706', // amber-600
  muted: '#6b7280', // gray-500
};

const CHART_COLORS = ['#dc2626', '#2563eb', '#16a34a', '#d97706', '#8b5cf6'];

export default function AnalyticsDashboard({ data }: AnalyticsDashboardProps) {
  // Prepare chart data
  const trafficSourceData = data.trafficSources.map(source => ({
    name: source.source.charAt(0).toUpperCase() + source.source.slice(1),
    value: source.count,
  }));

  const deviceData = data.deviceBreakdown.map(device => ({
    name: device.device.charAt(0).toUpperCase() + device.device.slice(1),
    value: device.count,
  }));

  const leadTypeData = data.leadBreakdown.map(lead => ({
    name: getLeadTypeName(lead.type),
    value: lead.count,
  }));

  const trendData = data.dailyTrend.map(day => ({
    date: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
    visitors: day.visitors,
    views: day.property_views,
  }));

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Mobile Header */}
      <div className="md:hidden bg-white rounded-lg shadow-sm border border-zinc-200 p-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-red-50 rounded-lg">
            <BarChart3 className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-zinc-950">Analytics</h1>
            <p className="text-sm text-zinc-600">Last 30 days performance</p>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block">
        <h1 className="text-3xl font-bold text-zinc-950">Analytics Dashboard</h1>
        <p className="text-zinc-600 mt-1">The A-B-C Funnel: Audience → Behavior → Conversion</p>
      </div>

      {/* Sample Data Notice */}
      {data.totalVisitors === 47 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
              <BarChart3 className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-blue-900">Analytics Preview Mode</h3>
              <p className="text-sm text-blue-800 mt-1">
                This dashboard is showing sample data to demonstrate the A-B-C funnel functionality. 
                Real analytics will be captured once your site starts receiving visitors and the database is migrated.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Section 1: The "At-a-Glance" KPI Bar */}
      <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4 md:p-6 border border-red-200">
        <h2 className="text-lg md:text-xl font-bold text-red-800 mb-4">📊 At-a-Glance Health Check (Last 30 Days)</h2>
        
        {/* Mobile KPI Grid */}
        <div className="md:hidden grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <Users className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-zinc-950">{data.totalVisitors}</p>
            <p className="text-xs text-zinc-600">Total Visitors</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <Eye className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-zinc-950">{data.totalPropertyViews}</p>
            <p className="text-xs text-zinc-600">Property Views</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <UserCheck className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-zinc-950">{data.totalLeads}</p>
            <p className="text-xs text-zinc-600">Leads Generated</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <TrendingUp className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-zinc-950">{data.conversionRate}%</p>
            <p className="text-xs text-zinc-600">Conversion Rate</p>
          </div>
        </div>

        {/* Desktop KPI Grid */}
        <div className="hidden md:grid grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 text-center shadow-sm">
            <Users className="w-8 h-8 text-red-600 mx-auto mb-3" />
            <p className="text-3xl font-bold text-zinc-950">{data.totalVisitors}</p>
            <p className="text-sm text-zinc-600 mt-1">Total Visitors</p>
            <p className="text-xs text-zinc-500 mt-2">Unique people who visited your site</p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-sm">
            <Eye className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <p className="text-3xl font-bold text-zinc-950">{data.totalPropertyViews}</p>
            <p className="text-sm text-zinc-600 mt-1">Property Views</p>
            <p className="text-xs text-zinc-500 mt-2">Times your listings were viewed</p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-sm">
            <UserCheck className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <p className="text-3xl font-bold text-zinc-950">{data.totalLeads}</p>
            <p className="text-sm text-zinc-600 mt-1">Leads Generated</p>
            <p className="text-xs text-zinc-500 mt-2">Potential clients who contacted you</p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-sm">
            <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-3" />
            <p className="text-3xl font-bold text-zinc-950">{data.conversionRate}%</p>
            <p className="text-sm text-zinc-600 mt-1">Conversion Rate</p>
            <p className="text-xs text-zinc-500 mt-2">Visitors who became leads</p>
          </div>
        </div>

        {/* Insight Box */}
        {data.conversionRate > 5 && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              🎉 <strong>Great conversion rate!</strong> Your website is effectively turning visitors into leads.
            </p>
          </div>
        )}
        
        {data.conversionRate < 2 && data.totalVisitors > 10 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              💡 <strong>Optimization opportunity:</strong> You have good traffic but low conversions. Consider improving your call-to-action buttons.
            </p>
          </div>
        )}
      </div>

      {/* Section 2: "How are people finding me?" - Traffic Sources */}
      <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-4 md:p-6">
        <h3 className="text-lg font-semibold text-zinc-950 mb-4">🔍 How are people finding me?</h3>
        
        {trafficSourceData.length > 0 ? (
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-full md:w-1/2 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trafficSourceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  >
                    {trafficSourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="w-full md:w-1/2 space-y-3">
              {trafficSourceData.map((source, index) => (
                <div key={source.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded mr-3" 
                      style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                    ></div>
                    <span className="text-sm font-medium text-zinc-700">{source.name}</span>
                  </div>
                  <span className="text-sm text-zinc-600">{source.value} visits</span>
                </div>
              ))}
              
              {/* Actionable Insights */}
              {trafficSourceData.find(s => s.name === 'Social' && s.value > trafficSourceData.reduce((sum, s) => sum + s.value, 0) * 0.5) && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    📱 <strong>Social media is your strength!</strong> Focus more on WhatsApp and social sharing.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
            <p className="text-zinc-500">No traffic data yet. Start sharing your profile link!</p>
          </div>
        )}
      </div>

      {/* Section 3: "What are they interested in?" - Content Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Top Properties */}
        <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-4 md:p-6">
          <h3 className="text-lg font-semibold text-zinc-950 mb-4">🏠 Top 5 Most Viewed Properties</h3>
          
          {data.topProperties.length > 0 ? (
            <div className="space-y-3">
              {data.topProperties.slice(0, 5).map((property, index) => (
                <div key={property.id} className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-6 h-6 bg-red-600 text-white rounded-full text-xs font-bold mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-zinc-950 text-sm truncate max-w-32 md:max-w-none">
                        {property.title}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-zinc-950">{property.views}</p>
                    <p className="text-xs text-zinc-600">views</p>
                  </div>
                </div>
              ))}
              
              {data.topProperties[0]?.views > 20 && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    🌟 <strong>&quot;{data.topProperties[0].title}&quot;</strong> is your hottest listing! Feature it prominently.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Eye className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
              <p className="text-zinc-500">No property views yet. Share your listings!</p>
            </div>
          )}
        </div>

        {/* Most Popular Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-4 md:p-6">
          <h3 className="text-lg font-semibold text-zinc-950 mb-4">📞 Most Popular Actions</h3>
          
          {leadTypeData.length > 0 ? (
            <div className="space-y-3">
              {leadTypeData.map((lead, index) => (
                <div key={lead.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getLeadIcon(lead.name)}
                    <span className="text-sm font-medium text-zinc-700">{lead.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-zinc-600">{lead.value}</span>
                    <div className="w-20 bg-zinc-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ 
                          width: `${Math.max(10, (lead.value / Math.max(...leadTypeData.map(l => l.value))) * 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
              
              {leadTypeData.find(l => l.name === 'Call' && l.value > data.totalLeads * 0.6) && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    📞 <strong>Clients prefer calling!</strong> Make sure you&apos;re ready to answer your phone.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <UserCheck className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
              <p className="text-zinc-500">No leads yet. Optimize your contact buttons!</p>
            </div>
          )}
        </div>
      </div>

      {/* Section 4: "Who is my audience?" - Visitor Demographics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Device Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-4 md:p-6">
          <h3 className="text-lg font-semibold text-zinc-950 mb-4">📱 Device Breakdown</h3>
          
          {deviceData.length > 0 ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-full h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {deviceData.find(d => d.name === 'Mobile' && d.value > data.totalVisitors * 0.8) && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg w-full">
                  <p className="text-sm text-blue-800">
                    📱 <strong>90%+ mobile traffic!</strong> Your mobile-first design is crucial.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Smartphone className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
              <p className="text-zinc-500">No device data yet.</p>
            </div>
          )}
        </div>

        {/* Top Locations */}
        <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-4 md:p-6">
          <h3 className="text-lg font-semibold text-zinc-950 mb-4">📍 Top 3 Visitor Locations</h3>
          
          {data.topLocations.length > 0 ? (
            <div className="space-y-3">
              {data.topLocations.slice(0, 3).map((location, index) => (
                <div key={location.location} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-zinc-400 mr-3" />
                    <span className="text-sm font-medium text-zinc-700">{location.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-zinc-600">{location.count}</span>
                    <div className="w-16 bg-zinc-200 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full" 
                        style={{ 
                          width: `${Math.max(10, (location.count / Math.max(...data.topLocations.map(l => l.count))) * 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
              
              {data.topLocations.length > 1 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    🌍 <strong>Multi-city interest!</strong> Consider expanding your service areas.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <MapPin className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
              <p className="text-zinc-500">No location data available.</p>
            </div>
          )}
        </div>
      </div>

      {/* 7-Day Trend Chart */}
      {trendData.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-4 md:p-6">
          <h3 className="text-lg font-semibold text-zinc-950 mb-4">📈 7-Day Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="visitors" fill={COLORS.primary} name="Visitors" />
                <Bar dataKey="views" fill={COLORS.secondary} name="Property Views" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

function getLeadTypeName(type: string): string {
  switch (type) {
    case 'CALL': return 'Call';
    case 'WHATSAPP': return 'WhatsApp';
    case 'FORM': return 'Contact Form';
    case 'EMAIL': return 'Email';
    default: return type;
  }
}

function getLeadIcon(name: string) {
  switch (name) {
    case 'Call':
      return <Phone className="w-4 h-4 text-zinc-400 mr-3" />;
    case 'WhatsApp':
      return <MessageCircle className="w-4 h-4 text-zinc-400 mr-3" />;
    case 'Contact Form':
      return <FileText className="w-4 h-4 text-zinc-400 mr-3" />;
    case 'Email':
      return <Mail className="w-4 h-4 text-zinc-400 mr-3" />;
    default:
      return <UserCheck className="w-4 h-4 text-zinc-400 mr-3" />;
  }
}