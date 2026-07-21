"use client";

import * as React from "react";
import { Copy, RotateCw } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useClipboard } from "@/hooks/use-clipboard";
import {
  type GeneratedColor,
  generatePalette,
  generateRandomColor,
  hslString,
  rgbString,
} from "@/lib/generators";

export function ColorGenerator() {
  const copy = useClipboard();
  const [color, setColor] = React.useState<GeneratedColor | null>(null);
  const [palette, setPalette] = React.useState<GeneratedColor[]>([]);

  const handleGenerate = React.useCallback(() => {
    const next = generateRandomColor();
    setColor(next);
    setPalette(generatePalette(next));
  }, []);

  React.useEffect(() => {
    // Seed with a client-only random color after mount to avoid an SSR/CSR hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    handleGenerate();
  }, [handleGenerate]);

  return (
    <div className="grid gap-5 md:grid-cols-5">
      <Card className="flex flex-col items-center justify-center gap-6 p-8 md:col-span-2">
        <div
          className="size-44 rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.18)] ring-4 ring-surface transition-colors duration-300"
          style={{ backgroundColor: color?.hex ?? "#007AFF" }}
        />
        <Button onClick={handleGenerate} className="w-full max-w-52">
          <RotateCw className="size-4" /> Generate color
        </Button>
      </Card>

      <div className="flex flex-col gap-5 md:col-span-3">
        <Card>
          <CardContent className="flex flex-col divide-y divide-separator p-4">
            <ColorValueRow
              label="HEX"
              value={color?.hex ?? ""}
              onCopy={() => color && copy(color.hex)}
            />
            <ColorValueRow
              label="RGB"
              value={color ? rgbString(color.rgb) : ""}
              onCopy={() => color && copy(rgbString(color.rgb))}
            />
            <ColorValueRow
              label="HSL"
              value={color ? hslString(color) : ""}
              onCopy={() => color && copy(hslString(color))}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="mb-3 text-footnote text-label-secondary">
              Palette — tap a swatch to copy and preview
            </p>
            <div className="flex gap-2">
              {palette.map((swatch, i) => (
                <Tooltip key={i}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => {
                        setColor(swatch);
                        copy(swatch.hex);
                      }}
                      className="press-scale h-11 flex-1 rounded-[9px] ring-1 ring-inset ring-black/5 transition-transform hover:scale-105"
                      style={{ backgroundColor: swatch.hex }}
                      aria-label={`Use and copy ${swatch.hex}`}
                    />
                  </TooltipTrigger>
                  <TooltipContent>{swatch.hex}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ColorValueRow({
  label,
  value,
  onCopy,
}: {
  label: string;
  value: string;
  onCopy: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
      <div className="flex flex-col gap-0.5">
        <span className="text-caption1 font-semibold tracking-wide text-label-tertiary uppercase">
          {label}
        </span>
        <span className="font-mono text-title3 text-label">{value}</span>
      </div>
      <Button variant="secondary" size="icon" onClick={onCopy} title={`Copy ${label}`}>
        <Copy className="size-4" />
      </Button>
    </div>
  );
}
