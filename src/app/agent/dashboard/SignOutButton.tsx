'use client';

import { signOut } from 'next-auth/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface SignOutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function SignOutButton({ className, children }: SignOutButtonProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOutClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut({ 
        callbackUrl: '/', // Redirect to home page after sign out
        redirect: true 
      });
    } catch (error) {
      console.error('Error signing out:', error);
      setIsSigningOut(false);
      setShowConfirmation(false);
    }
  };

  const handleCancelSignOut = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      {/* Sign Out Button */}
      <button
        type="button"
        onClick={handleSignOutClick}
        className={className}
        disabled={isSigningOut}
      >
        {children || 'Sign Out'}
      </button>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            {/* Header */}
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-zinc-950">Confirm Sign Out</h3>
                <p className="text-sm text-zinc-600">You will be signed out of your account</p>
              </div>
            </div>

            {/* Message */}
            <p className="text-zinc-700 mb-6">
              Are you sure you want to sign out? You will need to sign in again to access your dashboard.
            </p>

            {/* Buttons */}
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handleCancelSignOut}
                disabled={isSigningOut}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmSignOut}
                disabled={isSigningOut}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                {isSigningOut ? 'Signing Out...' : 'Sign Out'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}