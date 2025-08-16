'use client';

import Image from 'next/image';

interface Award {
  id: string;
  title: string;
  issuedBy: string | null;
  year: number | null;
  description: string | null;
  imageUrl: string | null;
}

export default function AwardsSection({ awards }: { awards?: Award[] }) {
  if (!awards || awards.length === 0) return null;
  return (
    <section id="awards" className="py-template-section bg-template-background">
      <div className="max-w-7xl mx-auto px-template-container">
        <h2 className="text-3xl md:text-4xl font-template-primary font-bold text-template-text-primary mb-6">Awards & Recognitions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-template-element">
          {awards.map(a => (
            <div key={a.id} className="bg-white rounded-template-card border border-zinc-200 p-4 shadow-template-sm">
              <div className="flex gap-3 items-start">
                {a.imageUrl ? (
                  <div className="relative w-16 h-16 rounded overflow-hidden border">
                    <Image src={a.imageUrl} alt={a.title} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded bg-zinc-100 border" />
                )}
                <div className="flex-1">
                  <div className="font-template-primary font-semibold text-template-text-primary">{a.title}</div>
                  <div className="text-sm text-template-text-muted">{a.issuedBy || ''}{a.year ? ` • ${a.year}` : ''}</div>
                  {a.description && <div className="text-sm text-template-text-secondary mt-2">{a.description}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


