'use client';

import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface FaqSectionProps {
  faqs: FAQ[];
}

export default function FaqSection({ faqs }: FaqSectionProps) {
  const defaultFaqs = [
    {
      id: 'default-1',
      question: 'What is the process for buying a property?',
      answer: 'Getting started is easy! First, we\'ll have a consultation to understand your needs, budget, and timeline. Then I\'ll help you get pre-approved for financing and start showing you properties that match your criteria.'
    },
    {
      id: 'default-2',
      question: 'How do I determine how much I can afford?',
      answer: 'I\'ll help you calculate your budget based on your income, expenses, and down payment. We\'ll also get you pre-approved with a lender to understand your exact purchasing power.'
    },
    {
      id: 'default-3',
      question: 'What documents are required for renting a property?',
      answer: 'For renting, you\'ll typically need proof of income, employment verification, bank statements, ID, and references. I\'ll provide you with a complete checklist specific to your situation.'
    },
    {
      id: 'default-4',
      question: 'Can I terminate a lease agreement early?',
      answer: 'Lease termination depends on your specific agreement terms and local laws. Some leases have early termination clauses, while others may require negotiation with the landlord.'
    },
    {
      id: 'default-5',
      question: 'What are the risks of investing in real estate?',
      answer: 'Real estate investments carry risks including market fluctuations, property maintenance costs, vacancy periods, and liquidity concerns. I\'ll help you understand and mitigate these risks.'
    },
    {
      id: 'default-6',
      question: 'How do I choose the right property to invest in?',
      answer: 'I\'ll help you analyze factors like location, market trends, rental yield potential, appreciation prospects, and your investment goals to find the right property.'
    },
    {
      id: 'default-7',
      question: 'Do high-end properties support virtual tours?',
      answer: 'Yes! I offer comprehensive virtual tours, 3D walkthroughs, and high-quality video presentations for all my premium listings to provide you with an immersive viewing experience.'
    },
    {
      id: 'default-8',
      question: 'How long does the property transfer process take?',
      answer: 'The timeline varies, but typically buying takes 30-45 days from offer acceptance to closing, while selling can take 15-60 days depending on market conditions and pricing strategy.'
    }
  ];

  const displayFaqs = faqs.length > 0 ? faqs : defaultFaqs;

  return (
    <section id="faq" className="w-full py-12 md:py-16 lg:py-20 bg-white">
      <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
            {/* Left Column - Sticky */}
            <div className="lg:sticky lg:top-8 lg:self-start">
              {/* Tag */}
              <div className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 bg-white rounded-full border border-zinc-200 text-xs md:text-sm text-zinc-700 mb-6 md:mb-8">
                Help Center
              </div>
              
              {/* Heading */}
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight mb-4 md:mb-6 uppercase">
                FREQUENTLY ASKED<br />
                QUESTIONS
              </h2>
              
              {/* Description */}
              <p className="text-zinc-600 text-base md:text-lg leading-relaxed mb-6">
                Find answers to common questions about real estate transactions, my services, and the buying/selling process.
              </p>

              {/* Contact CTA */}
              <div className="p-6 bg-white rounded-lg border border-zinc-200 shadow-sm">
                <h3 className="text-lg font-bold text-zinc-950 mb-2">Still Have Questions?</h3>
                <p className="text-zinc-600 text-sm mb-4">
                  I&apos;m here to help! Feel free to reach out with any questions about real estate or my services.
                </p>
                <button
                  onClick={() => {
                    const element = document.querySelector('#contact');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
                >
                  Ask Me Anything
                </button>
              </div>
            </div>

            {/* Right Column - FAQ Accordion */}
            <div className="lg:col-span-2">
              <div className="border-t border-b border-zinc-200 divide-y divide-zinc-200">
                {displayFaqs.map((faq, index) => (
                  <FaqAccordionItem
                    key={faq.id}
                    question={faq.question}
                    answer={faq.answer}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Standalone FAQ Accordion Item Component
function FaqAccordionItem({ question, answer }: { question: string; answer: string; index?: number }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 md:py-6 text-left flex items-center justify-between"
      >
        <span className="font-medium md:font-semibold text-zinc-900 pr-6 text-base md:text-lg">{question}</span>
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-zinc-300 text-zinc-700">
          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </span>
      </button>
      {isOpen && (
        <div className="pb-6">
          <div className="pt-1 text-zinc-700 leading-relaxed text-sm md:text-base">{answer}</div>
        </div>
      )}
    </div>
  );
}

