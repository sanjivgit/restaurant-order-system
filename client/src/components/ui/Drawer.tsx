"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  side?: "left" | "right" | "bottom";
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, title, children, side = "right" }) => {
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const panelPosition =
    side === "right"
      ? "right-0 top-0 h-full w-full sm:w-[420px]"
      : side === "left"
      ? "left-0 top-0 h-full w-full sm:w-[420px]"
      : "left-0 bottom-0 w-full max-h-[85vh] rounded-t-box";

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-neutral/50" onClick={onClose} />
      <div
        className={cn(
          "absolute bg-base-100 shadow-xl border-base-300 flex flex-col",
          panelPosition,
          side !== "bottom" && "border-l"
        )}
      >
        {title && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-base-300 shrink-0">
            <h3 className="font-display text-lg font-semibold">{title}</h3>
            <button onClick={onClose} aria-label="Close" className="btn btn-ghost btn-sm btn-circle">
              <X className="size-4" />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default Drawer;
