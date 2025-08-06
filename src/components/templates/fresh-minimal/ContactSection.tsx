'use client';

import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Agent {
  id: string;
  phone: string | null;
  city: string | null;
  area: string | null;
  user: {
    name: string | null;
    email: string | null;
  };
}

interface ContactSectionProps {
  agent: Agent;
}

export default function ContactSection({ agent }: ContactSectionProps) {
  const contactMethods = [
    {
      icon: Phone,
      title: 'Call',
      value: agent.phone || 'Phone number not available',
      action: agent.phone ? `tel:${agent.phone}` : null,
      available: !!agent.phone
    },
    {
      icon: Mail,
      title: 'Email',
      value: agent.user.email || 'Email not available',
      action: agent.user.email ? `mailto:${agent.user.email}` : null,
      available: !!agent.user.email
    },
    {
      icon: MapPin,
      title: 'Location',
      value: agent.city && agent.area ? `${agent.area}, ${agent.city}` : agent.city || 'Location not specified',
      action: null,
      available: true
    },
    {
      icon: Clock,
      title: 'Hours',
      value: 'Available 24/7',
      action: null,
      available: true
    }
  ];

  return (
    <section id="contact" className="py-template-section bg-template-background-secondary">
      <div className="max-w-7xl mx-auto px-template-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-template-primary font-bold text-template-text-primary mb-4">
            Get In Touch
          </h2>
          <p className="text-lg text-template-text-secondary font-template-primary max-w-2xl mx-auto">
            Ready to start your real estate journey? Contact me today for personalized service and expert guidance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {contactMethods.map((method, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-template-primary/10 rounded-template-card flex items-center justify-center mx-auto mb-4">
                <method.icon className="w-8 h-8 text-template-primary" />
              </div>
              <h3 className="font-template-primary font-semibold text-template-text-primary mb-2">
                {method.title}
              </h3>
              {method.action && method.available ? (
                <a
                  href={method.action}
                  className="text-template-text-secondary hover:text-template-primary font-template-primary transition-colors"
                >
                  {method.value}
                </a>
              ) : (
                <p className="text-template-text-secondary font-template-primary">
                  {method.value}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-template-background rounded-template-card p-8 md:p-12 text-center shadow-template-lg">
          <h3 className="text-2xl md:text-3xl font-template-primary font-bold text-template-text-primary mb-4">
            Ready to Make Your Move?
          </h3>
          <p className="text-template-text-secondary font-template-primary mb-8 max-w-2xl mx-auto">
            Whether you&apos;re buying, selling, or investing, I&apos;m here to guide you through every step of the process. 
            Let&apos;s discuss your goals and create a plan that works for you.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {agent.phone && (
              <a href={`tel:${agent.phone}`}>
                <Button className="bg-template-primary hover:bg-template-primary-hover text-white px-8 py-3 rounded-template-button font-template-primary font-semibold transition-all duration-300 shadow-template-md hover:shadow-template-lg">
                  Call Now
                </Button>
              </a>
            )}
            {agent.phone && (
              <a 
                href={`https://wa.me/${agent.phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button 
                  variant="outline"
                  className="border-2 border-template-primary text-template-primary hover:bg-template-primary hover:text-white px-8 py-3 rounded-template-button font-template-primary font-semibold transition-all duration-300"
                >
                  WhatsApp
                </Button>
              </a>
            )}
            {agent.user.email && (
              <a href={`mailto:${agent.user.email}`}>
                <Button 
                  variant="outline"
                  className="border-template-border text-template-text-secondary hover:text-template-primary hover:border-template-primary px-8 py-3 rounded-template-button font-template-primary font-semibold transition-all duration-300"
                >
                  Send Email
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}