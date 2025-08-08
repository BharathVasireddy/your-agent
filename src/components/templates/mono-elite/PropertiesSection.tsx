import React from 'react';
import { BlurFade } from '@/components/ui/blur-fade';

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
    <section id="properties" className="relative mx-auto max-w-7xl px-4 py-20">
      <BlurFade inView>
        <div className="flex items-end justify-between">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-950">Featured Properties</h2>
        </div>
      </BlurFade>

      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((p, idx) => (
          <BlurFade key={p.id} delay={idx * 0.05} inView>
            <article className="group border border-zinc-200 rounded-xl overflow-hidden bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.photos[0] || '/images/hero-background.jpg'} alt={p.title} className="h-52 w-full object-cover" />
              <div className="p-5">
                <h3 className="font-semibold text-zinc-950 line-clamp-1">{p.title}</h3>
                <p className="mt-1 text-sm text-zinc-600 line-clamp-2">{p.description}</p>
                <div className="mt-4 text-sm text-zinc-800">
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
          </BlurFade>
        ))}
      </div>
    </section>
  );
}


