"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/cn";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder = "Search…", className }) => (
  <div className={cn("relative", className)}>
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-base-content/40" />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="input input-bordered w-full rounded-field bg-base-100 pl-10 pr-9 focus:outline-none focus:border-primary"
    />
    {value && (
      <button
        onClick={() => onChange("")}
        aria-label="Clear search"
        className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs btn-circle"
      >
        <X className="size-3.5" />
      </button>
    )}
  </div>
);

export default SearchBar;
