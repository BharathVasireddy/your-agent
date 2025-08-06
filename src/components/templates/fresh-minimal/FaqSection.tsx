'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Faq {
  id: string;
  agentId: string;
  question: string;
  answer: string;
}

interface FaqSectionProps {
  faqs: Faq[];
}

export default function FaqSection({ faqs }: FaqSectionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  if (faqs.length === 0) {
    return (
      <section id="faq" className="py-template-section bg-template-background">
        <div className="max-w-4xl mx-auto px-template-container text-center">
          <h2 className="text-3xl md:text-4xl font-template-primary font-bold text-template-text-primary mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-template-text-muted font-template-primary">
            Common questions and answers will appear here.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="faq" className="py-template-section bg-template-background">
      <div className="max-w-4xl mx-auto px-template-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-template-primary font-bold text-template-text-primary mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-template-text-secondary font-template-primary">
            Find answers to common questions about our real estate services.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-template-background-secondary rounded-template-card border border-template-border-light overflow-hidden">
              <button
                onClick={() => toggleItem(faq.id)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-template-background-accent transition-colors"
              >
                <h3 className="font-template-primary font-semibold text-template-text-primary pr-4">
                  {faq.question}
                </h3>
                {openItems.has(faq.id) ? (
                  <ChevronUp className="w-5 h-5 text-template-primary flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-template-primary flex-shrink-0" />
                )}
              </button>
              
              {openItems.has(faq.id) && (
                <div className="px-6 pb-5">
                  <div className="pt-2 border-t border-template-border-light">
                    <p className="text-template-text-secondary font-template-primary leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}