import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-md border border-white/15 bg-zinc-900/30 px-3 py-2 text-sm text-zinc-100 transition-[border-color,background-color,box-shadow,transform] duration-200 ease-out placeholder:text-zinc-500 focus-visible:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300/60",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
