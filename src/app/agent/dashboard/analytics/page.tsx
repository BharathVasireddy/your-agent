import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { 
  TrendingUp, 
  DollarSign, 
  Calendar,
  MapPin,
  Home,
  BarChart3
} from 'lucide-react';

interface AnalyticsData {
  totalProperties: number;
  totalValue: number;
  averagePrice: number;
  propertiesByStatus: {
    available: number;
    sold: number;
    rented: number;
  };
  propertiesByType: {
    [key: string]: number;
  };
  propertiesByLocation: {
    [key: string]: number;
  };
  recentActivity: {
    id: string;
    title: string;
    type: string;
    date: Date;
    price: number;
  }[];
  monthlyStats: {
    month: string;
    properties: number;
    value: number;
  }[];
}

async function getAnalyticsData(userId: string): Promise<AnalyticsData> {
  // Fetch all properties for the agent
  const properties = await prisma.property.findMany({
    where: {
      agent: {
        userId: userId
      }
    },
    select: {
      id: true,
      title: true,
      price: true,
      status: true,
      propertyType: true,
      location: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Calculate analytics
  const totalProperties = properties.length;
  const totalValue = properties.reduce((sum, prop) => sum + prop.price, 0);
  const averagePrice = totalProperties > 0 ? Math.round(totalValue / totalProperties) : 0;

  // Properties by status
  const propertiesByStatus = {
    available: properties.filter(p => p.status === 'Available').length,
    sold: properties.filter(p => p.status === 'Sold').length,
    rented: properties.filter(p => p.status === 'Rented').length,
  };

  // Properties by type
  const propertiesByType: { [key: string]: number } = {};
  properties.forEach(prop => {
    propertiesByType[prop.propertyType] = (propertiesByType[prop.propertyType] || 0) + 1;
  });

  // Properties by location
  const propertiesByLocation: { [key: string]: number } = {};
  properties.forEach(prop => {
    propertiesByLocation[prop.location] = (propertiesByLocation[prop.location] || 0) + 1;
  });

  // Recent activity (last 10 properties)
  const recentActivity = properties.slice(0, 10).map(prop => ({
    id: prop.id,
    title: prop.title,
    type: prop.propertyType,
    date: prop.createdAt,
    price: prop.price,
  }));

  // Monthly stats (last 6 months)
  const monthlyStats = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
    const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    
    const monthProperties = properties.filter(p => 
      p.createdAt >= monthStart && p.createdAt <= monthEnd
    );
    
    monthlyStats.push({
      month: month.toLocaleDateString('en-US', { month: 'short' }),
      properties: monthProperties.length,
      value: monthProperties.reduce((sum, prop) => sum + prop.price, 0),
    });
  }

  return {
    totalProperties,
    totalValue,
    averagePrice,
    propertiesByStatus,
    propertiesByType,
    propertiesByLocation,
    recentActivity,
    monthlyStats,
  };
}

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/api/auth/signin');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session as any).user.id as string;

  const analyticsData = await getAnalyticsData(userId);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Mobile Header */}
      <div className="md:hidden bg-white rounded-lg shadow-sm border border-zinc-200 p-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg">
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-zinc-950">Analytics</h1>
            <p className="text-sm text-zinc-600">Your performance insights</p>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block">
        <h1 className="text-3xl font-bold text-zinc-950">Analytics</h1>
        <p className="text-zinc-600 mt-1">Track your property portfolio performance</p>
      </div>

      {/* Mobile Key Metrics */}
      <div className="md:hidden bg-white rounded-lg shadow-sm border border-zinc-200 p-4">
        <h2 className="text-lg font-semibold text-zinc-950 mb-3">Key Metrics</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg mb-2 mx-auto">
              <Home className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-lg font-bold text-zinc-950">{analyticsData.totalProperties}</p>
            <p className="text-xs text-zinc-600">Properties</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-green-50 rounded-lg mb-2 mx-auto">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-lg font-bold text-zinc-950">₹{(analyticsData.totalValue / 10000000).toFixed(1)}Cr</p>
            <p className="text-xs text-zinc-600">Total Value</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-orange-50 rounded-lg mb-2 mx-auto">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-lg font-bold text-zinc-950">₹{(analyticsData.averagePrice / 100000).toFixed(1)}L</p>
            <p className="text-xs text-zinc-600">Avg Price</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-green-50 rounded-lg mb-2 mx-auto">
              <div className="w-4 h-4 rounded-full bg-green-600"></div>
            </div>
            <p className="text-lg font-bold text-zinc-950">{analyticsData.propertiesByStatus.available}</p>
            <p className="text-xs text-zinc-600">Available</p>
          </div>
        </div>
      </div>

      {/* Desktop Key Metrics */}
      <div className="hidden md:grid grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600">Total Properties</p>
              <p className="text-2xl font-bold text-zinc-950">{analyticsData.totalProperties}</p>
            </div>
            <Home className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600">Total Portfolio Value</p>
              <p className="text-2xl font-bold text-zinc-950">₹{(analyticsData.totalValue / 10000000).toFixed(1)}Cr</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600">Average Price</p>
              <p className="text-2xl font-bold text-zinc-950">₹{(analyticsData.averagePrice / 100000).toFixed(1)}L</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600">Available Properties</p>
              <p className="text-2xl font-bold text-zinc-950">{analyticsData.propertiesByStatus.available}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-green-600"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Status Distribution */}
      <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-4 md:p-6">
        <h3 className="text-lg font-semibold text-zinc-950 mb-4">Property Status</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
              <span className="text-sm font-medium text-zinc-700">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-zinc-600">{analyticsData.propertiesByStatus.available}</span>
              <div className="w-20 bg-zinc-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${(analyticsData.propertiesByStatus.available / analyticsData.totalProperties) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded mr-3"></div>
              <span className="text-sm font-medium text-zinc-700">Sold</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-zinc-600">{analyticsData.propertiesByStatus.sold}</span>
              <div className="w-20 bg-zinc-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full" 
                  style={{ width: `${(analyticsData.propertiesByStatus.sold / analyticsData.totalProperties) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
              <span className="text-sm font-medium text-zinc-700">Rented</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-zinc-600">{analyticsData.propertiesByStatus.rented}</span>
              <div className="w-20 bg-zinc-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${(analyticsData.propertiesByStatus.rented / analyticsData.totalProperties) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Types & Locations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Property Types */}
        <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-4 md:p-6">
          <h3 className="text-lg font-semibold text-zinc-950 mb-4">Property Types</h3>
          <div className="space-y-3">
            {Object.entries(analyticsData.propertiesByType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-700">{type}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-zinc-600">{count}</span>
                  <div className="w-16 bg-zinc-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(count / analyticsData.totalProperties) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Locations */}
        <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-4 md:p-6">
          <h3 className="text-lg font-semibold text-zinc-950 mb-4">Top Locations</h3>
          <div className="space-y-3">
            {Object.entries(analyticsData.propertiesByLocation)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([location, count]) => (
              <div key={location} className="flex items-center justify-between">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 text-zinc-400 mr-2" />
                  <span className="text-sm font-medium text-zinc-700 truncate">{location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-zinc-600">{count}</span>
                  <div className="w-16 bg-zinc-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full" 
                      style={{ width: `${(count / analyticsData.totalProperties) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-4 md:p-6">
        <h3 className="text-lg font-semibold text-zinc-950 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {analyticsData.recentActivity.slice(0, 5).map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg mr-3">
                  <Home className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-zinc-950 text-sm truncate max-w-40 md:max-w-none">{activity.title}</p>
                  <p className="text-xs text-zinc-600">
                    {activity.type} • {activity.date.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-zinc-950">₹{(activity.price / 100000).toFixed(1)}L</p>
                <p className="text-xs text-zinc-600">Added</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-4 md:p-6">
        <h3 className="text-lg font-semibold text-zinc-950 mb-4">6-Month Trend</h3>
        <div className="space-y-4">
          {analyticsData.monthlyStats.map((stat, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 text-zinc-400 mr-3" />
                <span className="text-sm font-medium text-zinc-700">{stat.month}</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-semibold text-zinc-950">{stat.properties}</p>
                  <p className="text-xs text-zinc-600">Properties</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-zinc-950">₹{(stat.value / 10000000).toFixed(1)}Cr</p>
                  <p className="text-xs text-zinc-600">Value</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}