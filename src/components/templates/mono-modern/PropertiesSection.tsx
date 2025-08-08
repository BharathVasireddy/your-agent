import React from 'react';

type Property = {
  id: string;
  title: string;
  description: string;
  price: number;
  area: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  location: string;
  photos: string[];
  slug: string | null;
};

export default function PropertiesSection({ properties }: { properties: Property[] }) {
  return (
    <section id="properties" className="mx-auto max-w-6xl px-4 py-16">
      <div className="flex items-end justify-between">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-950">Featured Properties</h2>
      </div>

      <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((p) => (
          <article key={p.id} className="group border border-zinc-200 rounded-lg overflow-hidden bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.photos[0] || '/images/hero-background.jpg'} alt={p.title} className="h-44 w-full object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-zinc-950 line-clamp-1">{p.title}</h3>
              <p className="mt-1 text-sm text-zinc-600 line-clamp-2">{p.description}</p>
              <div className="mt-3 text-sm text-zinc-800">
                <div className="flex items-center justify-between">
                  <span>{p.location}</span>
                  {p.area ? <span>{p.area} sq.ft</span> : <span />}
                </div>
                <div className="mt-1 flex items-center gap-3 text-zinc-700">
                  {p.bedrooms !== null && <span>{p.bedrooms} Bed</span>}
                  {p.bathrooms !== null && <span>{p.bathrooms} Bath</span>}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}


