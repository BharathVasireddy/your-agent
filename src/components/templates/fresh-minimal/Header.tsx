'use client';

import { useState } from 'react';
import { Menu, X, Phone, Mail, Home } from 'lucide-react';
import Image from 'next/image';
import DashboardButton from '@/components/DashboardButton';
import { IconWebsite, IconFacebook, IconInstagram, IconLinkedIn, IconYouTube, IconTwitterX } from '@/components/icons/SocialIcons';

// WhatsApp Icon Component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 16 16"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
  </svg>
);

interface Agent {
  id: string;
  slug: string;
  phone: string | null;
  logoUrl: string | null;
  websiteUrl?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  linkedinUrl?: string | null;
  youtubeUrl?: string | null;
  twitterUrl?: string | null;
  user: {
    id: string;
    name: string | null;
    email: string | null;
  };
}

interface HeaderProps {
  agent: Agent;
}

export default function Header({ agent }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '#hero' },
    { label: 'Properties', href: '#properties' },
    { label: 'About', href: '#about' },
    { label: 'Reviews', href: '#testimonials' },
    { label: 'Blog', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-template-background border-b border-template-border-light sticky top-0 z-50 backdrop-blur-sm bg-template-background/90">
      <div className="max-w-7xl mx-auto px-template-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
            {agent.logoUrl ? (
              <Image 
                src={agent.logoUrl} 
                alt={`${agent.user.name} Logo`}
                width={96}
                height={32}
                className="h-8 w-auto object-contain"
              />
            ) : (
              <div className="bg-template-primary text-white p-2 rounded-template-button">
                <Home size={20} />
              </div>
            )}
            <div>
              <h1 className="font-template-primary font-semibold text-lg text-template-text-primary">
                {agent.user.name || 'Real Estate Agent'}
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.href)}
                className="px-4 py-2 text-template-text-secondary hover:text-template-primary hover:bg-template-background-secondary rounded-template-button transition-all duration-200 font-template-primary text-sm font-medium"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Contact Actions (Desktop) */}
          <div className="hidden md:flex items-center space-x-3">
            {agent.phone && (
              <>
                <a
                  href={`tel:${agent.phone}`}
                  className="flex items-center space-x-2 px-4 py-2 text-template-text-secondary hover:text-template-primary hover:bg-template-background-secondary rounded-template-button transition-all duration-200"
                  title="Call now"
                >
                  <Phone size={16} />
                  <span className="font-template-primary text-sm font-medium">Call</span>
                </a>
                <a
                  href={`https://wa.me/${agent.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-template-primary hover:bg-template-primary-hover text-white rounded-template-button transition-all duration-200 shadow-template-sm"
                  title="WhatsApp"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span className="font-template-primary text-sm font-medium">WhatsApp</span>
                </a>
              </>
            )}
            <DashboardButton agentUserId={agent.user.id} />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-template-text-secondary hover:text-template-primary hover:bg-template-background-secondary rounded-template-button transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-template-border-light bg-template-background">
            <div className="py-4 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  className="block w-full px-4 py-3 text-left text-template-text-secondary hover:text-template-primary hover:bg-template-background-secondary rounded-template-button transition-all font-template-primary font-medium"
                >
                  {item.label}
                </button>
              ))}
              
              {/* Mobile contact actions */}
              <div className="pt-4 border-t border-template-border-light space-y-2">
                {agent.phone && (
                  <>
                    <a
                      href={`tel:${agent.phone}`}
                      className="flex items-center space-x-3 px-4 py-3 text-template-text-secondary hover:text-template-primary hover:bg-template-background-secondary rounded-template-button transition-all"
                    >
                      <Phone size={20} />
                      <span className="font-template-primary font-medium">Call {agent.phone}</span>
                    </a>
                    <a
                      href={`https://wa.me/${agent.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 px-4 py-3 bg-template-primary text-white rounded-template-button hover:bg-template-primary-hover transition-all"
                    >
                      <WhatsAppIcon className="w-5 h-5" />
                      <span className="font-template-primary font-medium">WhatsApp</span>
                    </a>
                  </>
                )}
                {agent.user.email && (
                  <a
                    href={`mailto:${agent.user.email}`}
                    className="flex items-center space-x-3 px-4 py-3 text-template-text-secondary hover:text-template-primary hover:bg-template-background-secondary rounded-template-button transition-all"
                  >
                    <Mail size={20} />
                    <span className="font-template-primary font-medium">Email</span>
                  </a>
                )}
                <div className="px-4 py-2">
                  <DashboardButton agentUserId={agent.user.id} />
                </div>

                {/* Social links */}
                {(agent.websiteUrl || agent.facebookUrl || agent.instagramUrl || agent.linkedinUrl || agent.youtubeUrl || agent.twitterUrl) && (
                  <div className="px-4 pt-2 pb-4 border-t border-template-border-light">
                    <div className="text-xs text-template-text-muted mb-2">Connect</div>
                    <div className="flex flex-wrap gap-4 text-template-text-secondary">
                      {agent.websiteUrl && (<a href={agent.websiteUrl} target="_blank" rel="noopener noreferrer" aria-label="Website"><IconWebsite className="w-5 h-5 hover:text-template-primary" /></a>)}
                      {agent.facebookUrl && (<a href={agent.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><IconFacebook className="w-5 h-5 hover:text-template-primary" /></a>)}
                      {agent.instagramUrl && (<a href={agent.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><IconInstagram className="w-5 h-5 hover:text-template-primary" /></a>)}
                      {agent.linkedinUrl && (<a href={agent.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><IconLinkedIn className="w-5 h-5 hover:text-template-primary" /></a>)}
                      {agent.youtubeUrl && (<a href={agent.youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube"><IconYouTube className="w-5 h-5 hover:text-template-primary" /></a>)}
                      {agent.twitterUrl && (<a href={agent.twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Twitter/X"><IconTwitterX className="w-5 h-5 hover:text-template-primary" /></a>)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}