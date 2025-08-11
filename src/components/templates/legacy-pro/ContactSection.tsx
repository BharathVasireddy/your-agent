'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import toast from 'react-hot-toast';

interface Agent {
  id: string;
  slug: string;
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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    subject: 'General Inquiry'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Indian-only validation
      if (formData.phone) {
        if (!/^\d{10}$/.test(formData.phone)) {
          setPhoneError('Enter a valid 10-digit Indian mobile number');
          setIsSubmitting(false);
          return;
        }
        const e164 = `+91${formData.phone}`;
        const parsed = parsePhoneNumberFromString(e164, 'IN');
        if (!parsed || !parsed.isValid()) {
          setPhoneError('Enter a valid Indian mobile number');
          setIsSubmitting(false);
          return;
        }
        setPhoneError(null);
      }

      const res = await fetch(`/api/agents/${agent.slug}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone ? `+91${formData.phone}` : undefined,
          subject: formData.subject,
          message: formData.message,
          source: 'contact-form'
        })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to send message');
      }

      setShowSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        subject: 'General Inquiry'
      });
    } catch (err) {
      toast.error((err as Error).message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="contact" className="relative w-full">
      {/* Background image matching the reference style (no gradients) */}
      <div
        className="absolute inset-0 bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero-background.jpg')" }}
        aria-hidden="true"
      />
      <div className="relative">
        <div className="mx-auto max-w-6xl px-4 py-24 md:py-28 text-center">
          <div className="inline-flex items-center rounded-full border border-zinc-300 bg-white/70 px-3 py-1 text-xs font-medium text-zinc-700 backdrop-blur">
            Get in Touch
          </div>
          <h2 className="mt-4 text-2xl md:text-4xl font-extrabold tracking-tight text-zinc-950 uppercase">
            Let&apos;s Make Your Property Journey Effortless
          </h2>
          <p className="mt-3 text-sm md:text-base text-zinc-800 max-w-2xl mx-auto">
            Have questions or ready to take the next step? Whether you&apos;re looking to buy, rent, or invest, our
            team is here to guide you every step of the way. Let&apos;s turn your property goals into reality.
          </p>

          {/* Social Links */}
          {(agent.websiteUrl || agent.facebookUrl || agent.instagramUrl || agent.linkedinUrl || agent.youtubeUrl || agent.twitterUrl) && (
            <div className="mt-6 flex items-center justify-center gap-3">
              {agent.websiteUrl && (
                <a href={agent.websiteUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-zinc-900/80 hover:bg-white/70 rounded-md" aria-label="Website">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M14 3h7v7h-2V6.414l-9.293 9.293-1.414-1.414L17.586 5H14V3z"/><path d="M5 5h6v2H7v10h10v-4h2v6H5z"/></svg>
                </a>
              )}
              {agent.facebookUrl && (
                <a href={agent.facebookUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-zinc-900/80 hover:bg-white/70 rounded-md" aria-label="Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07C2 17.06 5.66 21.21 10.44 22v-7.02H7.9v-2.91h2.54V9.84c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.91h-2.34V22C18.34 21.21 22 17.06 22 12.07z"/></svg>
                </a>
              )}
              {agent.instagramUrl && (
                <a href={agent.instagramUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-zinc-900/80 hover:bg:white/70 rounded-md" aria-label="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2c1.66 0 3 1.34 3 3v10c0 1.66-1.34 3-3 3H7c-1.66 0-3-1.34-3-3V7c0-1.66 1.34-3 3-3h10z"/><path d="M12 7a5 5 0 100 10 5 5 0 000-10zm0 2.1A2.9 2.9 0 119.1 12 2.9 2.9 0 0112 9.1zM17.65 6.35a1.15 1.15 0 11-1.63 1.63 1.15 1.15 0 011.63-1.63z"/></svg>
                </a>
              )}
              {agent.linkedinUrl && (
                <a href={agent.linkedinUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-zinc-900/80 hover:bg-white/70 rounded-md" aria-label="LinkedIn">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M20.447 20.452H17.21v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.447-2.136 2.944v5.662H9.086V9h3.112v1.561h.045c.434-.82 1.494-1.686 3.072-1.686 3.288 0 3.894 2.164 3.894 4.979v6.598zM5.337 7.433a1.814 1.814 0 110-3.628 1.814 1.814 0 010 3.628zM6.944 20.452H3.726V9h3.218v11.452z"/></svg>
                </a>
              )}
              {agent.youtubeUrl && (
                <a href={agent.youtubeUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-zinc-900/80 hover:bg-white/70 rounded-md" aria-label="YouTube">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M23.498 6.186a2.998 2.998 0 00-2.112-2.12C19.296 3.5 12 3.5 12 3.5s-7.296 0-9.386.566a2.998 2.998 0 00-2.112 2.12A31.51 31.51 0 000 12a31.51 31.51 0 00.502 5.814 2.998 2.998 0 002.112 2.12C4.704 20.5 12 20.5 12 20.5s7.296 0 9.386-.566a2.998 2.998 0 002.112-2.12A31.51 31.51 0 0024 12a31.51 31.51 0 00-.502-5.814zM9.75 15.5v-7l6 3.5-6 3.5z"/></svg>
                </a>
              )}
              {agent.twitterUrl && (
                <a href={agent.twitterUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-zinc-900/80 hover:bg-white/70 rounded-md" aria-label="Twitter/X">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M18.244 2H21L14.5 9.43 22 22h-6.5l-4.06-6.59L6.6 22H4l6.93-7.8L4 2h6.6l3.67 6.02L18.244 2zm-1.14 18h1.53L8.84 4h-1.5l9.764 16z"/></svg>
                </a>
              )}
            </div>
          )}

          {/* Form Card */}
          <div className="mt-8 md:mt-10 mx-auto max-w-3xl rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <form onSubmit={handleSubmit} className="p-5 md:p-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label htmlFor="firstName" className="sr-only">First Name</label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="First Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="rounded-none border-0 border-b border-zinc-200 focus-visible:ring-0 focus-visible:border-zinc-900 px-0"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="sr-only">Last Name</label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Last Name"
                    className="rounded-none border-0 border-b border-zinc-200 focus-visible:ring-0 focus-visible:border-zinc-900 px-0"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="sr-only">Email</label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="rounded-none border-0 border-b border-zinc-200 focus-visible:ring-0 focus-visible:border-zinc-900 px-0"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="sr-only">Phone</label>
                  <input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={formData.phone}
                    onChange={(e)=>{
                      const digits = e.target.value.replace(/\D/g,'').slice(0,10);
                      handleInputChange('phone', digits);
                    }}
                    placeholder="Phone (India)"
                    className="w-full rounded-none border-0 border-b border-zinc-200 focus-visible:ring-0 focus-visible:border-zinc-900 px-0 py-2"
                  />
                  {phoneError && <p className="mt-1 text-xs text-brand">{phoneError}</p>}
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="message" className="sr-only">What Can We Help You?</label>
                <Textarea
                  id="message"
                  placeholder="What Can We Help You ?"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="min-h-[110px] resize-none rounded-2xl border border-zinc-200 focus-visible:ring-0 focus-visible:border-zinc-900"
                  required
                />
              </div>

              <div className="mt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-black hover:bg-zinc-900 text-white h-11"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Book a Call
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowSuccess(false)} />
          <div className="relative z-10 w-full max-w-md mx-auto rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-zinc-950">Message sent</h3>
            <p className="mt-2 text-sm text-zinc-700">Thanks for reaching out. We&apos;ll get back to you shortly.</p>
            <div className="mt-6 flex justify-end">
              <Button
                onClick={() => setShowSuccess(false)}
                className="rounded-md bg-black hover:bg-zinc-900 text-white"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}