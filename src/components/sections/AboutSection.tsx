'use client';

import { Award, Users, Home, Clock } from 'lucide-react';

interface Agent {
  id: string;
  experience: number | null;
  bio: string | null;
  city: string | null;
  area: string | null;
  profilePhotoUrl: string | null;
  user: {
    name: string | null;
  };
}

interface AboutSectionProps {
  agent: Agent;
}

export default function AboutSection({ agent }: AboutSectionProps) {
  const stats = [
    {
      icon: Clock,
      value: agent.experience || 0,
      label: agent.experience === 1 ? 'Year Experience' : 'Years Experience',
      description: 'Proven track record'
    },
    {
      icon: Users,
      value: '100+',
      label: 'Happy Clients',
      description: 'Successful transactions'
    },
    {
      icon: Home,
      value: '200+',
      label: 'Properties Sold',
      description: 'Across the city'
    },
    {
      icon: Award,
      value: 'Top 10%',
      label: 'Market Leader',
      description: 'In local market'
    }
  ];

  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-950 mb-6">
                About {agent.user.name}
              </h2>
              
              <div className="text-lg text-zinc-700 mb-8 leading-relaxed">
                {agent.bio ? (
                  <p>{agent.bio}</p>
                ) : (
                  <div className="space-y-4">
                    <p>
                      As a dedicated real estate professional serving {agent.city}{agent.area ? ` and ${agent.area}` : ''}, 
                      I bring {agent.experience || 'years of'} experience in helping clients find their perfect home 
                      and make smart investment decisions.
                    </p>
                    <p>
                      My commitment to excellence, deep market knowledge, and personalized approach ensure that 
                      every client receives the highest level of service. Whether you&apos;re buying, selling, or investing, 
                      I&apos;m here to guide you through every step of the process.
                    </p>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => {
                    const element = document.querySelector('#contact');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Let&apos;s Work Together
                </button>
                <button
                  onClick={() => {
                    const element = document.querySelector('#testimonials');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="border border-red-600 text-red-600 hover:bg-red-50 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Read Client Reviews
                </button>
              </div>
            </div>

            {/* Stats & Image */}
            <div>
              {/* Agent Image */}
              {agent.profilePhotoUrl && (
                <div className="mb-8 flex justify-center lg:justify-end">
                  <div className="relative">
                    <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={agent.profilePhotoUrl}
                        alt={agent.user.name || 'Agent photo'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Experience Badge */}
                    <div className="absolute -bottom-4 -right-4 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg">
                      <div className="text-center">
                        <div className="text-xl font-bold">{agent.experience || 0}+</div>
                        <div className="text-xs">Years</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-zinc-50 rounded-lg p-4 text-center">
                    <div className="flex justify-center mb-2">
                      <stat.icon className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="text-2xl font-bold text-zinc-950 mb-1">{stat.value}</div>
                    <div className="text-sm font-semibold text-zinc-700 mb-1">{stat.label}</div>
                    <div className="text-xs text-zinc-500">{stat.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}