"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
  iconClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  actionClassName?: string;
}

export const EmptyState = ({
  icon,
  title,
  description,
  action,
  className = "",
  iconClassName = "",
  titleClassName = "",
  descriptionClassName = "",
  actionClassName = "",
}: EmptyStateProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8",
        className
      )}
    >
      {icon && (
        <div className={cn("mb-4 text-muted-foreground", iconClassName)}>
          {icon}
        </div>
      )}
      <h3 className={cn("text-lg font-medium mb-2", titleClassName)}>
        {title}
      </h3>
      <p className={cn("text-muted-foreground mb-6", descriptionClassName)}>
        {description}
      </p>
      {action && <div className={actionClassName}>{action}</div>}
    </div>
  );
};
