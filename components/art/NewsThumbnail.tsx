import type { NewsArticle } from "@/lib/data/types";

const schemes: Record<
  NewsArticle["topic"],
  { from: string; to: string; motif: "grid" | "peaks" | "orbit" | "leaf" }
> = {
  product: { from: "#23225b", to: "#12a2cd", motif: "grid" },
  certification: { from: "#1b1a47", to: "#4a6fa5", motif: "peaks" },
  market: { from: "#17465d", to: "#2cbae2", motif: "orbit" },
  sustainability: { from: "#12452c", to: "#1e8e4f", motif: "leaf" },
};

/**
 * Topic-derived article art. Generated from the article's own topic so every
 * card in a listing is visually distinct without anyone sourcing an image, and
 * it is purely decorative — the headline carries the meaning.
 */
export function NewsThumbnail({ topic }: { topic: NewsArticle["topic"] }) {
  const scheme = schemes[topic];

  return (
    <svg viewBox="0 0 320 180" className="h-full w-full" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`news-${topic}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={scheme.from} />
          <stop offset="100%" stopColor={scheme.to} />
        </linearGradient>
      </defs>

      <rect width="320" height="180" fill={`url(#news-${topic})`} />

      <g stroke="#ffffff" strokeOpacity="0.16" strokeWidth="1" fill="none">
        {scheme.motif === "grid" &&
          [0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <g key={i}>
              <path d={`M${i * 40} 0V180`} />
              <path d={`M0 ${i * 26}H320`} />
            </g>
          ))}

        {scheme.motif === "peaks" && (
          <>
            <path d="M-20 170 90 50l58 66 40-46 132 100" strokeOpacity="0.35" strokeWidth="2" />
            <path d="M-20 190 60 92l70 72 52-54 158 92" strokeOpacity="0.2" strokeWidth="2" />
          </>
        )}

        {scheme.motif === "orbit" &&
          [40, 70, 100, 130].map((r) => (
            <ellipse key={r} cx="230" cy="90" rx={r} ry={r * 0.55} strokeOpacity="0.22" />
          ))}

        {scheme.motif === "leaf" &&
          [0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              d={`M${40 + i * 60} 180C${40 + i * 60} 120 ${70 + i * 60} 90 ${100 + i * 60} 60`}
              strokeOpacity="0.28"
              strokeWidth="2"
            />
          ))}
      </g>

      {/* Everest summit motif, bottom-left, on every thumbnail */}
      <path d="M0 180 46 128l22 26 16-20 44 46Z" fill="#ffffff" fillOpacity="0.14" />
    </svg>
  );
}
