'use client';

import { Heart } from 'lucide-react';
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
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-zinc-900 text-white py-12">
      <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand Section */}
            <div>
              <h3 className="text-xl font-bold mb-4">YourAgent</h3>
              <p className="text-zinc-400 leading-relaxed mb-4">
                Connecting people with their perfect homes. Professional real estate services 
                with a personal touch.
              </p>
              <div className="flex items-center text-sm text-zinc-400">
                Made with <Heart className="w-4 h-4 mx-1 text-brand" /> for real estate excellence
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => {
                      const element = document.querySelector('#hero');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      const element = document.querySelector('#properties');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    Properties
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      const element = document.querySelector('#about');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      const element = document.querySelector('#testimonials');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    Testimonials
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      const element = document.querySelector('#contact');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <div className="flex flex-wrap gap-4 text-zinc-300">
                {agent.websiteUrl && (
                  <a href={agent.websiteUrl} target="_blank" rel="noopener noreferrer" aria-label="Website"><IconWebsite className="w-5 h-5 hover:text-white" /></a>
                )}
                {agent.facebookUrl && (
                  <a href={agent.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><IconFacebook className="w-5 h-5 hover:text-white" /></a>
                )}
                {agent.instagramUrl && (
                  <a href={agent.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><IconInstagram className="w-5 h-5 hover:text-white" /></a>
                )}
                {agent.linkedinUrl && (
                  <a href={agent.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><IconLinkedIn className="w-5 h-5 hover:text-white" /></a>
                )}
                {agent.youtubeUrl && (
                  <a href={agent.youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube"><IconYouTube className="w-5 h-5 hover:text-white" /></a>
                )}
                {agent.twitterUrl && (
                  <a href={agent.twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Twitter/X"><IconTwitterX className="w-5 h-5 hover:text-white" /></a>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-zinc-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-zinc-400 text-sm mb-4 md:mb-0">
                © {currentYear} YourAgent. All rights reserved.
              </div>
              
              <div className="flex items-center space-x-6">
                <button
                  onClick={scrollToTop}
                  className="text-zinc-400 hover:text-white transition-colors text-sm"
                >
                  Back to Top ↑
                </button>
                <div className="text-zinc-400 text-sm">
                  Professional Real Estate Services
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}