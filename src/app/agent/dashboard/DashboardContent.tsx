'use client';

import Link from 'next/link';
import { User, Home, Plus, TrendingUp, Settings } from 'lucide-react';
import { useInstantNav } from '@/components/InstantNavProvider';
import DashboardAgentHeader from './DashboardAgentHeader';
import type { AgentProfile, Property } from '@/types/dashboard';

interface DashboardContentProps {
  agent: AgentProfile | null;
  properties: Property[];
  saleProperties: number;
  rentProperties: number;
  availableProperties: number;
}

export default function DashboardContent({ 
  agent, 
  properties, 
  saleProperties, 
  rentProperties, 
  availableProperties 
}: DashboardContentProps) {
  const { navigateInstantly } = useInstantNav();
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Mobile Header */}
      <div className="md:hidden bg-white rounded-lg shadow-sm border border-zinc-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Compact Profile Photo */}
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              {agent?.profilePhotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={agent.profilePhotoUrl}
                  alt={agent.user.name || 'Agent'}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-red-600" />
              )}
            </div>
            
            {/* Compact Agent Info */}
            <div>
              <h1 className="text-lg font-bold text-zinc-950">
                {agent?.user.name || 'Agent'}
              </h1>
              <p className="text-sm text-zinc-600 truncate">
                {agent?.city || 'Location'}{agent?.area ? ` - ${agent.area}` : ''}
              </p>
            </div>
          </div>
          
          {/* Settings Icon */}
          <Link
            href="/agent/dashboard/profile"
            className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 transition-colors"
          >
            <Settings className="w-5 h-5 text-zinc-600" />
          </Link>
        </div>
      </div>

      {/* Desktop Header */}
      <div id="agent-header" className="hidden md:block">
        <DashboardAgentHeader agent={agent} />
      </div>

      {/* Mobile Compact Stats */}
      <div className="md:hidden bg-white rounded-lg shadow-sm border border-zinc-200 p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg mb-2 mx-auto">
              <Home className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-lg font-bold text-zinc-950">{properties.length}</p>
            <p className="text-xs text-zinc-600">Total</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-green-50 rounded-lg mb-2 mx-auto">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-lg font-bold text-zinc-950">{saleProperties}</p>
            <p className="text-xs text-zinc-600">For Sale</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-orange-50 rounded-lg mb-2 mx-auto">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-lg font-bold text-zinc-950">{rentProperties}</p>
            <p className="text-xs text-zinc-600">For Rent</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 bg-green-50 rounded-lg mb-2 mx-auto">
              <div className="w-4 h-4 rounded-full bg-green-600"></div>
            </div>
            <p className="text-lg font-bold text-zinc-950">{availableProperties}</p>
            <p className="text-xs text-zinc-600">Available</p>
          </div>
        </div>
      </div>

      {/* Desktop Stats Grid */}
      <div id="quick-stats" className="hidden md:grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600">Total Properties</p>
              <p className="text-2xl font-bold text-zinc-950">{properties.length}</p>
            </div>
            <Home className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600">For Sale</p>
              <p className="text-2xl font-bold text-zinc-950">{saleProperties}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600">For Rent</p>
              <p className="text-2xl font-bold text-zinc-950">{rentProperties}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-600">Available</p>
              <p className="text-2xl font-bold text-zinc-950">{availableProperties}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-green-600"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Quick Actions */}
      <div className="md:hidden space-y-3">
        <button
          id="add-property-button"
          onClick={() => navigateInstantly('/agent/dashboard/properties/new')}
          className="w-full flex items-center p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors group"
        >
          <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg mr-3">
            <Plus className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-zinc-950">Add New Property</p>
            <p className="text-sm text-zinc-600">Create a new listing</p>
          </div>
        </button>
        
        <Link
          href="/agent/dashboard/properties"
          className="flex items-center p-4 bg-zinc-50 border border-zinc-200 rounded-lg hover:bg-zinc-100 transition-colors"
        >
          <div className="flex items-center justify-center w-10 h-10 bg-zinc-100 rounded-lg mr-3">
            <Home className="w-5 h-5 text-zinc-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-zinc-950">Manage Properties</p>
            <p className="text-sm text-zinc-600">View and edit listings</p>
          </div>
        </Link>
      </div>

      {/* Desktop Quick Actions */}
      <div className="hidden md:grid grid-cols-2 gap-6">
        {/* Add Property Card */}
        <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6">
          <h3 className="text-lg font-semibold text-zinc-950 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              id="add-property-button"
              href="/agent/dashboard/properties/new"
              className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors group"
            >
              <Plus className="w-6 h-6 text-red-600 mr-3" />
              <div>
                <p className="font-medium text-zinc-950">Add New Property</p>
                <p className="text-sm text-zinc-600">Create a new property listing</p>
              </div>
            </Link>
            
            <Link
              href="/agent/dashboard/properties"
              className="flex items-center p-4 bg-zinc-50 border border-zinc-200 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              <Home className="w-6 h-6 text-zinc-600 mr-3" />
              <div>
                <p className="font-medium text-zinc-950">Manage Properties</p>
                <p className="text-sm text-zinc-600">View and edit your listings</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Properties */}
        <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-zinc-950">Recent Properties</h3>
            <Link
              href="/agent/dashboard/properties"
              className="text-sm text-red-600 hover:text-red-700"
            >
              View All
            </Link>
          </div>
          
          {properties.length === 0 ? (
            <div className="text-center py-8">
              <Home className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
              <p className="text-zinc-500">No properties yet</p>
              <Link
                href="/agent/dashboard/properties/new"
                className="inline-flex items-center text-red-600 hover:text-red-700 mt-2"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add your first property
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {properties.slice(0, 3).map((property) => (
                <div key={property.id} className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
                  <div>
                    <p className="font-medium text-zinc-950 text-sm">{property.title}</p>
                    <p className="text-xs text-zinc-600">
                      ₹{property.price.toLocaleString()} • {property.propertyType}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    property.status === 'Available' 
                      ? 'bg-green-100 text-green-800'
                      : property.status === 'Sold'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {property.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Recent Properties */}
      <div className="md:hidden bg-white rounded-lg shadow-sm border border-zinc-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-zinc-950">Recent Properties</h3>
          <Link
            href="/agent/dashboard/properties"
            className="text-sm text-red-600 hover:text-red-700"
          >
            View All
          </Link>
        </div>
        
        {properties.length === 0 ? (
          <div className="text-center py-6">
            <div className="flex items-center justify-center w-12 h-12 bg-zinc-100 rounded-lg mx-auto mb-3">
              <Home className="w-6 h-6 text-zinc-400" />
            </div>
            <p className="text-zinc-500 text-sm">No properties yet</p>
            <Link
              href="/agent/dashboard/properties/new"
              className="inline-flex items-center text-red-600 hover:text-red-700 mt-2 text-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add your first property
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {properties.slice(0, 2).map((property) => (
              <div key={property.id} className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-zinc-950 text-sm truncate">{property.title}</p>
                  <p className="text-xs text-zinc-600">
                    ₹{property.price.toLocaleString()} • {property.propertyType}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ml-2 ${
                  property.status === 'Available' 
                    ? 'bg-green-100 text-green-800'
                    : property.status === 'Sold'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {property.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Profile Completion */}
      {agent && (
        <div className="md:hidden">
          {(!agent.profilePhotoUrl || !agent.bio || properties.length === 0) && (
            <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-4">
              <h3 className="text-lg font-semibold text-zinc-950 mb-3">Complete Profile</h3>
              <div className="space-y-2">
                {!agent.profilePhotoUrl && (
                  <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-lg mr-3">
                        <User className="w-4 h-4 text-yellow-600" />
                      </div>
                      <span className="text-sm text-yellow-800">Add profile photo</span>
                    </div>
                    <Link
                      href="/agent/dashboard/profile"
                      className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
                    >
                      Add
                    </Link>
                  </div>
                )}
                
                {!agent.bio && (
                  <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-lg mr-3">
                        <Settings className="w-4 h-4 text-yellow-600" />
                      </div>
                      <span className="text-sm text-yellow-800">Add bio</span>
                    </div>
                    <Link
                      href="/agent/dashboard/profile"
                      className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
                    >
                      Add
                    </Link>
                  </div>
                )}
                
                {properties.length === 0 && (
                  <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg mr-3">
                        <Plus className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm text-blue-800">Add property</span>
                    </div>
                    <Link
                      href="/agent/dashboard/properties/new"
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Add
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Desktop Profile Completion */}
      {agent && (
        <div className="hidden md:block bg-white rounded-lg shadow-sm border border-zinc-200 p-6">
          <h3 className="text-lg font-semibold text-zinc-950 mb-4">Profile Completion</h3>
          <div className="space-y-3">
            {!agent.profilePhotoUrl && (
              <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <User className="w-5 h-5 text-yellow-600 mr-3" />
                  <span className="text-sm text-yellow-800">Add a profile photo</span>
                </div>
                <Link
                  href="/agent/dashboard/profile"
                  className="text-sm text-yellow-600 hover:text-yellow-700"
                >
                  Add Photo
                </Link>
              </div>
            )}
            
            {!agent.bio && (
              <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <Settings className="w-5 h-5 text-yellow-600 mr-3" />
                  <span className="text-sm text-yellow-800">Add a professional bio</span>
                </div>
                <Link
                  href="/agent/dashboard/profile"
                  className="text-sm text-yellow-600 hover:text-yellow-700"
                >
                  Add Bio
                </Link>
              </div>
            )}
            
            {properties.length === 0 && (
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  <Plus className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-sm text-blue-800">Add your first property listing</span>
                </div>
                <Link
                  href="/agent/dashboard/properties/new"
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Add Property
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}