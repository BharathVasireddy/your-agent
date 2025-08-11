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