import * as React from "react";

import { cn } from "@/lib/utils";

const Select = React.forwardRef<HTMLSelectElement, React.ComponentProps<"select">>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "h-10 w-full rounded-md border border-white/15 bg-zinc-900/30 px-3 py-2 text-sm text-zinc-100 transition-[border-color,background-color,box-shadow,transform] duration-200 ease-out focus-visible:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300/60",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  ),
);
Select.displayName = "Select";

export { Select };
