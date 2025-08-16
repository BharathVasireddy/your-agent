import { redirect } from 'next/navigation';
import { getUserFlowStatus } from '@/lib/userFlow';
import TypeformWizardClient from './TypeformWizardClient';
// import Image from 'next/image';

export default async function OnboardingWizardPage() {
  // Check user flow status server-side
  const flowStatus = await getUserFlowStatus();

  // If user is not authenticated, redirect to sign in
  if (!flowStatus.isAuthenticated) {
    redirect('/login');
  }

  // Subscription is not required before onboarding

  // If user doesn't need onboarding (already completed), redirect to dashboard
  if (!flowStatus.needsOnboarding) {
    redirect('/agent/dashboard');
  }

  // User needs onboarding - enhanced single column layout
  return (
    <div className="min-h-screen bg-orange-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TypeformWizardClient />
      </div>
    </div>
  );
}