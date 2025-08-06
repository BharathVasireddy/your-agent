'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import toast from 'react-hot-toast';

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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    subject: 'General Inquiry'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate form submission - in real app, this would send to an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Thank you! Your message has been sent successfully.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        subject: 'General Inquiry'
      });
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const contactMethods = [
    {
      icon: Phone,
      title: 'Call Me',
      value: agent.phone || 'Phone number not available',
      action: agent.phone ? `tel:${agent.phone}` : null,
      description: 'Available during business hours'
    },
    {
      icon: Mail,
      title: 'Email Me',
      value: agent.user.email || 'Email not available',
      action: agent.user.email ? `mailto:${agent.user.email}` : null,
      description: 'I\'ll respond within 24 hours'
    },
    {
      icon: MapPin,
      title: 'Service Area',
      value: `${agent.city}${agent.area ? `, ${agent.area}` : ''}`,
      action: null,
      description: 'Primary service location'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      value: 'Mon - Sat: 9 AM - 7 PM',
      action: null,
      description: 'Sunday by appointment'
    }
  ];

  return (
    <section id="contact" className="w-full py-16 bg-zinc-50">
      <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-950 mb-4">Get In Touch</h2>
            <p className="text-zinc-600 max-w-2xl mx-auto">
              Ready to start your real estate journey? I&apos;m here to help you every step of the way. 
              Contact me today for a free consultation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h3 className="text-2xl font-bold text-zinc-950 mb-6">Let&apos;s Connect</h3>
              <p className="text-zinc-700 mb-8 leading-relaxed">
                Whether you&apos;re looking to buy your dream home, sell your current property, or explore investment 
                opportunities, I&apos;m here to provide expert guidance and personalized service. Reach out using any 
                of the methods below.
              </p>

              <div className="space-y-6">
                {contactMethods.map((method, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-red-600 text-white p-3 rounded-lg">
                      <method.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-zinc-950 mb-1">{method.title}</h4>
                      {method.action ? (
                        <a
                          href={method.action}
                          className="text-red-600 hover:text-red-700 font-medium transition-colors"
                        >
                          {method.value}
                        </a>
                      ) : (
                        <span className="text-zinc-900 font-medium">{method.value}</span>
                      )}
                      <p className="text-zinc-600 text-sm mt-1">{method.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="mt-8 p-6 bg-white rounded-lg border border-zinc-200">
                <h4 className="font-semibold text-zinc-950 mb-4">Quick Actions</h4>
                <div className="flex flex-col sm:flex-row gap-3">
                  {agent.phone && (
                    <a
                      href={`tel:${agent.phone}`}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-semibold text-center transition-colors"
                    >
                      Call Now
                    </a>
                  )}
                  {agent.user.email && (
                    <a
                      href={`mailto:${agent.user.email}`}
                      className="flex-1 border border-red-600 text-red-600 hover:bg-red-50 px-4 py-3 rounded-lg font-semibold text-center transition-colors"
                    >
                      Send Email
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-8">
                <h3 className="text-2xl font-bold text-zinc-950 mb-6">Send Me a Message</h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-2">
                        Full Name *
                      </label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-2">
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-zinc-700 mb-2">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-zinc-700 mb-2">
                        Subject
                      </label>
                      <select
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Buy Property">Looking to Buy</option>
                        <option value="Sell Property">Looking to Sell</option>
                        <option value="Property Valuation">Property Valuation</option>
                        <option value="Investment Advice">Investment Advice</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-zinc-700 mb-2">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Tell me about your real estate needs, timeline, budget, or any questions you have..."
                      className="min-h-[120px] resize-none"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}