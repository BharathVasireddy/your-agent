'use client';

import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin } from 'lucide-react';

interface Agent {
  id: string;
  city: string | null;
  area: string | null;
  phone: string | null;
  heroImage: string | null;
  heroTitle: string | null;
  heroSubtitle: string | null;
  profilePhotoUrl: string | null;
  user: {
    name: string | null;
    email: string | null;
  };
}

interface HeroSectionProps {
  agent: Agent;
}

export default function HeroSection({ agent }: HeroSectionProps) {
  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToProperties = () => {
    const element = document.querySelector('#properties');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-[80vh] flex items-center">
      {/* Background Image */}
      {agent.heroImage && (
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={agent.heroImage}
            alt="Hero background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Text Content */}
            <div className={`text-center lg:text-left ${agent.heroImage ? 'text-white' : ''}`}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                {agent.heroTitle || `${agent.user.name}`}
              </h1>
              
              <p className="text-xl md:text-2xl mb-6 opacity-90">
                {agent.heroSubtitle || `Real Estate Expert in ${agent.city}${agent.area ? ` - ${agent.area}` : ''}`}
              </p>
              
              <div className="flex items-center justify-center lg:justify-start space-x-2 mb-8 text-lg">
                <MapPin className="w-5 h-5" />
                <span>{agent.city}{agent.area ? `, ${agent.area}` : ''}</span>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  onClick={scrollToContact}
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg"
                >
                  Get In Touch
                </Button>
                <Button
                  onClick={scrollToProperties}
                  variant="outline"
                  size="lg"
                  className={`px-8 py-3 text-lg ${
                    agent.heroImage 
                      ? 'border-white text-white hover:bg-white hover:text-black' 
                      : 'border-red-600 text-red-600 hover:bg-red-50'
                  }`}
                >
                  View Properties
                </Button>
              </div>

              {/* Quick Contact */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start">
                {agent.phone && (
                  <a
                    href={`tel:${agent.phone}`}
                    className={`flex items-center space-x-2 ${
                      agent.heroImage ? 'text-white hover:text-gray-200' : 'text-zinc-600 hover:text-red-600'
                    } transition-colors`}
                  >
                    <Phone className="w-5 h-5" />
                    <span className="font-medium">{agent.phone}</span>
                  </a>
                )}
                {agent.user.email && (
                  <a
                    href={`mailto:${agent.user.email}`}
                    className={`flex items-center space-x-2 ${
                      agent.heroImage ? 'text-white hover:text-gray-200' : 'text-zinc-600 hover:text-red-600'
                    } transition-colors`}
                  >
                    <Mail className="w-5 h-5" />
                    <span className="font-medium">Email Me</span>
                  </a>
                )}
              </div>
            </div>

            {/* Agent Photo */}
            {agent.profilePhotoUrl && (
              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-8 border-white shadow-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={agent.profilePhotoUrl}
                      alt={agent.user.name || 'Agent photo'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Floating Badge */}
                  <div className="absolute bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg">
                    <span className="font-semibold text-sm">Real Estate Expert</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Default Background for non-hero-image cases */}
      {!agent.heroImage && (
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-zinc-100 -z-10"></div>
      )}
    </section>
  );
}