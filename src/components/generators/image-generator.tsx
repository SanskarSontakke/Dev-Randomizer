"use client";

import * as React from "react";
import { Copy, ImageOff, ImageIcon, RotateCw } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClipboard } from "@/hooks/use-clipboard";
import { type ImageService, buildImageUrl } from "@/lib/generators";

export function ImageGenerator() {
  const copy = useClipboard();

  const [width, setWidth] = React.useState(600);
  const [height, setHeight] = React.useState(400);
  const [service, setService] = React.useState<ImageService>("picsum");
  const [grayscale, setGrayscale] = React.useState(false);
  const [blur, setBlur] = React.useState(false);
  const [text, setText] = React.useState("");

  const [url, setUrl] = React.useState("");
  const [previewSrc, setPreviewSrc] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "loaded" | "error">("idle");

  const handleGenerate = React.useCallback(() => {
    const next = buildImageUrl({ service, width, height, grayscale, blur, text });
    setUrl(next);
    setStatus("loading");
    const separator = next.includes("?") ? "&" : "?";
    setPreviewSrc(`${next}${separator}cb=${Date.now()}`);
  }, [service, width, height, grayscale, blur, text]);

  React.useEffect(() => {
    // Seed with a client-only random preview after mount to avoid an SSR/CSR hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid gap-5 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Placeholder settings</CardTitle>
          <CardDescription>Build a shareable random-image URL.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="img-width">Width</Label>
              <Input
                id="img-width"
                type="number"
                min={10}
                max={2000}
                value={width}
                onChange={(e) => setWidth(Number(e.target.value) || 10)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="img-height">Height</Label>
              <Input
                id="img-height"
                type="number"
                min={10}
                max={2000}
                value={height}
                onChange={(e) => setHeight(Number(e.target.value) || 10)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="img-service">Service</Label>
            <Select value={service} onValueChange={(v) => setService(v as ImageService)}>
              <SelectTrigger id="img-service">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="picsum">Picsum Photos (random real images)</SelectItem>
                <SelectItem value="placeholdco">Placehold.co (solid color + text)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {service === "picsum" ? (
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="img-grayscale" className="font-normal text-body-ap text-label">
                  Grayscale
                </Label>
                <Switch id="img-grayscale" checked={grayscale} onCheckedChange={setGrayscale} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="img-blur" className="font-normal text-body-ap text-label">
                  Blur
                </Label>
                <Switch id="img-blur" checked={blur} onCheckedChange={setBlur} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="img-text">Text (optional)</Label>
              <Input
                id="img-text"
                placeholder="Custom text"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
          )}

          <Button onClick={handleGenerate} className="mt-1 w-full">
            <RotateCw className="size-4" /> Generate image URL
          </Button>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 lg:col-span-3">
        <div className="flex items-center gap-1.5">
          <Input readOnly value={url} className="truncate font-mono" aria-label="Generated image URL" />
          <Button variant="secondary" onClick={() => copy(url)} disabled={!url}>
            <Copy className="size-4" /> Copy
          </Button>
        </div>

        <Card className="min-h-[320px] flex-1 overflow-hidden bg-surface-sunken p-2">
          <div className="relative flex h-full min-h-[300px] items-center justify-center overflow-hidden rounded-[8px]">
            {status !== "loaded" && (
              <div className="absolute inset-0 z-0 flex flex-col items-center justify-center gap-2 text-label-tertiary">
                {status === "error" ? (
                  <>
                    <ImageOff className="size-9" />
                    <span className="text-subheadline text-destructive">Failed to load preview</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="size-9 opacity-50" />
                    <span className="text-subheadline">Generating preview…</span>
                  </>
                )}
              </div>
            )}
            {previewSrc && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewSrc}
                alt="Generated random placeholder"
                className={`relative z-10 max-h-[480px] max-w-full rounded-[6px] object-contain shadow-sm ${status === "loaded" ? "" : "hidden"}`}
                onLoad={() => setStatus("loaded")}
                onError={() => setStatus("error")}
              />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
