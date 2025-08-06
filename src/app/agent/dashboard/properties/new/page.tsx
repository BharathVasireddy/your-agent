import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import PropertyCreationWizard from '@/components/property/PropertyCreationWizard';

export default async function NewPropertyPage() {
  // Get the current user's session
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/api/auth/signin');
  }

  return <PropertyCreationWizard />;
}