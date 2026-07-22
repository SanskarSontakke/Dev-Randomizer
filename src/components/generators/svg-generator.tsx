"use client";

import * as React from "react";
import { Copy, Download, Moon, RotateCw, Sun } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SegmentedControl } from "@/components/segmented-control";
import { useClipboard } from "@/hooks/use-clipboard";
import {
  type SvgPatternType,
  type SvgTheme,
  densityLabel,
  generateSvgPattern,
} from "@/lib/generators";

const PATTERN_OPTIONS: { value: SvgPatternType; label: string }[] = [
  { value: "circles", label: "Circles" },
  { value: "rectangles", label: "Rectangles" },
  { value: "lines", label: "Lines" },
  { value: "triangles", label: "Triangles" },
  { value: "paths", label: "Curved paths" },
];

const THEME_OPTIONS = [
  { value: "dark" as const, label: "Dark", icon: <Moon className="size-3.5" /> },
  { value: "light" as const, label: "Light", icon: <Sun className="size-3.5" /> },
];

export function SvgGenerator() {
  const copy = useClipboard();

  const [type, setType] = React.useState<SvgPatternType>("circles");
  const [density, setDensity] = React.useState(40);
  const [theme, setTheme] = React.useState<SvgTheme>("dark");
  const [svgCode, setSvgCode] = React.useState("");

  const handleGenerate = React.useCallback(() => {
    setSvgCode(generateSvgPattern({ type, density, theme }));
  }, [type, density, theme]);

  React.useEffect(() => {
    // Seed with a client-only random pattern after mount to avoid an SSR/CSR hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDownload = React.useCallback(() => {
    if (!svgCode) return;
    const blob = new Blob([svgCode], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `pattern-${Math.floor(Date.now() / 1000)}.svg`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }, [svgCode]);

  return (
    <div className="grid gap-5 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Pattern style</CardTitle>
          <CardDescription>Generate a decorative SVG background.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="svg-type">Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as SvgPatternType)}>
              <SelectTrigger id="svg-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PATTERN_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="svg-density">Density</Label>
              <span className="text-subheadline font-semibold text-accent">
                {densityLabel(density)}
              </span>
            </div>
            <Slider
              id="svg-density"
              min={10}
              max={100}
              value={[density]}
              onValueChange={([v]) => setDensity(v)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Base theme</Label>
            <SegmentedControl
              layoutId="svg-theme-indicator"
              aria-label="Base theme"
              value={theme}
              onValueChange={setTheme}
              options={THEME_OPTIONS}
            />
          </div>

          <Button onClick={handleGenerate} className="mt-1 w-full">
            <RotateCw className="size-4" /> Generate SVG
          </Button>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 lg:col-span-3">
        <div className="flex items-center justify-between">
          <h3 className="text-headline">Preview</h3>
          <div className="flex gap-1.5">
            <Button variant="ghost" size="sm" onClick={() => copy(svgCode)} disabled={!svgCode}>
              <Copy className="size-3.5" /> Copy code
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDownload} disabled={!svgCode}>
              <Download className="size-3.5" /> Download
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden p-0">
          <div
            className="flex h-64 items-center justify-center bg-surface-sunken"
            dangerouslySetInnerHTML={{ __html: svgCode }}
          />
          <Textarea
            readOnly
            value={svgCode}
            className="scroll-thin h-36 resize-none rounded-none border-x-0 border-b-0 bg-[#0b0b0d] font-mono text-caption1 text-success"
          />
        </Card>
      </div>
    </div>
  );
}
