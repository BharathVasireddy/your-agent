'use client';

import { signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle, X } from 'lucide-react';

interface SignOutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function SignOutButton({ className, children }: SignOutButtonProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showConfirmation) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showConfirmation]);

  const handleSignOutClick = () => {
    console.log('Sign out clicked, showing confirmation modal');
    setShowConfirmation(true);
    // Add debug logging
    console.log('showConfirmation state set to:', true);
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

      {/* Confirmation Modal - Rendered as Portal */}
      {showConfirmation && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-[99999]"
          onClick={handleCancelSignOut}
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(0, 0, 0, 0.75)'
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 relative z-[100000]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleCancelSignOut}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            
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
            className="flex-1 bg-brand hover:bg-brand-hover text-white"
              >
                {isSigningOut ? 'Signing Out...' : 'Sign Out'}
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}