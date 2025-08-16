'use client';

import { IconWebsite, IconFacebook, IconInstagram, IconLinkedIn, IconYouTube, IconTwitterX } from '@/components/icons/SocialIcons';

type Agent = {
  websiteUrl?: string | null;
  officeAddress?: string | null;
  officeMapUrl?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  linkedinUrl?: string | null;
  youtubeUrl?: string | null;
  twitterUrl?: string | null;
};

export default function Footer({ agent }: { agent: Agent }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-template-background border-t border-template-border-light py-8">
      <div className="max-w-7xl mx-auto px-template-container">
        <div className="text-center">
          {(agent.officeAddress || agent.officeMapUrl) && (
            <div className="mb-4">
              {agent.officeAddress && (
                <p className="text-template-text-secondary text-sm font-template-primary">{agent.officeAddress}</p>
              )}
              {agent.officeMapUrl && (
                <p className="mt-1">
                  <a href={agent.officeMapUrl} target="_blank" rel="noopener noreferrer" className="text-template-primary hover:underline text-sm">View on Map</a>
                </p>
              )}
            </div>
          )}
          <p className="text-template-text-muted font-template-primary text-sm">
            © {currentYear} Professional Real Estate Services. All rights reserved.
          </p>
          <p className="text-template-text-muted font-template-primary text-xs mt-2">
            Designed for excellence in real estate.
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-template-text-secondary">
            {agent.websiteUrl && (
              <a href={agent.websiteUrl} target="_blank" rel="noopener noreferrer" aria-label="Website"><IconWebsite className="w-5 h-5 hover:text-template-primary" /></a>
            )}
            {agent.facebookUrl && (
              <a href={agent.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><IconFacebook className="w-5 h-5 hover:text-template-primary" /></a>
            )}
            {agent.instagramUrl && (
              <a href={agent.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><IconInstagram className="w-5 h-5 hover:text-template-primary" /></a>
            )}
            {agent.linkedinUrl && (
              <a href={agent.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><IconLinkedIn className="w-5 h-5 hover:text-template-primary" /></a>
            )}
            {agent.youtubeUrl && (
              <a href={agent.youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube"><IconYouTube className="w-5 h-5 hover:text-template-primary" /></a>
            )}
            {agent.twitterUrl && (
              <a href={agent.twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Twitter/X"><IconTwitterX className="w-5 h-5 hover:text-template-primary" /></a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}