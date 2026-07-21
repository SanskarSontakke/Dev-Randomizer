/**
 * Pure, framework-free generator logic for the Dev Randomizer toolset.
 * Kept isolated from React so each generator can be unit tested directly.
 */

// ---------------------------------------------------------------------------
// Random strings
// ---------------------------------------------------------------------------

export const CHARSETS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+~`|}{[]:;?><,./-=",
} as const;

export interface StringGeneratorOptions {
  length: number;
  useUpper: boolean;
  useLower: boolean;
  useNumbers: boolean;
  useSymbols: boolean;
  customCharacters?: string;
}

/** Builds the character pool for a given set of options. Empty string if nothing selected. */
export function buildCharset(options: StringGeneratorOptions): string {
  let charset = "";
  if (options.useUpper) charset += CHARSETS.upper;
  if (options.useLower) charset += CHARSETS.lower;
  if (options.useNumbers) charset += CHARSETS.numbers;
  if (options.useSymbols) charset += CHARSETS.symbols;
  if (options.customCharacters) charset += options.customCharacters;
  return charset;
}

/** Generates a cryptographically-random string from the given options. */
export function generateRandomString(options: StringGeneratorOptions): string {
  const charset = buildCharset(options);
  if (!charset) return "";

  const length = Math.max(1, Math.floor(options.length));
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);

  let result = "";
  for (let i = 0; i < length; i++) {
    result += charset[randomValues[i] % charset.length];
  }
  return result;
}

/** RFC 4122 v4 UUID, using the platform's crypto source. */
export function generateUUID(): string {
  if (typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID (e.g. insecure contexts).
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0"));
  return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex
    .slice(6, 8)
    .join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10, 16).join("")}`;
}

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "eu", "fugiat", "nulla", "pariatur", "excepteur",
  "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui",
  "officia", "deserunt", "mollit", "anim", "id", "est", "laborum",
] as const;

/** Generates a run of `count` lorem-ipsum words, capitalized and period-terminated. */
export function generateLoremIpsum(count: number, random = Math.random): string {
  const clamped = Math.min(Math.max(Math.floor(count) || 1, 1), 100);
  const words: string[] = [];
  for (let i = 0; i < clamped; i++) {
    const word = LOREM_WORDS[Math.floor(random() * LOREM_WORDS.length)];
    words.push(i === 0 ? word[0].toUpperCase() + word.slice(1) : word);
  }
  return `${words.join(" ")}.`;
}

// ---------------------------------------------------------------------------
// Color generation
// ---------------------------------------------------------------------------

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

/** Converts HSL (0-360, 0-100, 0-100) to 8-bit RGB. */
export function hslToRgb(h: number, s: number, l: number): RGB {
  const hue = ((h % 360) + 360) % 360 / 360;
  const sat = s / 100;
  const light = l / 100;

  if (sat === 0) {
    const v = Math.round(light * 255);
    return { r: v, g: v, b: v };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };

  const q = light < 0.5 ? light * (1 + sat) : light + sat - light * sat;
  const p = 2 * light - q;

  return {
    r: Math.round(hue2rgb(p, q, hue + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, hue) * 255),
    b: Math.round(hue2rgb(p, q, hue - 1 / 3) * 255),
  };
}

export function rgbToHex({ r, g, b }: RGB): string {
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
}

export function rgbString({ r, g, b }: RGB): string {
  return `rgb(${r}, ${g}, ${b})`;
}

export function hslString({ h, s, l }: HSL): string {
  return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
}

export interface GeneratedColor {
  h: number;
  s: number;
  l: number;
  rgb: RGB;
  hex: string;
}

/** Produces a random, well-saturated color (avoids murky mid-grays). */
export function generateRandomColor(random = Math.random): GeneratedColor {
  const h = Math.floor(random() * 360);
  const s = Math.floor(random() * 60) + 40; // 40-100%
  const l = Math.floor(random() * 60) + 20; // 20-80%
  const rgb = hslToRgb(h, s, l);
  return { h, s, l, rgb, hex: rgbToHex(rgb) };
}

/** Builds a 5-step analogous/monochromatic palette around a base color. */
export function generatePalette(base: Pick<HSL, "h" | "s" | "l">): GeneratedColor[] {
  const variations: HSL[] = [
    { h: base.h, s: Math.max(0, base.s - 30), l: Math.min(100, base.l + 30) },
    { h: base.h, s: Math.max(0, base.s - 15), l: Math.min(100, base.l + 15) },
    { h: base.h, s: base.s, l: base.l },
    { h: (base.h + 30) % 360, s: base.s, l: Math.max(0, base.l - 15) },
    { h: (base.h - 30 + 360) % 360, s: base.s, l: Math.max(0, base.l - 30) },
  ];

  return variations.map(({ h, s, l }) => {
    const rgb = hslToRgb(h, s, l);
    return { h, s, l, rgb, hex: rgbToHex(rgb) };
  });
}

// ---------------------------------------------------------------------------
// Placeholder images
// ---------------------------------------------------------------------------

export type ImageService = "picsum" | "placeholdco";

export interface ImageOptions {
  service: ImageService;
  width: number;
  height: number;
  grayscale?: boolean;
  blur?: boolean;
  text?: string;
  random?: () => number;
}

