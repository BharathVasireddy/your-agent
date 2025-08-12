"use client";

import React from "react";
import { Button } from "@/components/ui/button";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
};

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  destructive,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0"
      style={{ zIndex: 50 }}
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white shadow-template-lg">
          <div className="p-4 md:p-5 border-b border-zinc-200">
            <h3 className="text-base md:text-lg font-semibold text-zinc-950">{title}</h3>
          </div>
          {description && (
            <div className="p-4 md:p-5 text-sm text-zinc-700">{description}</div>
          )}
          <div className="p-4 md:p-5 pt-2 flex items-center justify-end gap-2">
            <Button variant="outline" onClick={onCancel} className="min-w-[96px]">
              {cancelLabel}
            </Button>
            <Button
              onClick={onConfirm}
              className="min-w-[120px]"
              variant={destructive ? "destructive" : "default"}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


