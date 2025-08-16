'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import ImageUploader from '@/components/ImageUploader';
import { addGalleryImage, deleteGalleryImage } from '@/app/actions';
import toast from 'react-hot-toast';
import { Trash2, Loader2, Plus } from 'lucide-react';

interface GalleryImage {
  id: string;
  imageUrl: string;
  caption?: string | null;
}

interface GalleryManagerProps {
  agent: { id: string; galleryImages?: GalleryImage[] };
}

export default function GalleryManager({ agent }: GalleryManagerProps) {
  const [images, setImages] = useState<GalleryImage[]>(agent.galleryImages || []);
  const [form, setForm] = useState<{ imageUrl: string; caption: string }>({ imageUrl: '', caption: '' });
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.imageUrl) { toast.error('Please upload an image first'); return; }
    setSaving(true);
    try {
      const res = await addGalleryImage({ imageUrl: form.imageUrl, caption: form.caption || null });
      if (res.success && res.image) {
        setImages(prev => [res.image as GalleryImage, ...prev]);
        toast.success('Image added');
        setForm({ imageUrl: '', caption: '' });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add image');
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this image?')) return;
    try {
      const res = await deleteGalleryImage(id);
      if (res.success) {
        setImages(prev => prev.filter(i => i.id !== id));
        toast.success('Image deleted');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete image');
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-950 mb-4">Add Image</h3>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label className="mb-2 block">Upload Image</Label>
            <ImageUploader currentImageUrl={form.imageUrl} onImageChange={(url) => setForm(s => ({ ...s, imageUrl: url }))} uploadFolder="agent-gallery" aspectRatio="auto" maxWidth={1600} maxHeight={1200} />
          </div>
          <div>
            <Label className="mb-1 block">Caption</Label>
            <Input value={form.caption} onChange={e => setForm(s => ({ ...s, caption: e.target.value }))} placeholder="Optional caption" />
          </div>
          <Button type="submit" disabled={saving} className="bg-brand text-white">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (<><Plus className="w-4 h-4 mr-2" />Add Image</>)}
          </Button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-950 mb-4">Gallery ({images.length})</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map(img => (
            <div key={img.id} className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.imageUrl} alt={img.caption || 'Gallery image'} className="w-full h-40 object-cover rounded-lg border border-zinc-200" />
              {img.caption && <div className="text-xs text-zinc-700 mt-1 line-clamp-2">{img.caption}</div>}
              <button onClick={() => remove(img.id)} className="absolute top-2 right-2 bg-white/90 border border-zinc-200 text-zinc-800 rounded p-1 opacity-0 group-hover:opacity-100 transition">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


