'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Settings } from 'lucide-react';

interface DashboardButtonProps {
  agentUserId: string;
}

export default function DashboardButton({ agentUserId }: DashboardButtonProps) {
  const { data: session } = useSession();
  
  // Check if current user owns this profile
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isOwner = session && (session as any).user && (session as any).user.id === agentUserId;
  
  if (!isOwner) {
    return null;
  }

  return (
    <Link
      href="/agent/dashboard"
      className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
      title="Go to Dashboard"
    >
      <Settings className="w-4 h-4" />
      <span className="hidden sm:inline">Dashboard</span>
    </Link>
  );
}