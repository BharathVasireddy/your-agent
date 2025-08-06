import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';


// Import the new template renderer
import TemplateRenderer from '@/components/templates/TemplateRenderer';
import { EditModeProvider } from '@/components/EditModeProvider';
import EditToggleButton from '@/components/EditToggleButton';

// Template name mapping
function getTemplateName(template: string): string {
  switch (template) {
    case 'classic-professional':
    case 'modern-minimal':
    case 'bold-red':
    case 'black-white':
      return 'legacy-pro';
    case 'fresh-minimal':
      return 'fresh-minimal';
    // Legacy theme support
    case 'professional-blue':
    case 'elegant-dark':
    case 'modern-red':
      return 'legacy-pro';
    default:
      return 'legacy-pro';
  }
}

interface AgentProfilePageProps {
  params: Promise<{
    agentSlug: string;
  }>;
}

async function getAgentData(agentSlug: string) {
  return await prisma.agent.findUnique({
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
      properties: {
        take: 8, // Only load first 8 properties for performance
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          area: true,
          bedrooms: true,
          bathrooms: true,
          location: true,
          amenities: true,
          photos: true,
          status: true,
          listingType: true,
          propertyType: true,
          slug: true,
          brochureUrl: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      testimonials: {
        take: 6, // Limit testimonials for performance
        orderBy: {
          id: 'desc',
        },
      },
      faqs: {
        take: 10, // Limit FAQs for performance
        orderBy: {
          id: 'desc',
        },
      },
    },
  });
}

export async function generateMetadata({ params }: AgentProfilePageProps): Promise<Metadata> {
  // Await the params in Next.js 15
  const { agentSlug } = await params;
  
  // Find the agent by slug
  const agent = await getAgentData(agentSlug);

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

// Dynamic revalidation based on performance config
// Dynamic revalidation based on performance config
export const revalidate = 300; // 5 minutes default, can be overridden by ISR

// Generate static paths for popular agents (optional)
export async function generateStaticParams() {
  // You can pre-generate paths for your most popular agents
  // This is optional but will make those pages even faster
  try {
    const popularAgents = await prisma.agent.findMany({
      select: { slug: true },
      take: 10, // Pre-generate top 10 agents
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return popularAgents.map((agent) => ({
      agentSlug: agent.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function AgentProfilePage({ params }: AgentProfilePageProps) {
  // Await the params in Next.js 15
  const { agentSlug } = await params;
  
  // Find the agent by slug
  const agent = await getAgentData(agentSlug);

  if (!agent) {
    notFound();
  }

  // Only check session if needed for edit functionality
  // This can be lazy-loaded on the client side for better performance
  const session = await getServerSession(authOptions);
  
  // Check if current user owns this profile
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isOwner = session && (session as any).user && (session as any).user.id === agent.user.id;

  // Get template name for rendering
  const templateName = getTemplateName(agent.template);

  return (
    <EditModeProvider isOwner={!!isOwner}>
      <TemplateRenderer templateName={templateName} agentData={agent} />
      <EditToggleButton />
    </EditModeProvider>
  );
}