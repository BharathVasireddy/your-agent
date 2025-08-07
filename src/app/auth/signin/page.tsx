import { redirect } from 'next/navigation';

export default async function SignInPage() {
  // Redirect to new login page
  redirect('/login');
}