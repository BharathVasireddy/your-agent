import React from 'react';
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
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-zinc-600 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          {(agent.officeAddress || agent.officeMapUrl) && (
            <div className="text-zinc-700">
              {agent.officeAddress && (<div className="truncate">{agent.officeAddress}</div>)}
              {agent.officeMapUrl && (
                <a href={agent.officeMapUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-900 hover:underline">View on Map</a>
              )}
            </div>
          )}
        </div>
        <div>© {new Date().getFullYear()} YourAgent</div>
        <div className="flex gap-4 text-zinc-600">
          {agent.websiteUrl && (<a href={agent.websiteUrl} target="_blank" rel="noopener noreferrer" aria-label="Website"><IconWebsite className="w-5 h-5 hover:text-zinc-900" /></a>)}
          {agent.facebookUrl && (<a href={agent.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><IconFacebook className="w-5 h-5 hover:text-zinc-900" /></a>)}
          {agent.instagramUrl && (<a href={agent.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><IconInstagram className="w-5 h-5 hover:text-zinc-900" /></a>)}
          {agent.linkedinUrl && (<a href={agent.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><IconLinkedIn className="w-5 h-5 hover:text-zinc-900" /></a>)}
          {agent.youtubeUrl && (<a href={agent.youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube"><IconYouTube className="w-5 h-5 hover:text-zinc-900" /></a>)}
          {agent.twitterUrl && (<a href={agent.twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Twitter/X"><IconTwitterX className="w-5 h-5 hover:text-zinc-900" /></a>)}
        </div>
      </div>
    </footer>
  );
}


