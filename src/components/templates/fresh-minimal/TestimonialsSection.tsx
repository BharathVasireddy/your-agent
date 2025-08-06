'use client';

import { Star, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  agentId: string;
  text: string;
  author: string;
  role: string | null;
  rating: number | null;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (testimonials.length === 0) {
    return (
      <section id="testimonials" className="py-template-section bg-template-background-secondary">
        <div className="max-w-7xl mx-auto px-template-container text-center">
          <h2 className="text-3xl md:text-4xl font-template-primary font-bold text-template-text-primary mb-4">
            Client Reviews
          </h2>
          <p className="text-template-text-muted font-template-primary">
            Client testimonials will appear here once available.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="py-template-section bg-template-background-secondary">
      <div className="max-w-7xl mx-auto px-template-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-template-primary font-bold text-template-text-primary mb-4">
            What Clients Say
          </h2>
          <p className="text-lg text-template-text-secondary font-template-primary max-w-2xl mx-auto">
            Real experiences from satisfied clients who trusted us with their property needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-template-background rounded-template-card p-6 shadow-template-md hover:shadow-template-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < (testimonial.rating || 5)
                          ? 'text-template-primary fill-current'
                          : 'text-template-border'
                      }`}
                    />
                  ))}
                </div>
                <Quote className="w-6 h-6 text-template-primary/20" />
              </div>
              
              <p className="text-template-text-secondary font-template-primary mb-6 leading-relaxed">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              
              <div>
                <p className="font-template-primary font-semibold text-template-text-primary">
                  {testimonial.author}
                </p>
                {testimonial.role && (
                  <p className="text-sm text-template-text-muted font-template-primary">
                    {testimonial.role}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}