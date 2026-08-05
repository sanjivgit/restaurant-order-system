import React from "react";
import { cn } from "@/lib/cn";

interface Option {
  label: string;
  value: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Option[];
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, id, ...props }, ref) => {
    const selectId = id || props.name;
    return (
      <div className="form-control w-full gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-base-content/80">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "select select-bordered w-full rounded-field bg-base-100 focus:outline-none focus:border-primary",
            error && "select-error",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className="text-xs text-error">{error}</span>}
      </div>
    );
  }
);
Select.displayName = "Select";

export default Select;
