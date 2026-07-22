import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-[0.95rem] font-semibold tracking-[-0.01em] transition-[transform,background-color,opacity] duration-150 press-scale disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
  {
    variants: {
      variant: {
        default: "bg-accent text-white shadow-sm hover:brightness-105",
        secondary:
          "bg-fill text-label hover:bg-fill-secondary",
        outline:
          "border border-separator-opaque bg-transparent text-label hover:bg-fill",
        ghost: "bg-transparent text-accent hover:bg-fill",
        destructive: "bg-destructive text-white hover:brightness-105",
      },
      size: {
        default: "h-[46px] px-5",
        sm: "h-9 px-3.5 text-[0.85rem]",
        lg: "h-[52px] px-7 text-[1.05rem]",
        icon: "h-10 w-10 rounded-full p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
