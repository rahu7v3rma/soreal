"use client";

import React from "react";
import { Badge, BadgeProps } from "@/components/shared/badge";
import { cn } from "@/lib/utils";

export function BlackBadge({ children, className, ...props }: BadgeProps) {
  return (
    <Badge
      className={cn(
        "bg-black text-white hover:bg-black/90 border-transparent",
        className
      )}
      {...props}
    >
      {children}
    </Badge>
  );
}
