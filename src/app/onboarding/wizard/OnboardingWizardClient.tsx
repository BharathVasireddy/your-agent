'use client';

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useWizardStore } from "@/store/wizard-store";
import { ChevronLeft, ChevronRight, Check, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Step1_Professional from "@/components/onboarding/Step1_Professional";
import Step2_About from "@/components/onboarding/Step2_About";
import Step3_Photo from "@/components/onboarding/Step3_Photo";
import Step4_Theme from "@/components/onboarding/Step4_Theme";
import { updateAgentProfile } from "@/app/actions";

export default function OnboardingWizardClient() {
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const wizardStore = useWizardStore();

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinish = async () => {
    try {
      setIsSubmitting(true);
      
      // Get all data from wizard store
      const profileData = {
        experience: wizardStore.experience,
        bio: wizardStore.bio,
        phone: wizardStore.phone,
        city: wizardStore.city,
        area: wizardStore.area,
        template: wizardStore.template,
        profilePhotoUrl: wizardStore.profilePhotoUrl,
        slug: wizardStore.slug,
        dateOfBirth: wizardStore.dateOfBirth,
      };

      // Validate required fields before submission
      if (!profileData.slug || !profileData.phone || !profileData.city || !profileData.dateOfBirth) {
        alert('Please complete all required fields before finishing.');
        return;
      }

      // Submit the profile data
      console.log("Profile data to submit:", profileData);
      const result = await updateAgentProfile(profileData);
      
      if (result.success && result.agent?.slug) {
        // Reset the wizard store after successful submission
        wizardStore.reset();
        
        // Redirect to the agent's public profile page using their slug
        router.push(`/${result.agent.slug}`);
      } else {
        alert('Profile creation failed. Please try again.');
      }
      
    } catch (error) {
      console.error("Error creating profile:", error);
      alert(error instanceof Error ? error.message : 'Failed to create profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Mobile header */}
        <div className="mb-6 lg:hidden">
          <h1 className="text-2xl font-semibold text-zinc-950">Set up your profile</h1>
          <p className="text-zinc-600 text-sm">Hello, {session?.user?.name || session?.user?.email}. Complete these quick steps.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Progress sidebar (desktop) */}
          <aside className="lg:col-span-4">
            <div className="sticky top-4 bg-white border border-zinc-200 rounded-xl p-5">
              <div className="hidden lg:block mb-4">
                <h2 className="text-xl font-semibold text-zinc-950">Profile Setup</h2>
                <p className="text-sm text-zinc-600">Step {step} of 4</p>
              </div>
              <ol className="space-y-4">
                {[
                  { id: 1, title: 'Professional Info', desc: 'Location, contact, experience' },
                  { id: 2, title: 'About You', desc: 'Write your professional bio' },
                  { id: 3, title: 'Profile Photo', desc: 'Upload a clear headshot' },
                  { id: 4, title: 'Template', desc: 'Choose your profile look' },
                ].map(({ id, title, desc }) => {
                  const isActive = id === step;
                  const isDone = id < step;
                  return (
                    <li key={id} className={`flex items-start gap-3 rounded-lg p-3 ${isActive ? 'bg-brand-light border border-brand-soft' : 'bg-white'}`}>
                      <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center border ${isActive ? 'border-brand' : 'border-zinc-300'}`}>
                        {isDone ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Circle className={`w-3.5 h-3.5 ${isActive ? 'text-brand' : 'text-zinc-400'}`} />}
                      </div>
                      <div className="flex-1">
                        <div className={`text-sm font-medium ${isActive ? 'text-brand' : 'text-zinc-900'}`}>{title}</div>
                        <div className="text-xs text-zinc-600">{desc}</div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </aside>

          {/* Step content */}
          <section className="lg:col-span-8">
            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm">
              <div className="p-5 sm:p-6 lg:p-8">
                {step === 1 && <Step1_Professional />}
                {step === 2 && <Step2_About />}
                {step === 3 && <Step3_Photo />}
                {step === 4 && <Step4_Theme />}
              </div>
              <div className="flex items-center justify-between gap-3 p-4 sm:p-6 border-t border-zinc-200">
                <Button onClick={prevStep} disabled={step === 1} variant="outline" className="flex items-center gap-2">
                  <ChevronLeft size={16} />
                  Back
                </Button>
                {step === 4 ? (
                  <Button onClick={handleFinish} disabled={isSubmitting} className="flex items-center gap-2 bg-brand hover:bg-brand-hover text-white">
                    {isSubmitting ? 'Creating Profile...' : 'Finish & Create Profile'}
                    <ChevronRight size={16} />
                  </Button>
                ) : (
                  <Button onClick={nextStep} className="flex items-center gap-2 bg-brand hover:bg-brand-hover text-white">
                    Next
                    <ChevronRight size={16} />
                  </Button>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}