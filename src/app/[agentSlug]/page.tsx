import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { cookies } from 'next/headers';
// import { PerformanceUtils } from '@/lib/performance';
import prisma from '@/lib/prisma';


// Import the new template renderer
import TemplateRenderer from '@/components/templates/TemplateRenderer';
import { EditModeProvider } from '@/components/EditModeProvider';
import EditToggleButton from '@/components/EditToggleButton';

// Template name mapping - only support two stable templates
function getTemplateName(template: string): string {
  if (template === 'fresh-minimal') return 'fresh-minimal';
  if (template === 'mono-modern') return 'mono-modern';
  if (template === 'mono-elite') return 'mono-elite';
  return 'legacy-pro';
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
          propertyData: true,
          agentId: true,
          createdAt: true,
          updatedAt: true,
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
// Next.js requires a primitive here; avoid TS-only expressions
export const revalidate = 300;

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

  // Only check session if user has an auth cookie to avoid extra work for anonymous users
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('next-auth.session-token')
    || cookieStore.get('__Secure-next-auth.session-token');
  const session = sessionToken ? await getServerSession(authOptions) : null;
  
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