/** Builds a placeholder-image URL for the requested service and options. */
export function buildImageUrl(options: ImageOptions): string {
  const random = options.random ?? Math.random;
  const width = Math.max(1, Math.round(options.width));
  const height = Math.max(1, Math.round(options.height));

  if (options.service === "picsum") {
    const randomId = Math.floor(random() * 1000);
    const params: string[] = [];
    if (options.grayscale) params.push("grayscale");
    if (options.blur) params.push("blur=2");
    const query = params.length ? `?${params.join("&")}` : "";
    return `https://picsum.photos/id/${randomId}/${width}/${height}${query}`;
  }

  const bgHue = Math.floor(random() * 360);
  const fgHue = (bgHue + 180) % 360;
  const bg = rgbToHex(hslToRgb(bgHue, 70, 80));
  const fg = rgbToHex(hslToRgb(fgHue, 80, 20));
  const base = `https://placehold.co/${width}x${height}/${bg.slice(1)}/${fg.slice(1)}/png`;
  const text = options.text?.trim();
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

// ---------------------------------------------------------------------------
// SVG pattern generation
// ---------------------------------------------------------------------------

export type SvgPatternType = "circles" | "rectangles" | "lines" | "triangles" | "paths";
export type SvgTheme = "dark" | "light";

export interface SvgPatternOptions {
  type: SvgPatternType;
  density: number; // 10-100
  theme: SvgTheme;
  width?: number;
  height?: number;
  random?: () => number;
}

/** Generates a self-contained decorative SVG pattern as a markup string. */
export function generateSvgPattern(options: SvgPatternOptions): string {
  const random = options.random ?? Math.random;
  const width = options.width ?? 800;
  const height = options.height ?? 400;
  const bgColor = options.theme === "dark" ? "#111827" : "#ffffff";

  const lines: string[] = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">`,
    `  <rect width="100%" height="100%" fill="${bgColor}"/>`,
  ];

  const numElements = Math.floor((options.density / 100) * 150) + 10;
  const baseHue = Math.floor(random() * 360);

  for (let i = 0; i < numElements; i++) {
    const h = (baseHue + Math.floor(random() * 60) - 30 + 360) % 360;
    const s = Math.floor(random() * 40) + 60;
    const l = options.theme === "dark" ? Math.floor(random() * 30) + 40 : Math.floor(random() * 30) + 60;
    const opacity = (random() * 0.5 + 0.1).toFixed(2);
    const fill = rgbToHex(hslToRgb(h, s, l));

    const x = Math.floor(random() * width);
    const y = Math.floor(random() * height);
    const size = Math.floor(random() * (120 - options.density / 2)) + 10;

    switch (options.type) {
      case "circles":
        lines.push(`  <circle cx="${x}" cy="${y}" r="${size / 2}" fill="${fill}" opacity="${opacity}" />`);
        break;
      case "rectangles": {
        const rectHeight = random() > 0.5 ? size : size * (random() + 0.5);
        const rx = random() > 0.7 ? size * 0.2 : 0;
        const rotation = Math.floor(random() * 90);
        lines.push(
          `  <rect x="${x}" y="${y}" width="${size}" height="${rectHeight.toFixed(1)}" rx="${rx.toFixed(1)}" fill="${fill}" opacity="${opacity}" transform="rotate(${rotation} ${x} ${y})" />`
        );
        break;
      }
      case "lines": {
        const x2 = x + (random() * size * 3 - size * 1.5);
        const y2 = y + (random() * size * 3 - size * 1.5);
        const strokeWidth = Math.max(1, Math.floor(random() * 8));
        lines.push(
          `  <line x1="${x}" y1="${y}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${fill}" stroke-width="${strokeWidth}" opacity="${opacity}" stroke-linecap="round" />`
        );
        break;
      }
      case "triangles": {
        const x2 = x + size;
        const y2 = y;
        const x3 = x + size / 2;
        const y3 = y - size;
        const rotation = Math.floor(random() * 360);
        lines.push(
          `  <polygon points="${x},${y} ${x2},${y2} ${x3},${y3}" fill="${fill}" opacity="${opacity}" transform="rotate(${rotation} ${x + size / 2} ${y - size / 2})" />`
        );
        break;
      }
      case "paths": {
        const cp1x = x + (random() * 200 - 100);
        const cp1y = y + (random() * 200 - 100);
        const cp2x = x + (random() * 200 - 100);
        const cp2y = y + (random() * 200 - 100);
        const endX = x + (random() * 300 - 150);
        const endY = y + (random() * 300 - 150);
        const strokeWidth = Math.max(2, Math.floor(random() * 10));
        lines.push(
          `  <path d="M ${x} ${y} C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${endX.toFixed(1)} ${endY.toFixed(1)}" stroke="${fill}" stroke-width="${strokeWidth}" fill="none" opacity="${opacity}" stroke-linecap="round" />`
        );
        break;
      }
    }
  }

  lines.push("</svg>");
  return lines.join("\n");
}

export function densityLabel(density: number): "Sparse" | "Medium" | "Dense" {
  if (density < 30) return "Sparse";
  if (density > 70) return "Dense";
  return "Medium";
}
