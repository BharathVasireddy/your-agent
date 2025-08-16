'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import ImageUploader from '@/components/ImageUploader';
import { addBuilder, updateBuilder, deleteBuilder } from '@/app/actions';
import toast from 'react-hot-toast';
import { Edit2, Trash2, Loader2, Plus, ExternalLink } from 'lucide-react';

interface Builder {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string | null;
}

interface BuildersManagerProps {
  agent: { id: string; builders?: Builder[] };
}

export default function BuildersManager({ agent }: BuildersManagerProps) {
  const [builders, setBuilders] = useState<Builder[]>(agent.builders || []);
  const [form, setForm] = useState<{ id?: string; name: string; logoUrl: string; websiteUrl: string }>({ name: '', logoUrl: '', websiteUrl: '' });
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.logoUrl) { toast.error('Name and logo are required'); return; }
    setSaving(true);
    try {
      if (form.id) {
        const res = await updateBuilder(form.id, { name: form.name, logoUrl: form.logoUrl, websiteUrl: form.websiteUrl || null });
        if (res.success && res.builder) {
          setBuilders(prev => prev.map(b => b.id === res.builder.id ? res.builder as Builder : b));
          toast.success('Builder updated');
          setForm({ name: '', logoUrl: '', websiteUrl: '' });
        }
      } else {
        const res = await addBuilder({ name: form.name, logoUrl: form.logoUrl, websiteUrl: form.websiteUrl || null });
        if (res.success && res.builder) {
          setBuilders(prev => [...prev, res.builder as Builder]);
          toast.success('Builder added');
          setForm({ name: '', logoUrl: '', websiteUrl: '' });
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save builder');
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this builder?')) return;
    try {
      const res = await deleteBuilder(id);
      if (res.success) {
        setBuilders(prev => prev.filter(b => b.id !== id));
        toast.success('Builder deleted');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete builder');
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-950 mb-4">{form.id ? 'Edit Builder' : 'Add Builder'}</h3>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="mb-1 block">Name *</Label>
              <Input value={form.name} onChange={e => setForm(s => ({ ...s, name: e.target.value }))} required />
            </div>
            <div>
              <Label className="mb-1 block">Website URL</Label>
              <Input value={form.websiteUrl} onChange={e => setForm(s => ({ ...s, websiteUrl: e.target.value }))} placeholder="https://..." />
            </div>
          </div>
          <div>
            <Label className="mb-2 block">Logo *</Label>
            <ImageUploader currentImageUrl={form.logoUrl} onImageChange={(url) => setForm(s => ({ ...s, logoUrl: url }))} uploadFolder="agent-builders" aspectRatio="square" maxWidth={600} maxHeight={600} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={saving} className="bg-brand text-white">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (<><Plus className="w-4 h-4 mr-2" />{form.id ? 'Update Builder' : 'Add Builder'}</>)}
            </Button>
            {form.id && (
              <Button type="button" variant="outline" onClick={() => setForm({ name: '', logoUrl: '', websiteUrl: '' })}>Cancel</Button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-950 mb-4">Current Builders ({builders.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {builders.map(b => (
            <div key={b.id} className="border border-zinc-200 rounded-lg p-4 flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.logoUrl} alt={b.name} className="w-16 h-16 rounded object-contain bg-white border" />
              <div className="flex-1">
                <div className="font-medium text-zinc-900">{b.name}</div>
                {b.websiteUrl && <a href={b.websiteUrl} target="_blank" rel="noreferrer" className="text-sm text-brand inline-flex items-center gap-1">Visit <ExternalLink className="w-3 h-3"/></a>}
              </div>
              <div className="flex flex-col gap-1">
                <Button size="sm" variant="outline" className="h-8" onClick={() => setForm({ id: b.id, name: b.name, logoUrl: b.logoUrl, websiteUrl: b.websiteUrl || '' })}><Edit2 className="w-3 h-3"/></Button>
                <Button size="sm" variant="outline" className="h-8" onClick={() => remove(b.id)}><Trash2 className="w-3 h-3"/></Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


