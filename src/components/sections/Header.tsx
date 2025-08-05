'use client';

import { useState } from 'react';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Agent {
  id: string;
  slug: string;
  phone: string | null;
  logoUrl: string | null;
  user: {
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
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-zinc-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
            {agent.logoUrl ? (
              <div className="h-10 w-10 rounded-lg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={agent.logoUrl}
                  alt={`${agent.user.name} Logo`}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}
            <div>
              <h1 className="text-xl font-bold text-zinc-950">{agent.user.name}</h1>
              <p className="text-sm text-zinc-600">Real Estate Agent</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className="text-zinc-700 hover:text-red-600 transition-colors text-sm font-medium"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Contact Info & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Quick Contact (Desktop) */}
            <div className="hidden lg:flex items-center space-x-3">
              {agent.phone && (
                <a
                  href={`tel:${agent.phone}`}
                  className="flex items-center space-x-1 text-sm text-zinc-600 hover:text-red-600 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>{agent.phone}</span>
                </a>
              )}
              {agent.user.email && (
                <a
                  href={`mailto:${agent.user.email}`}
                  className="flex items-center space-x-1 text-sm text-zinc-600 hover:text-red-600 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </a>
              )}
            </div>

            {/* CTA Button */}
            <Button
              onClick={() => scrollToSection('#contact')}
              className="hidden sm:flex bg-red-600 hover:bg-red-700 text-white"
            >
              Get In Touch
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-zinc-700 hover:text-red-600 transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-zinc-200 py-4">
            <nav className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className="text-zinc-700 hover:text-red-600 transition-colors text-sm font-medium text-left"
                >
                  {item.label}
                </button>
              ))}
              {/* Mobile Contact */}
              <div className="pt-3 border-t border-zinc-200 space-y-2">
                {agent.phone && (
                  <a
                    href={`tel:${agent.phone}`}
                    className="flex items-center space-x-2 text-sm text-zinc-600 hover:text-red-600 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{agent.phone}</span>
                  </a>
                )}
                {agent.user.email && (
                  <a
                    href={`mailto:${agent.user.email}`}
                    className="flex items-center space-x-2 text-sm text-zinc-600 hover:text-red-600 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span>{agent.user.email}</span>
                  </a>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}