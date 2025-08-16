'use client';

interface Builder { id: string; name: string; logoUrl: string; websiteUrl: string | null }

export default function BuildersSection({ builders }: { builders?: Builder[] }) {
  if (!builders || builders.length === 0) return null;
  return (
    <section id="builders" className="py-template-section bg-template-background">
      <div className="max-w-7xl mx-auto px-template-container">
        <h2 className="text-3xl md:text-4xl font-template-primary font-bold text-template-text-primary mb-6">Worked With</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center">
          {builders.map(b => (
            <div key={b.id} className="bg-white border border-zinc-200 rounded-template-card p-4 flex items-center justify-center">
              <a href={b.websiteUrl || '#'} target={b.websiteUrl ? '_blank' : undefined} rel={b.websiteUrl ? 'noreferrer' : undefined} className="block w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.logoUrl} alt={b.name} className="mx-auto max-h-12 object-contain" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


