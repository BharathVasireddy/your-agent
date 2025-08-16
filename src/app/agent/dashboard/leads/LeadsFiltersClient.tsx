"use client";

import { useCallback, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import StageSelect, { type Stage } from "./StageSelect";

export default function LeadsFiltersClient({ initial }: { initial: { q?: string; source?: string; stage?: Stage; startDate?: string; endDate?: string; } }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [q, setQ] = useState(initial.q ?? "");
  const [source, setSource] = useState<string>(initial.source ?? "");
  const [stage, setStage] = useState<Stage | "">((initial.stage as Stage) ?? "");
  const [startDate, setStartDate] = useState<string>(initial.startDate ?? "");
  const [endDate, setEndDate] = useState<string>(initial.endDate ?? "");

  const makeQuery = useCallback(() => {
    const next = new URLSearchParams(params?.toString());
    q ? next.set("q", q) : next.delete("q");
    source ? next.set("source", source) : next.delete("source");
    stage ? next.set("stage", stage) : next.delete("stage");
    startDate ? next.set("startDate", startDate) : next.delete("startDate");
    endDate ? next.set("endDate", endDate) : next.delete("endDate");
    next.delete("page");
    return next;
  }, [params, q, source, stage, startDate, endDate]);

  const onApply = () => {
    const next = makeQuery();
    router.push(`${pathname}?${next.toString()}`);
  };

  const onReset = () => {
    setQ("");
    setSource("");
    setStage("");
    setStartDate("");
    setEndDate("");
    router.push(`${pathname}`);
  };

  // avoid unused-expression lints for JSX-only file
  void q; void source; void stage; void startDate; void endDate;

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <div className="text-xs text-zinc-500">Search</div>
        <Input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search leads" />
      </div>

      <div className="space-y-1.5">
        <div className="text-xs text-zinc-500">Source</div>
        <Select value={source || 'all'} onValueChange={(v)=> setSource(v === 'all' ? '' : v)}>
          <SelectTrigger size="sm" className="w-full">
            <SelectValue placeholder="All sources" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sources</SelectItem>
            <SelectItem value="contact-form">Contact form</SelectItem>
            <SelectItem value="property">Property</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <div className="text-xs text-zinc-500">Stage</div>
        <StageSelect value={(stage || "new") as Stage} onChange={setStage as (v: Stage)=>void} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <div className="text-xs text-zinc-500">Start</div>
          <Input type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <div className="text-xs text-zinc-500">End</div>
          <Input type="date" value={endDate} onChange={(e)=>setEndDate(e.target.value)} />
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <Button size="sm" onClick={onApply}>Apply</Button>
        <Button size="sm" variant="outline" onClick={onReset}>Reset</Button>
      </div>
    </div>
  );
}


