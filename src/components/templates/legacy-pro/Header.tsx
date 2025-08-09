'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Menu, X, Phone, Mail, Home } from 'lucide-react';
import { logoFontClassNameByKey } from '@/lib/logo-fonts';


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
  logoFont?: string | null;
  logoMaxHeight?: number | null;
  logoMaxWidth?: number | null;
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
  const { data: session } = useSession();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isOwner = session && (session as any).user && (session as any).user.id === agent.user.id;
  const pathname = usePathname();
  const router = useRouter();
  const onAgentHome = pathname === `/${agent.slug}`;

  const navItems = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Properties', href: '#properties' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Blog', href: '#blog' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleNav = (href: string) => {
    if (onAgentHome) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setIsMenuOpen(false);
        return;
      }
    }
    router.push(`/${agent.slug}${href}`);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="header-container w-full px-4 md:px-6">
        <div className="flex items-center h-16">
          {/* Left - Logo/Brand/Name */}
          <div className="flex items-center gap-3 flex-1">
            <Link href={`/${agent.slug}`} className="flex items-center" aria-label="Go to home">
              {agent.logoUrl ? (
                <div
                  className="overflow-hidden"
                  style={{
                    maxHeight: `${agent.logoMaxHeight ?? 48}px`,
                    maxWidth: `${agent.logoMaxWidth ?? 160}px`,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={agent.logoUrl}
                    alt={`${agent.user.name} Logo`}
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : (
                <h1
                  className={`text-lg font-semibold text-zinc-950 tracking-tight ${logoFontClassNameByKey[agent.logoFont || 'sans']}`}
                >
                  {agent.user.name || 'REALTOR'}
                </h1>
              )}
            </Link>
          </div>

          {/* Center - Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 flex-1 justify-center">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNav(item.href)}
                className="text-zinc-700 hover:text-zinc-950 transition-colors text-sm font-medium capitalize"
              >
                {item.label}
              </button>
            ))}
            {isOwner && (
              <Link href="/agent/dashboard" className="text-zinc-700 hover:text-zinc-950 transition-colors text-sm font-medium capitalize">
                Dashboard
              </Link>
            )}
          </nav>

          {/* Right - Contact quick actions (mobile) + Contact (desktop) */}
          <div className="flex items-center gap-4 flex-1 justify-end">
            {/* Contact Icons (Desktop) */}
            <div className="hidden lg:flex items-center gap-4">
              {agent.phone && (
                <a href={`tel:${agent.phone}`} className="flex items-center gap-2 text-sm text-zinc-700 hover:text-zinc-950">
                  <Phone className="w-4 h-4" />
                  <span>({agent.phone})</span>
                </a>
              )}
              
              {agent.phone && (
                <a href={`https://wa.me/${agent.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-zinc-700 hover:text-zinc-950">
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              )}
              
              {agent.user.email && (
                <a href={`mailto:${agent.user.email}`} className="flex items-center gap-2 text-sm text-zinc-700 hover:text-zinc-950">
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </a>
              )}
            </div>

            {/* Mobile quick actions */}
            <div className="lg:hidden flex items-center gap-2 mr-1">
              {agent.phone && (
                <a
                  href={`tel:${agent.phone}`}
                  aria-label="Call"
                  title="Call"
                  className="inline-flex items-center gap-2 h-9 px-3 rounded-full border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-zinc-400 shadow-xs active:scale-95 transition"
                >
                  <Phone className="w-4 h-4" />
                  <span className="text-xs font-medium">Call</span>
                </a>
              )}
              {agent.phone && (
                <a
                  href={`https://wa.me/${agent.phone.replace(/\D/g, '')}`}
                  aria-label="WhatsApp"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="WhatsApp"
                  className="inline-flex items-center gap-2 h-9 px-3 rounded-full border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-zinc-400 shadow-xs active:scale-95 transition"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span className="text-xs font-medium">WhatsApp</span>
                </a>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-zinc-700 hover:text-zinc-950 transition-colors"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

      {/* Mobile Off-canvas Navigation */}
      {/* Backdrop */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/40 transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        className={`lg:hidden fixed inset-y-0 right-0 w-80 max-w-[85%] bg-white shadow-2xl border-l border-zinc-200 z-50 transform transition-transform duration-300 ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-200">
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5 text-zinc-700" />
            <span className="text-sm font-medium text-zinc-900">Menu</span>
          </div>
          <button
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
            className="p-2 text-zinc-700 hover:text-zinc-950"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex flex-col space-y-3 p-4 overflow-y-auto h-[calc(100%-56px)]">
          {isOwner && (
            <Link
              href="/agent/dashboard"
              onClick={() => setIsMenuOpen(false)}
              className="text-zinc-800 hover:text-zinc-950 transition-colors text-sm font-medium capitalize"
            >
              Dashboard
            </Link>
          )}

          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleNav(item.href)}
              className="text-zinc-800 hover:text-zinc-950 transition-colors text-sm font-medium text-left capitalize"
            >
              {item.label}
            </button>
          ))}

          <div className="pt-4 mt-2 border-t border-zinc-200 space-y-3">
            {agent.phone && (
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${agent.phone}`}
                  className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-zinc-400 shadow-xs"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Phone className="w-4 h-4" />
                  <span className="text-sm font-medium">Call</span>
                </a>
                <a
                  href={`https://wa.me/${agent.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-zinc-400 shadow-xs"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">WhatsApp</span>
                </a>
              </div>
            )}
            {agent.user.email && (
              <a
                href={`mailto:${agent.user.email}`}
                className="inline-flex items-center gap-2 text-sm text-zinc-700 hover:text-zinc-950"
                onClick={() => setIsMenuOpen(false)}
              >
                <Mail className="w-4 h-4" />
                <span>{agent.user.email}</span>
              </a>
            )}
          </div>
        </nav>
      </aside>
      </div>
    </header>
  );
}