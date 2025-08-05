import Link from 'next/link';
import { Settings, User } from 'lucide-react';

interface DashboardAgentHeaderProps {
  agent: {
    id: string;
    slug: string;
    profilePhotoUrl: string | null;
    specialization: string | null;
    city: string | null;
    user: {
      id: string;
      name: string | null;
      email: string | null;
      image: string | null;
    };
  } | null;
}

export default function DashboardAgentHeader({ agent }: DashboardAgentHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Profile Photo */}
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            {agent?.profilePhotoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={agent.profilePhotoUrl}
                alt={agent.user.name || 'Agent'}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-red-600" />
            )}
          </div>
          
          {/* Agent Info */}
          <div>
            <h1 className="text-2xl font-bold text-zinc-950">
              Welcome back, {agent?.user.name || 'Agent'}!
            </h1>
            <p className="text-zinc-600">
              {agent?.specialization || 'Real Estate Agent'} • {agent?.city || 'Location'}
            </p>
            {agent?.slug && (
              <p className="text-sm text-zinc-500">
                youragent.in/agent/{agent.slug}
              </p>
            )}
          </div>
        </div>
        
        {/* Edit Profile Button */}
        <Link
          href="/agent/dashboard/profile"
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Settings className="w-4 h-4 mr-2" />
          Edit Profile
        </Link>
      </div>
    </div>
  );
}