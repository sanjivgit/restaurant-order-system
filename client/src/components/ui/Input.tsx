import React from "react";
import { cn } from "@/lib/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, className, id, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="form-control w-full gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-base-content/80">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "input input-bordered w-full rounded-field bg-base-100 focus:outline-none focus:border-primary",
              leftIcon && "pl-10",
              error && "input-error",
              className
            )}
            {...props}
          />
        </div>
        {error ? (
          <span className="text-xs text-error">{error}</span>
        ) : hint ? (
          <span className="text-xs text-base-content/50">{hint}</span>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";

export default Input;
