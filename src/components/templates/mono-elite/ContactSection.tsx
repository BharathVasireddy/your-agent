import React from 'react';
import { BlurFade } from '@/components/ui/blur-fade';

export default function ContactSection({ agent }: { agent: { phone: string | null; user: { email: string | null } } }) {
  return (
    <section id="contact" className="mx-auto max-w-7xl px-4 py-20 border-t border-zinc-200">
      <div className="grid md:grid-cols-12 gap-10">
        <div className="md:col-span-4">
          <BlurFade inView>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-950">Contact</h2>
          </BlurFade>
        </div>
        <div className="md:col-span-8">
          <div className="grid sm:grid-cols-2 gap-4">
            <BlurFade inView>
              <a href={`tel:${agent.phone ?? ''}`} className="block border border-zinc-200 rounded-xl p-5 hover:bg-zinc-50">
                <div className="text-sm text-zinc-600">Phone</div>
                <div className="mt-1 font-medium text-zinc-950">{agent.phone || 'Not provided'}</div>
              </a>
            </BlurFade>
            <BlurFade delay={0.05} inView>
              <a href={`mailto:${agent.user.email ?? ''}`} className="block border border-zinc-200 rounded-xl p-5 hover:bg-zinc-50">
                <div className="text-sm text-zinc-600">Email</div>
                <div className="mt-1 font-medium text-zinc-950">{agent.user.email || 'Not provided'}</div>
              </a>
            </BlurFade>
          </div>
        </div>
      </div>
    </section>
  );
}


