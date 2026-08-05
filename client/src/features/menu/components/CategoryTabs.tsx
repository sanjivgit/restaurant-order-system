"use client";

import { cn } from "@/lib/cn";
import type { MenuCategory } from "@/types";

const CategoryTabs: React.FC<{
  categories: MenuCategory[];
  activeId: string | null;
  onChange: (id: string | null) => void;
}> = ({ categories, activeId, onChange }) => (
  <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
    <button
      onClick={() => onChange(null)}
      className={cn(
        "shrink-0 px-4 py-1.5 rounded-field text-sm font-medium border transition-colors",
        activeId === null
          ? "bg-primary text-primary-content border-primary"
          : "border-base-300 text-base-content/70 hover:bg-base-200"
      )}
    >
      All
    </button>
    {categories.map((cat) => (
      <button
        key={cat.id}
        onClick={() => onChange(cat.id)}
        className={cn(
          "shrink-0 px-4 py-1.5 rounded-field text-sm font-medium border transition-colors",
          activeId === cat.id
            ? "bg-primary text-primary-content border-primary"
            : "border-base-300 text-base-content/70 hover:bg-base-200"
        )}
      >
        {cat.name}
      </button>
    ))}
  </div>
);

export default CategoryTabs;
