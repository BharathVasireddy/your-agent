'use server';

import Image from 'next/image';
import { PerformanceSafeguards } from '@/lib/performance';
import dynamic from 'next/dynamic';
import ClientEditOnly from '@/components/ClientEditOnly';

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

interface HeroSectionProps { agent: Agent; }

// Dynamically load the editable client variant only when opted-in
const HeroSectionEditable = dynamic(() => import('./HeroSectionEditable'));

export default async function HeroSection({ agent }: HeroSectionProps) {
  // Server-rendered public view (no client hydration by default)
  const stats = [
    { number: '200+', label: 'Property Sold' },
    { number: '70+', label: 'Happy Clients' },
    { number: '140+', label: 'Builders' },
    { number: `${agent.experience || 14}+`, label: 'Years Experience' },
  ];

  const isOwner = false; // default server rendering without owner check

  return (
    <section id="hero" className="relative min-h-[65vh] md:min-h-[calc(100vh-64px)] flex flex-col">
      <div id="hero-public" className="absolute inset-0 z-0 mx-2 md:mx-4 mt-1 md:mt-2 rounded-3xl overflow-hidden">
        {agent.heroImage ? (
          <Image
            src={agent.heroImage}
            alt="Hero background"
            fill
            className="object-cover"
            {...PerformanceSafeguards.getImageProps('hero')}
          />
        ) : (
          <>
            <Image
              src="/images/hero-background.jpg"
              alt="Modern luxury house at twilight"
              fill
              className="object-cover"
              {...PerformanceSafeguards.getImageProps('hero')}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 opacity-0 transition-opacity duration-300" />
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center md:justify-start pt-2 pb-4 md:pt-12 md:pb-0">
        <div className="w-full px-4 sm:px-6 md:pl-10 md:pr-0 lg:pl-12 lg:pr-0 xl:pl-16 xl:pr-0 mt-0 md:mt-4">
          <div className="w-full">
            <div className="flex items-center h-full">
              <div className="text-white w-full md:w-3/4 lg:w-2/3 mx-auto md:mx-0">
                <div className="max-w-3xl mx-auto md:mx-0 text-center md:text-left">
                  <h1 className="text-[9vw] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold mb-2 md:mb-5 leading-tight">
                    {agent.heroTitle || 'Trusted Real Estate Advisor'}
                  </h1>
                  <p className="text-base md:text-lg lg:text-xl mb-4 md:mb-8 text-white max-w-2xl font-medium mx-auto md:mx-0">
                    {agent.heroSubtitle ||
                      `Luxury Homes & Premium Properties${agent.area ? ` in ${agent.area}` : ''}`}
                  </p>
                  {/* CTA Buttons */}
                  <div className="flex flex-wrap gap-2 md:gap-3 mb-4 md:mb-10 justify-center md:justify-start">
                    <a
                      href="#properties"
                      className="inline-flex items-center px-4 py-2 md:px-5 md:py-3 rounded-full bg-white text-zinc-900 font-medium hover:bg-zinc-100 text-sm md:text-base"
                    >
                      Explore Properties
                      <span className="ml-2">↗</span>
                    </a>
                    {agent.phone && (
                      <a
                        href={`https://wa.me/${agent.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 md:px-5 md:py-3 rounded-full border border-white/70 text-white hover:bg-white/10 font-medium text-sm md:text-base"
                      >
                        Schedule a call
                        <span className="ml-2">↗</span>
                      </a>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 md:gap-8 lg:gap-12">
                    {stats.map((stat, index) => (
                      <div key={index} className="text-white text-center md:text-left">
                        <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-1 md:mb-2 leading-none">
                          {stat.number}
                        </div>
                        <div className="text-xs sm:text-sm md:text-base lg:text-lg text-white/80 font-medium">{stat.label}</div>
                      </div>
                    ))}
                  </div>
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