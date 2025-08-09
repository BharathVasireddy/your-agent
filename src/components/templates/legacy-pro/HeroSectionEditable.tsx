'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import EditableWrapper from '@/components/ClientOnlyEditableWrapper';
import { updateAgentHeroTitle, updateAgentHeroSubtitle } from '@/app/actions';
import { useParams } from 'next/navigation';
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

export default function HeroSectionEditable({ agent }: HeroSectionProps) {
  const params = useParams();
  const agentSlug = params.agentSlug as string;

  const scrollTo = (id: string) => {
    const element = document.querySelector(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const stats = [
    { number: '200+', label: 'Property Sold' },
    { number: '70+', label: 'Happy Clients' },
    { number: '140+', label: 'Builders' },
    { number: `${agent.experience || 14}+`, label: 'Years Experience' },
  ];

  return (
    <section id="hero" className="relative min-h-[65vh] md:min-h-[calc(100vh-64px)] flex flex-col">
      <div className="absolute inset-0 z-0 mx-2 md:mx-4 mt-1 md:mt-2 rounded-3xl overflow-hidden">
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
              priority={true}
              onError={(e) => {
                const target = e.target as HTMLElement;
                (target as HTMLElement).style.display = 'none';
                const parent = (target as HTMLElement).parentElement;
                if (parent) parent.classList.add('bg-gradient-to-br', 'from-blue-900', 'via-blue-800', 'to-indigo-900');
              }}
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
                  <EditableWrapper
                    value={agent.heroTitle || 'Trusted Real Estate Advisor'}
                    onSave={async (newTitle) => {
                      await updateAgentHeroTitle(agentSlug, newTitle);
                    }}
                    type="title"
                    placeholder="Enter hero title..."
                  >
                      <h1 className="text-[9vw] sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 md:mb-6 leading-tight">
                      {agent.heroTitle || 'Trusted Real Estate Advisor'}
                      <br />
                        <span className="text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl">in {agent.city || 'Hyderabad'}</span>
                    </h1>
                  </EditableWrapper>

                  <EditableWrapper
                    value={
                      agent.heroSubtitle || `Luxury Homes & Premium Properties${agent.area ? ` in ${agent.area}` : ' in Beverly Hills'}`
                    }
                    onSave={async (newSubtitle) => {
                      await updateAgentHeroSubtitle(agentSlug, newSubtitle);
                    }}
                    type="textarea"
                    placeholder="Enter hero subtitle..."
                  >
                    <p className="text-base md:text-xl lg:text-2xl mb-4 md:mb-12 text-white/90 font-light max-w-2xl mx-auto md:mx-0">
                      {agent.heroSubtitle ||
                        `Luxury Homes & Premium Properties${agent.area ? ` in ${agent.area}` : ' in Beverly Hills'}`}
                    </p>
                  </EditableWrapper>

                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-16 justify-center md:justify-start">
                    <Button
                      onClick={() => scrollTo('#properties')}
                      size="lg"
                      className="bg-white text-black hover:bg-gray-100 px-6 py-3 md:px-8 md:py-4 text-sm md:text-base lg:text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 border-0"
                    >
                      Explore Properties
                      <div className="ml-3 w-6 h-6 bg-black rounded-full flex items-center justify-center">
                        <ArrowRight className="w-3 h-3 text-white" />
                      </div>
                    </Button>
                    <Button
                      onClick={() => scrollTo('#contact')}
                      variant="outline"
                      size="lg"
                      className="border-2 border-white/50 text-white hover:bg-white/10 px-6 py-3 md:px-8 md:py-4 text-sm md:text-base lg:text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 bg-transparent"
                    >
                      Schedule a call
                      <div className="ml-3 w-6 h-6 border border-white/50 rounded-full flex items-center justify-center">
                        <ArrowRight className="w-3 h-3 text-white" />
                      </div>
                    </Button>
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
    </section>
  );
}


