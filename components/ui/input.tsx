import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-xl border border-white/25 bg-white/60 px-3 py-2 text-sm text-zinc-900 shadow-sm backdrop-blur-xl transition-colors placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 dark:border-white/15 dark:bg-zinc-900/60 dark:text-zinc-100 dark:placeholder:text-zinc-400",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
