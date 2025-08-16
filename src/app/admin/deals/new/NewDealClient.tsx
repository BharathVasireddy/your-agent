'use client';

import { useMemo, useState, useActionState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ImageUploader from '@/components/ImageUploader';
import { useFormStatus } from 'react-dom';

export type DealActionState = { error?: string } | undefined;

export default function NewDealClient({ action }: { action: (prev: DealActionState, formData: FormData) => Promise<DealActionState> }) {
  const [state, formAction] = useActionState(action, undefined);
  const { pending } = useFormStatus();
  const [listingType, setListingType] = useState<'Sale' | 'Rent'>('Sale');

  const helpText = useMemo(() => ({
    photos: 'Paste full URLs. First image will be used as cover.',
    amenities: 'Comma-separated list like: Pool, Gym, Parking',
  }), []);

  return (
    <form action={formAction} className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-6 border border-zinc-200 rounded-xl">
      {state?.error && (
        <div className="lg:col-span-12 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
          {state.error.split('\n').map((line: string, i: number) => (<div key={i}>{line}</div>))}
        </div>
      )}

      {/* Main */}
      <div className="lg:col-span-8 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" rows={5} required />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price (₹)</Label>
            <Input id="price" name="price" type="number" min={0} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="agentEarningAmount">Agent Earning (₹)</Label>
            <Input id="agentEarningAmount" name="agentEarningAmount" type="number" min={0} required />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Listing Type</Label>
            {/* Mirror value into hidden input for form submission */}
            <input type="hidden" name="listingType" value={listingType} />
            <Select value={listingType} onValueChange={(v) => setListingType(v as 'Sale' | 'Rent')}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Sale">Sale</SelectItem>
                <SelectItem value="Rent">Rent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="propertyType">Property Type</Label>
            <Input id="propertyType" name="propertyType" defaultValue="Flat/Apartment" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amenities">Amenities (comma-separated)</Label>
          <Input id="amenities" name="amenities" placeholder={helpText.amenities} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="photos">Photos (comma-separated URLs)</Label>
          <Input id="photos" name="photos" placeholder="https://..." />
          <p className="text-xs text-zinc-500">{helpText.photos}</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="brochureUrl">Brochure URL</Label>
          <Input id="brochureUrl" name="brochureUrl" placeholder="https://..." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="propertyData">Property Data (JSON matching selected type)</Label>
          <Textarea id="propertyData" name="propertyData" rows={6} />
        </div>
      </div>

      {/* Side */}
      <div className="lg:col-span-4 space-y-4">
        <div className="space-y-2">
          <Label>Cover Image</Label>
          <ImageUploader
            onImageChange={(url) => {
              const el = document.getElementsByName('photos')[0] as HTMLInputElement | undefined;
              if (el) el.value = el.value ? `${el.value},${url}` : url;
            }}
            uploadFolder="deal-photos"
            aspectRatio="wide"
            maxWidth={1600}
            maxHeight={1200}
          />
          <p className="text-xs text-zinc-500">First image in Photos will be used as the cover.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="minProfileViewsLast30d">Min Profile Views (30d)</Label>
            <Input id="minProfileViewsLast30d" name="minProfileViewsLast30d" type="number" min={0} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minPageViewsLast30d">Min Page Views (30d)</Label>
            <Input id="minPageViewsLast30d" name="minPageViewsLast30d" type="number" min={0} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="allowedCities">Allowed Cities (comma-separated)</Label>
          <Input id="allowedCities" name="allowedCities" placeholder="Hyderabad, Mumbai" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="allowedAreas">Allowed Areas (comma-separated)</Label>
          <Input id="allowedAreas" name="allowedAreas" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="allowedAgentSlugs">Allowed Agent Slugs (comma-separated)</Label>
          <Input id="allowedAgentSlugs" name="allowedAgentSlugs" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="excludedCities">Excluded Cities (comma-separated)</Label>
          <Input id="excludedCities" name="excludedCities" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="excludedAreas">Excluded Areas (comma-separated)</Label>
          <Input id="excludedAreas" name="excludedAreas" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="excludedAgentSlugs">Excluded Agent Slugs (comma-separated)</Label>
          <Input id="excludedAgentSlugs" name="excludedAgentSlugs" />
        </div>
        <div className="flex justify-end pt-2">
          <Button type="submit" className="bg-brand hover:bg-brand-hover text-white" disabled={pending}>
            {pending ? 'Creating…' : 'Create Deal'}
          </Button>
        </div>
      </div>
    </form>
  );
}
