"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import StageSelect from "./StageSelect";
import type { Stage } from "./StageSelect";

export default function UpdateLeadDialog({
  open,
  onClose,
  leadId,
  initialStage,
}: {
  open: boolean;
  onClose: () => void;
  leadId: string;
  initialStage: Stage;
}) {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>(initialStage);
  const [note, setNote] = useState("");
  const [followAt, setFollowAt] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const nowIsoLocal = (() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0,16);
  })();
  const minIso = nowIsoLocal;
  const followValid = !followAt || (followAt >= minIso);

  const onConfirm = () => {
    const text = note.trim();
    startTransition(async () => {
      try {
        const { updateLeadStage, addLeadNote, scheduleFollowupEmail } = await import("@/app/actions");
        if (stage !== initialStage) {
          await updateLeadStage(leadId, stage);
        }
        if (text) await addLeadNote(leadId, text);
        if (followAt && followAt >= minIso) await scheduleFollowupEmail(leadId, new Date(followAt).toISOString());
        onClose();
        // Refresh to reflect latest stage/notes/follow-ups
        router.refresh();
      } catch {
        onClose();
      }
    });
  };

  const Content = (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <div className="text-xs text-zinc-500">Lead stage</div>
        <StageSelect value={stage} onChange={setStage} />
      </div>
      <div className="space-y-1.5">
        <div className="text-xs text-zinc-500">Add update (optional)</div>
        <Input placeholder="Add a note about this client" value={note} onChange={(e)=>setNote(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <div className="text-xs text-zinc-500">Follow-up time (optional)</div>
        <Input type="datetime-local" min={minIso} value={followAt} onChange={(e)=>setFollowAt(e.target.value)} />
        {!followValid && <div className="text-xs text-red-600">Please choose a future date and time.</div>}
        <div className="text-xs text-zinc-500">We will send an email reminder at the specified time.</div>
      </div>
    </div>
  );

  return (
    <ConfirmDialog
      open={open}
      title="Update lead"
      description={Content}
      confirmLabel={isPending ? "Saving…" : "Save"}
      cancelLabel="Cancel"
      onConfirm={onConfirm}
      onCancel={onClose}
      confirmDisabled={isPending || !followValid}
    />
  );
}


