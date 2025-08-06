import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import prisma from '@/lib/prisma';
import EditPropertyForm from '@/components/EditPropertyForm';

interface EditPropertyPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const { slug } = await params;
  // Get the current user's session
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/api/auth/signin');
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link
            href="/agent/dashboard/properties"
            className="inline-flex items-center text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Properties
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-zinc-950">Edit Property</h1>
        <p className="text-zinc-600 mt-1">Update your property listing details</p>
      </div>

      {/* Edit Property Form */}
      <EditPropertyForm property={propertyData} />
    </div>
  );
}