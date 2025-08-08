"use client";
import React from 'react';
import { GridPattern } from '@/components/ui/grid-pattern';
import { BlurFade } from '@/components/ui/blur-fade';

export default function HeroSection({ agent }: { agent: { heroTitle: string | null; heroSubtitle: string | null; heroImage: string | null } }) {
  return (
    <section className="relative border-b border-zinc-200">
      <div className="absolute inset-0 -z-10">
        <GridPattern width={28} height={28} className="[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]" />
      </div>
      <div className="mx-auto max-w-7xl px-4 py-20 md:py-28">
        <div className="grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-6">
            <BlurFade inView>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-950 leading-tight">
                {agent.heroTitle || 'Modern Real Estate Portfolio'}
              </h1>
            </BlurFade>
            <BlurFade delay={0.1} inView>
              <p className="mt-3 text-zinc-800 text-base md:text-lg max-w-prose">
                {agent.heroSubtitle || 'A refined, fast, and distraction-free showcase of listings and expertise.'}
              </p>
            </BlurFade>
            <BlurFade delay={0.15} inView>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#properties" className="inline-flex items-center px-5 py-2.5 rounded-lg bg-zinc-900 text-white text-sm hover:bg-zinc-800">Explore Properties<span className="ml-2">↗</span></a>
                <a href="#contact" className="inline-flex items-center px-5 py-2.5 rounded-lg border border-zinc-300 text-zinc-800 text-sm hover:bg-zinc-50">Schedule a call<span className="ml-2">↗</span></a>
              </div>
            </BlurFade>
          </div>
          <div className="md:col-span-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <BlurFade delay={0.15} inView>
              <img
                src={agent.heroImage || '/images/hero-background.jpg'}
                alt="Hero"
                className="w-full h-72 md:h-96 object-cover rounded-xl border border-zinc-200"
              />
            </BlurFade>
          </div>
        </div>
      </div>
    </section>
  );
}


