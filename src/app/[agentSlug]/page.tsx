import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Import the new section components
import Header from '@/components/sections/Header';
import HeroSection from '@/components/sections/HeroSection';
import PropertiesSection from '@/components/sections/PropertiesSection';
import AboutSection from '@/components/sections/AboutSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import FaqSection from '@/components/sections/FaqSection';
import ContactSection from '@/components/sections/ContactSection';
import Footer from '@/components/sections/Footer';
import { EditModeProvider } from '@/components/EditModeProvider';
import EditToggleButton from '@/components/EditToggleButton';

// Theme configuration
function getThemeClass(theme: string): string {
  switch (theme) {
    case 'professional-blue':
      return 'theme-professional-blue';
    case 'elegant-dark':
      return 'theme-elegant-dark';
    case 'modern-red':
      return 'theme-modern-red';
    default:
      return 'theme-professional-blue';
  }
}

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
    : `Experienced real estate agent serving ${agent.city}${agent.area ? ` - ${agent.area}` : ''}`;

  return {
    title: `${agent.user.name} - Real Estate Agent in ${agent.city}`,
    description,
  };
}

export default async function AgentProfilePage({ params }: AgentProfilePageProps) {
  // Await the params in Next.js 15
  const { agentSlug } = await params;
  
  // Check if user is logged in and owns this profile
  const session = await getServerSession(authOptions);
  
  // Find the agent by slug
  const agent = await prisma.agent.findUnique({
    where: {
      slug: agentSlug,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      properties: true,
      testimonials: true,
      faqs: true,
    },
  });

  if (!agent) {
    notFound();
  }

  // Check if current user owns this profile
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isOwner = session && (session as any).user && (session as any).user.id === agent.user.id;

  // Get theme class for styling
  const themeClass = getThemeClass(agent.theme);

  return (
    <EditModeProvider isOwner={!!isOwner}>
      <main className={themeClass}>
        <Header agent={agent} />
        <HeroSection agent={agent} />
        <PropertiesSection properties={agent.properties} agent={agent} />
        <AboutSection agent={agent} />
        <TestimonialsSection testimonials={agent.testimonials} />
        <FaqSection faqs={agent.faqs} />
        <ContactSection agent={agent} />
        <Footer />
        <EditToggleButton />
      </main>
    </EditModeProvider>
  );
}