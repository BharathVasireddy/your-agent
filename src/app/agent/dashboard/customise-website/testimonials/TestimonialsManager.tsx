'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, Edit2, Trash2, Star } from 'lucide-react';
import { addTestimonial, updateTestimonial, deleteTestimonial } from '@/app/actions';
import toast from 'react-hot-toast';

interface Testimonial {
  id: string;
  text: string;
  author: string;
  role?: string | null;
  rating: number | null;
}

interface Agent {
  id: string;
  testimonials: Testimonial[];
}

interface TestimonialsManagerProps {
  agent: Agent;
}

export default function TestimonialsManager({ agent }: TestimonialsManagerProps) {
  // Content management state
  const [testimonials, setTestimonials] = useState<Testimonial[]>(agent.testimonials || []);

  // Testimonial form state
  const [testimonialForm, setTestimonialForm] = useState({
    text: '',
    author: '',
    role: '',
    rating: null as number | null,
    editingId: null as string | null
  });
  const [isSubmittingTestimonial, setIsSubmittingTestimonial] = useState(false);

  // Testimonial management functions
  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!testimonialForm.text.trim() || !testimonialForm.author.trim()) {
      toast.error('Please fill in all testimonial fields.');
      return;
    }

    try {
      setIsSubmittingTestimonial(true);
      
      const data = {
        text: testimonialForm.text,
        author: testimonialForm.author,
        role: testimonialForm.role.trim() || null,
        rating: testimonialForm.rating
      };

      if (testimonialForm.editingId) {
        // Update existing testimonial
        const result = await updateTestimonial(testimonialForm.editingId, data);
        if (result.success) {
          setTestimonials(prev => prev.map(t => 
            t.id === testimonialForm.editingId ? { ...t, ...data } : t
          ));
          toast.success('Testimonial updated successfully!');
        }
      } else {
        // Add new testimonial
        const result = await addTestimonial(data);
        if (result.success && result.testimonial) {
          setTestimonials(prev => [...prev, result.testimonial]);
          toast.success('Testimonial added successfully!');
        }
      }
      
      // Reset form
      setTestimonialForm({
        text: '',
        author: '',
        role: '',
        rating: null,
        editingId: null
      });
      
    } catch (error) {
      console.error('Error with testimonial:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save testimonial');
    } finally {
      setIsSubmittingTestimonial(false);
    }
  };

  const handleEditTestimonial = (testimonial: Testimonial) => {
    setTestimonialForm({
      text: testimonial.text,
      author: testimonial.author,
      role: testimonial.role || '',
      rating: testimonial.rating,
      editingId: testimonial.id
    });
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    
    try {
      const result = await deleteTestimonial(id);
      if (result.success) {
        setTestimonials(prev => prev.filter(t => t.id !== id));
        toast.success('Testimonial deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete testimonial');
    }
  };

  const cancelEdit = () => {
    setTestimonialForm({
      text: '',
      author: '',
      role: '',
      rating: null,
      editingId: null
    });
  };

  return (
    <div className="space-y-8">
      {/* Add/Edit Testimonial Form */}
      <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-950 mb-4">
          {testimonialForm.editingId ? 'Edit Testimonial' : 'Add New Testimonial'}
        </h3>
        
        <form onSubmit={handleTestimonialSubmit} className="space-y-4">
          <div>
            <Label htmlFor="testimonial-text" className="text-zinc-600 mb-2 block">Testimonial Text *</Label>
            <Textarea
              id="testimonial-text"
              value={testimonialForm.text}
              onChange={(e) => setTestimonialForm(prev => ({ ...prev, text: e.target.value }))}
              placeholder="Enter the client's testimonial..."
              className="min-h-[100px]"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="testimonial-author" className="text-zinc-600 mb-2 block">Client Name *</Label>
              <Input
                id="testimonial-author"
                value={testimonialForm.author}
                onChange={(e) => setTestimonialForm(prev => ({ ...prev, author: e.target.value }))}
                placeholder="Client's full name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="testimonial-role" className="text-zinc-600 mb-2 block">Client Role/Title</Label>
              <Input
                id="testimonial-role"
                value={testimonialForm.role}
                onChange={(e) => setTestimonialForm(prev => ({ ...prev, role: e.target.value }))}
                placeholder="e.g., Software Developer"
              />
            </div>
            
            <div>
              <Label htmlFor="testimonial-rating" className="text-zinc-600 mb-2 block">Rating (Optional)</Label>
              <Select 
                value={testimonialForm.rating?.toString() || 'none'} 
                onValueChange={(value) => setTestimonialForm(prev => ({ 
                  ...prev, 
                  rating: value && value !== 'none' ? parseInt(value) : null 
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No rating</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              type="submit"
              disabled={isSubmittingTestimonial}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isSubmittingTestimonial ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {testimonialForm.editingId ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  {testimonialForm.editingId ? 'Update Testimonial' : 'Add Testimonial'}
                </>
              )}
            </Button>
            
            {testimonialForm.editingId && (
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

      {/* Testimonials List */}
      <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-950 mb-4">
          Current Testimonials ({testimonials.length})
        </h3>
        
        <div className="space-y-3">
          {testimonials.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-zinc-500 mb-2">No testimonials added yet.</p>
              <p className="text-zinc-400 text-sm">Add your first testimonial using the form above.</p>
            </div>
          ) : (
            testimonials.map((testimonial) => (
              <div key={testimonial.id} className="border border-zinc-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h5 className="font-medium text-zinc-900">{testimonial.author}</h5>
                      {testimonial.rating && (
                        <div className="flex items-center">
                          {Array.from({ length: testimonial.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      )}
                    </div>
                    {testimonial.role && (
                      <p className="text-zinc-500 text-sm mb-2">{testimonial.role}</p>
                    )}
                    <p className="text-zinc-700 text-sm">{testimonial.text}</p>
                  </div>
                  <div className="flex space-x-1 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditTestimonial(testimonial)}
                      className="p-1 h-8 w-8"
                      title="Edit testimonial"
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteTestimonial(testimonial.id)}
                      className="p-1 h-8 w-8 text-red-600 hover:text-red-700"
                      title="Delete testimonial"
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
        <h4 className="font-medium text-zinc-900 mb-2">Tips for Great Testimonials</h4>
        <ul className="text-zinc-600 text-sm space-y-1">
          <li>• Include specific details about your service or expertise</li>
          <li>• Mention the type of property or service provided</li>
          <li>• Keep testimonials authentic and genuine</li>
          <li>• Include the client&apos;s role/profession for credibility</li>
        </ul>
      </div>
    </div>
  );
}