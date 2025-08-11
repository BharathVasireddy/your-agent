'use client';

import { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ResetPasswordForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // TODO: Implement password reset logic
      // This would typically call your backend API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setIsSuccess(true);
    } catch {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <Mail className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-950">Check Your Email</h3>
        <p className="text-zinc-600">
          We&apos;ve sent password reset instructions to <strong>{email}</strong>
        </p>
        <p className="text-sm text-zinc-500">
          Didn&apos;t receive the email? Check your spam folder or try again.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center text-brand hover:text-brand-hover font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-brand-light border border-brand-soft text-brand px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent input-lg input-with-left-icon"
            placeholder="Enter your email address"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-brand hover:bg-brand-hover text-white btn-lg"
      >
        {isLoading ? 'Sending...' : 'Send Reset Instructions'}
      </Button>

      <div className="text-center">
        <Link
          href="/login"
          className="inline-flex items-center text-zinc-600 hover:text-zinc-900 text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to sign in
        </Link>
      </div>
    </form>
  );
}
