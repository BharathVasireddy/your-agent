import React from 'react';

type FAQ = { id: string; question: string; answer: string };

export default function FaqSection({ faqs }: { faqs: FAQ[] }) {
  if (!faqs || faqs.length === 0) return null;
  return (
    <section id="faqs" className="mx-auto max-w-6xl px-4 py-16 border-t border-zinc-200">
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-950">FAQs</h2>
      <div className="mt-8 divide-y divide-zinc-200 border border-zinc-200 rounded-lg bg-white">
        {faqs.map((f) => (
          <div key={f.id} className="p-5">
            <h3 className="font-medium text-zinc-950">{f.question}</h3>
            <p className="mt-1 text-zinc-700">{f.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}


