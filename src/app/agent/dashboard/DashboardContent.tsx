import Link from 'next/link';
import { User, Home, Plus, TrendingUp, Settings } from 'lucide-react';
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
  return (
    <div className="space-y-6">
      {/* Agent Header */}
      <div id="agent-header">
        <DashboardAgentHeader agent={agent} />
      </div>

      {/* Quick Stats */}
      <div id="quick-stats" className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      {/* Profile Completion */}
      {agent && (
        <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6">
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