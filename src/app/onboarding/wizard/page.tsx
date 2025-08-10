import { redirect } from 'next/navigation';
import { getUserFlowStatus } from '@/lib/userFlow';
import TypeformWizardClient from './TypeformWizardClient';

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

  // User needs onboarding - show the wizard
  return <TypeformWizardClient />;
}