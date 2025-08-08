import React from 'react';
import Link from 'next/link';

export default function HeroSection({ agent }: { agent: { heroTitle: string | null; heroSubtitle: string | null; heroImage: string | null } }) {
  return (
    <section className="relative border-b border-zinc-200">
      <div className="mx-auto max-w-6xl px-4 py-16 grid md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-6">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-950 leading-tight">
            {agent.heroTitle || 'Properties, Perfectly Presented'}
          </h1>
          <p className="mt-4 text-zinc-700 text-base md:text-lg">
            {agent.heroSubtitle || 'A clean, modern showcase of listings and expertise. No distractions.'}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#properties" className="inline-flex items-center px-5 py-2.5 rounded-lg bg-zinc-900 text-white text-sm hover:bg-zinc-800">Explore Properties<span className="ml-2">↗</span></a>
            <Link href="#contact" className="inline-flex items-center px-5 py-2.5 rounded-lg border border-zinc-300 text-zinc-800 text-sm hover:bg-zinc-50">Schedule a call<span className="ml-2">↗</span></Link>
          </div>
        </div>
        <div className="md:col-span-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={agent.heroImage || '/images/hero-background.jpg'}
            alt="Hero"
            className="w-full h-64 md:h-80 object-cover rounded-lg border border-zinc-200"
          />
        </div>
      </div>
    </section>
  );
}


