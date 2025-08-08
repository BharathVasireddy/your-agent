import React from 'react';

export default function AboutSection({ agent }: { agent: { bio: string | null; experience: number | null } }) {
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-16 border-t border-zinc-200">
      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-950">About</h2>
        </div>
        <div className="md:col-span-8 text-zinc-700 leading-relaxed">
          <p>{agent.bio || 'Experienced, client-first real estate service with strong local expertise.'}</p>
          {agent.experience !== null && (
            <p className="mt-3 text-zinc-600">Experience: {agent.experience} years</p>
          )}
        </div>
      </div>
    </section>
  );
}


