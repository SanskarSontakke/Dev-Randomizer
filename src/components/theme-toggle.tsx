"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";

import { SegmentedControl } from "@/components/segmented-control";

const OPTIONS = [
  { value: "system" as const, label: "System", icon: <Monitor className="size-3.5" /> },
  { value: "light" as const, label: "Light", icon: <Sun className="size-3.5" /> },
  { value: "dark" as const, label: "Dark", icon: <Moon className="size-3.5" /> },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // Defer rendering the real toggle until after mount (standard next-themes
    // pattern) since the resolved theme is unknown during server rendering.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-9 w-[104px] rounded-full bg-fill" aria-hidden />;
  }

  return (
    <SegmentedControl
      layoutId="theme-toggle-indicator"
      aria-label="Color scheme"
      value={(theme as "system" | "light" | "dark") ?? "system"}
      onValueChange={setTheme}
      options={OPTIONS}
      compact
      className="p-0.5"
    />
  );
}
