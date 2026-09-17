import { cn } from "@/lib/utils";

export type HairStyle = "short" | "side" | "bun" | "long";

export interface AvatarLook {
  hairStyle: HairStyle;
  /** Background gradient stops. */
  ground: [string, string];
}

/**
 * Professional placeholder portrait: a clean silhouette on a brand gradient,
 * used until approved headshots are supplied. No facial features, so it reads
 * as a neutral corporate avatar rather than a cartoon. Pure SVG — crisp at any
 * size, no image request.
 */
export function PersonAvatar({ look, className, id }: { look: AvatarLook; className?: string; id: string }) {
  const bg = `avatar-bg-${id}`;
  const figure = `avatar-fig-${id}`;
  const { hairStyle } = look;

  return (
    <svg viewBox="0 0 400 500" aria-hidden="true" className={cn("h-full w-full", className)} preserveAspectRatio="xMidYMax slice">
      <defs>
        <linearGradient id={bg} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={look.ground[0]} />
          <stop offset="100%" stopColor={look.ground[1]} />
        </linearGradient>
        <linearGradient id={figure} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.7" />
        </linearGradient>
      </defs>

      <rect width="400" height="500" fill={`url(#${bg})`} />
      {/* Engineering grid and concentric rings, echoing the site's grounds */}
      <g stroke="#fff" strokeOpacity="0.07" strokeWidth="1">
        {Array.from({ length: 9 }, (_, i) => (
          <path key={`v${i}`} d={`M${i * 50} 0V500`} />
        ))}
        {Array.from({ length: 11 }, (_, i) => (
          <path key={`h${i}`} d={`M0 ${i * 50}H400`} />
        ))}
      </g>
      <circle cx="200" cy="215" r="130" fill="#fff" opacity="0.1" />
      <circle cx="200" cy="215" r="170" fill="none" stroke="#fff" strokeOpacity="0.16" strokeWidth="1.5" />

      <g fill={`url(#${figure})`}>
        {/* Long hair sits behind the shoulders */}
        {hairStyle === "long" ? <path d="M132 200c0-66 30-104 68-104s68 38 68 104v116H132Z" /> : null}
        {hairStyle === "bun" ? <circle cx="200" cy="96" r="28" /> : null}

        {/* Shoulders, neck and head as one continuous silhouette */}
        <path d="M58 500c0-96 60-150 142-150s142 54 142 150Z" />
        <rect x="178" y="290" width="44" height="80" rx="20" />
        <ellipse cx="200" cy="215" rx="64" ry="80" />

        {/* Hair volume that changes the outline */}
        {hairStyle === "short" ? <path d="M134 212c-4-60 26-94 66-94s72 32 66 94c-10-26-32-40-66-40s-56 14-66 40Z" /> : null}
        {hairStyle === "side" ? <path d="M132 220c-8-66 26-106 70-106 42 0 74 34 66 98-20-32-52-48-100-40-16 10-28 26-36 48Z" /> : null}
        {hairStyle === "bun" ? <path d="M134 214c-4-60 28-96 66-96s70 36 66 96c-10-36-34-56-66-56s-56 20-66 56Z" /> : null}
        {hairStyle === "long" ? <path d="M132 226c-4-66 28-106 68-106s72 40 68 106c-12-44-38-68-68-68s-56 24-68 68Z" /> : null}
      </g>

      {/* Collar detail so the figure reads as business dress */}
      <path d="M170 360l30 56 30-56" fill="none" stroke={look.ground[1]} strokeOpacity="0.45" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
