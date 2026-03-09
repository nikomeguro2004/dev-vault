import * as React from "react";

import { cn } from "@/lib/utils";

const Select = React.forwardRef<HTMLSelectElement, React.ComponentProps<"select">>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "h-10 w-full rounded-xl border border-white/25 bg-white/60 px-3 py-2 text-sm text-zinc-900 shadow-sm backdrop-blur-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 dark:border-white/15 dark:bg-zinc-900/60 dark:text-zinc-100",
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
