import React from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/cn";

export const Spinner: React.FC<{ className?: string; label?: string }> = ({ className, label }) => (
  <div className="flex flex-col items-center justify-center gap-2 py-10 text-base-content/60">
    <Loader2 className={cn("size-6 animate-spin text-primary", className)} />
    {label && <p className="text-sm">{label}</p>}
  </div>
);

export const ErrorState: React.FC<{ title?: string; description?: string; onRetry?: () => void }> = ({
  title = "Something went wrong",
  description = "That didn't load. Give it another try.",
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center text-center px-6 py-10 gap-3">
    <div className="size-12 rounded-full bg-error/10 flex items-center justify-center text-error">
      <AlertTriangle className="size-6" />
    </div>
    <div className="space-y-1">
      <p className="font-display font-semibold">{title}</p>
      <p className="text-sm text-base-content/60 max-w-xs">{description}</p>
    </div>
    {onRetry && (
      <button onClick={onRetry} className="btn btn-outline btn-sm rounded-field">
        Try again
      </button>
    )}
  </div>
);

export default Spinner;
