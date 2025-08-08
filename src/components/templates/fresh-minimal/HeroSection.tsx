// server component (public view)

import dynamic from 'next/dynamic';
import ClientEditOnly from '@/components/ClientEditOnly';
import Image from 'next/image';
import { PerformanceSafeguards } from '@/lib/performance';

interface Agent {
  id: string;
  city: string | null;
  area: string | null;
  phone: string | null;
  heroImage: string | null;
  heroTitle: string | null;
  heroSubtitle: string | null;
  profilePhotoUrl: string | null;
  experience: number | null;
  user: {
    name: string | null;
    email: string | null;
  };
}

interface HeroSectionProps {
  agent: Agent;
}

const HeroSectionEditable = dynamic(() => import('./HeroSectionEditable'));

export default function HeroSection({ agent }: HeroSectionProps) {

  // Default stats that can be customized later
  const stats = [
    { value: `${agent.experience || '5'}+`, label: 'Years Experience' },
    { value: '200+', label: 'Properties Sold' },
    { value: '150+', label: 'Happy Clients' },
    { value: '24/7', label: 'Available' },
  ];

  return (
    <section id="hero" className="bg-template-background py-template-section">
      <div id="hero-public" className="max-w-7xl mx-auto px-template-container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-template-element">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-template-primary font-bold text-template-text-primary leading-tight">
                {agent.heroTitle || `Professional Real Estate Services in ${agent.city || 'Your Area'}`}
              </h1>
              <p className="text-lg md:text-xl text-template-text-secondary font-template-primary leading-relaxed max-w-xl">
                {agent.heroSubtitle || `Your trusted partner for buying, selling, and investing in real estate. ${agent.experience ? `With ${agent.experience} years of experience` : 'Expert guidance'} to help you make the right decisions.`}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="#properties"
                className="inline-flex items-center px-5 py-3 rounded-template-button bg-template-primary text-white font-template-primary hover:bg-template-primary-hover"
              >
                Explore Properties
                <span className="ml-2">↗</span>
              </a>
              {agent.phone && (
                <a
                  href={`https://wa.me/${agent.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-5 py-3 rounded-template-button border border-template-border text-template-text-primary hover:bg-template-background-secondary font-template-primary"
                >
                  Schedule a call
                  <span className="ml-2">↗</span>
                </a>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-template-primary font-bold text-template-primary">
                    {stat.value}
                  </div>
                  <div className="text-sm text-template-text-muted font-template-primary mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-template-card overflow-hidden shadow-template-lg">
              {agent.heroImage || agent.profilePhotoUrl ? (
                <Image
                  src={agent.heroImage || agent.profilePhotoUrl || '/images/default-hero.jpg'}
                  alt={`${agent.user.name} - Real Estate Agent`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  {...PerformanceSafeguards.getImageProps('hero')}
                />
              ) : (
                <div className="w-full h-full bg-template-background-secondary flex items-center justify-center">
                  <div className="text-center text-template-text-muted">
                    <div className="w-24 h-24 bg-template-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-12 h-12 bg-template-primary/20 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-template-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                        </svg>
                      </div>
                    </div>
                    <p className="font-template-primary">Professional Photo</p>
                  </div>
                </div>
              )}
            </div>

            {/* Floating contact card */}
            <div className="absolute -bottom-6 -left-6 bg-template-background border border-template-border-light rounded-template-card p-4 shadow-template-lg">
              <div className="flex items-center space-x-3">
                {agent.profilePhotoUrl && (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={agent.profilePhotoUrl}
                      alt={agent.user.name || 'Agent'}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="font-template-primary font-semibold text-template-text-primary text-sm">
                    {agent.user.name}
                  </p>
                  <p className="text-template-text-muted text-xs font-template-primary">
                    {agent.city && agent.area ? `${agent.area}, ${agent.city}` : agent.city || 'Real Estate Expert'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ClientEditOnly selectorToHide="#hero-public">
        <HeroSectionEditable agent={agent} />
      </ClientEditOnly>
    </section>
  );
}