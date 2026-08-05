import React from "react";
import { cn } from "@/lib/cn";

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const Avatar: React.FC<{ name: string; size?: "sm" | "md" | "lg"; className?: string }> = ({
  name,
  size = "md",
  className,
}) => {
  const sizeClass = { sm: "size-8 text-xs", md: "size-10 text-sm", lg: "size-14 text-base" }[size];
  return (
    <div
      className={cn(
        "rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold font-display shrink-0",
        sizeClass,
        className
      )}
    >
      {initials(name || "?")}
    </div>
  );
};

export default Avatar;
