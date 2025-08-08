import React from 'react';
import { BlurFade } from '@/components/ui/blur-fade';

type FAQ = { id: string; question: string; answer: string };

export default function FaqSection({ faqs }: { faqs: FAQ[] }) {
  if (!faqs || faqs.length === 0) return null;
  return (
    <section id="faqs" className="mx-auto max-w-7xl px-4 py-20 border-t border-zinc-200">
      <BlurFade inView>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-950">FAQs</h2>
      </BlurFade>
      <div className="mt-8 divide-y divide-zinc-200 border border-zinc-200 rounded-xl bg-white">
        {faqs.map((f, idx) => (
          <BlurFade key={f.id} delay={idx * 0.03} inView>
            <div className="p-6">
              <h3 className="font-medium text-zinc-950">{f.question}</h3>
              <p className="mt-1 text-zinc-700">{f.answer}</p>
            </div>
          </BlurFade>
        ))}
      </div>
    </section>
  );
}


