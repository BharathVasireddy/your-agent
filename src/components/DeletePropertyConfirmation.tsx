"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { deletePropertyAction } from '@/app/actions';
import type { Property } from '@/types/dashboard';
import Link from 'next/link';

interface DeletePropertyConfirmationProps {
  property: Property;
}

export default function DeletePropertyConfirmation({ property }: DeletePropertyConfirmationProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);

    if (!property.slug) {
      setDeleteError('Property slug is missing');
      setIsDeleting(false);
      return;
    }

    try {
      const result = await deletePropertyAction(property.slug);
      
      if (result.success) {
        // Redirect to properties page with success message
        router.push('/agent/dashboard/properties?deleted=true');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      setDeleteError(error instanceof Error ? error.message : 'Failed to delete property');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="container mx-auto p-6">
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
          <h1 className="text-3xl font-bold text-zinc-950">Delete Property</h1>
          <p className="text-zinc-600 mt-1">This action cannot be undone</p>
        </div>

        {/* Delete Confirmation */}
        <div className="max-w-2xl mx-auto">
          {deleteError && (
            <div className="bg-brand-light border border-brand-soft rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-brand-deep font-medium">Error</p>
              </div>
              <p className="text-brand mt-1">{deleteError}</p>
            </div>
          )}

          <div className="bg-white rounded-lg border border-zinc-200 p-8">
            {/* Warning Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-brand" />
              </div>
            </div>

            {/* Warning Message */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-zinc-950 mb-4">
                Are you sure you want to delete this property?
              </h2>
              <p className="text-zinc-600 mb-6">
                This action cannot be undone. The property listing will be permanently removed from your dashboard and all associated photos will be deleted.
              </p>
            </div>

            {/* Property Preview */}
            <div className="bg-zinc-50 rounded-lg p-6 mb-8">
              <div className="flex items-start gap-4">
                {property.photos.length > 0 && (
                  <div className="flex-shrink-0 relative">
                    <Image
                      src={property.photos[0]}
                      alt={property.title}
                      width={80}
                      height={64}
                      className="w-20 h-16 object-cover rounded-lg border border-zinc-200"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-zinc-950 mb-1 truncate">
                    {property.title}
                  </h3>
                  <p className="text-zinc-600 text-sm mb-2">
                    {property.location}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-zinc-500">
                    <span>₹{property.price.toLocaleString('en-IN')}</span>
                    <span>{property.area} sq ft</span>
                    <span className="px-2 py-1 bg-zinc-200 rounded-full text-xs">
                      {property.propertyType}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirmation Checkbox */}
            <div className="bg-brand-light border border-brand-soft rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-brand mt-0.5 flex-shrink-0" />
                <div className="text-sm text-brand-deep">
                  <p className="font-medium mb-1">This will permanently:</p>
                  <ul className="list-disc list-inside space-y-1 text-brand">
                    <li>Remove the property from your listings</li>
                    <li>Delete all property photos from storage</li>
                    <li>Remove it from any public searches</li>
                    <li>This action cannot be reversed</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 bg-brand hover:bg-brand-hover text-white"
              >
                {isDeleting ? 'Deleting...' : 'Delete Property'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}