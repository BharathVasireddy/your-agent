'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import ImageUploader from '@/components/ImageUploader';
import { addAward, updateAward, deleteAward } from '@/app/actions';
import toast from 'react-hot-toast';
import { Edit2, Trash2, Loader2, Plus } from 'lucide-react';

interface Award {
  id: string;
  title: string;
  issuedBy?: string | null;
  year?: number | null;
  description?: string | null;
  imageUrl?: string | null;
}

interface AwardsManagerProps {
  agent: { id: string; awards?: Award[] };
}

export default function AwardsManager({ agent }: AwardsManagerProps) {
  const [awards, setAwards] = useState<Award[]>(agent.awards || []);
  const [form, setForm] = useState<{ id?: string; title: string; issuedBy: string; year: string; description: string; imageUrl: string }>(
    { title: '', issuedBy: '', year: '', description: '', imageUrl: '' }
  );
  const [saving, setSaving] = useState(false);

  const reset = () => setForm({ title: '', issuedBy: '', year: '', description: '', imageUrl: '' });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    setSaving(true);
    try {
      if (form.id) {
        const res = await updateAward(form.id, {
          title: form.title,
          issuedBy: form.issuedBy || null,
          year: form.year ? parseInt(form.year) : null,
          description: form.description || null,
          imageUrl: form.imageUrl || null,
        });
        if (res.success && res.award) {
          setAwards(prev => prev.map(a => a.id === res.award.id ? res.award as Award : a));
          toast.success('Award updated');
          reset();
        }
      } else {
        const res = await addAward({
          title: form.title,
          issuedBy: form.issuedBy || null,
          year: form.year ? parseInt(form.year) : null,
          description: form.description || null,
          imageUrl: form.imageUrl || null,
        });
        if (res.success && res.award) {
          setAwards(prev => [...prev, res.award as Award]);
          toast.success('Award added');
          reset();
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save award');
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this award?')) return;
    try {
      const res = await deleteAward(id);
      if (res.success) {
        setAwards(prev => prev.filter(a => a.id !== id));
        toast.success('Award deleted');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete award');
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-950 mb-4">{form.id ? 'Edit Award' : 'Add Award'}</h3>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="mb-1 block">Title *</Label>
              <Input value={form.title} onChange={e => setForm(s => ({ ...s, title: e.target.value }))} required />
            </div>
            <div>
              <Label className="mb-1 block">Issued By</Label>
              <Input value={form.issuedBy} onChange={e => setForm(s => ({ ...s, issuedBy: e.target.value }))} />
            </div>
            <div>
              <Label className="mb-1 block">Year</Label>
              <Input type="number" min="1900" max="2100" value={form.year} onChange={e => setForm(s => ({ ...s, year: e.target.value }))} />
            </div>
          </div>
          <div>
            <Label className="mb-1 block">Description</Label>
            <Textarea value={form.description} onChange={e => setForm(s => ({ ...s, description: e.target.value }))} />
          </div>
          <div>
            <Label className="mb-2 block">Award Image</Label>
            <ImageUploader currentImageUrl={form.imageUrl} onImageChange={(url) => setForm(s => ({ ...s, imageUrl: url }))} uploadFolder="agent-awards" aspectRatio="square" maxWidth={800} maxHeight={800} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={saving} className="bg-brand text-white">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (<><Plus className="w-4 h-4 mr-2" />{form.id ? 'Update Award' : 'Add Award'}</>)}
            </Button>
            {form.id && (
              <Button type="button" variant="outline" onClick={() => reset()}>Cancel</Button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-950 mb-4">Current Awards ({awards.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {awards.map(a => (
            <div key={a.id} className="border border-zinc-200 rounded-lg p-4">
              <div className="flex gap-3">
                {a.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.imageUrl} alt={a.title} className="w-16 h-16 rounded object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded bg-zinc-100" />
                )}
                <div className="flex-1">
                  <div className="font-medium text-zinc-900">{a.title}</div>
                  <div className="text-sm text-zinc-600">{a.issuedBy || ''} {a.year ? `• ${a.year}` : ''}</div>
                  {a.description && <div className="text-sm text-zinc-700 mt-1 line-clamp-2">{a.description}</div>}
                </div>
                <div className="flex flex-col gap-1">
                  <Button size="sm" variant="outline" className="h-8" onClick={() => setForm({ id: a.id, title: a.title, issuedBy: a.issuedBy || '', year: a.year?.toString() || '', description: a.description || '', imageUrl: a.imageUrl || '' })}><Edit2 className="w-3 h-3"/></Button>
                  <Button size="sm" variant="outline" className="h-8" onClick={() => remove(a.id)}><Trash2 className="w-3 h-3"/></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


