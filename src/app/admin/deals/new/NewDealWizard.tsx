'use client';

import { useRef, useState, useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import ImageUploader from '@/components/ImageUploader';
import type { DealActionState } from './NewDealClient';
import PropertyTypeSelector from '@/components/property/PropertyTypeSelector';
import { Badge } from '@/components/ui/badge';

const DEFAULT_AMENITIES = [
  'Swimming Pool',
  'Gym',
  'Parking',
  'Power Backup',
  'Security',
  'Club House',
  'Play Area',
  'Lift',
  'CCTV',
  'Water Supply',
];

function RupeeInput({ id, name, value, onChange, placeholder }: { id: string; name: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  const formatIN = (n: string) => {
    const digits = n.replace(/[^0-9]/g, '');
    if (!digits) return '';
    return new Intl.NumberFormat('en-IN').format(parseInt(digits));
  };
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">₹</span>
      <Input id={id} name={name} inputMode="numeric" value={value} onChange={(e) => onChange(formatIN(e.target.value))} placeholder={placeholder} className="pl-7" />
      {/* Hidden numeric field to ensure server receives a clean number */}
      <input type="hidden" name={`__numeric__${name}`} value={value.replace(/[^0-9]/g, '')} />
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="bg-brand hover:bg-brand-hover text-white">
      {pending ? 'Creating…' : 'Create Deal'}
    </Button>
  );
}

export default function NewDealWizard({ action }: { action: (prev: DealActionState, formData: FormData) => Promise<DealActionState> }) {
  const [state, formAction] = useActionState(action, undefined);
  const [step, setStep] = useState(1);
  const [listingType, setListingType] = useState<'Sale' | 'Rent'>('Sale');
  const [propertyType, setPropertyType] = useState<string>('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [priceDisplay, setPriceDisplay] = useState('');
  const [agentEarningDisplay, setAgentEarningDisplay] = useState('');
  const [photoOrder, setPhotoOrder] = useState<string[]>([]);
  const brochureInputRef = useRef<HTMLInputElement>(null);
  const [brochureUploading, setBrochureUploading] = useState(false);
  const [brochureUrl, setBrochureUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [minProfileViewsLast30d, setMinProfileViewsLast30d] = useState('');
  const [minPageViewsLast30d, setMinPageViewsLast30d] = useState('');
  const [allowedCities, setAllowedCities] = useState('');
  const [allowedAreas, setAllowedAreas] = useState('');
  const [allowedAgentSlugs, setAllowedAgentSlugs] = useState('');
  const [excludedCities, setExcludedCities] = useState('');
  const [excludedAreas, setExcludedAreas] = useState('');
  const [excludedAgentSlugs, setExcludedAgentSlugs] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);
  const saveTimerRef = useRef<number | null>(null);

  const DRAFT_KEY = 'admin:deal-wizard-draft';

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(DRAFT_KEY) : null;
      if (raw) {
        const d = JSON.parse(raw) as Record<string, unknown>;
        if (typeof d.step === 'number') setStep(d.step as number);
        if (typeof d.title === 'string') setTitle(d.title as string);
        if (typeof d.description === 'string') setDescription(d.description as string);
        if (typeof d.location === 'string') setLocation(d.location as string);
        if (typeof d.priceDisplay === 'string') setPriceDisplay(d.priceDisplay as string);
        if (typeof d.agentEarningDisplay === 'string') setAgentEarningDisplay(d.agentEarningDisplay as string);
        if (d.listingType === 'Sale' || d.listingType === 'Rent') setListingType(d.listingType as 'Sale' | 'Rent');
        if (typeof d.propertyType === 'string') setPropertyType(d.propertyType as string);
        if (Array.isArray(d.selectedAmenities)) setSelectedAmenities(d.selectedAmenities as string[]);
        if (Array.isArray(d.photoOrder)) setPhotoOrder(d.photoOrder as string[]);
        if (typeof d.brochureUrl === 'string') setBrochureUrl(d.brochureUrl as string);
        if (typeof d.minProfileViewsLast30d === 'string') setMinProfileViewsLast30d(d.minProfileViewsLast30d as string);
        if (typeof d.minPageViewsLast30d === 'string') setMinPageViewsLast30d(d.minPageViewsLast30d as string);
        if (typeof d.allowedCities === 'string') setAllowedCities(d.allowedCities as string);
        if (typeof d.allowedAreas === 'string') setAllowedAreas(d.allowedAreas as string);
        if (typeof d.allowedAgentSlugs === 'string') setAllowedAgentSlugs(d.allowedAgentSlugs as string);
        if (typeof d.excludedCities === 'string') setExcludedCities(d.excludedCities as string);
        if (typeof d.excludedAreas === 'string') setExcludedAreas(d.excludedAreas as string);
        if (typeof d.excludedAgentSlugs === 'string') setExcludedAgentSlugs(d.excludedAgentSlugs as string);
      }
    } catch {}
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    saveTimerRef.current = window.setTimeout(() => {
      const data = {
        step,
        title,
        description,
        location,
        priceDisplay,
        agentEarningDisplay,
        listingType,
        propertyType,
        selectedAmenities,
        photoOrder,
        brochureUrl,
        minProfileViewsLast30d,
        minPageViewsLast30d,
        allowedCities,
        allowedAreas,
        allowedAgentSlugs,
        excludedCities,
        excludedAreas,
        excludedAgentSlugs,
      };
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
      } catch {}
    }, 300);
  }, [isHydrated, step, title, description, location, priceDisplay, agentEarningDisplay, listingType, propertyType, selectedAmenities, photoOrder, brochureUrl, minProfileViewsLast30d, minPageViewsLast30d, allowedCities, allowedAreas, allowedAgentSlugs, excludedCities, excludedAreas, excludedAgentSlugs]);

  // function resetDraft() {
    try { localStorage.removeItem(DRAFT_KEY); } catch {}
    setStep(1);
    setTitle('');
    setDescription('');
    setLocation('');
    setPriceDisplay('');
    setAgentEarningDisplay('');
    setListingType('Sale');
    setPropertyType('');
    setSelectedAmenities([]);
    setPhotoOrder([]);
    setBrochureUrl('');
    setMinProfileViewsLast30d('');
    setMinPageViewsLast30d('');
    setAllowedCities('');
    setAllowedAreas('');
    setAllowedAgentSlugs('');
    setExcludedCities('');
    setExcludedAreas('');
    setExcludedAgentSlugs('');
  // }

  const toggleAmenity = (a: string) => {
    setSelectedAmenities((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  };

  const addPhotoUrl = (url: string) => {
    setPhotoOrder((prev) => (prev.includes(url) ? prev : [...prev, url]));
  };

  const removePhoto = (url: string) => {
    setPhotoOrder((prev) => prev.filter((u) => u !== url));
  };

  const movePhoto = (index: number, direction: -1 | 1) => {
    setPhotoOrder((prev) => {
      const next = [...prev];
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= next.length) return prev;
      const [item] = next.splice(index, 1);
      next.splice(newIndex, 0, item);
      return next;
    });
  };

  const onSelectPropertyType = (lt: 'Sale' | 'Rent', pt: string) => {
    setListingType(lt);
    setPropertyType(pt);
    setStep(3);
  };

  const handleBrochureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setBrochureUploading(true);
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'deal-brochures');
      const res = await fetch('/api/upload-file', { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok || !json?.success) throw new Error(json?.error || 'Upload failed');
      setBrochureUrl(json.url);
    } catch (e) {
      console.error(e);
      alert(e instanceof Error ? e.message : 'Failed to upload brochure');
    } finally {
      setBrochureUploading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={5} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <RupeeInput id="price" name="price" value={priceDisplay} onChange={setPriceDisplay} placeholder="30,00,000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agentEarningAmount">Agent Earning</Label>
                <RupeeInput id="agentEarningAmount" name="agentEarningAmount" value={agentEarningDisplay} onChange={setAgentEarningDisplay} placeholder="50,000" />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" onClick={() => setStep(2)} className="bg-brand hover:bg-brand-hover text-white">Next</Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Select Amenities</Label>
              <div className="flex flex-wrap gap-2">
                {DEFAULT_AMENITIES.map((a) => (
                  <Badge
                    key={a}
                    onClick={() => toggleAmenity(a)}
                    className={`cursor-pointer ${selectedAmenities.includes(a) ? 'bg-brand text-white border-brand hover:bg-brand-hover' : 'bg-zinc-100 text-zinc-700 border-zinc-300 hover:bg-zinc-200'}`}
                  >
                    {a}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Property Type</Label>
              <div className="rounded-lg border border-zinc-200 p-4 bg-white">
                <PropertyTypeSelector
                  onSelect={(lt, pt) => onSelectPropertyType(lt as 'Sale' | 'Rent', pt)}
                  onCancel={() => setStep(1)}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button type="button" onClick={() => setStep(3)} className="bg-brand hover:bg-brand-hover text-white" disabled={!propertyType}>Next</Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Upload Images (order matters)</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ImageUploader onImageChange={addPhotoUrl} uploadFolder="deal-photos" aspectRatio="wide" maxWidth={1600} maxHeight={1200} />
                <ImageUploader onImageChange={addPhotoUrl} uploadFolder="deal-photos" aspectRatio="wide" maxWidth={1600} maxHeight={1200} />
              </div>
              {photoOrder.length > 0 && (
                <div className="mt-2 space-y-2">
                  {photoOrder.map((url, idx) => (
                    <div key={url} className="flex items-center justify-between border rounded-lg p-2 bg-zinc-50">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="deal" className="w-16 h-10 object-cover rounded" />
                        <span className="text-sm text-zinc-700">#{idx + 1}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button type="button" variant="outline" onClick={() => movePhoto(idx, -1)} disabled={idx === 0}>Up</Button>
                        <Button type="button" variant="outline" onClick={() => movePhoto(idx, 1)} disabled={idx === photoOrder.length - 1}>Down</Button>
                        <Button type="button" variant="destructive" onClick={() => removePhoto(url)}>Remove</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="brochure">Upload Brochure (PDF)</Label>
              <input ref={brochureInputRef} id="brochure" type="file" accept="application/pdf" onChange={handleBrochureChange} />
              {brochureUploading && <p className="text-sm text-zinc-600">Uploading...</p>}
              {brochureUrl && <p className="text-sm text-green-700">Uploaded</p>}
            </div>
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button type="button" onClick={() => setStep(4)} className="bg-brand hover:bg-brand-hover text-white">Next</Button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
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
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => setStep(3)}>Back</Button>
              <SubmitButton />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form action={formAction} className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-6 border border-zinc-200 rounded-xl">
      {state?.error && (
        <div className="lg:col-span-12 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
          {state.error.split('\n').map((line, i) => (<div key={i}>{line}</div>))}
        </div>
      )}

      {/* Sync hidden fields to server */}
      <input type="hidden" name="listingType" value={listingType} />
      <input type="hidden" name="propertyType" value={propertyType} />
      <input type="hidden" name="amenities" value={selectedAmenities.join(', ')} />
      <input type="hidden" name="photos" value={photoOrder.join(',')} />
      <input type="hidden" name="brochureUrl" value={brochureUrl} />
      {/* Copy numeric values from formatted inputs */}
      <input type="hidden" name="price" value={priceDisplay.replace(/[^0-9]/g, '')} />
      <input type="hidden" name="agentEarningAmount" value={agentEarningDisplay.replace(/[^0-9]/g, '')} />

      <div className="lg:col-span-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-zinc-900">Create Deal</h2>
          <div className="text-sm text-zinc-600">Step {step} of 4</div>
        </div>
        {renderStep()}
      </div>
    </form>
  );
}
