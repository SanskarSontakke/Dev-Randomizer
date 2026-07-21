"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-[31px] w-[51px] shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-colors duration-200 outline-none",
        "data-[state=checked]:bg-success data-[state=unchecked]:bg-fill",
        "focus-visible:ring-2 focus-visible:ring-accent/40",
        "disabled:cursor-not-allowed disabled:opacity-40",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block size-[27px] rounded-full bg-white shadow-[0_3px_8px_rgba(0,0,0,0.25),0_1px_1px_rgba(0,0,0,0.15)] ring-0 transition-transform duration-200",
          "data-[state=checked]:translate-x-[21px] data-[state=unchecked]:translate-x-0.5"
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
