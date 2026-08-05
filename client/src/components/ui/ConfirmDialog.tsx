"use client";

import React from "react";
import Modal from "./Modal";
import Button from "./Button";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDestructive,
  isLoading,
  onConfirm,
  onCancel,
}) => (
  <Modal isOpen={isOpen} onClose={onCancel} size="sm">
    <div className="flex flex-col items-center text-center gap-3">
      <div
        className={`size-11 rounded-full flex items-center justify-center ${
          isDestructive ? "bg-error/10 text-error" : "bg-primary/10 text-primary"
        }`}
      >
        <AlertTriangle className="size-5" />
      </div>
      <h4 className="font-display font-semibold text-lg">{title}</h4>
      {description && <p className="text-sm text-base-content/60">{description}</p>}
      <div className="flex gap-2 w-full mt-2">
        <Button variant="outline" fullWidth onClick={onCancel} disabled={isLoading}>
          {cancelLabel}
        </Button>
        <Button
          variant={isDestructive ? "error" : "primary"}
          fullWidth
          onClick={onConfirm}
          isLoading={isLoading}
        >
          {confirmLabel}
        </Button>
      </div>
    </div>
  </Modal>
);

export default ConfirmDialog;
