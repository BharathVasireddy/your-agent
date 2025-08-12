import React from 'react';
import { IconWebsite, IconFacebook, IconInstagram, IconLinkedIn, IconYouTube, IconTwitterX } from '@/components/icons/SocialIcons';

type Agent = {
  websiteUrl?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  linkedinUrl?: string | null;
  youtubeUrl?: string | null;
  twitterUrl?: string | null;
};

export default function Footer({ agent }: { agent: Agent }) {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-zinc-600 flex items-center justify-between">
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


