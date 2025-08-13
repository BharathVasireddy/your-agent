"use client";

import { useRef } from "react";
import { ChevronDown } from "lucide-react";

export default function TopFiltersClient({
  initial,
  exportUrl,
}: {
  initial: { q?: string; stage?: string; source?: string };
  exportUrl: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const debounceRef = useRef<number | null>(null);
  const onSelectChange = () => {
    // Auto-submit when dropdowns change
    formRef.current?.requestSubmit();
  };
  const onQueryChange: React.ChangeEventHandler<HTMLInputElement> = () => {
    // Debounce submit while typing
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      formRef.current?.requestSubmit();
    }, 400);
  };

  const buildExportUrl = () => {
    const p = new URLSearchParams();
    const form = formRef.current;
    if (form) {
      const q = (form.elements.namedItem('q') as HTMLInputElement)?.value || '';
      const stage = (form.elements.namedItem('stage') as HTMLSelectElement)?.value || '';
      const source = (form.elements.namedItem('source') as HTMLSelectElement)?.value || '';
      if (q) p.set('q', q);
      if (stage) p.set('stage', stage);
      if (source) p.set('source', source);
    } else {
      if (initial.q) p.set('q', initial.q);
      if (initial.stage) p.set('stage', initial.stage);
      if (initial.source) p.set('source', initial.source);
    }
    const tail = p.toString();
    return tail ? `${exportUrl}?${tail}` : exportUrl;
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-3 md:p-4 flex items-center gap-3">
      <form ref={formRef} action="?" method="get" className="flex items-center gap-3 flex-1">
        <input
          name="q"
          defaultValue={initial.q || ""}
          placeholder="Search leads"
          className="flex-1 w-full border border-zinc-300 rounded-md px-3 py-2 text-sm"
          onChange={onQueryChange}
        />
        <div className="relative">
          <select name="stage" defaultValue={initial.stage || ""} onChange={onSelectChange} className="h-9 border border-zinc-300 rounded-md pl-2 pr-8 text-sm appearance-none">
            <option value="">All stages</option>
            <option value="new">New Lead</option>
            <option value="contacted">Contacted</option>
            <option value="interested">Interested</option>
            <option value="appointment">Appointment Scheduled</option>
            <option value="negotiation">In Negotiation</option>
            <option value="offer-made">Offer Made</option>
            <option value="under-consideration">Under Consideration</option>
            <option value="won">Closed (Won)</option>
            <option value="lost">Closed (Lost)</option>
            <option value="follow-up">Follow-up</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        </div>
        <div className="relative">
          <select name="source" defaultValue={initial.source || ""} onChange={onSelectChange} className="h-9 border border-zinc-300 rounded-md pl-2 pr-8 text-sm appearance-none">
            <option value="">All sources</option>
            <option value="contact-form">Contact form</option>
            <option value="property">Property</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        </div>
      </form>
      <a href={buildExportUrl()} className="px-3 py-2 rounded-md border border-zinc-300 hover:bg-zinc-50 text-sm">Export CSV</a>
    </div>
  );
}


