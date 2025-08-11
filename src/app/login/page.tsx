import { Suspense } from 'react';
import AuthPageLayout from '@/components/auth/AuthPageLayout';
import SignInForm from '@/components/SignInForm';

export default async function LoginPage() {
  return (
    <AuthPageLayout 
      title="Welcome Back"
      subtitle="Sign in with Google or WhatsApp"
    >
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <SignInForm />
      </Suspense>
    </AuthPageLayout>
  );
}
