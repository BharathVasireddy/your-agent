import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { cookies } from 'next/headers';
// import { PerformanceUtils } from '@/lib/performance';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';


// Import the new template renderer
import TemplateRenderer from '@/components/templates/TemplateRenderer';
import { headers } from 'next/headers';
import { getHostInfo } from '@/lib/utils';
import ClientLazyEditProvider from '@/components/ClientLazyEditProvider';

// Template name mapping - only support two stable templates
function getTemplateName(template: string): string {
  if (template === 'fresh-minimal') return 'fresh-minimal';
  if (template === 'mono-modern') return 'mono-modern';
  if (template === 'mono-elite') return 'mono-elite';
  return 'legacy-pro';
}

interface AgentProfilePageProps {
  params: Promise<{ agentSlug: string }>;
  searchParams?: Promise<Record<string, string | undefined>>;
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
        where: {
          isHiddenByAgent: false,
          status: { notIn: ['Inactive', 'Sold'] },
        },
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
      awards: {
        where: { isRemovedByAdmin: false },
        orderBy: { createdAt: 'desc' },
        take: 12,
      },
      galleryImages: {
        where: { isRemovedByAdmin: false },
        orderBy: { createdAt: 'desc' },
        take: 24,
      },
      builders: {
        where: { isRemovedByAdmin: false },
        orderBy: { createdAt: 'desc' },
        take: 24,
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

  const isActive = !!agent.subscriptionEndsAt && agent.subscriptionEndsAt > new Date();
  const tpl = (agent as unknown as { templateData?: unknown }).templateData as { seo?: { metaTitle?: string; metaDescription?: string } } | undefined;
  const seoTitle = tpl?.seo?.metaTitle?.trim();
  const seoDesc = tpl?.seo?.metaDescription?.trim();
  // Generate description from saved SEO meta or fallback to bio snippet
  const description = seoDesc && seoDesc.length > 0
    ? seoDesc.slice(0, 160)
    : agent.bio 
      ? agent.bio.length > 160 
        ? agent.bio.substring(0, 160) + '...'
        : agent.bio
      : `Experienced real estate agent serving ${agent.city}${agent.area ? ` - ${agent.area}` : ''}`;

  return {
    title: seoTitle && seoTitle.length > 0 ? seoTitle : `${agent.user.name} - Real Estate Agent in ${agent.city}`,
    description,
    robots: isActive ? undefined : { index: false, follow: false },
  };
}

// Dynamic revalidation based on performance config
// Dynamic revalidation based on performance config
// Next.js requires a primitive here; avoid TS-only expressions
// Disable static pre-rendering to avoid build-time DB coupling

export default async function AgentProfilePage({ params, searchParams }: AgentProfilePageProps) {
  // Await the params in Next.js 15
  const { agentSlug } = await params;
  const resolvedSearchParams = await (searchParams ?? Promise.resolve<Record<string, string | undefined>>({}));
  const sp: Record<string, string | undefined> = resolvedSearchParams || {} as Record<string, string | undefined>;
  
  // Find the agent by slug
  const agent = await getAgentData(agentSlug);
  // If we are on primary domain path-based route, canonicalize to subdomain if available
  try {
    const hdrs = await headers();
    const { hostname, primaryDomain } = getHostInfo(hdrs.get('host'));
    const onPrimary = hostname === primaryDomain || hostname.endsWith(`.${primaryDomain}`);
    if (onPrimary && agent?.slug) {
      const reserved = new Set(['', 'www', 'app', 'admin']);
      if (!reserved.has(agent.slug)) {
        redirect(`https://${agent.slug}.${primaryDomain}`);
      }
    }
  } catch {
    // headers() may fail in some edge cases; ignore canonicalization
  }


  if (!agent) {
    notFound();
  }

  // Determine active subscription state
  const isActive = !!agent.subscriptionEndsAt && agent.subscriptionEndsAt > new Date();
  const isPublished = (agent as unknown as { isPublished?: boolean }).isPublished ?? false;

  // Only check session if user has an auth cookie to avoid extra work for anonymous users
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('next-auth.session-token')
    || cookieStore.get('__Secure-next-auth.session-token');
  const session = sessionToken ? await getServerSession(authOptions) : null;
  
  // Check if current user owns this profile
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isOwner = !!(session && (session as any).user && (session as any).user.id === agent.user.id);
  const viewingPublic = isOwner && sp.view === 'public';
  const isOwnerForRender = isOwner && !viewingPublic;

  // Get template name for rendering
  const templateName = getTemplateName(agent.template);

  // Compute aggregate rating from testimonials (server-side)
  const testimonialRatings = (agent.testimonials || [])
    .map((t: { rating: number | null }) => (typeof t.rating === 'number' ? t.rating : null))
    .filter((r: number | null): r is number => typeof r === 'number');
  const ratingCount = testimonialRatings.length;
  const reviewCount = (agent.testimonials || []).length;
  const ratingValue = ratingCount
    ? Math.round((testimonialRatings.reduce((sum: number, r: number) => sum + r, 0) / ratingCount) * 10) / 10
    : null;

  return (
    <ClientLazyEditProvider isOwner={!!isOwner}>
      {/* SEO: FAQPage schema */}
      {agent.faqs && agent.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: agent.faqs.map((f: { question: string; answer: string }) => ({
                '@type': 'Question',
                name: f.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: f.answer,
                },
              })),
            }),
          }}
        />
      )}

      {/* SEO: Reviews schema (Testimonials) */}
      {agent.testimonials && agent.testimonials.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              itemListElement: agent.testimonials.map((t: { text: string; author: string | null; rating: number | null }, index: number) => ({
                '@type': 'Review',
                position: index + 1,
                reviewBody: t.text,
                author: t.author ? { '@type': 'Person', name: t.author } : undefined,
                reviewRating: typeof t.rating === 'number' ? { '@type': 'Rating', ratingValue: t.rating, bestRating: 5, worstRating: 1 } : undefined,
                itemReviewed: {
                  '@type': 'RealEstateAgent',
                  name: agent.user?.name || 'Real Estate Agent',
                },
              })),
            }),
          }}
        />
      )}

      {/* SEO: Aggregate rating for the agent based on testimonials */}
      {ratingValue && ratingCount > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'RealEstateAgent',
              name: agent.user?.name || 'Real Estate Agent',
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue,
                ratingCount,
                reviewCount,
                bestRating: 5,
                worstRating: 1,
              },
            }),
          }}
        />
      )}

      {/* Owner unpublished banner and view toggle */}
      {isOwner && (!isActive || !isPublished) && !viewingPublic && (
        <div className="bg-zinc-50 border border-zinc-200 text-zinc-800 px-4 py-3 text-sm flex items-center gap-3">
          <span>Your profile is not published yet.</span>
          {!isActive ? (
            <Link href="/agent/dashboard/subscription" className="underline hover:text-zinc-900">Publish profile</Link>
          ) : (
            <Link href="/agent/dashboard/customise-website" className="underline hover:text-zinc-900">Publish from customise website</Link>
          )}
          <span className="opacity-50">•</span>
          <Link href={`/${agent.slug}?view=public`} className="underline hover:text-zinc-900">View as public</Link>
        </div>
      )}
      {isOwner && viewingPublic && (
        <div className="bg-zinc-50 border border-zinc-200 text-zinc-700 px-4 py-3 text-sm flex items-center justify-between">
          <span>You are viewing your profile as the public would see it.</span>
          <Link href={`/${agent.slug}`} className="underline hover:text-zinc-900">Exit public view</Link>
        </div>
      )}

      {(!isActive || !isPublished) && !isOwnerForRender ? (
        <main className="min-h-[50vh] bg-white">
          <div className="max-w-3xl mx-auto px-6 py-16 text-center">
            <h1 className="text-3xl font-bold text-zinc-950 mb-3">Profile not available</h1>
            <p className="text-zinc-600">This agent profile is currently not published.</p>
          </div>
        </main>
      ) : (
        <TemplateRenderer templateName={templateName} agentData={agent} />
      )}
    </ClientLazyEditProvider>
  );
}