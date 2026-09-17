import { cn } from "@/lib/utils";

/**
 * One icon family for the whole site: 24px grid, 1.5px stroke, round caps.
 * Mixing icon sets is the single fastest way to make a page look unfinished,
 * so every glyph lives here and nothing else draws inline SVG chrome.
 */
const paths = {
  arrowRight: "M5 12h14M13 6l6 6-6 6",
  arrowLeft: "M19 12H5M11 18l-6-6 6-6",
  arrowUpRight: "M7 17 17 7M9 7h8v8",
  chevronDown: "M6 9l6 6 6-6",
  chevronRight: "M9 6l6 6-6 6",
  chevronLeft: "M15 6l-6 6 6 6",
  check: "M4 12.5 9 17.5 20 6.5",
  close: "M6 6l12 12M18 6 6 18",
  menu: "M4 7h16M4 12h16M4 17h16",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.35-4.35",
  phone:
    "M15.5 21a1.5 1.5 0 0 0 1.5-1.5v-2.6a1.5 1.5 0 0 0-1.2-1.47l-2.2-.44a1.5 1.5 0 0 0-1.45.52l-.72.86a11.5 11.5 0 0 1-4.43-4.43l.86-.72a1.5 1.5 0 0 0 .52-1.45l-.44-2.2A1.5 1.5 0 0 0 6.1 6H3.5A1.5 1.5 0 0 0 2 7.5C2 14.9 8.1 21 15.5 21Z",
  mail: "M3 7.5A1.5 1.5 0 0 1 4.5 6h15A1.5 1.5 0 0 1 21 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 16.5v-9ZM3.5 7l8.5 6 8.5-6",
  pin: "M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11ZM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  download: "M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19h14",
  document: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5ZM14 3v5h5M9 13h6M9 17h4",
  shield: "M12 3 5 6v5.5c0 4.2 2.9 8 7 9.5 4.1-1.5 7-5.3 7-9.5V6l-7-3ZM9 12l2 2 4-4",
  bolt: "M13 3 5 14h6l-1 7 8-11h-6l1-7Z",
  leaf: "M20 4C10 4 4 9 4 16c0 2 .7 3.3 1.5 4C8 14 12 11.5 17 10.5 12.5 12.5 9 16 7.5 20.5c1 .3 2 .5 3 .5 6 0 9.5-5 9.5-17Z",
  snow: "M12 2v20M4.5 6.5l15 11M19.5 6.5l-15 11M12 6l-2.5-2.5M12 6l2.5-2.5M12 18l-2.5 2.5M12 18l2.5 2.5",
  gauge: "M12 20a8 8 0 1 1 8-8M12 12l4.5-3.5",
  factory: "M3 21V10l5 3V10l5 3V4h3v17H3ZM3 21h18M7 17h2M12 17h2M17 17h2",
  wrench:
    "M14.5 4a5 5 0 0 0-4.6 7L4 16.9a2 2 0 1 0 2.8 2.8l5.9-5.9A5 5 0 1 0 14.5 4Z",
  cube: "M12 3 4 7.5v9L12 21l8-4.5v-9L12 3ZM4 7.5 12 12l8-4.5M12 12v9",
  layers: "M12 3 3 8l9 5 9-5-9-5ZM3 13l9 5 9-5M3 18l9 5 9-5",
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z",
  users: "M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20M9.5 10.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM21 20v-1.5a4 4 0 0 0-3-3.87M16.5 3.9a4 4 0 0 1 0 7.2",
  calendar: "M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7ZM8 3v4M16 3v4M4 11h16",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3.5 2",
  star: "m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1.1 5.9-5.3-2.9-5.3 2.9 1.1-5.9L3.5 9.7l5.9-.8L12 3.5Z",
  play: "M8 5.5v13l11-6.5-11-6.5Z",
  rotate: "M20 12a8 8 0 1 1-2.4-5.7M20 4v4h-4",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  filter: "M4 5h16l-6.5 7.5V19l-3 2v-8.5L4 5Z",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 11v5M12 8h.01",
  alert: "M12 8v5M12 16h.01M10.3 3.9 2.6 17.2A2 2 0 0 0 4.3 20h15.4a2 2 0 0 0 1.7-2.8L13.7 3.9a2 2 0 0 0-3.4 0Z",
  linkedin: "M6 9v10M6 5.5v.01M11 19v-6a3 3 0 0 1 6 0v6M11 9v10",
  youtube:
    "M3 8.5A3.5 3.5 0 0 1 6.5 5h11A3.5 3.5 0 0 1 21 8.5v7a3.5 3.5 0 0 1-3.5 3.5h-11A3.5 3.5 0 0 1 3 15.5v-7ZM10.5 9.5l4.5 2.5-4.5 2.5v-5Z",
  whatsapp:
    "M3.5 20.5 5 16.2A7.8 7.8 0 1 1 8 19.2l-4.5 1.3ZM9.2 9c.2 1.6 1.2 3 2.6 3.9l.9-1.1 2 .8v1.5c-2.9.3-5.6-2.4-5.9-5.3h1.5l.9 2-1 .9Z",
  building: "M4 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M14 21V9h4a2 2 0 0 1 2 2v10M3 21h18M7 7h2M7 11h2M7 15h2",
  box: "M4 8h16v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8ZM3 4h18v4H3zM10 12h4",
  temperature: "M10 14.5V5a2 2 0 1 1 4 0v9.5a4 4 0 1 1-4 0ZM12 17.5h.01",
  lock: "M6 11h12v9H6v-9ZM8.5 11V7.5a3.5 3.5 0 0 1 7 0V11",
  sparkle: "M12 3v5M12 16v5M4.5 12h5M14.5 12h5M6.7 6.7l3 3M14.3 14.3l3 3M17.3 6.7l-3 3M9.7 14.3l-3 3",
} as const;

export type IconName = keyof typeof paths;

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  /** Rendered size in px. Sizes come from the token set: 16, 20, 24, 32. */
  size?: 16 | 20 | 24 | 32;
  /** Give the icon a name only when it is not next to visible text. */
  label?: string;
}

export function Icon({ name, size = 24, label, className, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("shrink-0", className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      {...rest}
    >
      <path d={paths[name]} />
    </svg>
  );
}
