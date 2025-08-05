import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import CopyShareButtons from './CopyShareButtons';

interface AgentProfilePageProps {
  params: Promise<{
    agentSlug: string;
  }>;
}

export default async function AgentProfilePage({ params }: AgentProfilePageProps) {
  // Await the params in Next.js 15
  const { agentSlug } = await params;
  
  // Find the agent by slug
  const agent = await prisma.agent.findUnique({
    where: {
      slug: agentSlug,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!agent) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-zinc-950 mb-2">
            🎉 Profile Created Successfully!
          </h1>
          <p className="text-zinc-600">
            Your professional real estate agent profile is now live
          </p>
        </div>

        {/* Profile Preview */}
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg border border-zinc-200 p-8">
          <div className="flex flex-col items-center text-center">
            {/* Profile Photo */}
            {agent.profilePhotoUrl ? (
              <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-red-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={agent.profilePhotoUrl}
                  alt={`${agent.user.name} - Real Estate Agent`}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-32 h-32 rounded-full bg-zinc-100 border-4 border-red-100 flex items-center justify-center mb-6">
                <svg className="w-16 h-16 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}

            {/* Basic Info */}
            <h2 className="text-2xl font-bold text-zinc-950 mb-1">
              {agent.user.name}
            </h2>
            <p className="text-red-600 font-medium mb-4">
              Real Estate Agent
            </p>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-6">
              <div className="text-left">
                <p className="text-sm text-zinc-600">Experience</p>
                <p className="font-medium text-zinc-900">{agent.experience} years</p>
              </div>
              <div className="text-left">
                <p className="text-sm text-zinc-600">Specialization</p>
                <p className="font-medium text-zinc-900">{agent.specialization}</p>
              </div>
              <div className="text-left">
                <p className="text-sm text-zinc-600">Location</p>
                <p className="font-medium text-zinc-900">{agent.city}</p>
              </div>
              <div className="text-left">
                <p className="text-sm text-zinc-600">Phone</p>
                <p className="font-medium text-zinc-900">{agent.phone}</p>
              </div>
              {agent.licenseNumber && (
                <div className="text-left md:col-span-2">
                  <p className="text-sm text-zinc-600">RERA License</p>
                  <p className="font-medium text-zinc-900">{agent.licenseNumber}</p>
                </div>
              )}
            </div>

            {/* Bio */}
            {agent.bio && (
              <div className="w-full">
                <h3 className="text-lg font-semibold text-zinc-950 mb-2">About</h3>
                <p className="text-zinc-700 leading-relaxed">{agent.bio}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-8 space-y-4">
          <p className="text-zinc-600">
            Your profile URL: <span className="font-mono text-red-600">youragent.in/{agent.slug}</span>
          </p>
          
          {/* Copy & Share Buttons */}
          <CopyShareButtons agentSlug={agent.slug} agentName={agent.user.name || 'Agent'} />
          
          <div className="space-x-4 pt-4">
            <Link
              href="/onboarding/wizard"
              className="inline-flex items-center px-4 py-2 bg-zinc-100 text-zinc-700 rounded-lg hover:bg-zinc-200 transition-colors"
            >
              Edit Profile
            </Link>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}