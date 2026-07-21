import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-16 w-full rounded-[10px] border border-separator-opaque/70 bg-surface px-3.5 py-3 text-body-ap text-label placeholder:text-label-tertiary outline-none transition-[border-color,box-shadow]",
        "focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/25",
        "disabled:opacity-40",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
