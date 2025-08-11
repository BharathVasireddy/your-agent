'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Edit2, Trash2 } from 'lucide-react';
import { addFAQ, updateFAQ, deleteFAQ } from '@/app/actions';
import toast from 'react-hot-toast';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface Agent {
  id: string;
  faqs: FAQ[];
}

interface FaqsManagerProps {
  agent: Agent;
}

export default function FaqsManager({ agent }: FaqsManagerProps) {
  // Content management state
  const [faqs, setFaqs] = useState<FAQ[]>(agent.faqs || []);

  // FAQ form state
  const [faqForm, setFaqForm] = useState({
    question: '',
    answer: '',
    editingId: null as string | null
  });
  const [isSubmittingFaq, setIsSubmittingFaq] = useState(false);

  // FAQ management functions
  const handleFaqSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!faqForm.question.trim() || !faqForm.answer.trim()) {
      toast.error('Please fill in both question and answer.');
      return;
    }

    try {
      setIsSubmittingFaq(true);
      
      const data = {
        question: faqForm.question,
        answer: faqForm.answer
      };

      if (faqForm.editingId) {
        // Update existing FAQ
        const result = await updateFAQ(faqForm.editingId, data);
        if (result.success) {
          setFaqs(prev => prev.map(f => 
            f.id === faqForm.editingId ? { ...f, ...data } : f
          ));
          toast.success('FAQ updated successfully!');
        }
      } else {
        // Add new FAQ
        const result = await addFAQ(data);
        if (result.success && result.faq) {
          setFaqs(prev => [...prev, result.faq]);
          toast.success('FAQ added successfully!');
        }
      }
      
      // Reset form
      setFaqForm({
        question: '',
        answer: '',
        editingId: null
      });
      
    } catch (error) {
      console.error('Error with FAQ:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save FAQ');
    } finally {
      setIsSubmittingFaq(false);
    }
  };

  const handleEditFaq = (faq: FAQ) => {
    setFaqForm({
      question: faq.question,
      answer: faq.answer,
      editingId: faq.id
    });
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    
    try {
      const result = await deleteFAQ(id);
      if (result.success) {
        setFaqs(prev => prev.filter(f => f.id !== id));
        toast.success('FAQ deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete FAQ');
    }
  };

  const cancelEdit = () => {
    setFaqForm({
      question: '',
      answer: '',
      editingId: null
    });
  };

  return (
    <div className="space-y-8">
      {/* Add/Edit FAQ Form */}
      <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-950 mb-4">
          {faqForm.editingId ? 'Edit FAQ' : 'Add New FAQ'}
        </h3>
        
        <form onSubmit={handleFaqSubmit} className="space-y-4">
          <div>
            <Label htmlFor="faq-question" className="text-zinc-600 mb-2 block">Question *</Label>
            <Input
              id="faq-question"
              value={faqForm.question}
              onChange={(e) => setFaqForm(prev => ({ ...prev, question: e.target.value }))}
              placeholder="Enter the frequently asked question..."
              required
            />
          </div>
          
          <div>
            <Label htmlFor="faq-answer" className="text-zinc-600 mb-2 block">Answer *</Label>
            <Textarea
              id="faq-answer"
              value={faqForm.answer}
              onChange={(e) => setFaqForm(prev => ({ ...prev, answer: e.target.value }))}
              placeholder="Enter the answer to this question..."
              className="min-h-[100px]"
              required
            />
          </div>
          
          <div className="flex space-x-2">
            <Button
              type="submit"
              disabled={isSubmittingFaq}
              className="bg-brand hover:bg-brand-hover text-white"
            >
              {isSubmittingFaq ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {faqForm.editingId ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  {faqForm.editingId ? 'Update FAQ' : 'Add FAQ'}
                </>
              )}
            </Button>
            
            {faqForm.editingId && (
              <Button
                type="button"
                variant="outline"
                onClick={cancelEdit}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* FAQs List */}
      <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-950 mb-4">
          Current FAQs ({faqs.length})
        </h3>
        
        <div className="space-y-3">
          {faqs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-zinc-500 mb-2">No FAQs added yet.</p>
              <p className="text-zinc-400 text-sm">Add your first FAQ using the form above.</p>
            </div>
          ) : (
            faqs.map((faq) => (
              <div key={faq.id} className="border border-zinc-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h5 className="font-medium text-zinc-900 mb-1">{faq.question}</h5>
                    <p className="text-zinc-700 text-sm">{faq.answer}</p>
                  </div>
                  <div className="flex space-x-1 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditFaq(faq)}
                      className="p-1 h-8 w-8"
                      title="Edit FAQ"
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteFaq(faq.id)}
                      className="p-1 h-8 w-8 text-brand hover:text-brand-hover"
                      title="Delete FAQ"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4">
        <h4 className="font-medium text-zinc-900 mb-2">Tips for Effective FAQs</h4>
        <ul className="text-zinc-600 text-sm space-y-1">
          <li>• Address common client concerns and questions</li>
          <li>• Keep answers clear, concise, and helpful</li>
          <li>• Include questions about your process, fees, and services</li>
          <li>• Update FAQs regularly based on client feedback</li>
        </ul>
      </div>
    </div>
  );
}