'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { adminModerateAward, adminModerateGalleryImage, adminModerateBuilder, adminModerateTestimonial, adminModerateFAQ, adminModerateProperty, adminModerateAgentProfile } from '@/app/actions';

type Item = {
  id: string;
  type: 'agent_profile' | 'property' | 'award' | 'gallery_image' | 'builder' | 'testimonial' | 'faq' | string;
  entityId: string;
  action: 'created' | 'updated' | string;
  createdAt: string | Date;
  snapshot: unknown;
  agent: { slug: string; user: { name: string | null; email: string | null } };
};

export default function PendingQueue({ items }: { items: Item[] }) {
  const [data, setData] = useState(items);

  async function approve(item: Item) {
    // Mark as approved by removing from queue client-side; server is append-only for now
    setData(prev => prev.filter(i => i.id !== item.id));
  }

  async function takedown(item: Item, reason?: string) {
    try {
      if (item.type === 'award') await adminModerateAward(item.entityId, true, reason);
      else if (item.type === 'gallery_image') await adminModerateGalleryImage(item.entityId, true, reason);
      else if (item.type === 'builder') await adminModerateBuilder(item.entityId, true, reason);
      else if (item.type === 'testimonial') await adminModerateTestimonial(item.entityId, true, reason);
      else if (item.type === 'faq') await adminModerateFAQ(item.entityId, true, reason);
      else if (item.type === 'property') await adminModerateProperty(item.entityId, true, reason);
      else if (item.type === 'agent_profile') await adminModerateAgentProfile(item.entityId, true, reason);
      // testimonials/faqs/properties/profile handled via dedicated pages or future actions
    } finally {
      setData(prev => prev.filter(i => i.id !== item.id));
    }
  }

  return (
    <section className="bg-white border border-zinc-200 rounded-lg p-4">
      <h2 className="font-semibold mb-3">Pending Moderation</h2>
      {data.length === 0 ? (
        <div className="text-sm text-zinc-600">No pending items.</div>
      ) : (
        <div className="space-y-3">
          {data.map((item) => (
            <PendingRow key={item.id} item={item} onApprove={() => approve(item)} onTakedown={(r) => takedown(item, r)} />
          ))}
        </div>
      )}
    </section>
  );
}

function PendingRow({ item, onApprove, onTakedown }: { item: Item; onApprove: () => void; onTakedown: (reason?: string) => void }) {
  const [reason, setReason] = useState('');
  const meta = typeof item.snapshot === 'object' && item.snapshot ? JSON.stringify(item.snapshot) : '';
  return (
    <div className="border border-zinc-200 rounded p-3">
      <div className="text-sm text-zinc-600">{item.agent.user.name} ({item.agent.slug})</div>
      <div className="text-xs text-zinc-500">{item.type} • {item.action} • {new Date(item.createdAt).toLocaleString()}</div>
      {meta && <pre className="text-xs text-zinc-700 bg-zinc-50 rounded p-2 mt-2 overflow-x-auto">{meta}</pre>}
      <div className="flex gap-2 mt-2">
        <Button size="sm" variant="outline" onClick={onApprove}>Approve</Button>
        <Button size="sm" variant="outline" onClick={() => onTakedown(reason)} className="text-red-600 border-red-300">Take down</Button>
        <Input value={reason} onChange={e => setReason(e.target.value)} placeholder="Reason (optional)" className="h-8 text-xs max-w-xs" />
      </div>
    </div>
  );
}


