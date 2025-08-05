'use client';

import { User } from 'lucide-react';

interface AgentHeaderProps {
  agent: {
    user: {
      name: string | null;
      image: string | null;
    };
    city: string | null;
    area: string | null;
    experience: number | null;
    profilePhotoUrl?: string | null;
  };
}

export default function AgentHeader({ agent }: AgentHeaderProps) {
  const displayImage = agent.profilePhotoUrl || agent.user.image;

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          {displayImage ? (
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-primary/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={displayImage}
                alt={`${agent.user.name} - Real Estate Agent`}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-muted border-4 border-primary/20 flex items-center justify-center">
              <User className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Agent Info */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            {agent.user.name || 'Agent'}
          </h1>
          <p className="text-lg text-muted-foreground mb-1">
            Real Estate Agent{agent.experience ? ` • ${agent.experience} years experience` : ''}
          </p>
          <p className="text-base text-muted-foreground">
            📍 {agent.city || 'Location not specified'}{agent.area ? ` - ${agent.area}` : ''}
          </p>
        </div>
      </div>
    </div>
  );
}