import { Dices } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="material-bar sticky top-0 z-40 border-b border-separator">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-[9px] bg-accent text-white shadow-sm">
            <Dices className="size-[18px]" strokeWidth={2.25} />
          </span>
          <div className="flex flex-col leading-none">
            <span className="text-headline">Dev Randomizer</span>
            <span className="hidden text-caption1 text-label-secondary sm:block">
              Random data for building and testing
            </span>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
