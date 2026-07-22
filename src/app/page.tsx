"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CaseSensitive, ImageIcon, Palette, Shapes } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SegmentedControl } from "@/components/segmented-control";
import { StringGenerator } from "@/components/generators/string-generator";
import { ColorGenerator } from "@/components/generators/color-generator";
import { ImageGenerator } from "@/components/generators/image-generator";
import { SvgGenerator } from "@/components/generators/svg-generator";

const TOOLS = [
  { value: "strings" as const, label: "Strings", icon: <CaseSensitive className="size-4" /> },
  { value: "colors" as const, label: "Colors", icon: <Palette className="size-4" /> },
  { value: "images" as const, label: "Images", icon: <ImageIcon className="size-4" /> },
  { value: "svg" as const, label: "SVG Patterns", icon: <Shapes className="size-4" /> },
];

type ToolId = (typeof TOOLS)[number]["value"];

export default function Home() {
  const [active, setActive] = React.useState<ToolId>("strings");

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
        <div className="scroll-thin -mx-4 flex justify-start overflow-x-auto px-4 sm:mx-0 sm:justify-center sm:px-0">
          <SegmentedControl
            layoutId="tool-nav-indicator"
            aria-label="Select tool"
            value={active}
            onValueChange={setActive}
            options={TOOLS}
          />
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.8 }}
          >
            {active === "strings" && <StringGenerator />}
            {active === "colors" && <ColorGenerator />}
            {active === "images" && <ImageGenerator />}
            {active === "svg" && <SvgGenerator />}
          </motion.div>
        </AnimatePresence>
      </main>
      <SiteFooter />
    </>
  );
}
