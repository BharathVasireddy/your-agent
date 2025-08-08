import React from 'react';
import { BlurFade } from '@/components/ui/blur-fade';

type Testimonial = { id: string; text: string; author: string; role: string | null };

export default function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials || testimonials.length === 0) return null;
  return (
    <section id="testimonials" className="mx-auto max-w-7xl px-4 py-20 border-t border-zinc-200">
      <BlurFade inView>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-950">Testimonials</h2>
      </BlurFade>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {testimonials.map((t, idx) => (
          <BlurFade key={t.id} delay={idx * 0.05} inView>
            <blockquote className="border border-zinc-200 rounded-xl p-6 bg-white">
              <p className="text-zinc-800">“{t.text}”</p>
              <footer className="mt-3 text-sm text-zinc-600">— {t.author}{t.role ? `, ${t.role}` : ''}</footer>
            </blockquote>
          </BlurFade>
        ))}
      </div>
    </section>
  );
}


