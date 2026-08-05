import React from "react";
import { cn } from "@/lib/cn";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const areaId = id || props.name;
    return (
      <div className="form-control w-full gap-1.5">
        {label && (
          <label htmlFor={areaId} className="text-sm font-medium text-base-content/80">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={areaId}
          className={cn(
            "textarea textarea-bordered w-full rounded-field bg-base-100 focus:outline-none focus:border-primary",
            error && "textarea-error",
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-error">{error}</span>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export default Textarea;
