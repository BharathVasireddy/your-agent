'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface FaqSectionProps {
  faqs: FAQ[];
}

export default function FaqSection({ faqs }: FaqSectionProps) {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const defaultFaqs = [
    {
      id: 'default-1',
      question: 'How do I get started with buying a property?',
              answer: 'Getting started is easy! First, we&apos;ll have a consultation to understand your needs, budget, and timeline. Then I&apos;ll help you get pre-approved for financing and start showing you properties that match your criteria.'
    },
    {
      id: 'default-2',
      question: 'What documents do I need for selling my property?',
              answer: 'For selling, you&apos;ll need property title documents, recent tax bills, maintenance records, and any relevant permits or certificates. I&apos;ll provide you with a complete checklist and help you gather everything needed.'
    },
    {
      id: 'default-3',
      question: 'How long does the buying/selling process typically take?',
              answer: 'The timeline varies, but typically buying takes 30-45 days from offer acceptance to closing, while selling can take 15-60 days depending on market conditions and pricing strategy. I&apos;ll keep you informed every step of the way.'
    },
    {
      id: 'default-4',
      question: 'Do you charge any upfront fees?',
              answer: 'No, I don&apos;t charge any upfront fees for buyers. For sellers, my commission is only paid at closing when your property successfully sells. I believe in earning my fee by delivering results.'
    }
  ];

  const displayFaqs = faqs.length > 0 ? faqs : defaultFaqs;

  return (
    <section id="faq" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-950 mb-4">Frequently Asked Questions</h2>
            <p className="text-zinc-600 max-w-2xl mx-auto">
              Find answers to common questions about real estate transactions, my services, and the buying/selling process.
            </p>
          </div>

          <div className="space-y-4">
            {displayFaqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-zinc-50 rounded-lg border border-zinc-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-zinc-100 transition-colors"
                >
                  <span className="font-semibold text-zinc-950 pr-4">{faq.question}</span>
                  {openItems.includes(faq.id) ? (
                    <ChevronUp className="w-5 h-5 text-red-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-red-600 flex-shrink-0" />
                  )}
                </button>
                
                {openItems.includes(faq.id) && (
                  <div className="px-6 pb-4">
                    <div className="text-zinc-700 leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12 p-8 bg-red-50 rounded-lg border border-red-100">
            <h3 className="text-xl font-bold text-zinc-950 mb-2">Still Have Questions?</h3>
            <p className="text-zinc-600 mb-4">
              I&apos;m here to help! Feel free to reach out with any questions about real estate or my services.
            </p>
            <button
              onClick={() => {
                const element = document.querySelector('#contact');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Ask Me Anything
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}