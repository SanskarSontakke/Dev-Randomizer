export function SiteFooter() {
  return (
    <footer className="border-t border-separator">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-1 px-4 py-6 text-center sm:px-6">
        <p className="text-footnote text-label-secondary">
          Dev Randomizer — random strings, colors, images, and SVG patterns for
          building and testing.
        </p>
        <p className="text-caption1 text-label-tertiary">
          All generation runs locally in your browser. Placeholder images are
          fetched from Picsum Photos and Placehold.co.
        </p>
      </div>
    </footer>
  );
}
