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

interface HeroSectionProps { agent: Agent; }

export default function HeroSectionEditable({ agent }: HeroSectionProps) {
  const params = useParams();
  const agentSlug = params.agentSlug as string;

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const stats = [
    { value: `${agent.experience || '5'}+`, label: 'Years Experience' },
    { value: '200+', label: 'Properties Sold' },
    { value: '150+', label: 'Happy Clients' },
    { value: '24/7', label: 'Available' },
  ];

  return (
    <section id="hero" className="bg-template-background py-template-section">
      <div className="max-w-7xl mx-auto px-template-container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-template-element">
            <div className="space-y-6">
              <EditableWrapper
                value={agent.heroTitle || `Professional Real Estate Services in ${agent.city || 'Your Area'}`}
                onSave={async (value) => { await updateAgentHeroTitle(agentSlug, value); }}
                className="group"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-template-primary font-bold text-template-text-primary leading-tight">
                  {agent.heroTitle || `Professional Real Estate Services in ${agent.city || 'Your Area'}`}
                </h1>
              </EditableWrapper>

              <EditableWrapper
                value={
                  agent.heroSubtitle ||
                  `Your trusted partner for buying, selling, and investing in real estate. ${
                    agent.experience ? `With ${agent.experience} years of experience` : 'Expert guidance'
                  } to help you make the right decisions.`
                }
                onSave={async (value) => { await updateAgentHeroSubtitle(agentSlug, value); }}
                className="group"
              >
                <p className="text-lg md:text-xl text-template-text-secondary font-template-primary leading-relaxed max-w-xl">
                  {agent.heroSubtitle ||
                    `Your trusted partner for buying, selling, and investing in real estate. ${
                      agent.experience ? `With ${agent.experience} years of experience` : 'Expert guidance'
                    } to help you make the right decisions.`}
                </p>
              </EditableWrapper>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => scrollTo('#properties')}
                className="bg-template-primary hover:bg-template-primary-hover text-white px-8 py-3 rounded-template-button font-template-primary font-semibold text-base shadow-template-md hover:shadow-template-lg transition-all duration-300 group"
              >
                View Properties
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                onClick={() => scrollTo('#contact')}
                className="border-2 border-template-primary text-template-primary hover:bg-template-primary hover:text-white px-8 py-3 rounded-template-button font-template-primary font-semibold text-base transition-all duration-300"
              >
                Get Consultation
              </Button>
            </div>

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
                      <div className="w-12 h-12 bg-template-primary/20 rounded-full flex items-center justify-center" />
                    </div>
                    <p className="font-template-primary">Professional Photo</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


