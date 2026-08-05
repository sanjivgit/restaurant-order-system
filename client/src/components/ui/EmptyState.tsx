import React from "react";
import { PackageOpen } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon, action }) => (
  <div className="flex flex-col items-center justify-center text-center px-6 py-10 gap-3">
    <div className="size-12 rounded-full bg-base-200 flex items-center justify-center text-base-content/40">
      {icon ?? <PackageOpen className="size-6" />}
    </div>
    <div className="space-y-1">
      <p className="font-display font-semibold text-base-content">{title}</p>
      {description && <p className="text-sm text-base-content/60 max-w-xs">{description}</p>}
    </div>
    {action}
  </div>
);

export default EmptyState;
