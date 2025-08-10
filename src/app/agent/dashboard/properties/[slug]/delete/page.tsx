import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import DeletePropertyConfirmation from '@/components/DeletePropertyConfirmation';

interface DeletePropertyPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function DeletePropertyPage({ params }: DeletePropertyPageProps) {
  const { slug } = await params;
  // Get the current user's session
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/login');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session as any).user.id as string;

  // Find the property and verify ownership
  const property = await prisma.property.findFirst({
    where: {
      slug: slug,
      agent: {
        userId: userId
      }
    },
    include: {
      agent: {
        select: {
          id: true,
          user: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    }
  });

  // If property not found, doesn't belong to user, or has no slug, show 404
  if (!property || !property.slug) {
    notFound();
  }

  // Transform the property data to match our interface
  const propertyData = {
    id: property.id,
    slug: property.slug,
    agentId: property.agentId,
    title: property.title,
    description: property.description,
    price: property.price,
    area: property.area,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    location: property.location,
    amenities: property.amenities,
    photos: property.photos,
    status: property.status,
    listingType: property.listingType,
    propertyType: property.propertyType,
    createdAt: property.createdAt,
    updatedAt: property.updatedAt
  };

  return <DeletePropertyConfirmation property={propertyData} />;
}