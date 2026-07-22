"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
  layoutId: string;
  /** Icon-only rendering; the label becomes a visually-hidden accessible name. */
  compact?: boolean;
  className?: string;
  "aria-label"?: string;
}

/**
 * Apple-style segmented control with a spring-animated shared "magic motion"
 * indicator sliding between the selected segment (rather than an ease-curve
 * fade or width transition).
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onValueChange,
  layoutId,
  compact = false,
  className,
  ...props
}: SegmentedControlProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={props["aria-label"]}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full bg-fill p-1",
        className
      )}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            aria-label={compact ? option.label : undefined}
            title={compact ? option.label : undefined}
            onClick={() => onValueChange(option.value)}
            className={cn(
              "relative flex items-center gap-1.5 whitespace-nowrap rounded-full text-subheadline font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
              compact ? "size-8 justify-center" : "px-3.5 py-1.5",
              active ? "text-label" : "text-label-secondary hover:text-label"
            )}
          >
            {active && (
              <motion.div
                layoutId={layoutId}
                transition={{ type: "spring", stiffness: 500, damping: 38, mass: 0.9 }}
                className="absolute inset-0 rounded-full bg-surface shadow-[0_1px_3px_rgba(0,0,0,0.16),0_1px_1px_rgba(0,0,0,0.08)]"
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {option.icon}
              {!compact && option.label}
              {compact && <span className="sr-only">{option.label}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}
