import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, IndianRupee, Download } from 'lucide-react';
import { PerformanceSafeguards } from '@/lib/performance';
import { formatArea, formatPrice, getPropertyFeatures } from '@/lib/property-display-utils';
import ContactSection from '../ContactSection';
import Header from '../Header';
import Footer from '../Footer';
import PropertiesSection from '../PropertiesSection';
import TestimonialsSection from '../TestimonialsSection';
import FaqSection from '../FaqSection';

interface Agent {
  id: string;
  slug: string;
  phone: string | null;
  city: string | null;
  area: string | null;
  user: { id: string; name: string | null; email: string | null; image: string | null };
}

interface Property {
  id: string;
  slug: string | null;
  title: string;
  description: string;
  price: number;
  area: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  location: string;
  amenities: string[];
  photos: string[];
  status: string;
  listingType: string;
  propertyType: string;
  brochureUrl: string | null;
}
interface Testimonial { id: string; text: string; author: string; role?: string | null; rating: number | null }
interface FAQ { id: string; question: string; answer: string }

export default function LegacyPropertyDetail({ agent, property, similar }: { agent: Agent; property: Property; similar: Property[]; isOwner?: boolean; }) {
  // getPropertyFeatures expects dashboard Property shape which closely matches here
  // Cast narrowly to suppress any without compromising types elsewhere
  const features = getPropertyFeatures(property as unknown as unknown as import('@/types/dashboard').Property);
  const mainPhoto = property.photos?.[0] || '/images/hero-background.jpg';
  const secondary = property.photos?.slice(1, 4) || [];

  return (
    <main className="w-full">
      {/* Header */}
      <Header agent={agent as unknown as { id: string; slug: string; phone: string | null; logoUrl: string | null; logoFont?: string | null; logoMaxHeight?: number | null; logoMaxWidth?: number | null; user: { id: string; name: string | null; email: string | null } }} />
      {/* Hero Gallery */}
      <section className="w-full px-4 md:px-8 lg:px-12 xl:px-16 pt-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-zinc-200">
              <Image
                src={mainPhoto}
                alt={property.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 66vw"
                {...PerformanceSafeguards.getImageProps('property')}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 lg:grid-cols-1 gap-4">
            {secondary.map((src, idx) => (
              <div key={idx} className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-zinc-200">
                <Image
                  src={src}
                  alt={`${property.title} ${idx + 2}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 33vw, 33vw"
                  {...PerformanceSafeguards.getImageProps('property')}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Title + Actions */}
      <section className="w-full px-4 md:px-8 lg:px-12 xl:px-16 mt-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-2">
              <Badge className="bg-zinc-900 text-white">For {property.listingType}</Badge>
              <Badge variant="outline">{property.propertyType}</Badge>
              <Badge variant="outline">{property.status}</Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-zinc-950">{property.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-zinc-700">
              <MapPin className="w-4 h-4" />
              <span>{property.location}</span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div className="text-2xl font-bold text-zinc-950 flex items-center gap-1">
                <IndianRupee className="w-5 h-5" />
                <span>{formatPrice(property.price)}</span>
              </div>
              {property.area && (
                <div className="text-zinc-700">{formatArea(property.area)}</div>
              )}
            </div>

            {/* Feature chips */}
            <div className="mt-4 flex flex-wrap gap-2">
              {features.map((f) => (
                <span key={f.label} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-200 text-sm text-zinc-700 bg-white">
                  <f.icon className="w-4 h-4 text-zinc-500" />
                  {f.label}: {f.value}
                </span>
              ))}
            </div>

            {/* Overview */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-zinc-950 mb-3">Overview</h2>
              <p className="text-zinc-700 leading-7 whitespace-pre-line">{property.description}</p>
            </div>

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-zinc-950 mb-3">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((a) => (
                    <span key={a} className="px-3 py-1.5 rounded-full bg-zinc-50 text-zinc-700 border border-zinc-200 text-sm">{a}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Location placeholder (static map can be wired later) */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-zinc-950 mb-3">Location</h3>
              <p className="text-zinc-600">{property.location}</p>
            </div>
          </div>

          {/* Inquiry card */}
          <aside className="lg:col-span-1">
            <div className="rounded-xl border border-zinc-200 bg-white p-4">
              <div className="font-semibold text-zinc-900">{property.title}</div>
              <div className="text-sm text-zinc-600">Listed by {agent.user.name || 'Agent'}</div>
              <div className="mt-4 grid gap-2">
                <input className="px-3 py-2 rounded border border-zinc-300" placeholder="Name" />
                <input className="px-3 py-2 rounded border border-zinc-300" placeholder="Email" />
                <input className="px-3 py-2 rounded border border-zinc-300" placeholder="Phone" />
                <textarea className="px-3 py-2 rounded border border-zinc-300 min-h-[90px]" placeholder="Message" />
                <Button className="w-full bg-zinc-900 hover:bg-zinc-950 text-white">Submit Inquiry</Button>
                {property.brochureUrl && (
                  <Link href={property.brochureUrl} target="_blank" className="w-full inline-flex items-center justify-center gap-2 border border-zinc-300 rounded px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50">
                    <Download className="w-4 h-4" /> Download brochure
                  </Link>
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Similar properties (reuse template grid) */}
      {similar.length > 0 && (
        <section className="mt-12">
          <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16">
            <div className="max-w-7xl mx-auto">
              <h3 className="text-2xl font-bold text-zinc-950 mb-6">Similar properties</h3>
            </div>
          </div>
          <PropertiesSection
            // Casting to existing props to satisfy template component without widening to any globally
            properties={similar as unknown as unknown as import('@/types/dashboard').Property[]}
            agent={agent as unknown as { id: string; slug: string; user: { name: string | null; email: string | null }; phone: string | null; city: string | null; area: string | null; experience: number | null; bio: string | null }}
          />
        </section>
      )}

      {/* Testimonials */}
      <TestimonialsSection testimonials={(agent as unknown as { testimonials?: Testimonial[] }).testimonials || []} />

      {/* FAQs */}
      <FaqSection faqs={(agent as unknown as { faqs?: FAQ[] }).faqs || []} />

      {/* Contact reuse */}
      <section className="mt-12">
        <ContactSection agent={agent as unknown as { id: string; phone: string | null; city: string | null; area: string | null; user: { name: string | null; email: string | null } }} />
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}


