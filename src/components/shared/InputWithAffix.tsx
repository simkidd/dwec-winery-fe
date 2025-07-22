import React from "react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

interface InputWithAffixProps
  extends Omit<React.ComponentProps<typeof Input>, "prefix"> {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

const InputWithAffix = React.forwardRef<HTMLInputElement, InputWithAffixProps>(
  ({ className, prefix, suffix, ...props }, ref) => {
    return (
      <div className={cn("relative flex items-center")}>
        {prefix && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {prefix}
          </div>
        )}
        <Input
          ref={ref}
          className={cn(
            prefix ? "pl-8" : "pl-3", // Adjust padding when prefix exists
            suffix ? "pr-8" : "pr-3", // Adjust padding when suffix exists
            className
          )}
          {...props}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {suffix}
          </div>
        )}
      </div>
    );
  }
);

InputWithAffix.displayName = "InputWithAffix";

export { InputWithAffix };
