"use client";

import * as React from "react";
import { Copy, RotateCw } from "lucide-react";

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
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useClipboard } from "@/hooks/use-clipboard";
import {
  type StringGeneratorOptions,
  buildCharset,
  generateLoremIpsum,
  generateRandomString,
  generateUUID,
} from "@/lib/generators";

const TOGGLES: {
  key: keyof Pick<StringGeneratorOptions, "useUpper" | "useLower" | "useNumbers" | "useSymbols">;
  label: string;
  sample: string;
}[] = [
  { key: "useUpper", label: "Uppercase", sample: "A–Z" },
  { key: "useLower", label: "Lowercase", sample: "a–z" },
  { key: "useNumbers", label: "Numbers", sample: "0–9" },
  { key: "useSymbols", label: "Symbols", sample: "!@#$…" },
];

export function StringGenerator() {
  const copy = useClipboard();

  const [length, setLength] = React.useState(16);
  const [useUpper, setUseUpper] = React.useState(true);
  const [useLower, setUseLower] = React.useState(true);
  const [useNumbers, setUseNumbers] = React.useState(true);
  const [useSymbols, setUseSymbols] = React.useState(false);
  const [customCharacters, setCustomCharacters] = React.useState("");

  const [output, setOutput] = React.useState("");
  const [uuid, setUuid] = React.useState("");
  const [loremCount, setLoremCount] = React.useState(5);
  const [loremText, setLoremText] = React.useState("");

  const options: StringGeneratorOptions = {
    length,
    useUpper,
    useLower,
    useNumbers,
    useSymbols,
    customCharacters,
  };
  const charsetEmpty = buildCharset(options).length === 0;

  const handleGenerateString = React.useCallback(() => {
    setOutput(generateRandomString(options));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length, useUpper, useLower, useNumbers, useSymbols, customCharacters]);

  const handleGenerateUuid = React.useCallback(() => setUuid(generateUUID()), []);

  const handleGenerateLorem = React.useCallback(() => {
    setLoremText(generateLoremIpsum(loremCount));
  }, [loremCount]);

  React.useEffect(() => {
    // Seed with client-only random values after mount to avoid an SSR/CSR hydration mismatch.
    /* eslint-disable react-hooks/set-state-in-effect */
    setOutput(generateRandomString(options));
    setUuid(generateUUID());
    setLoremText(generateLoremIpsum(5));
    /* eslint-enable react-hooks/set-state-in-effect */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid gap-5 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>Choose length and character sets.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="str-length">Length</Label>
              <span className="text-subheadline font-semibold tabular-nums text-accent">
                {length}
              </span>
            </div>
            <Slider
              id="str-length"
              min={1}
              max={128}
              step={1}
              value={[length]}
              onValueChange={([v]) => setLength(v)}
            />
          </div>

          <Separator />

          <div className="flex flex-col gap-3.5">
            {TOGGLES.map(({ key, label, sample }) => {
              const checked = { useUpper, useLower, useNumbers, useSymbols }[key];
              const setChecked = {
                useUpper: setUseUpper,
                useLower: setUseLower,
                useNumbers: setUseNumbers,
                useSymbols: setUseSymbols,
              }[key];
              return (
                <div key={key} className="flex items-center justify-between">
                  <Label htmlFor={key} className="flex flex-col gap-0.5 font-normal">
                    <span className="text-body-ap text-label">{label}</span>
                    <span className="text-caption1 text-label-tertiary">{sample}</span>
                  </Label>
                  <Switch id={key} checked={checked} onCheckedChange={setChecked} />
                </div>
              );
            })}
          </div>

          <Separator />

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="str-custom">Custom characters (optional)</Label>
            <Input
              id="str-custom"
              placeholder="e.g. ABC123"
              value={customCharacters}
              onChange={(e) => setCustomCharacters(e.target.value)}
              className="font-mono"
            />
          </div>

          <Button onClick={handleGenerateString} className="mt-1 w-full">
            <RotateCw className="size-4" /> Generate
          </Button>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-5 lg:col-span-3">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Output</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copy(output)}
              disabled={!output}
            >
              <Copy className="size-3.5" /> Copy
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex min-h-32 items-center justify-center rounded-[10px] bg-[#0b0b0d] px-4 py-5 shadow-inner">
              {charsetEmpty ? (
                <p className="text-center text-subheadline text-destructive">
                  Select at least one character set, or provide custom characters.
                </p>
              ) : (
                <p className="scroll-thin max-h-40 w-full overflow-y-auto text-center font-mono text-lg break-all text-success select-all">
                  {output || "Click Generate to create a string"}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-5 sm:grid-cols-2">
          <FieldWithActions
            label="UUID v4"
            value={uuid}
            onRegenerate={handleGenerateUuid}
            onCopy={() => copy(uuid)}
          />
          <FieldWithActions
            label="Lorem ipsum"
            value={loremText}
            onRegenerate={handleGenerateLorem}
            onCopy={() => copy(loremText)}
            leading={
              <Input
                type="number"
                min={1}
                max={100}
                value={loremCount}
                onChange={(e) => setLoremCount(Number(e.target.value) || 1)}
                className="w-16 shrink-0 px-2 text-center"
                aria-label="Word count"
              />
            }
          />
        </div>
      </div>
    </div>
  );
}

function FieldWithActions({
  label,
  value,
  leading,
  onRegenerate,
  onCopy,
}: {
  label: string;
  value: string;
  leading?: React.ReactNode;
  onRegenerate: () => void;
  onCopy: () => void;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-2 p-4">
        <Label className="text-footnote text-label-secondary">{label}</Label>
        <div className="flex items-center gap-1.5">
          {leading}
          <Input readOnly value={value} className="truncate font-mono" />
          <Button variant="secondary" size="icon" onClick={onRegenerate} title="Regenerate">
            <RotateCw className="size-4" />
          </Button>
          <Button variant="secondary" size="icon" onClick={onCopy} title="Copy">
            <Copy className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
