import React from 'react';

type Testimonial = { id: string; text: string; author: string; role: string | null };

export default function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials || testimonials.length === 0) return null;
  return (
    <section id="testimonials" className="mx-auto max-w-6xl px-4 py-16 border-t border-zinc-200">
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-950">Testimonials</h2>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {testimonials.map((t) => (
          <blockquote key={t.id} className="border border-zinc-200 rounded-lg p-5 bg-white">
            <p className="text-zinc-800">“{t.text}”</p>
            <footer className="mt-3 text-sm text-zinc-600">— {t.author}{t.role ? `, ${t.role}` : ''}</footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}


