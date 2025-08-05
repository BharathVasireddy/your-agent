'use client';

import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Testimonial {
  id: string;
  text: string;
  author: string;
  rating: number | null;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (testimonials.length === 0) {
    return (
      <section id="testimonials" className="py-16 bg-zinc-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-950 mb-4">Client Testimonials</h2>
            <p className="text-zinc-600 max-w-2xl mx-auto">
              Client reviews and testimonials will appear here. Contact me to share your experience!
            </p>
          </div>
        </div>
      </section>
    );
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section id="testimonials" className="py-16 bg-zinc-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-950 mb-4">Client Testimonials</h2>
          <p className="text-zinc-600 max-w-2xl mx-auto">
            Don&apos;t just take my word for it. Here&apos;s what my clients have to say about their experience working with me.
          </p>
        </div>

        {/* Featured Testimonial */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-8 md:p-12 relative">
            {/* Quote Icon */}
            <div className="absolute top-6 left-6 text-red-600/20">
              <Quote className="w-12 h-12" />
            </div>

            <div className="text-center">
              {/* Rating */}
              {currentTestimonial.rating && (
                <div className="flex justify-center mb-6">
                  {Array.from({ length: currentTestimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              )}

              {/* Testimonial Text */}
              <blockquote className="text-xl md:text-2xl text-zinc-700 leading-relaxed mb-8 italic">
                &ldquo;{currentTestimonial.text}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="text-lg font-semibold text-zinc-950">
                {currentTestimonial.author}
              </div>
            </div>

            {/* Navigation Arrows */}
            {testimonials.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevTestimonial}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 p-0 rounded-full border-zinc-300 hover:border-red-600 hover:text-red-600"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextTestimonial}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 p-0 rounded-full border-zinc-300 hover:border-red-600 hover:text-red-600"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </>
            )}
          </div>

          {/* Dots Indicator */}
          {testimonials.length > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-red-600' : 'bg-zinc-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* All Testimonials Grid (if more than 3) */}
        {testimonials.length > 3 && (
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold text-zinc-950 text-center mb-8">More Client Reviews</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.slice(0, 6).map((testimonial) => (
                <div key={testimonial.id} className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6">
                  {/* Rating */}
                  {testimonial.rating && (
                    <div className="flex mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  )}

                  {/* Text */}
                  <p className="text-zinc-700 mb-4 text-sm leading-relaxed">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="font-semibold text-zinc-950 text-sm">
                    {testimonial.author}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-12">
          <Button
            onClick={() => {
              const element = document.querySelector('#contact');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3"
          >
            Share Your Experience
          </Button>
        </div>
      </div>
    </section>
  );
}