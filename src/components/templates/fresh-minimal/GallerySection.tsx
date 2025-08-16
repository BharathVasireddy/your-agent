'use client';

interface ImageItem { id: string; imageUrl: string; caption: string | null }

export default function GallerySection({ images }: { images?: ImageItem[] }) {
  if (!images || images.length === 0) return null;
  return (
    <section id="gallery" className="py-template-section bg-template-background-secondary">
      <div className="max-w-7xl mx-auto px-template-container">
        <h2 className="text-3xl md:text-4xl font-template-primary font-bold text-template-text-primary mb-6">Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map(img => (
            <figure key={img.id} className="rounded-template-card overflow-hidden border border-zinc-200 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.imageUrl} alt={img.caption || 'Gallery image'} className="w-full h-48 object-cover" />
              {img.caption && <figcaption className="p-2 text-sm text-template-text-secondary">{img.caption}</figcaption>}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}


