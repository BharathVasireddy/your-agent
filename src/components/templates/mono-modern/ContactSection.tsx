import React from 'react';

export default function ContactSection({ agent }: { agent: { phone: string | null; user: { email: string | null } } }) {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-4 py-16 border-t border-zinc-200">
      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-950">Contact</h2>
        </div>
        <div className="md:col-span-8">
          <div className="grid sm:grid-cols-2 gap-4">
            <a href={`tel:${agent.phone ?? ''}`} className="block border border-zinc-200 rounded-lg p-4 hover:bg-zinc-50">
              <div className="text-sm text-zinc-600">Phone</div>
              <div className="mt-1 font-medium text-zinc-950">{agent.phone || 'Not provided'}</div>
            </a>
            <a href={`mailto:${agent.user.email ?? ''}`} className="block border border-zinc-200 rounded-lg p-4 hover:bg-zinc-50">
              <div className="text-sm text-zinc-600">Email</div>
              <div className="mt-1 font-medium text-zinc-950">{agent.user.email || 'Not provided'}</div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}


