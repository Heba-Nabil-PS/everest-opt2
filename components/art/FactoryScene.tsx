import { cn } from "@/lib/utils";

/**
 * Hero scene: the Sharjah assembly line seen down its length — roof trusses,
 * gantry lighting, cabinets moving through final assembly. Drawn rather than
 * photographed so the brand holds until the real factory shoot lands, and
 * composed to the same one-light-source rule as the product renders.
 */
export function FactoryScene({ className, alt }: { className?: string; alt: string }) {
  return (
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      className={cn("h-full w-full", className)}
      role="img"
      aria-label={alt}
    >
      <defs>
        <linearGradient id="fs-air" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#1c1b45" />
          <stop offset="55%" stopColor="#23225b" />
          <stop offset="100%" stopColor="#0e0d26" />
        </linearGradient>
        <linearGradient id="fs-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2963" />
          <stop offset="100%" stopColor="#121130" />
        </linearGradient>
        <linearGradient id="fs-glow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2cbae2" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#2cbae2" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="fs-cab" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3a3980" />
          <stop offset="100%" stopColor="#1d1c48" />
        </linearGradient>
        <linearGradient id="fs-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9adcf2" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#2cbae2" stopOpacity="0.25" />
        </linearGradient>
        <radialGradient id="fs-lamp" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#d8f3fd" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#d8f3fd" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1440" height="900" fill="url(#fs-air)" />

      {/* Roof trusses receding to the vanishing point */}
      <g stroke="#6d8dbc" strokeOpacity="0.35" strokeWidth="2" fill="none">
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const t = i / 5;
          const half = 700 - t * 470;
          const y = 60 + t * 170;
          return (
            <g key={i}>
              <path d={`M${720 - half} ${y} H${720 + half}`} />
              <path d={`M${720 - half} ${y} l${half * 0.5} ${-38 + t * 24} H${720 + half * 0.5} Z`} opacity="0.5" />
            </g>
          );
        })}
        <path d="M20 60 L250 230" />
        <path d="M1420 60 L1190 230" />
      </g>

      {/* Gantry lamps */}
      {[
        { x: 720, y: 120, r: 190 },
        { x: 420, y: 180, r: 150 },
        { x: 1020, y: 180, r: 150 },
      ].map((lamp, i) => (
        <circle key={i} cx={lamp.x} cy={lamp.y} r={lamp.r} fill="url(#fs-lamp)" opacity="0.35" />
      ))}

      {/* Rear wall and bay doors */}
      <rect x="470" y="230" width="500" height="180" fill="#191838" />
      <rect x="560" y="284" width="140" height="126" rx="4" fill="#0d0c22" />
      <rect x="740" y="284" width="140" height="126" rx="4" fill="#0d0c22" />

      {/* Floor */}
      <path d="M0 900 L0 470 L1440 470 L1440 900Z" fill="url(#fs-floor)" />
      {/* Conveyor centre line running to the vanishing point */}
      <path d="M640 470 L120 900 M800 470 L1320 900" stroke="#2cbae2" strokeOpacity="0.28" strokeWidth="3" />
      <path d="M690 470 L470 900 M750 470 L970 900" stroke="#6d8dbc" strokeOpacity="0.2" strokeWidth="2" />

      {/* Cabinets on the line — larger as they come toward the camera */}
      {[
        { x: 700, y: 470, s: 0.34 },
        { x: 620, y: 520, s: 0.5 },
        { x: 505, y: 592, s: 0.72 },
        { x: 330, y: 690, s: 1 },
        { x: 900, y: 540, s: 0.56 },
        { x: 1040, y: 622, s: 0.8 },
      ].map((cab, i) => {
        const w = 150 * cab.s;
        const h = 250 * cab.s;
        return (
          <g key={i} transform={`translate(${cab.x - w / 2} ${cab.y - h})`}>
            <rect width={w} height={h} rx={6 * cab.s} fill="url(#fs-cab)" />
            <rect
              x={w * 0.08}
              y={h * 0.12}
              width={w * 0.84}
              height={h * 0.72}
              rx={4 * cab.s}
              fill="url(#fs-glass)"
            />
            <rect x={w * 0.08} y={0} width={w * 0.84} height={h * 0.08} rx={3 * cab.s} fill="#2cbae2" opacity="0.8" />
            {[1, 2, 3, 4].map((shelf) => (
              <rect
                key={shelf}
                x={w * 0.12}
                y={h * 0.12 + (shelf * h * 0.72) / 5}
                width={w * 0.76}
                height={2 * cab.s}
                fill="#23225b"
                opacity="0.4"
              />
            ))}
            <ellipse cx={w / 2} cy={h + 6 * cab.s} rx={w * 0.62} ry={8 * cab.s} fill="#0b0a1f" opacity="0.5" />
          </g>
        );
      })}

      {/* Overhead light spill onto the floor */}
      <path d="M560 470 L880 470 L1180 900 L260 900Z" fill="url(#fs-glow)" opacity="0.16" />

      {/* Foreground haze so the headline always sits on a calm ground */}
      <rect y="600" width="1440" height="300" fill="#0b0a1f" opacity="0.35" />
    </svg>
  );
}
