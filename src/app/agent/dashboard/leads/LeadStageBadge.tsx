"use client";

import { cn } from "@/lib/utils";
import type { Stage } from "./StageSelect";

const LABELS: Record<Stage, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  won: "Closed (Won)",
  lost: "Closed (Lost)",
};

const COLORS: Record<Stage, string> = {
  new: "bg-zinc-50 text-zinc-700 border-zinc-200",
  contacted: "bg-blue-50 text-blue-700 border-blue-200",
  qualified: "bg-amber-50 text-amber-800 border-amber-200",
  won: "bg-green-50 text-green-700 border-green-200",
  lost: "bg-red-50 text-red-700 border-red-200",
};

export default function LeadStageBadge({ stage }: { stage: Stage }) {
  const label = LABELS[stage] ?? stage;
  const color = COLORS[stage] ?? COLORS.new;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium",
        color
      )}
    >
      {label}
    </span>
  );
}


