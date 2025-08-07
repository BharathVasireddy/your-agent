'use client';

import { Phone, Mail } from 'lucide-react';

interface ContactBarProps {
  agent: {
    phone: string | null;
    user: {
      email: string | null;
    };
  };
}

export default function ContactBar({ agent }: ContactBarProps) {
  return (
    <div className="sticky bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t shadow-lg sm:relative sm:bg-card sm:backdrop-blur-none sm:border sm:rounded-lg sm:shadow-sm" style={{ zIndex: 'var(--z-sticky)' }}>
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex gap-3 justify-center">
          {/* Call Now Button */}
          {agent.phone && (
            <a
              href={`tel:${agent.phone}`}
              className="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium text-center min-w-[140px]"
              aria-label={`Call ${agent.phone}`}
            >
              <Phone className="w-5 h-5 mr-2" />
              Call Now
            </a>
          )}

          {/* Email Button */}
          {agent.user.email && (
            <a
              href={`mailto:${agent.user.email}`}
              className="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-center min-w-[140px]"
              aria-label={`Email ${agent.user.email}`}
            >
              <Mail className="w-5 h-5 mr-2" />
              Email
            </a>
          )}
        </div>

        {/* Phone Number Display */}
        {agent.phone && (
          <div className="text-center mt-2 sm:hidden">
            <p className="text-sm text-muted-foreground">
              {agent.phone}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}