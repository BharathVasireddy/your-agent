'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, ArrowRight, ArrowLeft, CheckCircle, Home, Building, User, Plus } from 'lucide-react';
import { markTourAsComplete } from '@/lib/userFlow';

import type { ExtendedSession } from '@/types/dashboard';

interface DashboardTourProps {
  isVisible: boolean;
  onComplete: () => void;
  userSession: ExtendedSession;
}

interface TourStep {
  id: number;
  title: string;
  description: string;
  target: string;
  icon: React.ReactNode;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
  {
    id: 1,
    title: 'Welcome to Your Dashboard! 🎉',
    description: 'This is your command center for managing your real estate business. Let\'s take a quick tour to show you around.',
    target: 'agent-header',
    icon: <Home className="w-5 h-5" />,
    position: 'bottom'
  },
  {
    id: 2,
    title: 'Your Professional Profile',
    description: 'This shows your profile info and quick stats. Click "Edit Profile" anytime to update your details, photo, or bio.',
    target: 'agent-header',
    icon: <User className="w-5 h-5" />,
    position: 'bottom'
  },
  {
    id: 3,
    title: 'Quick Statistics',
    description: 'Track your properties at a glance - total listings, available properties, and breakdown by sale vs rent.',
    target: 'quick-stats',
    icon: <Building className="w-5 h-5" />,
    position: 'top'
  },
  {
    id: 4,
    title: 'Add Your First Property',
    description: 'Start by adding your property listings. This red button is your main action - click it when you\'re ready to list your first property!',
    target: 'add-property-button',
    icon: <Plus className="w-5 h-5" />,
    position: 'top'
  },
  {
    id: 5,
    title: 'Navigation Made Easy',
    description: 'Use the bottom navigation (mobile) or header links (desktop) to move between Dashboard, Properties, and Profile sections.',
    target: 'bottom-nav',
    icon: <ArrowRight className="w-5 h-5" />,
    position: 'top'
  },
  {
    id: 6,
    title: 'You\'re All Set! 🚀',
    description: 'That\'s it! You\'re ready to start managing your real estate business. Need help? Look for help icons throughout the app.',
    target: 'agent-header',
    icon: <CheckCircle className="w-5 h-5" />,
    position: 'bottom'
  }
];

export default function DashboardTour({ isVisible, onComplete, userSession }: DashboardTourProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleting, setIsCompleting] = useState(false);

  if (!isVisible) return null;

  const currentTourStep = tourSteps.find(step => step.id === currentStep);
  const isLastStep = currentStep === tourSteps.length;
  const isFirstStep = currentStep === 1;

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      setIsCompleting(true);
      await markTourAsComplete(userSession.user.id);
      onComplete();
    } catch (error) {
      console.error('Error completing tour:', error);
      onComplete(); // Complete anyway to not block the user
    } finally {
      setIsCompleting(false);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (!currentTourStep) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
      
      {/* Tour Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-zinc-200">
          {/* Header */}
          <div className="p-6 border-b border-zinc-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  {currentTourStep.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-950">
                    {currentTourStep.title}
                  </h3>
                  <p className="text-sm text-zinc-500">
                    Step {currentStep} of {tourSteps.length}
                  </p>
                </div>
              </div>
              <button
                onClick={handleSkip}
                className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-zinc-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-zinc-700 leading-relaxed">
              {currentTourStep.description}
            </p>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-zinc-500 mb-2">
                <span>Progress</span>
                <span>{Math.round((currentStep / tourSteps.length) * 100)}%</span>
              </div>
              <div className="w-full bg-zinc-200 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / tourSteps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-zinc-200 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handleSkip}
              disabled={isCompleting}
            >
              Skip Tour
            </Button>
            
            <div className="flex items-center space-x-3">
              {!isFirstStep && (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={isCompleting}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              )}
              
              <Button
                onClick={handleNext}
                disabled={isCompleting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isCompleting ? (
                  'Completing...'
                ) : isLastStep ? (
                  <>
                    Get Started
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}