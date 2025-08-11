'use client';

import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Agent {
  id: string;
  phone: string | null;
  city: string | null;
  area: string | null;
  websiteUrl?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  linkedinUrl?: string | null;
  youtubeUrl?: string | null;
  twitterUrl?: string | null;
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

        {/* Social Links */}
        {(agent.websiteUrl || agent.facebookUrl || agent.instagramUrl || agent.linkedinUrl || agent.youtubeUrl || agent.twitterUrl) && (
          <div className="mb-12">
            <h3 className="text-xl font-template-primary font-semibold text-template-text-primary text-center mb-4">Connect with me</h3>
            <div className="flex items-center justify-center gap-4">
              {agent.websiteUrl && (
                <a href={agent.websiteUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-template-primary hover:bg-template-primary/10 rounded-template-button" aria-label="Website">
                  {/* Simple link icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M14 3h7v7h-2V6.414l-9.293 9.293-1.414-1.414L17.586 5H14V3z"/><path d="M5 5h6v2H7v10h10v-4h2v6H5z"/></svg>
                </a>
              )}
              {agent.facebookUrl && (
                <a href={agent.facebookUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-template-primary hover:bg-template-primary/10 rounded-template-button" aria-label="Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07C2 17.06 5.66 21.21 10.44 22v-7.02H7.9v-2.91h2.54V9.84c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.91h-2.34V22C18.34 21.21 22 17.06 22 12.07z"/></svg>
                </a>
              )}
              {agent.instagramUrl && (
                <a href={agent.instagramUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-template-primary hover:bg-template-primary/10 rounded-template-button" aria-label="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2c1.66 0 3 1.34 3 3v10c0 1.66-1.34 3-3 3H7c-1.66 0-3-1.34-3-3V7c0-1.66 1.34-3 3-3h10z"/><path d="M12 7a5 5 0 100 10 5 5 0 000-10zm0 2.1A2.9 2.9 0 119.1 12 2.9 2.9 0 0112 9.1zM17.65 6.35a1.15 1.15 0 11-1.63 1.63 1.15 1.15 0 011.63-1.63z"/></svg>
                </a>
              )}
              {agent.linkedinUrl && (
                <a href={agent.linkedinUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-template-primary hover:bg-template-primary/10 rounded-template-button" aria-label="LinkedIn">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M20.447 20.452H17.21v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.447-2.136 2.944v5.662H9.086V9h3.112v1.561h.045c.434-.82 1.494-1.686 3.072-1.686 3.288 0 3.894 2.164 3.894 4.979v6.598zM5.337 7.433a1.814 1.814 0 110-3.628 1.814 1.814 0 010 3.628zM6.944 20.452H3.726V9h3.218v11.452z"/></svg>
                </a>
              )}
              {agent.youtubeUrl && (
                <a href={agent.youtubeUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-template-primary hover:bg-template-primary/10 rounded-template-button" aria-label="YouTube">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M23.498 6.186a2.998 2.998 0 00-2.112-2.12C19.296 3.5 12 3.5 12 3.5s-7.296 0-9.386.566a2.998 2.998 0 00-2.112 2.12A31.51 31.51 0 000 12a31.51 31.51 0 00.502 5.814 2.998 2.998 0 002.112 2.12C4.704 20.5 12 20.5 12 20.5s7.296 0 9.386-.566a2.998 2.998 0 002.112-2.12A31.51 31.51 0 0024 12a31.51 31.51 0 00-.502-5.814zM9.75 15.5v-7l6 3.5-6 3.5z"/></svg>
                </a>
              )}
              {agent.twitterUrl && (
                <a href={agent.twitterUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-template-primary hover:bg-template-primary/10 rounded-template-button" aria-label="Twitter/X">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M18.244 2H21L14.5 9.43 22 22h-6.5l-4.06-6.59L6.6 22H4l6.93-7.8L4 2h6.6l3.67 6.02L18.244 2zm-1.14 18h1.53L8.84 4h-1.5l9.764 16z"/></svg>
                </a>
              )}
            </div>
          </div>
        )}

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