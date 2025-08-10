// Email/password registration is disabled. Redirect to login.
import { redirect } from 'next/navigation';

export default async function RegisterPage() {
  redirect('/login');
}
