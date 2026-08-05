import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        className="btn btn-sm btn-ghost btn-circle"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" />
      </button>

      {pages.map((p, idx) => (
        <React.Fragment key={p}>
          {idx > 0 && pages[idx - 1] !== p - 1 && <span className="px-1 text-base-content/40">…</span>}
          <button
            onClick={() => onChange(p)}
            className={cn(
              "btn btn-sm btn-circle",
              p === page ? "btn-primary" : "btn-ghost"
            )}
          >
            {p}
          </button>
        </React.Fragment>
      ))}

      <button
        className="btn btn-sm btn-ghost btn-circle"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
};

export default Pagination;
