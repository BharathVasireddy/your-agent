import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import AgentHeader from '@/components/profile/AgentHeader';
import ContactBar from '@/components/profile/ContactBar';
import AboutSection from '@/components/profile/AboutSection';

interface AgentProfilePageProps {
  params: Promise<{
    agentSlug: string;
  }>;
}

export async function generateMetadata({ params }: AgentProfilePageProps): Promise<Metadata> {
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
          image: true,
        },
      },
    },
  });

  if (!agent) {
    return {
      title: 'Agent Not Found',
    };
  }

  // Generate description from first 160 characters of bio
  const description = agent.bio 
    ? agent.bio.length > 160 
      ? agent.bio.substring(0, 160) + '...'
      : agent.bio
    : `Real estate agent specializing in ${agent.specialization} in ${agent.city}`;

  return {
    title: `${agent.user.name} - Real Estate Agent in ${agent.city}`,
    description,
  };
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
          image: true,
        },
      },
    },
  });

  if (!agent) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Agent Header */}
          <AgentHeader agent={agent} />

          {/* About Section */}
          <AboutSection bio={agent.bio} />

          {/* Contact Bar */}
          <ContactBar agent={agent} />
        </div>
      </div>
    </div>
  );
}