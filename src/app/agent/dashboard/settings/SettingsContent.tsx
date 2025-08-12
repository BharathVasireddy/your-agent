'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  User, 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Download,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff,
  Copy,
  Check,
  LogOut
} from 'lucide-react';
import { signOut } from 'next-auth/react';

interface UserData {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

interface AgentData {
  id: string;
  slug: string;
  profilePhotoUrl: string | null;
  bio: string | null;
  experience: number | null;
  city: string | null;
  area: string | null;
  phone: string | null;
  isSubscribed: boolean;
  createdAt: Date;
}

interface SettingsContentProps {
  user: UserData;
  agent: AgentData | null;
}

export default function SettingsContent({ user, agent }: SettingsContentProps) {
  const [activeSection, setActiveSection] = useState<'profile' | 'account' | 'privacy' | 'notifications'>('profile');
  const [showProfileUrl, setShowProfileUrl] = useState(false);
  const [copied, setCopied] = useState(false);

  const profileUrl = agent ? `https://youragent.in/${agent.slug}` : '';

  const copyProfileUrl = async () => {
    if (profileUrl) {
      try {
        await navigator.clipboard.writeText(profileUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  const completionPercentage = agent ? (() => {
    let completed = 0;
    const total = 5;
    
    if (agent.profilePhotoUrl) completed++;
    if (agent.bio) completed++;
    if (agent.experience) completed++;
    if (agent.phone) completed++;
    if (agent.city && agent.area) completed++;
    
    return Math.round((completed / total) * 100);
  })() : 0;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Mobile Header */}
      <div className="md:hidden bg-white rounded-lg shadow-sm border border-zinc-200 p-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-zinc-50 rounded-lg">
            <SettingsIcon className="w-5 h-5 text-zinc-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-zinc-950">Settings</h1>
            <p className="text-sm text-zinc-600">Manage your account</p>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block">
        <h1 className="text-3xl font-bold text-zinc-950">Settings</h1>
        <p className="text-zinc-600 mt-1">Manage your account and preferences</p>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="md:hidden bg-white rounded-lg shadow-sm border border-zinc-200 p-1">
        <div className="grid grid-cols-4 gap-1">
          <button
            onClick={() => setActiveSection('profile')}
            className={`p-3 text-xs font-medium rounded-lg transition-colors ${
              activeSection === 'profile'
                ? 'bg-brand-light text-brand'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <User className="w-4 h-4 mx-auto mb-1" />
            Profile
          </button>
          <button
            onClick={() => setActiveSection('account')}
            className={`p-3 text-xs font-medium rounded-lg transition-colors ${
              activeSection === 'account'
                ? 'bg-brand-light text-brand'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Shield className="w-4 h-4 mx-auto mb-1" />
            Account
          </button>
          <button
            onClick={() => setActiveSection('privacy')}
            className={`p-3 text-xs font-medium rounded-lg transition-colors ${
              activeSection === 'privacy'
                ? 'bg-brand-light text-brand'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Eye className="w-4 h-4 mx-auto mb-1" />
            Privacy
          </button>
          <button
            onClick={() => setActiveSection('notifications')}
            className={`p-3 text-xs font-medium rounded-lg transition-colors ${
              activeSection === 'notifications'
                ? 'bg-brand-light text-brand'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Bell className="w-4 h-4 mx-auto mb-1" />
            Alerts
          </button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:grid grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="space-y-1">
          <button
            onClick={() => setActiveSection('profile')}
            className={`w-full text-left p-3 rounded-lg transition-colors ${
              activeSection === 'profile'
                ? 'bg-brand-light text-brand border border-brand-soft'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
            }`}
          >
            <div className="flex items-center">
              <User className="w-5 h-5 mr-3" />
              Profile Settings
            </div>
          </button>
          <button
            onClick={() => setActiveSection('account')}
            className={`w-full text-left p-3 rounded-lg transition-colors ${
              activeSection === 'account'
                ? 'bg-brand-light text-brand border border-brand-soft'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
            }`}
          >
            <div className="flex items-center">
              <Shield className="w-5 h-5 mr-3" />
              Account Security
            </div>
          </button>
          <button
            onClick={() => setActiveSection('privacy')}
            className={`w-full text-left p-3 rounded-lg transition-colors ${
              activeSection === 'privacy'
                ? 'bg-brand-light text-brand border border-brand-soft'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
            }`}
          >
            <div className="flex items-center">
              <Eye className="w-5 h-5 mr-3" />
              Privacy Settings
            </div>
          </button>
          <button
            onClick={() => setActiveSection('notifications')}
            className={`w-full text-left p-3 rounded-lg transition-colors ${
              activeSection === 'notifications'
                ? 'bg-brand-light text-brand border border-brand-soft'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
            }`}
          >
            <div className="flex items-center">
              <Bell className="w-5 h-5 mr-3" />
              Notifications
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="col-span-3">
          {activeSection === 'profile' && <ProfileSettings user={user} agent={agent} profileUrl={profileUrl} completionPercentage={completionPercentage} />}
          {activeSection === 'account' && <AccountSettings user={user} agent={agent} />}
          {activeSection === 'privacy' && <PrivacySettings profileUrl={profileUrl} showProfileUrl={showProfileUrl} setShowProfileUrl={setShowProfileUrl} copyProfileUrl={copyProfileUrl} copied={copied} />}
          {activeSection === 'notifications' && <NotificationSettings />}
        </div>
      </div>

      {/* Mobile Content */}
      <div className="md:hidden">
        {activeSection === 'profile' && <ProfileSettings user={user} agent={agent} profileUrl={profileUrl} completionPercentage={completionPercentage} />}
        {activeSection === 'account' && <AccountSettings user={user} agent={agent} />}
        {activeSection === 'privacy' && <PrivacySettings profileUrl={profileUrl} showProfileUrl={showProfileUrl} setShowProfileUrl={setShowProfileUrl} copyProfileUrl={copyProfileUrl} copied={copied} />}
        {activeSection === 'notifications' && <NotificationSettings />}
      </div>

      {/* Sign Out Button */}
      <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <LogOut className="w-5 h-5 text-brand mr-3" />
            <div>
              <p className="font-medium text-zinc-950">Sign Out</p>
              <p className="text-sm text-zinc-600">Sign out from your account</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-hover transition-colors text-sm font-medium"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileSettings({ user, agent, profileUrl, completionPercentage }: { user: UserData; agent: AgentData | null; profileUrl: string; completionPercentage: number }) {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Profile Completion */}
      <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-4 md:p-6">
        <h3 className="text-lg font-semibold text-zinc-950 mb-4">Profile Completion</h3>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-zinc-600">Profile completed</span>
          <span className="text-sm font-semibold text-zinc-950">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-zinc-200 rounded-full h-2 mb-4">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        <Link
          href="/agent/dashboard/profile"
          className="inline-flex items-center text-brand hover:text-brand-hover text-sm font-medium"
        >
          Complete your profile
          <ExternalLink className="w-4 h-4 ml-1" />
        </Link>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-4 md:p-6">
        <h3 className="text-lg font-semibold text-zinc-950 mb-4">Basic Information</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-950">Full Name</p>
              <p className="text-sm text-zinc-600">{user.name || 'Not set'}</p>
            </div>
            <Link
              href="/agent/dashboard/profile"
              className="text-brand hover:text-brand-hover text-sm font-medium"
            >
              Edit
            </Link>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-950">Email</p>
              <p className="text-sm text-zinc-600">{user.email}</p>
            </div>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Verified</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-950">Phone</p>
              <p className="text-sm text-zinc-600">{agent?.phone || 'Not set'}</p>
            </div>
            <Link
              href="/agent/dashboard/profile"
              className="text-brand hover:text-brand-hover text-sm font-medium"
            >
              {agent?.phone ? 'Edit' : 'Add'}
            </Link>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-950">Location</p>
              <p className="text-sm text-zinc-600">
                {agent?.city && agent?.area ? `${agent.city}, ${agent.area}` : 'Not set'}
              </p>
            </div>
            <Link
              href="/agent/dashboard/profile"
              className="text-brand hover:text-brand-hover text-sm font-medium"
            >
              {agent?.city ? 'Edit' : 'Add'}
            </Link>
          </div>
        </div>
      </div>

      {/* Professional Details */}
      <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-4 md:p-6">
        <h3 className="text-lg font-semibold text-zinc-950 mb-4">Professional Details</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-950">Experience</p>
              <p className="text-sm text-zinc-600">
                {agent?.experience ? `${agent.experience} years` : 'Not set'}
              </p>
            </div>
            <Link
              href="/agent/dashboard/profile"
              className="text-brand hover:text-brand-hover text-sm font-medium"
            >
              {agent?.experience ? 'Edit' : 'Add'}
            </Link>
          </div>
          

          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-950">Profile URL</p>
              <p className="text-sm text-zinc-600 truncate max-w-48">{profileUrl}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Link
                href={profileUrl}
                target="_blank"
                className="text-brand hover:text-brand-hover text-sm font-medium"
              >
                View
              </Link>
              <Link
                href="/agent/dashboard/profile"
                className="text-brand hover:text-brand-hover text-sm font-medium"
              >
                Edit
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-4 md:p-6">
        <h3 className="text-lg font-semibold text-zinc-950 mb-4">Contact Information</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-950">Phone Number</p>
              <p className="text-sm text-zinc-600">{agent?.phone || 'Not set'}</p>
            </div>
            <Link
              href="/agent/dashboard/profile"
              className="text-brand hover:text-brand-hover text-sm font-medium"
            >
              {agent?.phone ? 'Edit' : 'Add'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function AccountSettings({ user, agent }: { user: UserData; agent: AgentData | null }) {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Subscription Status */}
      <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-4 md:p-6">
        <h3 className="text-lg font-semibold text-zinc-950 mb-4">Subscription</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-zinc-950">Current Plan</p>
            <p className="text-sm text-zinc-600">
              {agent?.isSubscribed ? 'Premium Plan' : 'Free Plan'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              agent?.isSubscribed 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {agent?.isSubscribed ? 'Active' : 'Limited'}
            </span>
            {!agent?.isSubscribed && (
              <Link
                href="/subscribe"
                className="px-3 py-1 bg-brand text-white rounded-lg text-xs font-medium hover:bg-brand-hover transition-colors"
              >
                Upgrade
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-4 md:p-6">
        <h3 className="text-lg font-semibold text-zinc-950 mb-4">Account Information</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-950">Account Status</p>
              <p className="text-sm text-zinc-600">Active</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-950">Profile Status</p>
              <p className="text-sm text-zinc-600">
                {agent ? 'Created' : 'Not created'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-950">User ID</p>
              <p className="text-sm text-zinc-600 font-mono">{user.id}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-4 md:p-6">
        <h3 className="text-lg font-semibold text-zinc-950 mb-4">Security</h3>
        <div className="space-y-4">
          {/* Password-based auth removed */}
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-950">Two-Factor Authentication</p>
              <p className="text-sm text-zinc-600">Not available yet</p>
            </div>
            <span className="text-xs text-zinc-400">Coming soon</span>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-4 md:p-6">
        <h3 className="text-lg font-semibold text-zinc-950 mb-4">Data Management</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-950">Export Data</p>
              <p className="text-sm text-zinc-600">Download all your data</p>
            </div>
            <button className="flex items-center text-zinc-600 hover:text-zinc-900 text-sm font-medium">
              <Download className="w-4 h-4 mr-1" />
              Export
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-950 text-brand">Delete Account</p>
              <p className="text-sm text-zinc-600">Permanently delete your account</p>
            </div>
            <button className="flex items-center text-brand hover:text-brand-hover text-sm font-medium">
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrivacySettings({ profileUrl, showProfileUrl, setShowProfileUrl, copyProfileUrl, copied }: { 
  profileUrl: string; 
  showProfileUrl: boolean; 
  setShowProfileUrl: (show: boolean) => void; 
  copyProfileUrl: () => void; 
  copied: boolean; 
}) {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Profile Visibility */}
      <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-4 md:p-6">
        <h3 className="text-lg font-semibold text-zinc-950 mb-4">Profile Visibility</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-950">Public Profile</p>
              <p className="text-sm text-zinc-600">Your profile is visible to everyone</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              Public
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-950">Profile URL</p>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-zinc-600">
                  {showProfileUrl ? profileUrl : '••••••••••••••••••••••••••••••••'}
                </p>
                <button
                  onClick={() => setShowProfileUrl(!showProfileUrl)}
                  className="text-zinc-400 hover:text-zinc-600"
                >
                  {showProfileUrl ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              onClick={copyProfileUrl}
              className="flex items-center text-brand hover:text-brand-hover text-sm font-medium"
            >
              {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-4 md:p-6">
        <h3 className="text-lg font-semibold text-zinc-950 mb-4">Contact Information</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-950">Show Phone Number</p>
              <p className="text-sm text-zinc-600">Display phone on public profile</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
               <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-950">Show WhatsApp</p>
              <p className="text-sm text-zinc-600">Display WhatsApp on public profile</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
               <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-950">Show Email</p>
              <p className="text-sm text-zinc-600">Display email on public profile</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
               <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Property Visibility */}
      <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-4 md:p-6">
        <h3 className="text-lg font-semibold text-zinc-950 mb-4">Property Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-950">Show Property Prices</p>
              <p className="text-sm text-zinc-600">Display prices on public listings</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
               <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-950">Allow Property Inquiries</p>
              <p className="text-sm text-zinc-600">Let visitors contact you about properties</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
               <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Search Engine Visibility */}
      <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-4 md:p-6">
        <h3 className="text-lg font-semibold text-zinc-950 mb-4">Search Engine Visibility</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-950">Allow Search Engine Indexing</p>
              <p className="text-sm text-zinc-600">Let search engines find your profile</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
               <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationSettings() {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Email Notifications */}
      <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-4 md:p-6">
        <h3 className="text-lg font-semibold text-zinc-950 mb-4">Email Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-950">Property Inquiries</p>
              <p className="text-sm text-zinc-600">New inquiries about your properties</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
               <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-950">Weekly Analytics Report</p>
              <p className="text-sm text-zinc-600">Performance summary every week</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
               <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-950">Account Updates</p>
              <p className="text-sm text-zinc-600">Important account information</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-950">Marketing Updates</p>
              <p className="text-sm text-zinc-600">Product updates and tips</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Push Notifications */}
      <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-4 md:p-6">
        <h3 className="text-lg font-semibold text-zinc-950 mb-4">Push Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-950">Instant Notifications</p>
              <p className="text-sm text-zinc-600">Get notified immediately</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-950">Quiet Hours</p>
              <p className="text-sm text-zinc-600">No notifications from 10 PM to 8 AM</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
            </label>
          </div>
        </div>
      </div>

      {/* SMS Notifications */}
      <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-4 md:p-6">
        <h3 className="text-lg font-semibold text-zinc-950 mb-4">SMS Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-950">Critical Alerts</p>
              <p className="text-sm text-zinc-600">Important security and account alerts</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-950">Property Alerts</p>
              <p className="text-sm text-zinc-600">New inquiries via SMS</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}