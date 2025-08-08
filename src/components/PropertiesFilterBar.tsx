'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const listingTypes = ['Sale', 'Rent'];
const propertyTypes = [
  'Flat/Apartment',
  'Villa/Independent House',
  'Plot',
  'Agricultural Land',
  'IT Commercial Space',
  'Farm House',
];
const statuses = ['Available', 'Sold', 'Rented'];

export default function PropertiesFilterBar() {
  const router = useRouter();
  const params = useSearchParams();

  const setParam = (key: string, value?: string) => {
    const url = new URL(window.location.href);
    if (value) url.searchParams.set(key, value); else url.searchParams.delete(key);
    url.searchParams.delete('page'); // reset pagination
    router.replace(url.toString());
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <select
        className="border border-zinc-200 rounded-md px-2 py-1 text-sm"
        value={params.get('listingType') || ''}
        onChange={(e) => setParam('listingType', e.target.value || undefined)}
      >
        <option value="">All Listings</option>
        {listingTypes.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <select
        className="border border-zinc-200 rounded-md px-2 py-1 text-sm"
        value={params.get('propertyType') || ''}
        onChange={(e) => setParam('propertyType', e.target.value || undefined)}
      >
        <option value="">All Property Types</option>
        {propertyTypes.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <select
        className="border border-zinc-200 rounded-md px-2 py-1 text-sm"
        value={params.get('status') || ''}
        onChange={(e) => setParam('status', e.target.value || undefined)}
      >
        <option value="">All Status</option>
        {statuses.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
    </div>
  );
}


