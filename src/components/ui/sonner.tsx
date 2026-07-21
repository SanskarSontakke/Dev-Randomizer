"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

function Toaster({ ...props }: ToasterProps) {
  const { resolvedTheme } = useTheme();

  return (
    <Sonner
      theme={resolvedTheme as ToasterProps["theme"]}
      position="bottom-center"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast material-thick! rounded-2xl! text-label! shadow-lg! text-subheadline!",
          description: "text-label-secondary",
          actionButton: "bg-accent! text-white!",
          cancelButton: "bg-fill! text-label!",
          success: "[&_[data-icon]]:text-success!",
          error: "[&_[data-icon]]:text-destructive!",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
