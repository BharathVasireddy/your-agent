'use client';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useWizardStore } from "@/store/wizard-store";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Step1_Professional from "@/components/onboarding/Step1_Professional";
import Step2_About from "@/components/onboarding/Step2_About";
import Step3_Photo from "@/components/onboarding/Step3_Photo";
import Step4_Theme from "@/components/onboarding/Step4_Theme";
import { updateAgentProfile } from "@/app/actions";

export default function OnboardingWizardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const wizardStore = useWizardStore();

  // Check authentication and subscription status
  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push('/api/auth/signin');
      return;
    }

    // Check subscription status (you can add an API call here if needed)
    // For now, assuming user is subscribed if they reach this page
    setLoading(false);
  }, [session, status, router]);

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
        theme: wizardStore.theme,
        profilePhotoUrl: wizardStore.profilePhotoUrl,
        slug: wizardStore.slug,
      };

      // Validate required fields before submission
      if (!profileData.slug || !profileData.phone || !profileData.city) {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-500">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null; // Router will redirect
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-red-600 mb-2">
            Profile Setup Wizard
          </h1>
          <p className="text-zinc-600">
            Hello, {session.user?.name || session.user?.email}! Let&apos;s build your professional profile.
          </p>
          
          {/* Subscription Status */}
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg inline-flex items-center gap-2">
            <CheckCircle size={16} className="text-green-600" />
            <span className="text-green-800 text-sm">Subscription Active</span>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex space-x-4">
              {[1, 2, 3, 4].map((stepNum) => (
                <div
                  key={stepNum}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    stepNum === step
                      ? 'bg-red-600 text-white'
                      : stepNum < step
                      ? 'bg-green-500 text-white'
                      : 'bg-zinc-200 text-zinc-600'
                  }`}
                >
                  {stepNum}
                </div>
              ))}
            </div>
          </div>
          <p className="text-center text-sm text-zinc-600">
            Step {step} of 4
          </p>
        </div>

        {/* Step Content */}
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md border border-zinc-200">
          <div className="p-8">
            {step === 1 && <Step1_Professional />}
            {step === 2 && <Step2_About />}
            {step === 3 && <Step3_Photo />}
            {step === 4 && <Step4_Theme />}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center p-6 border-t border-zinc-200">
            <Button
              onClick={prevStep}
              disabled={step === 1}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ChevronLeft size={16} />
              Back
            </Button>

            {step === 4 ? (
              <Button
                onClick={handleFinish}
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
              >
                {isSubmitting ? 'Creating Profile...' : 'Finish & Create Profile'}
                <ChevronRight size={16} />
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
              >
                Next
                <ChevronRight size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}