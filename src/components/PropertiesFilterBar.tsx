'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

const listingTypes = ['Sale', 'Rent'];
const propertyTypes = [
  'Flat/Apartment',
  'Villa/Independent House',
  'Plot',
  'Agricultural Land',
  'IT Commercial Space',
  'Farm House',
];
const areas = [
  'Madhapur', 'Gachibowli', 'Kokapet', 'Kondapur', 'Banjara Hills', 'Jubilee Hills',
  'HITEC City', 'Financial District', 'Begumpet', 'Secunderabad', 'Kukatpally', 'Miyapur',
  'Bachupally', 'Kompally', 'Nizampet', 'Chanda Nagar', 'Manikonda', 'Nanakramguda', 'Raidurg',
  'Uppal', 'LB Nagar', 'Dilsukhnagar', 'Ameerpet', 'Malakpet'
];

export default function PropertiesFilterBar() {
  const router = useRouter();
  const params = useSearchParams();
  const [search, setSearch] = useState('');
  useEffect(() => {
    setSearch(params.get('q') || '');
  }, [params]);

  const setParam = (key: string, value?: string) => {
    const url = new URL(window.location.href);
    if (value) url.searchParams.set(key, value); else url.searchParams.delete(key);
    url.searchParams.delete('page'); // reset pagination
    router.replace(url.toString());
  };

  return (
    <div className="flex flex-wrap gap-4 items-end">
      {/* Search */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-zinc-500">Search</label>
        <input
        type="text"
        placeholder="Search properties..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          const v = e.target.value.trim();
          setParam('q', v.length ? v : undefined);
        }}
        className="px-3 py-2 text-sm rounded-md border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-400 min-w-[220px]"
      />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-zinc-500">Listing Type</label>
        <div className="relative">
          <select
            className="appearance-none border border-zinc-300 rounded-md pl-3 pr-8 py-2 text-sm bg-white shadow-sm hover:border-zinc-400 min-w-[180px]"
            value={params.get('listingType') || ''}
            onChange={(e) => setParam('listingType', e.target.value || undefined)}
          >
            <option value="">All Listings</option>
            {listingTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500">⌄</span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-zinc-500">Property Type</label>
        <div className="relative">
          <select
            className="appearance-none border border-zinc-300 rounded-md pl-3 pr-8 py-2 text-sm bg-white shadow-sm hover:border-zinc-400 min-w-[220px]"
            value={params.get('propertyType') || ''}
            onChange={(e) => setParam('propertyType', e.target.value || undefined)}
          >
            <option value="">All Property Types</option>
            {propertyTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500">⌄</span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-zinc-500">Area/Location</label>
        <div className="relative">
          <select
            className="appearance-none border border-zinc-300 rounded-md pl-3 pr-8 py-2 text-sm bg-white shadow-sm hover:border-zinc-400 min-w-[200px]"
            value={params.get('area') || ''}
            onChange={(e) => setParam('area', e.target.value || undefined)}
          >
            <option value="">All Areas</option>
            {areas.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500">⌄</span>
        </div>
      </div>
    </div>
  );
}


