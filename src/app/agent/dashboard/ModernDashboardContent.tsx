'use client';

import Link from 'next/link';
import { User, Home, Plus, TrendingUp, Settings, BarChart3, Eye, MapPin, Phone, ExternalLink, Building2, Activity, Target, ArrowUpRight } from 'lucide-react';
import { useInstantNav } from '@/components/InstantNavProvider';
import type { AgentProfile, Property } from '@/types/dashboard';

interface ModernDashboardContentProps {
  agent: AgentProfile | null;
  properties: Property[];
  saleProperties: number;
  rentProperties: number;
  availableProperties: number;
}

export default function ModernDashboardContent({ 
  agent, 
  properties, 
  saleProperties, 
  rentProperties, 
  availableProperties 
}: ModernDashboardContentProps) {
  const { navigateInstantly } = useInstantNav();
  
  // Calculate some additional metrics
  const totalProperties = properties.length;
  const avgPropertyValue = properties.length > 0 
    ? Math.round(properties.reduce((sum, p) => sum + p.price, 0) / properties.length)
    : 0;
  
  return (
    <div className="space-y-6">
      {/* Modern Welcome Header */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Profile Photo */}
            <div className="relative">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-orange-50 flex items-center justify-center overflow-hidden border-2 border-orange-100">
                {agent?.profilePhotoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={agent.profilePhotoUrl}
                    alt={agent.user.name || 'Agent'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 md:w-10 md:h-10 text-brand" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            
            {/* Welcome Text */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-zinc-950">
                Welcome back, {agent?.user.name?.split(' ')[0] || 'Agent'}! 👋
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                {agent?.city && (
                  <div className="flex items-center gap-1 text-zinc-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">
                      {agent?.area ? `${agent.area}, ${agent.city}` : agent.city}
                    </span>
                  </div>
                )}
                {agent?.phone && (
                  <div className="flex items-center gap-1 text-zinc-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{agent.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Quick Profile Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              href={`/${agent?.slug}`}
              target="_blank"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors text-sm font-medium text-zinc-700"
            >
              <Eye className="w-4 h-4" />
              View Live Site
              <ExternalLink className="w-3 h-3" />
            </Link>
            <Link
              href="/agent/dashboard/profile"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-brand hover:bg-brand-hover rounded-lg transition-colors text-sm font-medium text-white"
            >
              <Settings className="w-4 h-4" />
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Modern Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Total Properties */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl">🏠</span>
          </div>
          <div>
            <p className="text-3xl font-bold text-zinc-950 mb-1">{totalProperties}</p>
            <p className="text-sm text-zinc-600">Total Properties</p>
          </div>
        </div>

        {/* For Sale */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl">💰</span>
          </div>
          <div>
            <p className="text-3xl font-bold text-zinc-950 mb-1">{saleProperties}</p>
            <p className="text-sm text-zinc-600">For Sale</p>
          </div>
        </div>

        {/* For Rent */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
              <Home className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-2xl">🏘️</span>
          </div>
          <div>
            <p className="text-3xl font-bold text-zinc-950 mb-1">{rentProperties}</p>
            <p className="text-sm text-zinc-600">For Rent</p>
          </div>
        </div>

        {/* Available */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-2xl">✅</span>
          </div>
          <div>
            <p className="text-3xl font-bold text-zinc-950 mb-1">{availableProperties}</p>
            <p className="text-sm text-zinc-600">Available</p>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-brand-light rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-brand" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-950">Quick Actions ⚡</h3>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => navigateInstantly('/agent/dashboard/properties/new')}
              className="w-full flex items-center gap-4 p-4 bg-brand-light hover:bg-brand-muted rounded-xl transition-colors group"
            >
              <div className="w-12 h-12 bg-brand rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-zinc-950">Add New Property</p>
                <p className="text-sm text-zinc-600">Create a stunning listing</p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-zinc-400 ml-auto" />
            </button>
            
            <Link
              href="/agent/dashboard/properties"
              className="w-full flex items-center gap-4 p-4 bg-zinc-50 hover:bg-zinc-100 rounded-xl transition-colors group"
            >
              <div className="w-12 h-12 bg-zinc-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6 text-zinc-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-zinc-950">Manage Properties</p>
                <p className="text-sm text-zinc-600">Edit and organize listings</p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-zinc-400 ml-auto" />
            </Link>

            <Link
              href="/agent/dashboard/analytics"
              className="w-full flex items-center gap-4 p-4 bg-zinc-50 hover:bg-zinc-100 rounded-xl transition-colors group"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-zinc-950">View Analytics</p>
                <p className="text-sm text-zinc-600">Track your performance</p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-zinc-400 ml-auto" />
            </Link>
          </div>
        </div>

        {/* Recent Properties */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Home className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-950">Recent Properties 🏡</h3>
            </div>
            <Link
              href="/agent/dashboard/properties"
              className="text-sm text-brand hover:text-brand-hover font-medium"
            >
              View All
            </Link>
          </div>
          
          {properties.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-zinc-400" />
              </div>
              <p className="text-zinc-500 mb-4">No properties yet</p>
              <Link
                href="/agent/dashboard/properties/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-hover transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add your first property
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {properties.slice(0, 4).map((property) => (
                <div key={property.id} className="flex items-center gap-4 p-4 bg-zinc-50 rounded-xl hover:bg-zinc-100 transition-colors">
                  <div className="w-12 h-12 bg-zinc-200 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-zinc-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-zinc-950 text-sm truncate">{property.title}</p>
                    <p className="text-sm text-zinc-600">
                      ₹{property.price.toLocaleString('en-IN')} • {property.propertyType}
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    property.status === 'Available' 
                      ? 'bg-green-100 text-green-700'
                      : property.status === 'Sold'
                      ? 'bg-brand-light text-brand'
                      : 'bg-zinc-100 text-zinc-700'
                  }`}>
                    {property.status}
                  </span>
                </div>
              ))}
              {properties.length > 4 && (
                <div className="pt-2">
                  <Link
                    href="/agent/dashboard/properties"
                    className="text-sm text-brand hover:text-brand-hover font-medium"
                  >
                    +{properties.length - 4} more properties
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Performance Insights */}
      {totalProperties > 0 && (
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-950">Performance Insights 📊</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-zinc-700">Average Property Value</span>
              </div>
              <p className="text-2xl font-bold text-zinc-950">
                ₹{avgPropertyValue.toLocaleString('en-IN')}
              </p>
            </div>
            
            <div className="bg-zinc-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm font-medium text-zinc-700">Listing Success Rate</span>
              </div>
              <p className="text-2xl font-bold text-zinc-950">
                {totalProperties > 0 ? Math.round((availableProperties / totalProperties) * 100) : 0}%
              </p>
            </div>
            
            <div className="bg-zinc-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-4 text-orange-600" />
                </div>
                <span className="text-sm font-medium text-zinc-700">Portfolio Growth</span>
              </div>
              <p className="text-2xl font-bold text-zinc-950">
                +{totalProperties}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
