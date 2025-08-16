"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useWizardStore } from "@/store/wizard-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PhoneWhatsAppVerify from "@/components/PhoneWhatsAppVerify";
import { Label } from "@/components/ui/label";
// Removed unused Select imports
import LocationSelector from "@/components/common/LocationSelector";
import { ChevronLeft, ChevronRight, AlertCircle, Check } from "lucide-react";
import { updateAgentProfile, generateBio } from "@/app/actions";
import Step3_Photo from "@/components/onboarding/Step3_Photo";
import Step4_Theme from "@/components/onboarding/Step4_Theme";
import { AnimatePresence, motion } from "motion/react";

export default function TypeformWizardClient() {
  const { data: session } = useSession();
  const router = useRouter();
  const store = useWizardStore();

  // Ordered questions: one at a time
  // 0 welcome, 1 name, 2 email, 3 state/district/city, 4 phone, 5 exp, 6 slug, 7 bio, 8 photo, 9 template
  // Removed: area selection and date of birth steps
  const TOTAL = 10;
  const [index, setIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatingBio, setGeneratingBio] = useState(false);
  const [slugChecking, setSlugChecking] = useState(false);
  const [slugStatus, setSlugStatus] = useState<'checking' | 'available' | 'taken' | null>(null);

  // Cities/Areas (same as Step1)
  const citiesWithAreas = useMemo(
    () =>
      ({
    Hyderabad: [
          { label: "Madhapur", value: "Madhapur" },
          { label: "Gachibowli", value: "Gachibowli" },
          { label: "Kondapur", value: "Kondapur" },
          { label: "HITEC City", value: "HITEC City" },
          { label: "Financial District", value: "Financial District" },
          { label: "Kokapet", value: "Kokapet" },
          { label: "Banjara Hills", value: "Banjara Hills" },
          { label: "Jubilee Hills", value: "Jubilee Hills" },
          { label: "Punjagutta", value: "Punjagutta" },
          { label: "Ameerpet", value: "Ameerpet" },
          { label: "Secunderabad", value: "Secunderabad" },
          { label: "Kukatpally", value: "Kukatpally" },
          { label: "Miyapur", value: "Miyapur" },
          { label: "Uppal", value: "Uppal" },
          { label: "LB Nagar", value: "LB Nagar" },
          { label: "Dilsukhnagar", value: "Dilsukhnagar" },
          { label: "Charminar", value: "Charminar" },
          { label: "Abids", value: "Abids" },
    ],
    Bangalore: [
          { label: "Koramangala", value: "Koramangala" },
          { label: "Indiranagar", value: "Indiranagar" },
          { label: "Whitefield", value: "Whitefield" },
          { label: "Electronic City", value: "Electronic City" },
          { label: "HSR Layout", value: "HSR Layout" },
          { label: "BTM Layout", value: "BTM Layout" },
          { label: "Marathahalli", value: "Marathahalli" },
          { label: "Sarjapur Road", value: "Sarjapur Road" },
    ],
    Mumbai: [
          { label: "Bandra", value: "Bandra" },
          { label: "Andheri", value: "Andheri" },
          { label: "Powai", value: "Powai" },
          { label: "Lower Parel", value: "Lower Parel" },
          { label: "Worli", value: "Worli" },
          { label: "Malad", value: "Malad" },
          { label: "Thane", value: "Thane" },
          { label: "Navi Mumbai", value: "Navi Mumbai" },
        ],
      }) as const,
    []
  );

  // const availableCities = Object.keys(citiesWithAreas);
  // const availableAreas = store.city
  //   ? citiesWithAreas[store.city as keyof typeof citiesWithAreas] || []
  //   : [];

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
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
      if (generated && generated !== store.slug) {
        store.setData({ slug: generated });
      }
    }
    // Only re-run when session values change or when local store fields used in guards change
  }, [
    session?.user?.name,
    session?.user?.email,
    store.email,
    store.name,
    store.slug,
    store.setData,
  ]);

  const isPhoneValid = (val: string) => /^\+91[6-9]\d{9}$/.test(val);

  // Real-time slug availability checking (no auto-modification)
  const checkSlugAvailability = useCallback(async (slug: string) => {
    if (!slug || slug.length < 3) {
      setSlugStatus(null);
      return;
    }
    
    setSlugChecking(true);
    setSlugStatus('checking');
    try {
      const res = await fetch("/api/check-slug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      
      // Set status but don't auto-modify during real-time checking
      setSlugStatus(data.available ? 'available' : 'taken');
    } catch {
      setSlugStatus(null);
    } finally {
      setSlugChecking(false);
    }
  }, []);

  // Debounce the slug checking
  useEffect(() => {
    if (index === 6 && store.slug && store.slug.length >= 3) {
      const timeoutId = setTimeout(() => {
        checkSlugAvailability(store.slug);
      }, 1000); // Wait 1 second after user stops typing

      return () => clearTimeout(timeoutId);
    }
  }, [store.slug, index, checkSlugAvailability, store]);

  const validateCurrent = async (): Promise<boolean> => {
    setError(null);
    if (index === 0) return true; // welcome step
    if (index === 1) return true; // name will be captured into user profile later
    if (index === 2) return true; // email is from session for Google, optional input for Whatsapp users
    if (index === 3) return !!store.stateId;
    // Allow proceeding with phone verification OR if user chose to verify later
    if (index === 4) {
      // If they have a valid phone and verified it, that's great
      if (store.phone && isPhoneValid(store.phone) && store.phoneVerified) {
        return true;
      }
      // If they chose to verify later, that's also okay (phone can be empty or unverified)
      return true;
    }
    if (index === 5)
      return Number.isFinite(store.experience) && store.experience >= 0;
    if (index === 6) {
      if (!store.slug || store.slug.length < 3) {
        setError("Your profile URL must be at least 3 characters long");
        return false;
      }
      try {
        const res = await fetch("/api/check-slug", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug: store.slug }),
        });
        const data = await res.json();
        
        if (!data.available) {
          if (data.slug && data.slug !== store.slug) {
            // Update the store with the suggested slug
            store.setData({ slug: data.slug });
            setError(`"${data.originalSlug || store.slug}" is already taken. We've updated it to "${data.slug}" for you.`);
          } else {
            setError(data.message || "That profile URL is already taken. Please try a different one.");
          }
          return false;
        }
        
        // Clear any previous errors if slug is available
        setError(null);
        return true;
      } catch {
        setError("Unable to check URL availability. Please try again in a moment.");
        return false;
      }
    }
    if (index === 7) return store.bio.length <= 500; // optional but limited
    if (index === 8) return true; // photo optional
    if (index === 9) return !!store.template;
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
      if (
        !store.slug ||
        !store.cityId
      ) {
        setError("Please complete all required fields before continuing to the next step.");
        return;
      }
      const result = await updateAgentProfile({
        experience: store.experience,
        bio: store.bio,
        phone: store.phoneVerified && store.phone ? store.phone : undefined, // Only include phone if verified
        city: store.city, // back-compat display
        area: store.area,
        template: store.template,
        profilePhotoUrl: store.profilePhotoUrl,
        slug: store.slug,
        dateOfBirth: store.dateOfBirth, // Optional - will be null if not provided
        name: store.name || session?.user?.name || undefined,
        email: store.email || session?.user?.email || undefined,
        // new hierarchical location
        stateId: store.stateId,
        districtId: store.districtId,
        cityId: store.cityId,
      });
      if (result.success && result.agent?.slug) {
        useWizardStore.getState().reset();
        router.push("/agent/dashboard");
      } else {
        setError("We couldn\'t create your profile right now. Please try again.");
      }
    } finally {
      setBusy(false);
    }
  };

  // Keyboard: Enter to continue
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
        const isTextArea = tag === "textarea";
        if (!isTextArea) {
          e.preventDefault();
          void next();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next]);

  const progress = Math.round(((index + 1) / TOTAL) * 100);

  return (
    <div className="w-full">
      {/* Enhanced Progress Bar */}
      <div className="mb-12">
        <div className="relative">
                     <div className="h-3 w-full overflow-hidden rounded-full border border-orange-100 bg-white/80 shadow-inner">
             <div
               className="h-3 rounded-full bg-brand shadow-sm transition-all duration-500 ease-out"
               style={{ width: `${progress}%` }}
             />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="text-sm font-medium text-zinc-700">
              Step {index + 1} of {TOTAL}
            </div>
            <div className="text-sm text-zinc-600">{progress}% Complete 🚀</div>
          </div>
        </div>
        </div>

        <div className="relative min-h-[360px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
            initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="rounded-2xl border border-white bg-white/90 p-8 shadow-xl backdrop-blur-sm sm:p-12"
            >
               {index === 0 && (
              <div className="space-y-8 text-center">
                {/* Hero Section */}
                <div className="space-y-4">
                  <div className="mb-4 text-6xl">🎉</div>
                                     <h1 className="text-4xl font-bold leading-tight text-brand sm:text-5xl">
                     Welcome to YourAgent!
                   </h1>
                  <p className="mx-auto max-w-2xl text-xl leading-relaxed text-zinc-600">
                    Let&amp;apos;s build your professional real estate profile in just{" "}
                    <span className="font-semibold text-orange-600">
                      10 simple steps
                    </span>{" "}
                    🚀
                  </p>
                </div>

                                 {/* Benefits Grid */}
                 <div className="my-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                   <div className="rounded-xl border border-orange-100 bg-orange-50 p-6">
                     <div className="mb-3 text-2xl">🎯</div>
                     <h3 className="mb-2 font-semibold text-zinc-900">
                       Get More Leads
                     </h3>
                     <p className="text-sm text-zinc-600">
                       Professional profiles get 3x more quality leads
                     </p>
                   </div>
                   <div className="rounded-xl border border-orange-100 bg-orange-50 p-6">
                     <div className="mb-3 text-2xl">💼</div>
                     <h3 className="mb-2 font-semibold text-zinc-900">
                       Build Trust
                     </h3>
                     <p className="text-sm text-zinc-600">
                       Showcase your expertise and experience
                     </p>
                   </div>
                   <div className="rounded-xl border border-orange-100 bg-orange-50 p-6">
                     <div className="mb-3 text-2xl">⚡</div>
                     <h3 className="mb-2 font-semibold text-zinc-900">
                       Quick Setup
                     </h3>
                     <p className="text-sm text-zinc-600">
                       Go live in under 5 minutes
                     </p>
                   </div>
                   <div className="rounded-xl border border-orange-100 bg-orange-50 p-6">
                     <div className="mb-3 text-2xl">🎨</div>
                     <h3 className="mb-2 font-semibold text-zinc-900">
                       Beautiful Design
                     </h3>
                     <p className="text-sm text-zinc-600">
                       Choose from stunning templates
                     </p>
                   </div>
                 </div>

                                 {/* What We'll Do */}
                 <div className="rounded-xl border border-orange-100 bg-orange-50 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-zinc-900">
                    What we&amp;apos;ll set up together:
                  </h3>
                  <div className="grid grid-cols-1 gap-3 text-left sm:grid-cols-2">
                    <div className="flex items-center gap-3">
                      <span className="text-green-600">✅</span>
                      <span className="text-sm text-zinc-700">
                        Your professional details
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-green-600">✅</span>
                      <span className="text-sm text-zinc-700">
                        Custom profile URL
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-green-600">✅</span>
                      <span className="text-sm text-zinc-700">
                        Professional bio
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-green-600">✅</span>
                      <span className="text-sm text-zinc-700">
                        Beautiful website template
                      </span>
                    </div>
                  </div>
                </div>

                {/* Encouragement */}
                <div className="text-center">
                  <p className="text-lg font-medium text-zinc-800">
                    Ready to get started? 🎊
                  </p>
                  <p className="mt-1 text-sm text-zinc-600">
                    This will be fun and quick, we promise!
                  </p>
                </div>
                </div>
               )}

               {index === 1 && (
               <div className="space-y-8">
                 <div className="text-center space-y-4">
                   <div className="text-4xl">👋</div>
                   <h2 className="text-3xl font-bold text-zinc-950">
                     Nice to meet you!
                   </h2>
                   <p className="text-lg text-zinc-600">
                     Let&amp;apos;s start with your name so we can personalize everything
                   </p>
                 </div>
                 <div className="max-w-md mx-auto space-y-2">
                   <Label className="text-sm font-medium text-zinc-700">Full Name</Label>
                    <Input
                      type="text"
                     placeholder={session?.user?.name || "Your name"}
                     className="h-11"
                     value={store.name || ""}
                      onChange={(e) => store.setData({ name: e.target.value })}
                    />
                  </div>
                </div>
              )}

               {index === 2 && (
               <div className="space-y-8">
                 <div className="text-center space-y-4">
                   <div className="text-4xl">📧</div>
                   <h2 className="text-3xl font-bold text-zinc-950">
                     Great! Now your email
                   </h2>
                   <p className="text-lg text-zinc-600">
                     We&amp;apos;ll use this to send you important updates about your
                     profile
                   </p>
                 </div>
                 <div className="max-w-md mx-auto space-y-2">
                   <Label className="text-sm font-medium text-zinc-700">Email</Label>
                    <Input
                      type="email"
                     placeholder={session?.user?.email || "you@example.com"}
                     className="h-11"
                     value={store.email || ""}
                      onChange={(e) => store.setData({ email: e.target.value })}
                    />
                   <p className="text-xs text-zinc-500 text-center">
                     We prefill if you used Google. WhatsApp users can add it
                     now.
                   </p>
                  </div>
                </div>
              )}

               {index === 3 && (
               <div className="space-y-8">
                 <div className="text-center space-y-4">
                   <div className="text-4xl">📍</div>
                   <h2 className="text-3xl font-bold text-zinc-950">
                     Where&amp;apos;s your territory?
                   </h2>
                   <p className="text-lg text-zinc-600">
                     Help clients find you by setting your operating location
                   </p>
                 </div>
                 <div className="max-w-md mx-auto">
                  <LocationSelector
                    stateId={store.stateId}
                    districtId={store.districtId}
                    cityId={store.cityId}
                     onStateChange={(v) =>
                       store.setData({ stateId: v, districtId: "", cityId: "" })
                     }
                     onDistrictChange={(v) =>
                       store.setData({ districtId: v, cityId: "" })
                     }
                    onCityChange={async (v) => {
                      // set selected ids and also set legacy city name for back-compat
                      try {
                         const res = await fetch(
                           `/api/locations?districtId=${store.districtId}`
                         );
                        const data = await res.json();
                         const found = Array.isArray(data.cities)
                           ? data.cities.find((c: { id: string; name: string }) => c.id === v)
                           : null;
                         store.setData({ cityId: v, city: found?.name || "" });
                      } catch {
                        store.setData({ cityId: v });
                      }
                    }}
                    required
                  />
                  </div>
                </div>
              )}

                              {index === 4 && (
                 <div className="space-y-8">
                   <div className="text-center space-y-4">
                     <div className="text-4xl">📱</div>
                     <h2 className="text-3xl font-bold text-zinc-950">
                       Verify your phone number
                     </h2>
                     <p className="text-lg text-zinc-600">
                       This helps clients reach you easily and builds trust
                     </p>
                     <p className="text-sm text-zinc-500">
                       Optional - you can skip this step and add it later
                     </p>
                   </div>
                   <div className="max-w-md mx-auto">
                  <PhoneWhatsAppVerify
                    label="Phone (India only)"
                    value={store.phone}
                       onValueChange={(e164) =>
                         store.setData({ phone: e164, phoneVerified: false })
                       }
                       onVerified={(e164) =>
                         store.setData({ phone: e164, phoneVerified: true })
                       }
                    required
                  />
                  {!!store.phone && !isPhoneValid(store.phone) && (
                       <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-center gap-2">
                         <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                         <p className="text-sm text-amber-800">
                           Enter a valid 10-digit Indian number (e.g., +919876543210)
                         </p>
                       </div>
                     )}
                     {!!store.phone &&
                       isPhoneValid(store.phone) &&
                       !store.phoneVerified && (
                         <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200 flex items-center gap-2">
                           <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                           <p className="text-sm text-blue-800">
                             Please verify your WhatsApp number to continue.
                           </p>
                </div>
              )}

                     {/* Verify Later Option */}
                     {!store.phoneVerified && (
                       <div className="mt-6 pt-4 border-t border-zinc-100">
                         <div className="text-center space-y-3">
                           <p className="text-sm text-zinc-600">
                             Having trouble with verification?
                           </p>
                           <button
                             type="button"
                             onClick={() => {
                               // Clear any phone data if they want to skip verification
                               store.setData({ phone: '', phoneVerified: false });
                               // Immediately advance to next step
                               setIndex((i) => i + 1);
                             }}
                             className="inline-flex items-center gap-2 px-4 py-2 text-sm text-zinc-600 hover:text-zinc-800 bg-zinc-50 hover:bg-zinc-100 rounded-md transition-colors"
                           >
                             <span>Skip for now</span>
                             <span className="text-xs">→</span>
                           </button>
                           <p className="text-xs text-zinc-500">
                             You can add your phone number anytime from your dashboard
                           </p>
                         </div>
                       </div>
                     )}
                     
                     {/* Success message when verified */}
                     {store.phoneVerified && store.phone && (
                       <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200 flex items-center gap-2">
                         <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                         <p className="text-sm text-green-800">
                           Great! Your phone number is verified and ready to go.
                         </p>
                       </div>
                     )}
                  </div>
                </div>
              )}

                        {index === 5 && (
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <div className="text-4xl">🏆</div>
                  <h2 className="text-3xl font-bold text-zinc-950">
                    Time to show off your expertise!
                  </h2>
                  <p className="text-lg text-zinc-600">
                    Your experience helps clients trust your guidance
                  </p>
                </div>
                <div className="max-w-md mx-auto space-y-2">
                  <Label htmlFor="exp" className="text-sm font-medium text-zinc-700">
                    Experience (years)
                  </Label>
                    <Input
                      id="exp"
                      type="number"
                      value={store.experience}
                    onChange={(e) =>
                      store.setData({
                        experience: parseInt(e.target.value || "0", 10) || 0,
                      })
                    }
                      min={0}
                      max={50}
                    className="h-11"
                    />
                  </div>
                </div>
              )}

                         {index === 6 && (
               <div className="space-y-8">
                 <div className="text-center space-y-4">
                   <div className="text-4xl">🔗</div>
                   <h2 className="text-3xl font-bold text-zinc-950">
                     Claim your unique URL!
                   </h2>
                   <p className="text-lg text-zinc-600">
                     This will be your personal real estate website address
                   </p>
                 </div>
                                    <div className="max-w-md mx-auto space-y-2">
                     <Label htmlFor="slug" className="text-sm font-medium text-zinc-700">
                       Profile URL
                     </Label>
                     <div className="flex">
                       <span className="inline-flex items-center rounded-l-lg border border-r-0 border-zinc-300 bg-zinc-100 px-4 text-sm font-medium text-zinc-600">
                         youragent.in/
                       </span>
                       <div className="relative flex-1">
                      <Input
                        id="slug"
                        type="text"
                        value={store.slug}
                           onChange={(e) => {
                             setError(null); // Clear error when user types
                             setSlugStatus(null); // Clear status when user types
                             store.setData({ slug: e.target.value });
                           }}
                        placeholder="your-name"
                           className="h-11 rounded-l-none pr-10"
                         />
                         <div className="absolute right-3 top-1/2 -translate-y-1/2">
                           {slugChecking && (
                             <div className="w-4 h-4 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin"></div>
                           )}
                           {!slugChecking && slugStatus === 'available' && (
                             <Check className="w-4 h-4 text-green-600" />
                           )}
                           {!slugChecking && slugStatus === 'taken' && (
                             <AlertCircle className="w-4 h-4 text-red-600" />
                           )}
                         </div>
                       </div>
                     </div>
                     
                     {/* Real-time availability status */}
                     {!error && store.slug && store.slug.length >= 3 && slugStatus && (
                       <div className={`mt-2 text-xs flex items-center gap-1 ${
                         slugStatus === 'available' ? 'text-green-600' : 
                         slugStatus === 'taken' ? 'text-red-600' : 'text-zinc-500'
                       }`}>
                         {slugStatus === 'available' && (
                           <>
                             <Check className="w-3 h-3" />
                             <span>Available!</span>
                           </>
                         )}
                         {slugStatus === 'taken' && (
                           <>
                             <AlertCircle className="w-3 h-3" />
                             <span>Already taken</span>
                           </>
                         )}
                       </div>
                     )}
                     
                                           {error && (
                          <div className={`mt-4 p-4 rounded-lg border flex items-start gap-3 ${
                            error.includes("updated it to") 
                              ? "bg-blue-50 border-blue-200" 
                              : "bg-red-50 border-red-200"
                          }`}>
                            <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                              error.includes("updated it to") 
                                ? "text-blue-600" 
                                : "text-red-600"
                            }`} />
                            <div className="flex-1">
                              <p className={`text-sm font-medium leading-relaxed ${
                                error.includes("updated it to") 
                                  ? "text-blue-800" 
                                  : "text-red-800"
                              }`}>
                                {error}
                              </p>
                              {error.includes("updated it to") && (
                                <p className="text-xs text-blue-700 mt-2 opacity-90">
                                  💡 The URL has been automatically updated for you. You can modify it if needed.
                                </p>
                              )}
                            </div>
                    </div>
                        )}
                  </div>
                </div>
              )}

                         {index === 7 && (
               <div className="space-y-8">
                 <div className="text-center space-y-4">
                   <div className="text-4xl">✍️</div>
                   <h2 className="text-3xl font-bold text-zinc-950">
                     Tell your story!
                   </h2>
                   <p className="text-lg text-zinc-600">
                     A great bio helps clients connect with you personally
                   </p>
                 </div>
                 <div className="max-w-lg mx-auto space-y-2">
                   <Label htmlFor="bio" className="text-sm font-medium text-zinc-700">
                     Bio (optional)
                   </Label>
                    <textarea
                      id="bio"
                      value={store.bio}
                     onChange={(e) =>
                       store.setData({ bio: e.target.value.slice(0, 500) })
                     }
                      placeholder="Tell clients about your background and expertise..."
                     className="min-h-[160px] w-full rounded-md border border-zinc-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-brand"
                   />
                   <div className="flex items-center justify-between">
                     <div className="text-xs text-zinc-500">
                       {store.bio.length}/500
                     </div>
                        <Button
                          type="button"
                          variant="outline"
                          disabled={generatingBio}
                          onClick={async () => {
                            try {
                              setError(null);
                              setGeneratingBio(true);
                           const name =
                             store.name || session?.user?.name || "Agent";
                              const res = await generateBio({
                                name,
                             experience: Number.isFinite(store.experience)
                               ? store.experience
                               : 0,
                             city: store.city || "Your City",
                                area: store.area || undefined,
                              });
                              if (res?.success && res?.bio) {
                                store.setData({ bio: res.bio.slice(0, 500) });
                              } else {
                                                           setError(
                                "We couldn't generate your bio right now. Please try again or write one yourself."
                              );
                              }
                            } catch (e) {
                           setError(
                             e instanceof Error
                               ? e.message
                               : "Something went wrong while generating your bio. Please try again."
                           );
                            } finally {
                              setGeneratingBio(false);
                            }
                          }}
                          className="h-9"
                        >
                       {generatingBio ? "Generating..." : "Generate with AI"}
                        </Button>
                      </div>
                  </div>
                </div>
              )}

                         {index === 8 && (
               <div className="space-y-8">
                 <div className="text-center space-y-4">
                   <div className="text-4xl">📸</div>
                   <h2 className="text-3xl font-bold text-zinc-950">
                     Show your friendly face!
                   </h2>
                   <p className="text-lg text-zinc-600">
                     A professional photo builds instant trust with clients
                   </p>
                 </div>
                 <div className="max-w-lg mx-auto">
                  <Step3_Photo />
                 </div>
                </div>
              )}

             {index === 9 && (
               <div className="space-y-8">
                 <div className="text-center space-y-4">
                   <div className="text-4xl">🎨</div>
                   <h2 className="text-3xl font-bold text-zinc-950">
                     Almost done! Pick your style
                   </h2>
                   <p className="text-lg text-zinc-600">
                     Choose a beautiful template that represents your brand
                   </p>
                 </div>
                 <div className="max-w-4xl mx-auto">
                  <Step4_Theme />
                 </div>
                </div>
              )}

            {/* Global Error Display */}
            {error && !error.includes("Profile URL") && !error.includes("updated it to") && !error.includes("already taken") && (
              <div className="mt-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800 leading-relaxed">{error}</p>
                  {error.includes("Failed to create profile") && (
                    <p className="text-xs text-red-700 mt-2 opacity-90">
                      💡 Please try again or contact support if the issue persists.
                    </p>
                  )}
                  {error.includes("complete all required fields") && (
                    <p className="text-xs text-red-700 mt-2 opacity-90">
                      💡 Make sure all required fields are filled before continuing.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Enhanced Nav */}
            <div className="mt-8 flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={prev}
                disabled={index === 0}
                className="flex items-center gap-2 border-zinc-300 px-6 py-3 hover:bg-zinc-50"
              >
                <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>
                             <Button
                 type="button"
                 onClick={next}
                 disabled={busy}
                 className="flex transform items-center gap-2 rounded-lg bg-brand px-8 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-brand-hover"
               >
                {busy ? (
                  "Processing..."
                ) : index === TOTAL - 1 ? (
                  <>Launch My Profile! 🚀</>
                ) : (
                  <>
                    Continue
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
      </div>
    </div>
  );
}
