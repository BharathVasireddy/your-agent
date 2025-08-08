import React from 'react';
import { BlurFade } from '@/components/ui/blur-fade';

export default function AboutSection({ agent }: { agent: { bio: string | null; experience: number | null } }) {
  return (
    <section id="about" className="mx-auto max-w-7xl px-4 py-20 border-t border-zinc-200">
      <div className="grid md:grid-cols-12 gap-10">
        <div className="md:col-span-4">
          <BlurFade inView>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-950">About</h2>
          </BlurFade>
        </div>
        <div className="md:col-span-8 text-zinc-700 leading-relaxed">
          <BlurFade delay={0.1} inView>
            <p>{agent.bio || 'Experienced, client-first real estate service with strong local expertise.'}</p>
            {agent.experience !== null && (
              <p className="mt-3 text-zinc-600">Experience: {agent.experience} years</p>
            )}
          </BlurFade>
        </div>
      </div>
    </section>
  );
}


