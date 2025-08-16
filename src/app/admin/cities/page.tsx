import { requireAdmin } from '@/lib/admin';
import { headers } from 'next/headers';
import LocationManager from './LocationManager';

export const dynamic = 'force-dynamic';

async function fetchLocationData() {
  const h = await headers();
  const host = h.get('host')!;
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  
  const [statesRes, districtsRes, citiesRes] = await Promise.all([
    fetch(`${protocol}://${host}/api/admin/states`, {
      headers: { cookie: h.get('cookie') ?? '' },
      cache: 'no-store',
    }),
    fetch(`${protocol}://${host}/api/admin/districts`, {
      headers: { cookie: h.get('cookie') ?? '' },
      cache: 'no-store',
    }),
    fetch(`${protocol}://${host}/api/admin/cities`, {
      headers: { cookie: h.get('cookie') ?? '' },
      cache: 'no-store',
    }),
  ]);

  if (!statesRes.ok || !districtsRes.ok || !citiesRes.ok) {
    throw new Error('Failed to fetch location data');
  }

  const [states, districts, cities] = await Promise.all([
    statesRes.json(),
    districtsRes.json(),
    citiesRes.json(),
  ]);

  return { states: states.states, districts: districts.districts, cities: cities.cities };
}

export default async function LocationPage() {
  await requireAdmin();
  const locationData = await fetchLocationData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Location Management</h1>
          <p className="text-muted-foreground">Manage states, districts, and cities for agent segmentation</p>
        </div>
      </div>
      <LocationManager initialData={locationData} />
    </div>
  );
}
