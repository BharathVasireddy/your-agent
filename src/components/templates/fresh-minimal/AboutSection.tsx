'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Award, Users, Clock, TrendingUp } from 'lucide-react';
import EditableWrapper from '@/components/ClientOnlyEditableWrapper';
import { updateAgentBio } from '@/app/actions';
import { useParams } from 'next/navigation';
import { PerformanceSafeguards } from '@/lib/performance';

interface Agent {
  id: string;
  bio: string | null;
  experience: number | null;
  profilePhotoUrl: string | null;
  city: string | null;
  area: string | null;
  user: {
    name: string | null;
    email: string | null;
  };
}

interface AboutSectionProps {
  agent: Agent;
}

export default function AboutSection({ agent }: AboutSectionProps) {
  const params = useParams();
  const agentSlug = params.agentSlug as string;

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const downloadVisitingCard = async () => {
    try {
      const url = `/agent/dashboard/tools/visiting-card`;
      window.open(url, '_blank');
    } catch {}
  };

  // Professional highlights
  const highlights = [
    {
      icon: Award,
      title: 'Certified Professional',
      description: 'Licensed real estate professional with proven track record'
    },
    {
      icon: Users,
      title: 'Client-Focused',
      description: 'Dedicated to providing personalized service and building lasting relationships'
    },
    {
      icon: Clock,
      title: 'Always Available',
      description: 'Quick response times and flexible scheduling to meet your needs'
    },
    {
      icon: TrendingUp,
      title: 'Market Expert',
      description: 'Deep knowledge of local market trends and property values'
    }
  ];

  return (
    <section id="about" className="py-template-section bg-template-background">
      <div className="max-w-7xl mx-auto px-template-container">
        <div className="grid lg:grid-cols-2 gap-template-element items-center">
          {/* Left - Image */}
          <div className="relative">
            <div className="relative aspect-[3/4] max-w-md mx-auto rounded-template-card overflow-hidden shadow-template-lg">
              {agent.profilePhotoUrl ? (
                <Image
                  src={agent.profilePhotoUrl}
                  alt={`${agent.user.name} - Professional Photo`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  {...PerformanceSafeguards.getImageProps('profile')}
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

            {/* Experience Badge */}
            {agent.experience && (
              <div className="absolute -top-4 -right-4 bg-template-primary text-white rounded-template-card p-4 shadow-template-md">
                <div className="text-center">
                  <div className="text-2xl font-template-primary font-bold">{agent.experience}+</div>
                  <div className="text-xs font-template-primary">Years</div>
                </div>
              </div>
            )}
          </div>

          {/* Right - Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-template-primary font-bold text-template-text-primary mb-4">
                  About {agent.user.name?.split(' ')[0] || 'Me'}
                </h2>
                <div className="w-16 h-1 bg-template-primary rounded-full"></div>
              </div>

              <EditableWrapper
                value={agent.bio || `Hi, I'm ${agent.user.name}, a dedicated real estate professional serving ${agent.city}${agent.area ? ` and ${agent.area}` : ''}. ${agent.experience ? `With ${agent.experience} years of experience` : 'With extensive experience'} in the real estate industry, I'm committed to helping clients achieve their property goals.

Whether you're looking to buy your dream home, sell your property for the best price, or make smart investment decisions, I provide personalized service and expert guidance throughout the entire process. My deep understanding of the local market ensures you get the best possible outcome.

I believe in building lasting relationships with my clients based on trust, transparency, and results. Let's work together to make your real estate dreams a reality.`}
                onSave={async (value) => {
                  await updateAgentBio(agentSlug, value);
                }}
                className="group"
              >
                <div className="text-template-text-secondary font-template-primary leading-relaxed space-y-4 text-base">
                  {(agent.bio || `Hi, I'm ${agent.user.name}, a dedicated real estate professional serving ${agent.city}${agent.area ? ` and ${agent.area}` : ''}. ${agent.experience ? `With ${agent.experience} years of experience` : 'With extensive experience'} in the real estate industry, I'm committed to helping clients achieve their property goals.

Whether you're looking to buy your dream home, sell your property for the best price, or make smart investment decisions, I provide personalized service and expert guidance throughout the entire process. My deep understanding of the local market ensures you get the best possible outcome.

I believe in building lasting relationships with my clients based on trust, transparency, and results. Let's work together to make your real estate dreams a reality.`).split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </EditableWrapper>
            </div>

            {/* Professional Highlights Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {highlights.map((highlight, index) => (
                <div key={index} className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-template-primary/10 rounded-template-button flex items-center justify-center">
                      <highlight.icon className="w-6 h-6 text-template-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-template-primary font-semibold text-template-text-primary mb-1">
                      {highlight.title}
                    </h3>
                    <p className="text-sm text-template-text-muted font-template-primary">
                      {highlight.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="pt-4 flex gap-3 flex-wrap">
              <Button
                onClick={scrollToContact}
                className="bg-template-primary hover:bg-template-primary-hover text-white px-8 py-3 rounded-template-button font-template-primary font-semibold transition-all duration-300 shadow-template-md hover:shadow-template-lg"
              >
                Schedule a Consultation
              </Button>
              <Button
                onClick={downloadVisitingCard}
                variant="outline"
                className="border-template-primary text-template-primary hover:bg-template-primary/10 px-8 py-3 rounded-template-button font-template-primary"
              >
                Download Visiting Card
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}