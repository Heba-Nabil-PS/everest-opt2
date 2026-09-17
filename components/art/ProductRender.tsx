import { cn } from "@/lib/utils";
import type { ProductArt } from "@/lib/data/types";

export type RenderAngle = "front" | "three-quarter" | "detail";

interface ProductRenderProps {
  art: ProductArt;
  angle?: RenderAngle;
  /** Alternative text. Pass "" only when an adjacent caption already names it. */
  alt: string;
  className?: string;
  /** Suppress the studio ground and gradient when the render sits on dark art. */
  bare?: boolean;
}

/**
 * Art-directed vector renders. Every cabinet is drawn on the same studio
 * ground, lit from the same angle and grounded with the same contact shadow,
 * so a category grid reads as one photographic set rather than a mixed bag of
 * cut-outs. Swap this component for photography by replacing it in one place.
 */
export function ProductRender({
  art,
  angle = "three-quarter",
  alt,
  className,
  bare,
}: ProductRenderProps) {
  const uid = `${art.form}-${art.doors}-${art.shelves}-${angle}`;

  return (
    <svg
      viewBox="0 0 400 460"
      className={cn("h-full w-full", className)}
      role={alt ? "img" : "presentation"}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
    >
      <defs>
        <linearGradient id={`studio-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f7fbfe" />
          <stop offset="100%" stopColor="#dfeef7" />
        </linearGradient>
        <linearGradient id={`steel-${uid}`} x1="0" y1="0" x2="1" y2="0.2">
          <stop offset="0%" stopColor="#3b3a72" />
          <stop offset="45%" stopColor="#23225b" />
          <stop offset="100%" stopColor="#191838" />
        </linearGradient>
        <linearGradient id={`side-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#14132f" />
          <stop offset="100%" stopColor="#232252" />
        </linearGradient>
        <linearGradient id={`glass-${uid}`} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#bfe9f8" stopOpacity="0.92" />
          <stop offset="38%" stopColor="#7fd2ee" stopOpacity="0.5" />
          <stop offset="62%" stopColor="#e8f8ff" stopOpacity="0.78" />
          <stop offset="100%" stopColor="#9adcf2" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id={`canopy-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2cbae2" />
          <stop offset="100%" stopColor="#12a2cd" />
        </linearGradient>
        <radialGradient id={`shadow-${uid}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#23225b" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#23225b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`led-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#74d7f2" stopOpacity="0.35" />
        </linearGradient>
      </defs>

      {!bare ? (
        <>
          <rect width="400" height="460" rx="16" fill={`url(#studio-${uid})`} />
          {/* Horizon line: the same studio sweep behind every product. */}
          <path d="M0 318h400" stroke="#c8deeb" strokeWidth="1" />
        </>
      ) : null}

      {/* Contact shadow — one light source, one grounding, on every render. */}
      <ellipse cx="200" cy="392" rx="132" ry="26" fill={`url(#shadow-${uid})`} />

      {angle === "detail" ? (
        <DetailView art={art} uid={uid} />
      ) : (
        <Cabinet art={art} uid={uid} threeQuarter={angle === "three-quarter"} />
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------------ */

function Cabinet({
  art,
  uid,
  threeQuarter,
}: {
  art: ProductArt;
  uid: string;
  threeQuarter: boolean;
}) {
  /* Real proportions drive the drawing, so a 1,500 L unit looks like one. */
  const aspect = art.ratio.width / art.ratio.height;
  const maxW = 250;
  const maxH = 300;
  const width = Math.min(maxW, maxH * aspect);
  const height = width / aspect;
  const x = 200 - width / 2 - (threeQuarter ? 14 : 0);
  const y = 380 - height;
  const sideDepth = threeQuarter ? Math.min(46, width * 0.26) : 0;

  if (art.form === "chest") return <Chest art={art} uid={uid} threeQuarter={threeQuarter} />;
  if (art.form === "watercooler") return <WaterCooler uid={uid} threeQuarter={threeQuarter} />;

  const canopyH = art.canopy ? Math.max(22, height * 0.1) : Math.max(10, height * 0.04);
  const bodyY = y + canopyH;
  const bodyH = height - canopyH;
  const plinth = Math.max(14, height * 0.06);
  /* Frame thickness scales with the cabinet so a small counter-top unit still
     reads as a steel cabinet rather than a pane of glass. */
  const doorGap = Math.max(6, width * 0.05);
  /* No doors on an upright is an open multideck: one wide opening, no handle. */
  const open = art.doors === 0;
  const bays = Math.max(art.doors, 1);
  const doorW = (width - doorGap * (bays + 1)) / bays;

  return (
    <g>
      {/* Side face gives the cabinet depth without leaving the flat style. */}
      {threeQuarter ? (
        <path
          d={`M${x + width} ${y} l${sideDepth} ${-sideDepth * 0.34} v${height} l${-sideDepth} ${sideDepth * 0.34} Z`}
          fill={`url(#side-${uid})`}
        />
      ) : null}

      {/* Cabinet shell */}
      <rect x={x} y={y} width={width} height={height} rx="8" fill={`url(#steel-${uid})`} />

      {/* Illuminated canopy, or a plain top rail when the model has none */}
      {art.canopy ? (
        <>
          <rect x={x} y={y} width={width} height={canopyH} rx="8" fill={`url(#canopy-${uid})`} />
          <rect x={x + 12} y={y + canopyH / 2 - 3} width={width * 0.42} height="6" rx="3" fill="#0b2a38" opacity="0.35" />
        </>
      ) : (
        <rect x={x} y={y} width={width} height={canopyH} rx="8" fill="#2f2e6b" />
      )}

      {/* Glazed doors with shelf lines and vertical LED pillars */}
      {Array.from({ length: bays }).map((_, index) => {
        const dx = x + doorGap + index * (doorW + doorGap);
        const dy = bodyY + 8;
        const dh = bodyH - plinth - 14;
        const shelvesPerDoor = Math.max(1, Math.round(art.shelves / bays));

        return (
          <g key={index}>
            {open ? <rect x={dx} y={dy} width={doorW} height={dh} rx="5" fill="#dff3fb" /> : null}
            <rect
              x={dx}
              y={dy}
              width={doorW}
              height={dh}
              rx="5"
              fill={`url(#glass-${uid})`}
              opacity={open ? 0.45 : 1}
            />
            <rect
              x={dx}
              y={dy}
              width={doorW}
              height={dh}
              rx="5"
              fill="none"
              stroke="#ffffff"
              strokeOpacity="0.55"
            />
            {/* Product silhouettes on the shelves */}
            {Array.from({ length: shelvesPerDoor }).map((__, shelfIndex) => {
              const sy = dy + ((shelfIndex + 1) * dh) / (shelvesPerDoor + 1);
              return (
                <g key={shelfIndex}>
                  <path
                    d={`M${dx + 6} ${sy}h${doorW - 12}`}
                    stroke="#23225b"
                    strokeOpacity="0.28"
                    strokeWidth="2"
                  />
                  {Array.from({ length: Math.max(2, Math.floor(doorW / 22)) }).map((___, bottle) => (
                    <rect
                      key={bottle}
                      x={dx + 9 + bottle * 20}
                      y={sy - 15}
                      width="12"
                      height="15"
                      rx="3"
                      fill="#23225b"
                      opacity={0.18 + (bottle % 3) * 0.05}
                    />
                  ))}
                </g>
              );
            })}
            {/* Vertical LED bars, both pillars */}
            <rect x={dx + 2} y={dy + 6} width="2.5" height={dh - 12} rx="1.25" fill={`url(#led-${uid})`} />
            <rect
              x={dx + doorW - 4.5}
              y={dy + 6}
              width="2.5"
              height={dh - 12}
              rx="1.25"
              fill={`url(#led-${uid})`}
            />
            {/* Handle, or the air-curtain grille across an open front */}
            {open ? (
              <rect x={dx + 4} y={dy + 2} width={doorW - 8} height="4" rx="2" fill="#2cbae2" opacity="0.8" />
            ) : (
              <rect
                x={dx + doorW - 12}
                y={dy + dh / 2 - 22}
                width="4"
                height="44"
                rx="2"
                fill="#eaf7fc"
                opacity="0.9"
              />
            )}
            {/* Single specular sweep across the glass — same angle every time */}
            <path
              d={`M${dx + doorW * 0.12} ${dy + dh} L${dx + doorW * 0.52} ${dy} h${doorW * 0.14} L${dx + doorW * 0.26} ${dy + dh} Z`}
              fill="#ffffff"
              opacity="0.16"
            />
          </g>
        );
      })}

      {/* Plinth and branding band */}
      <rect x={x} y={y + height - plinth} width={width} height={plinth} rx="4" fill="#131233" />
      <rect x={x + width * 0.08} y={y + height - plinth + plinth * 0.35} width={width * 0.3} height="3" rx="1.5" fill="#2cbae2" opacity="0.75" />
    </g>
  );
}

function Chest({
  art,
  uid,
  threeQuarter,
}: {
  art: ProductArt;
  uid: string;
  threeQuarter: boolean;
}) {
  const width = 260;
  const height = 150;
  const x = 200 - width / 2 - (threeQuarter ? 16 : 0);
  const y = 380 - height;
  const depth = threeQuarter ? 50 : 0;
  const glassTop = art.doors > 1;

  return (
    <g>
      {threeQuarter ? (
        <path
          d={`M${x + width} ${y} l${depth} ${-depth * 0.42} v${height} l${-depth} ${depth * 0.42} Z`}
          fill={`url(#side-${uid})`}
        />
      ) : null}
      {threeQuarter ? (
        <path
          d={`M${x} ${y} l${depth} ${-depth * 0.42} h${width} l${-depth} ${depth * 0.42} Z`}
          fill={glassTop ? `url(#glass-${uid})` : "#2f2e6b"}
        />
      ) : null}

      <rect x={x} y={y} width={width} height={height} rx="8" fill={`url(#steel-${uid})`} />
      {/* Lid seam */}
      <rect x={x + 6} y={y + 8} width={width - 12} height="10" rx="5" fill="#0f0e26" opacity="0.6" />
      {glassTop ? (
        <rect x={x + 14} y={y + 24} width={width - 28} height="34" rx="6" fill={`url(#glass-${uid})`} />
      ) : null}

      {/* Basket dividers read as the storage baskets in the spec table */}
      {Array.from({ length: art.shelves }).map((_, index) => (
        <rect
          key={index}
          x={x + 16 + index * ((width - 32) / art.shelves)}
          y={y + height - 46}
          width={(width - 32) / art.shelves - 8}
          height="28"
          rx="4"
          fill="#eaf7fc"
          opacity="0.16"
        />
      ))}

      <rect x={x} y={y + height - 16} width={width} height="16" rx="4" fill="#131233" />
      <rect x={x + width * 0.08} y={y + height - 10} width={width * 0.26} height="3" rx="1.5" fill="#2cbae2" opacity="0.75" />
      {/* Castors */}
      <circle cx={x + 26} cy={y + height + 6} r="7" fill="#0b0a1f" />
      <circle cx={x + width - 26} cy={y + height + 6} r="7" fill="#0b0a1f" />
    </g>
  );
}

function WaterCooler({ uid, threeQuarter }: { uid: string; threeQuarter: boolean }) {
  const width = 120;
  const height = 290;
  const x = 200 - width / 2 - (threeQuarter ? 12 : 0);
  const y = 380 - height;
  const depth = threeQuarter ? 34 : 0;

  return (
    <g>
      {threeQuarter ? (
        <path
          d={`M${x + width} ${y} l${depth} ${-depth * 0.4} v${height} l${-depth} ${depth * 0.4} Z`}
          fill={`url(#side-${uid})`}
        />
      ) : null}

      {/* Brushed 304 stainless body */}
      <rect x={x} y={y} width={width} height={height} rx="10" fill="#c7d3de" />
      {Array.from({ length: 9 }).map((_, index) => (
        <rect
          key={index}
          x={x + 8 + index * ((width - 16) / 9)}
          y={y + 8}
          width="1"
          height={height - 16}
          fill="#ffffff"
          opacity="0.5"
        />
      ))}

      {/* Filtration viewing panel — hygiene you can see */}
      <rect x={x + 16} y={y + 22} width={width - 32} height="70" rx="6" fill={`url(#glass-${uid})`} />
      {[0, 1, 2].map((index) => (
        <rect
          key={index}
          x={x + 24 + index * ((width - 48) / 3)}
          y={y + 32}
          width={(width - 48) / 3 - 6}
          height="50"
          rx="4"
          fill="#23225b"
          opacity="0.22"
        />
      ))}

      {/* Dispensing alcove and taps */}
      <rect x={x + 14} y={y + 130} width={width - 28} height="74" rx="6" fill="#23225b" opacity="0.9" />
      <rect x={x + 34} y={y + 140} width="6" height="26" rx="3" fill="#eaf7fc" />
      <rect x={x + width - 40} y={y + 140} width="6" height="26" rx="3" fill="#eaf7fc" />
      <rect x={x + 22} y={y + 196} width={width - 44} height="6" rx="3" fill="#8a8fa3" />

      <rect x={x} y={y + height - 18} width={width} height="18" rx="5" fill="#131233" />
      <rect x={x + 18} y={y + height - 11} width="36" height="3" rx="1.5" fill="#2cbae2" opacity="0.8" />
    </g>
  );
}

/** Close crop on the controller and door seal — the engineering detail shot. */
function DetailView({ art, uid }: { art: ProductArt; uid: string }) {
  return (
    <g>
      <rect x="46" y="70" width="308" height="280" rx="12" fill={`url(#steel-${uid})`} />
      <rect x="66" y="90" width="268" height="182" rx="8" fill={`url(#glass-${uid})`} />
      <rect x="66" y="90" width="268" height="182" rx="8" fill="none" stroke="#ffffff" strokeOpacity="0.5" />

      {/* Door seal profile */}
      <rect x="66" y="90" width="14" height="182" rx="6" fill="#0f0e26" opacity="0.55" />
      <rect x="72" y="98" width="3" height="166" rx="1.5" fill="#2cbae2" opacity="0.5" />

      {/* Controller face — the EMMD readout */}
      <rect x="96" y="292" width="150" height="40" rx="8" fill="#0b0a1f" />
      <rect x="108" y="304" width="52" height="16" rx="3" fill="#2cbae2" opacity="0.85" />
      <circle cx="186" cy="312" r="5" fill="#1e8e4f" />
      <circle cx="206" cy="312" r="5" fill="#8a8fa3" opacity="0.6" />
      <circle cx="226" cy="312" r="5" fill="#8a8fa3" opacity="0.6" />

      {/* LED pillar close-up */}
      <rect x="318" y="100" width="6" height="162" rx="3" fill={`url(#led-${uid})`} />

      {art.canopy ? (
        <rect x="46" y="70" width="308" height="26" rx="10" fill={`url(#canopy-${uid})`} />
      ) : null}
    </g>
  );
}
