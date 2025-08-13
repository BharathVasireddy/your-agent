"use client";

import { useState, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function SeoSettings({ agentSlug, initial }: { agentSlug: string; initial: { metaTitle: string; metaDescription: string } }) {
  const [metaTitle, setMetaTitle] = useState(initial.metaTitle);
  const [metaDescription, setMetaDescription] = useState(initial.metaDescription);
  const [isPending, startTransition] = useTransition();
  const [glowTitle, setGlowTitle] = useState(false);
  const [glowDesc, setGlowDesc] = useState(false);
  const remain = Math.max(0, 160 - metaDescription.length);

  const onSave = () => {
    startTransition(async () => {
      try {
        const { updateAgentTemplateValue } = await import('@/app/actions');
        await updateAgentTemplateValue(agentSlug, 'seo.metaTitle', metaTitle.trim());
        await updateAgentTemplateValue(agentSlug, 'seo.metaDescription', metaDescription.trim());
      } catch {}
    });
  };

  const onGenerate = () => {
    startTransition(async () => {
      try {
        const { generateSeoTitle, generateSeoDescription } = await import('@/app/actions');
        setGlowTitle(true);
        const t = await generateSeoTitle(agentSlug);
        if ((t as { success: boolean }).success) setMetaTitle((t as { success: true; metaTitle: string }).metaTitle);
        setTimeout(()=>setGlowTitle(false), 900);
        setGlowDesc(true);
        const d = await generateSeoDescription(agentSlug);
        if ((d as { success: boolean }).success) setMetaDescription((d as { success: true; metaDescription: string }).metaDescription);
        setTimeout(()=>setGlowDesc(false), 900);
      } catch {}
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="text-sm text-zinc-700">Meta Title</div>
        <div className={`relative`}>
          <Input value={metaTitle} onChange={(e)=>setMetaTitle(e.target.value)} placeholder="e.g. Bharat Vasireddy | Real Estate Agent in Hyderabad" className={glowTitle ? 'animate-pulse ring-2 ring-brand-soft' : ''} />
          <button type="button" onClick={onGenerate} className="absolute right-2 top-1/2 -translate-y-1/2 h-7 px-2 rounded-md border border-brand text-brand hover:bg-brand-soft text-xs">AI</button>
        </div>
        <div className="text-xs text-zinc-500">Recommended: up to 60 characters</div>
      </div>
      <div className="space-y-1">
        <div className="text-sm text-zinc-700">Meta Description</div>
        <div className="relative">
          <Textarea value={metaDescription} onChange={(e)=>setMetaDescription(e.target.value)} rows={4} placeholder="Short summary shown in search results" className={glowDesc ? 'animate-pulse ring-2 ring-brand-soft' : ''} />
          <button type="button" onClick={onGenerate} className="absolute right-2 bottom-2 h-7 px-2 rounded-md border border-brand text-brand hover:bg-brand-soft text-xs">AI</button>
        </div>
        <div className="text-xs text-zinc-500">{remain} characters remaining (recommended up to 160)</div>
      </div>
      <div className="pt-2 flex items-center gap-2">
        <button onClick={onSave} disabled={isPending} className="h-9 px-4 rounded-md bg-brand text-white hover:bg-brand-hover disabled:opacity-50">
          {isPending ? 'Saving…' : 'Save changes' }
        </button>
        <button onClick={onGenerate} disabled={isPending} className="h-9 px-4 rounded-md border border-brand text-brand hover:bg-brand-soft disabled:opacity-50">
          {isPending ? 'Generating…' : 'Generate with AI' }
        </button>
      </div>
    </div>
  );
}


