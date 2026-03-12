import * as React from "react";

import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-white/20 bg-transparent px-2.5 py-1 text-xs font-medium text-zinc-200 transition-[border-color,background-color,color,transform] duration-200 ease-out hover:border-white/35 hover:bg-white/10",
        className,
      )}
      {...props}
    />
  );
}
