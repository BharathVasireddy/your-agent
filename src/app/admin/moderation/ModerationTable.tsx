'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { adminModerateAward, adminModerateGalleryImage, adminModerateBuilder } from '@/app/actions';
import { Input } from '@/components/ui/input';

interface AwardItem {
  id: string;
  title: string;
  imageUrl: string | null;
  isRemovedByAdmin: boolean;
  removedReason: string | null;
  agent: { slug: string; user: { name: string | null; email: string | null } };
}
interface ImageItem {
  id: string;
  imageUrl: string;
  caption: string | null;
  isRemovedByAdmin: boolean;
  removedReason: string | null;
  agent: { slug: string; user: { name: string | null; email: string | null } };
}
interface BuilderItem {
  id: string;
  name: string;
  logoUrl: string;
  isRemovedByAdmin: boolean;
  removedReason: string | null;
  agent: { slug: string; user: { name: string | null; email: string | null } };
}

export default function ModerationTable({ awards, images, builders }: { awards: AwardItem[]; images: ImageItem[]; builders: BuilderItem[] }) {
  const [awardsState, setAwardsState] = useState(awards);
  const [imagesState, setImagesState] = useState(images);
  const [buildersState, setBuildersState] = useState(builders);

  async function toggleAward(id: string, remove: boolean, reason?: string) {
    const res = await adminModerateAward(id, remove, reason);
    if (res.success) setAwardsState(prev => prev.map(a => a.id === id ? { ...a, isRemovedByAdmin: remove, removedReason: reason || null } : a));
  }
  async function toggleImage(id: string, remove: boolean, reason?: string) {
    const res = await adminModerateGalleryImage(id, remove, reason);
    if (res.success) setImagesState(prev => prev.map(i => i.id === id ? { ...i, isRemovedByAdmin: remove, removedReason: reason || null } : i));
  }
  async function toggleBuilder(id: string, remove: boolean, reason?: string) {
    const res = await adminModerateBuilder(id, remove, reason);
    if (res.success) setBuildersState(prev => prev.map(b => b.id === id ? { ...b, isRemovedByAdmin: remove, removedReason: reason || null } : b));
  }

  const ReasonInput = ({ onSubmit }: { onSubmit: (reason?: string) => void }) => {
    const [value, setValue] = useState('');
    return (
      <div className="flex gap-2 mt-2">
        <Input value={value} onChange={e => setValue(e.target.value)} placeholder="Reason (optional)" />
        <Button size="sm" onClick={() => onSubmit(value || undefined)}>Save</Button>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <section className="bg-white border border-zinc-200 rounded-lg p-4">
        <h2 className="font-semibold mb-3">Awards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {awardsState.map(a => (
            <div key={a.id} className="border rounded p-3">
              <div className="text-sm text-zinc-600">{a.agent.user.name} ({a.agent.slug})</div>
              <div className="font-medium">{a.title}</div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {a.imageUrl && <img src={a.imageUrl} alt={a.title} className="w-full h-32 object-cover rounded mt-2" />}
              <div className="mt-2 text-xs text-zinc-500">Removed: {a.isRemovedByAdmin ? 'Yes' : 'No'} {a.removedReason ? `• ${a.removedReason}` : ''}</div>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant={a.isRemovedByAdmin ? 'default' : 'outline'} onClick={() => toggleAward(a.id, !a.isRemovedByAdmin)}>Toggle</Button>
              </div>
              <ReasonInput onSubmit={(r) => toggleAward(a.id, true, r)} />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border border-zinc-200 rounded-lg p-4">
        <h2 className="font-semibold mb-3">Gallery Images</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {imagesState.map(i => (
            <div key={i.id} className="border rounded p-3">
              <div className="text-xs text-zinc-600">{i.agent.user.name} ({i.agent.slug})</div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={i.imageUrl} alt={i.caption || 'Image'} className="w-full h-32 object-cover rounded mt-1" />
              {i.caption && <div className="text-sm mt-1">{i.caption}</div>}
              <div className="mt-2 text-xs text-zinc-500">Removed: {i.isRemovedByAdmin ? 'Yes' : 'No'} {i.removedReason ? `• ${i.removedReason}` : ''}</div>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant={i.isRemovedByAdmin ? 'default' : 'outline'} onClick={() => toggleImage(i.id, !i.isRemovedByAdmin)}>Toggle</Button>
              </div>
              <ReasonInput onSubmit={(r) => toggleImage(i.id, true, r)} />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border border-zinc-200 rounded-lg p-4">
        <h2 className="font-semibold mb-3">Builders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {buildersState.map(b => (
            <div key={b.id} className="border rounded p-3 flex gap-3 items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.logoUrl} alt={b.name} className="w-16 h-16 object-contain bg-white border rounded" />
              <div className="flex-1">
                <div className="text-sm text-zinc-600">{b.agent.user.name} ({b.agent.slug})</div>
                <div className="font-medium">{b.name}</div>
                <div className="mt-1 text-xs text-zinc-500">Removed: {b.isRemovedByAdmin ? 'Yes' : 'No'} {b.removedReason ? `• ${b.removedReason}` : ''}</div>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant={b.isRemovedByAdmin ? 'default' : 'outline'} onClick={() => toggleBuilder(b.id, !b.isRemovedByAdmin)}>Toggle</Button>
                </div>
                <ReasonInput onSubmit={(r) => toggleBuilder(b.id, true, r)} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}


