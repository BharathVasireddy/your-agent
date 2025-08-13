"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import UpdateLeadDialog from "../UpdateLeadDialog";
import type { Stage } from "../StageSelect";

export default function UpdateLeadInlineClient({ leadId, initialStage }: { leadId: string; initialStage: Stage }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="default" size="sm" onClick={()=>setOpen(true)}>Update</Button>
      <UpdateLeadDialog open={open} onClose={()=>setOpen(false)} leadId={leadId} initialStage={initialStage} />
    </>
  );
}


