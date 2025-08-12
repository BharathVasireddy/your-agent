"use client";

import { useFormStatus } from "react-dom";

export default function PublishButton({ isPublished, disabled = false, disabledTitle }: { isPublished: boolean; disabled?: boolean; disabledTitle?: string }) {
  const { pending } = useFormStatus();
  const baseClasses = "px-4 py-2 rounded-md text-white";
  const colorClasses = isPublished
    ? "bg-zinc-700 hover:bg-zinc-800"
    : "bg-green-600 hover:bg-green-700";

  return (
    <button type="submit" disabled={pending || disabled} title={disabled ? disabledTitle : undefined} className={`${baseClasses} ${colorClasses} disabled:opacity-70`}>
      {pending ? (isPublished ? "Unpublishing..." : "Publishing...") : (isPublished ? "Unpublish" : "Publish")}
    </button>
  );
}


