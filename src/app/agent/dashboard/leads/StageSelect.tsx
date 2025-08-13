"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type Stage = 'new' | 'contacted' | 'qualified' | 'won' | 'lost';

export default function StageSelect({ value, onChange, size = "sm" }: { value: Stage; onChange: (next: Stage)=>void; size?: 'sm'|'default' }) {
  return (
    <Select value={value} onValueChange={(v)=>onChange(v as Stage)}>
      <SelectTrigger size={size} className="min-w-[9rem]">
        <SelectValue placeholder="Stage" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="new">New</SelectItem>
        <SelectItem value="contacted">Contacted</SelectItem>
        <SelectItem value="qualified">Qualified</SelectItem>
        <SelectItem value="won">Won</SelectItem>
        <SelectItem value="lost">Lost</SelectItem>
      </SelectContent>
    </Select>
  );
}


