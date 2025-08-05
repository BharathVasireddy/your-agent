'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardTour from './DashboardTour';
import DashboardContent from './DashboardContent';
import type { AgentProfile, Property } from '@/types/dashboard';

interface DashboardWithTourProps {
  needsTour: boolean;
  agent: AgentProfile | null;
  properties: Property[];
  saleProperties: number;
  rentProperties: number;
  availableProperties: number;
}

export default function DashboardWithTour({
  needsTour,
  agent,
  properties,
  saleProperties,
  rentProperties,
  availableProperties
}: DashboardWithTourProps) {
  const router = useRouter();
  const [showTour, setShowTour] = useState(needsTour);

  const handleTourComplete = () => {
    setShowTour(false);
    // Refresh the page to update the hasSeenTour status
    router.refresh();
  };

  return (
    <>
      <DashboardContent
        agent={agent}
        properties={properties}
        saleProperties={saleProperties}
        rentProperties={rentProperties}
        availableProperties={availableProperties}
      />
      
      <DashboardTour
        isVisible={showTour}
        onComplete={handleTourComplete}
      />
    </>
  );
}