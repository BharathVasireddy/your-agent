"use client";

import { useState, useTransition } from "react";
import { addLeadNote, updateLeadStage } from "@/app/actions";
import StageSelect, { type Stage } from "./StageSelect";

export default function LeadRowClient({ leadId, initialStage, message }: { leadId: string; initialStage: Stage; message?: string }) {
  const [stage, setStage] = useState<Stage>(initialStage);
  const [note, setNote] = useState("");
  const [isPending, startTransition] = useTransition();
  const [timeline, setTimeline] = useState<Array<{ id: string; text: string; createdAt: string; author: string }>>([]);

  const saveStage = (next: Stage) => {
    setStage(next);
    startTransition(async () => {
      try { await updateLeadStage(leadId, next as 'new'|'contacted'|'qualified'|'won'|'lost'); } catch {}
    });
  };

  const saveNote = () => {
    const text = note.trim();
    if (!text) return;
    startTransition(async () => {
      try {
        const res = await addLeadNote(leadId, text);
        const maybe = res as unknown as { note?: { id: string; text: string; createdAt: string | Date; author: string } };
        if (maybe?.note) {
          const n = maybe.note;
          setTimeline((prev)=>[
            { id: n.id, text: n.text, createdAt: new Date(n.createdAt).toLocaleString(), author: n.author },
            ...prev,
          ]);
        }
        setNote("");
      } catch {}
    });
  };

  return (
    <div className="flex flex-col gap-2 md:gap-1">
      <div className="flex items-center gap-2 text-xs">
        <StageSelect value={stage} onChange={(next)=>saveStage(next)} />
        {isPending && <span className="text-zinc-500">Saving…</span>}
      </div>
      <div className="flex items-center gap-2">
        <input placeholder="Add note" value={note} onChange={(e)=>setNote(e.target.value)} className="flex-1 max-w-[560px] border border-zinc-300 rounded px-2 h-8 text-sm" />
        <button onClick={saveNote} className="h-8 px-3 bg-zinc-900 text-white rounded text-sm disabled:opacity-50" disabled={isPending || !note.trim()}>Add</button>
      </div>
      {message && <div className="text-xs text-zinc-500 line-clamp-2" title={message}>{message}</div>}
      {timeline.length > 0 && (
        <div className="mt-2">
          <div className="text-xs text-zinc-500 mb-1">Recent notes</div>
          <div className="space-y-2">
            {timeline.map((n) => (
              <div key={n.id} className="relative pl-4 text-xs">
                <div className="absolute left-0 top-1 size-2 rounded-full bg-zinc-400" />
                <div className="text-zinc-900">{n.text}</div>
                <div className="text-zinc-500">{n.createdAt} · {n.author}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


