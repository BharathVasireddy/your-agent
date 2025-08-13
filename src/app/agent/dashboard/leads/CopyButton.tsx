"use client";

import { useState } from "react";
import { Clipboard, Check } from "lucide-react";

export default function CopyButton({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-zinc-300 hover:bg-zinc-50"
      title={label || 'Copy'}
    >
      {copied ? <Check className="h-4 w-4 text-green-600" /> : <Clipboard className="h-4 w-4 text-zinc-600" />}
    </button>
  );
}


