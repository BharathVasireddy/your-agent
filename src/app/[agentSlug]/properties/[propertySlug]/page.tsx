import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import LegacyPropertyDetail from '@/components/templates/legacy-pro/property/PropertyDetail';

export const revalidate = 300;

interface PageParams {
  params: Promise<{
    agentSlug: string;
    propertySlug: string;
  }>;
}

async function getData(agentSlug: string, propertySlug: string) {
  const agent = await prisma.agent.findUnique({
    where: { slug: agentSlug },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
      testimonials: { take: 6, orderBy: { id: 'desc' } },
    },
  });

  if (!agent) return null;

  const property = await prisma.property.findFirst({
    where: { slug: propertySlug, agentId: agent.id },
  });

  if (!property) return null;

  const similar = await prisma.property.findMany({
    where: {
      agentId: agent.id,
      id: { not: property.id },
      listingType: property.listingType,
      propertyType: property.propertyType,
      slug: { not: null },
    },
    orderBy: { createdAt: 'desc' },
    take: 6,
    select: {
      id: true,
      slug: true,
      title: true,
      price: true,
      area: true,
      bedrooms: true,
      bathrooms: true,
      location: true,
      photos: true,
      status: true,
      listingType: true,
      propertyType: true,
      createdAt: true,
    },
  });

  return { agent, property, similar };
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { agentSlug, propertySlug } = await params;
  const data = await getData(agentSlug, propertySlug);
  if (!data) return {};
  const { agent, property } = data;
  const title = `${property.title} • ${agent.user.name ?? 'Property'} • YourAgent`;
  const description = property.description?.slice(0, 160) ?? `${property.propertyType} in ${property.location}`;
  const images = property.photos?.length ? [{ url: property.photos[0], alt: property.title }] : [];
  return {
    title,
    description,
    openGraph: { title, description, images },
    twitter: { card: 'summary_large_image', title, description, images },
  };
}

export default async function PropertyDetailPage({ params }: PageParams) {
  const { agentSlug, propertySlug } = await params;

  // Only check session if there is an auth cookie (avoid extra work for anonymous users)
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('next-auth.session-token') || cookieStore.get('__Secure-next-auth.session-token');
  const session = sessionToken ? await getServerSession(authOptions) : null;

  const data = await getData(agentSlug, propertySlug);
  if (!data) notFound();

  const { agent, property, similar } = data;

  // Basic owner check; not used for gating yet but available if needed
  const isOwner = Boolean(session && 'user' in session && (session.user as { id?: string } | null)?.id === agent.user.id);

  return (
    <LegacyPropertyDetail agent={agent as never} property={property as never} similar={similar as never} isOwner={isOwner} />
  );
}


