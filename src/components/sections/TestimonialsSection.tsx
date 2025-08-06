'use client';

import { motion } from "motion/react";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";

interface Testimonial {
  id: string;
  text: string;
  author: string;
  role?: string;
  avatar?: string;
  rating: number | null;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

const defaultTestimonials: Testimonial[] = [
  {
    id: "1",
    text: "Buying my vacation home was surprisingly easy. Sophia really knew her stuff and made the whole process super smooth. I didn't have to worry about a thing.",
    author: "Nathan Harper",
    role: "Software Developer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 5
  },
  {
    id: "2", 
    text: "Emily walked me through every step of my green home investment. She explained things clearly, gave great advice, and honestly just made it all feel doable.",
    author: "Logan Price",
    role: "Environmental Consultant", 
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    rating: 5
  },
  {
    id: "3",
    text: "Isabella was amazing — super friendly and detail-oriented. I found the perfect rental without any of the usual stress. It actually felt fun.",
    author: "Aria Sullivan",
    role: "Digital Nomad",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face", 
    rating: 5
  },
  {
    id: "4",
    text: "I had no idea where to start with property investment, but Emily made it all make sense. She was patient, clear, and completely on my side the whole time.",
    author: "Grace Powell",
    role: "Financial Consultant",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    rating: 5
  },
  {
    id: "5",
    text: "I thought the rental process would be a nightmare, but Olivia made it simple. She's sharp, supportive, and gave me a lot of confidence.",
    author: "Scarlett Mitchell", 
    role: "Event Planner",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    rating: 5
  },
  {
    id: "6",
    text: "Charlotte totally got what I was looking for. Her design sense and guidance helped me find a home that fits me perfectly. Loved working with her.",
    author: "Samuel Brooks",
    role: "Interior Designer", 
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    rating: 5
  },
  {
    id: "7",
    text: "The expertise and professionalism shown throughout the entire process was exceptional. Every detail was handled with care and precision.",
    author: "Maya Chen",
    role: "Marketing Director",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    rating: 5
  },
  {
    id: "8",
    text: "Outstanding service from start to finish. The team went above and beyond to ensure everything was perfect for our family's needs.",
    author: "David Rodriguez",
    role: "Tech Entrepreneur",
    avatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face",
    rating: 5
  },
  {
    id: "9",
    text: "Professional, reliable, and incredibly knowledgeable. The entire experience exceeded our expectations in every way possible.",
    author: "Sarah Johnson",
    role: "Investment Advisor",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    rating: 5
  }
];

export default function TestimonialsSection({ testimonials = defaultTestimonials }: TestimonialsSectionProps) {
  // Convert testimonials to the format expected by TestimonialsColumn
  const convertedTestimonials = testimonials.map((testimonial, index) => ({
    text: testimonial.text,
    image: testimonial.avatar || defaultTestimonials[index % defaultTestimonials.length]?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    name: testimonial.author,
    role: testimonial.role || "Satisfied Client",
  }));

  // Split testimonials into three columns
  const firstColumn = convertedTestimonials.slice(0, 3);
  const secondColumn = convertedTestimonials.slice(3, 6);
  const thirdColumn = convertedTestimonials.slice(6, 9);

  return (
    <section id="testimonials" className="bg-background my-20 relative">
      <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16">
        <div className="max-w-7xl mx-auto z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
          >
            <div className="flex justify-center">
              <div className="border py-1 px-4 rounded-lg">Testimonials</div>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter mt-5">
              What our clients say
            </h2>
            <p className="text-center mt-5 opacity-75">
              See what our customers have to say about us.
            </p>
          </motion.div>

          <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
            <TestimonialsColumn testimonials={firstColumn} duration={15} />
            <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
            <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
          </div>
        </div>
      </div>
    </section>
  );
}