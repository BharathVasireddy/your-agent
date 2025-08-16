'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useWizardStore } from '@/store/wizard-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PhoneWhatsAppVerify from '@/components/PhoneWhatsAppVerify';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { updateAgentProfile, generateBio } from '@/app/actions';
import Step3_Photo from '@/components/onboarding/Step3_Photo';
import Step4_Theme from '@/components/onboarding/Step4_Theme';
import { AnimatePresence, motion } from 'motion/react';

export default function TypeformWizardClient() {
  const { data: session } = useSession();
  const router = useRouter();
  const store = useWizardStore();

  // Ordered questions: one at a time
  // 0 welcome, 1 name, 2 email, 3 city, 4 area, 5 phone, 6 dob, 7 exp, 8 slug, 9 bio, 10 photo, 11 template
  const TOTAL = 12;
  const [index, setIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatingBio, setGeneratingBio] = useState(false);

  // Cities/Areas (same as Step1)
  const citiesWithAreas = useMemo(() => ({
    Hyderabad: [
      { label: 'Madhapur', value: 'Madhapur' },
      { label: 'Gachibowli', value: 'Gachibowli' },
      { label: 'Kondapur', value: 'Kondapur' },
      { label: 'HITEC City', value: 'HITEC City' },
      { label: 'Financial District', value: 'Financial District' },
      { label: 'Kokapet', value: 'Kokapet' },
      { label: 'Banjara Hills', value: 'Banjara Hills' },
      { label: 'Jubilee Hills', value: 'Jubilee Hills' },
      { label: 'Punjagutta', value: 'Punjagutta' },
      { label: 'Ameerpet', value: 'Ameerpet' },
      { label: 'Secunderabad', value: 'Secunderabad' },
      { label: 'Kukatpally', value: 'Kukatpally' },
      { label: 'Miyapur', value: 'Miyapur' },
      { label: 'Uppal', value: 'Uppal' },
      { label: 'LB Nagar', value: 'LB Nagar' },
      { label: 'Dilsukhnagar', value: 'Dilsukhnagar' },
      { label: 'Charminar', value: 'Charminar' },
      { label: 'Abids', value: 'Abids' },
    ],
    Bangalore: [
      { label: 'Koramangala', value: 'Koramangala' },
      { label: 'Indiranagar', value: 'Indiranagar' },
      { label: 'Whitefield', value: 'Whitefield' },
      { label: 'Electronic City', value: 'Electronic City' },
      { label: 'HSR Layout', value: 'HSR Layout' },
      { label: 'BTM Layout', value: 'BTM Layout' },
      { label: 'Marathahalli', value: 'Marathahalli' },
      { label: 'Sarjapur Road', value: 'Sarjapur Road' },
    ],
    Mumbai: [
      { label: 'Bandra', value: 'Bandra' },
      { label: 'Andheri', value: 'Andheri' },
      { label: 'Powai', value: 'Powai' },
      { label: 'Lower Parel', value: 'Lower Parel' },
      { label: 'Worli', value: 'Worli' },
      { label: 'Malad', value: 'Malad' },
      { label: 'Thane', value: 'Thane' },
      { label: 'Navi Mumbai', value: 'Navi Mumbai' },
    ],
  } as const), []);

  const availableCities = Object.keys(citiesWithAreas);
  const availableAreas = store.city ? citiesWithAreas[store.city as keyof typeof citiesWithAreas] || [] : [];

  // Do not prefill phone from local storage. Let users enter explicitly for privacy.

  // Prefill email/name/slug from session with equality guards
  useEffect(() => {
    const sessionEmail = session?.user?.email;
    const sessionName = session?.user?.name;

    if (sessionEmail && store.email !== sessionEmail) {
      store.setData({ email: sessionEmail });
    }
    if (sessionName && !store.name) {
      store.setData({ name: sessionName });
    }
    if (!store.slug && sessionName) {
      const generated = sessionName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
      if (generated && generated !== store.slug) {
        store.setData({ slug: generated });
      }
    }
    // Only re-run when session values change or when local store fields used in guards change
  }, [session?.user?.name, session?.user?.email, store.email, store.name, store.slug, store.setData]);

  const isPhoneValid = (val: string) => /^\+91[6-9]\d{9}$/.test(val);

  const validateCurrent = async (): Promise<boolean> => {
    setError(null);
    if (index === 0) return true; // welcome step
    if (index === 1) return true; // name will be captured into user profile later
    if (index === 2) return true; // email is from session for Google, optional input for Whatsapp users
    if (index === 3) return !!store.city;
    if (index === 4) return !!store.area;
    // Require verified WhatsApp number (PhoneWhatsAppVerify sets phoneVerified=true on success)
    if (index === 5) return !!store.phone && isPhoneValid(store.phone) && !!store.phoneVerified;
    if (index === 6) return !!store.dateOfBirth;
    if (index === 7) return Number.isFinite(store.experience) && store.experience >= 0;
    if (index === 8) {
      if (!store.slug || store.slug.length < 3) {
        setError('Profile URL must be at least 3 characters');
        return false;
      }
      try {
        const res = await fetch('/api/check-slug', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug: store.slug }),
        });
        const data = await res.json();
        if (!data.available && data.slug && data.slug !== store.slug) {
          store.setData({ slug: data.slug });
        }
        if (!data.available) {
          setError('That URL is taken. We suggested a close alternative.');
          return false;
        }
      } catch {
        setError('Could not validate URL. Please try again.');
        return false;
      }
      return true;
    }
    if (index === 9) return store.bio.length <= 500; // optional but limited
    if (index === 10) return true; // photo optional
    if (index === 11) return !!store.template;
    return true;
  };

  const next = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    const ok = await validateCurrent();
    setBusy(false);
    if (!ok) return;
    if (index < TOTAL - 1) setIndex((i) => i + 1);
    else await finish();
  }, [busy, index, validateCurrent]);

  const prev = () => {
    if (index > 0) setIndex((i) => i - 1);
  };

  const finish = async () => {
    try {
      setBusy(true);
      if (!store.slug || !store.phone || !store.phoneVerified || !store.city || !store.dateOfBirth) {
        setError('Please complete all required fields.');
        return;
      }
      const result = await updateAgentProfile({
        experience: store.experience,
        bio: store.bio,
        phone: store.phone,
        city: store.city,
        area: store.area,
        template: store.template,
        profilePhotoUrl: store.profilePhotoUrl,
        slug: store.slug,
        dateOfBirth: store.dateOfBirth,
        name: store.name || session?.user?.name || undefined,
        email: store.email || session?.user?.email || undefined,
      });
      if (result.success && result.agent?.slug) {
        useWizardStore.getState().reset();
        router.push('/agent/dashboard');
      } else {
        setError('Failed to create profile.');
      }
    } finally {
      setBusy(false);
    }
  };

  // Keyboard: Enter to continue
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
        const isTextArea = tag === 'textarea';
        if (!isTextArea) {
          e.preventDefault();
          void next();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next]);

  const progress = Math.round(((index + 1) / TOTAL) * 100);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Progress */}
        <div className="mb-8">
          <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
            <div className="h-2 bg-brand" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-2 text-sm text-zinc-600">Step {index + 1} of {TOTAL}</div>
        </div>

        <div className="relative min-h-[360px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 shadow-sm"
            >
               {index === 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-zinc-950">Welcome to YourAgent</h2>
                  <p className="text-zinc-600">We&apos;ll set up your professional profile in a few quick steps. You can adjust everything later in your dashboard.</p>
                  <ul className="text-sm text-zinc-700 list-disc pl-5 space-y-1">
                    <li>Tell us your basic details</li>
                    <li>Pick a clean profile URL</li>
                    <li>Write a short professional bio</li>
                    <li>Choose a website template</li>
                  </ul>
                </div>
               )}

               {index === 1 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-zinc-950">What is your full name?</h2>
                  <div>
                    <Label className="text-sm text-zinc-700">Full Name</Label>
                    <Input
                      type="text"
                      placeholder={session?.user?.name || 'Your name'}
                      className="mt-2 h-11"
                      value={store.name || ''}
                      onChange={(e) => store.setData({ name: e.target.value })}
                    />
                  </div>
                </div>
              )}

               {index === 2 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-zinc-950">What is your email?</h2>
                  <div>
                    <Label className="text-sm text-zinc-700">Email</Label>
                    <Input
                      type="email"
                      placeholder={session?.user?.email || 'you@example.com'}
                      className="mt-2 h-11"
                      value={store.email || ''}
                      onChange={(e) => store.setData({ email: e.target.value })}
                    />
                    <p className="mt-1 text-xs text-zinc-500">We prefill if you used Google. WhatsApp users can add it now.</p>
                  </div>
                </div>
              )}

               {index === 3 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-zinc-950">Which city do you operate in?</h2>
                  <div>
                    <Label className="text-sm text-zinc-700">City</Label>
                    <Select value={store.city} onValueChange={(v) => store.setData({ city: v, area: '' })}>
                      <SelectTrigger className="w-full h-11 mt-2">
                        <SelectValue placeholder="Select your city" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCities.map((c) => (
                          <SelectItem value={c} key={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

               {index === 4 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-zinc-950">Your primary area in {store.city || 'the city'}?</h2>
                  <div>
                    <Label className="text-sm text-zinc-700">Area</Label>
                    <Select value={store.area} onValueChange={(v) => store.setData({ area: v })}>
                      <SelectTrigger className="w-full h-11 mt-2">
                        <SelectValue placeholder={store.city ? `Select area in ${store.city}` : 'Select area'} />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        {availableAreas.map((a) => (
                          <SelectItem value={a.value} key={a.value}>{a.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

               {index === 5 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-zinc-950">Verify your WhatsApp number</h2>
                  <PhoneWhatsAppVerify
                    label="Phone (India only)"
                    value={store.phone}
                    onValueChange={(e164)=>store.setData({ phone: e164, phoneVerified: false })}
                    onVerified={(e164)=>store.setData({ phone: e164, phoneVerified: true })}
                    required
                  />
                  {!!store.phone && !isPhoneValid(store.phone) && (
                    <p className="mt-1 text-xs text-brand-hover">Enter a valid 10-digit Indian number (e.g., +919876543210)</p>
                  )}
                  {!!store.phone && isPhoneValid(store.phone) && !store.phoneVerified && (
                    <p className="mt-1 text-xs text-brand-hover">Please verify your WhatsApp number to continue.</p>
                  )}
                </div>
              )}

               {index === 6 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-zinc-950">When is your date of birth?</h2>
                  <div>
                    <Label htmlFor="dob" className="text-sm text-zinc-700">Date of birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={store.dateOfBirth}
                      onChange={(e) => store.setData({ dateOfBirth: e.target.value })}
                      max={new Date().toISOString().split('T')[0]}
                      className="mt-2 h-11"
                    />
                  </div>
                </div>
              )}

               {index === 7 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-zinc-950">How many years of experience do you have?</h2>
                  <div>
                    <Label htmlFor="exp" className="text-sm text-zinc-700">Experience (years)</Label>
                    <Input
                      id="exp"
                      type="number"
                      value={store.experience}
                      onChange={(e) => store.setData({ experience: parseInt(e.target.value || '0', 10) || 0 })}
                      min={0}
                      max={50}
                      className="mt-2 h-11"
                    />
                  </div>
                </div>
              )}

               {index === 8 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-zinc-950">Pick your profile URL</h2>
                  <div>
                    <Label htmlFor="slug" className="text-sm text-zinc-700">Profile URL</Label>
                    <div className="mt-2 flex">
                      <span className="inline-flex items-center px-4 text-sm font-medium text-zinc-600 bg-zinc-100 border border-r-0 border-zinc-300 rounded-l-lg">youragent.in/</span>
                      <Input
                        id="slug"
                        type="text"
                        value={store.slug}
                        onChange={(e) => store.setData({ slug: e.target.value })}
                        placeholder="your-name"
                        className="rounded-l-none h-11"
                      />
                    </div>
                    {error && <p className="mt-1 text-xs text-brand-hover">{error}</p>}
                  </div>
                </div>
              )}

               {index === 9 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-zinc-950">Write a short professional bio</h2>
                  <div>
                    <Label htmlFor="bio" className="text-sm text-zinc-700">Bio (optional)</Label>
                    <textarea
                      id="bio"
                      value={store.bio}
                      onChange={(e) => store.setData({ bio: e.target.value.slice(0, 500) })}
                      placeholder="Tell clients about your background and expertise..."
                      className="mt-2 w-full min_h-[160px] rounded-md border border-zinc-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-brand"
                    />
                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-xs text-zinc-500">{store.bio.length}/500</div>
                        <Button
                          type="button"
                          variant="outline"
                          disabled={generatingBio}
                          onClick={async () => {
                            try {
                              setError(null);
                              setGeneratingBio(true);
                              const name = store.name || session?.user?.name || 'Agent';
                              const res = await generateBio({
                                name,
                                experience: Number.isFinite(store.experience) ? store.experience : 0,
                                city: store.city || 'Your City',
                                area: store.area || undefined,
                              });
                              if (res?.success && res?.bio) {
                                store.setData({ bio: res.bio.slice(0, 500) });
                              } else {
                                setError('Could not generate bio. Please try again.');
                              }
                            } catch (e) {
                              setError(e instanceof Error ? e.message : 'Could not generate bio.');
                            } finally {
                              setGeneratingBio(false);
                            }
                          }}
                          className="h-9"
                        >
                          {generatingBio ? 'Generating...' : 'Generate with AI'}
                        </Button>
                      </div>
                  </div>
                </div>
              )}

               {index === 10 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-zinc-950">Add a profile photo (optional)</h2>
                  <Step3_Photo />
                </div>
              )}

               {index === 11 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-zinc-950">Choose your template</h2>
                  <Step4_Theme />
                </div>
              )}

              {/* Nav */}
              <div className="mt-6 flex items-center justify-between">
                <Button type="button" variant="outline" onClick={prev} disabled={index === 0} className="flex items-center gap-2">
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
               <Button type="button" onClick={next} disabled={busy} className="flex items-center gap-2 bg-brand hover:bg-brand-hover text-white">
                  {index === TOTAL - 1 ? 'Finish' : 'Continue'}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}


