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
    <section id="hero" className="relative h-screen flex flex-col">
      <div id="hero-public" className="absolute inset-0 z-0 mx-2 md:mx-4 mt-4 rounded-3xl overflow-hidden">
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

      <div className="relative z-10 flex-1 flex items-center pt-20">
        <div className="w-full px-8 md:px-12 lg:px-16 mt-4">
          <div className="w-full">
            <div className="flex items-center h-full">
              <div className="text-white w-full md:w-3/4 lg:w-2/3">
                <div className="max-w-3xl">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
                    {agent.heroTitle || 'Trusted Real Estate Advisor'}
                    <br />
                    <span className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl">in {agent.city || 'Hyderabad'}</span>
                  </h1>
                  <p className="text-lg md:text-xl lg:text-2xl mb-12 text-white/90 font-light max-w-2xl">
                    {agent.heroSubtitle ||
                      `Luxury Homes & Premium Properties${agent.area ? ` in ${agent.area}` : ' in Beverly Hills'}`}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
                    {stats.map((stat, index) => (
                      <div key={index} className="text-white">
                        <div className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 leading-none">
                          {stat.number}
                        </div>
                        <div className="text-sm md:text-base lg:text-lg text-white/80 font-medium">{stat.label}</div>
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