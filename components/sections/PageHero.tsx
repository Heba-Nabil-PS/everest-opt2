import { Fragment } from "react";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { Shell } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Section";
import { PhotoBackdrop } from "@/components/ui/PhotoBackdrop";
import { HeroStage } from "@/components/motion/HeroStage";
import { cn } from "@/lib/utils";

/**
 * The single page-header pattern. Every non-home page opens with this, so the
 * one `h1` per page and the breadcrumb trail are structurally guaranteed
 * rather than re-implemented per template.
 *
 * It sits under the transparent header and replays the site's entrance on
 * every navigation: the photograph settles from a zoom, the title's words rise
 * out of their masks, then the supporting copy fades up. All CSS, because the
 * title is the LCP element. On scroll the copy lifts away (HeroStage).
 *
 * Pass `image` to set a photograph behind the header; without one the deep
 * ground falls back to the brand gradient.
 */
export function PageHero({
  eyebrow,
  title,
  subline,
  crumbs,
  crumbLabel,
  aside,
  image,
  ground = "deep",
  children,
}: {
  eyebrow: string;
  title: string;
  subline?: string;
  crumbs: Crumb[];
  crumbLabel: string;
  aside?: React.ReactNode;
  image?: string;
  ground?: "deep" | "frost";
  children?: React.ReactNode;
}) {
  const inverse = ground === "deep" || Boolean(image);
  const words = title.split(" ");
  const afterTitle = 140 + words.length * 50;

  return (
    <HeroStage
      closeWindow={false}
      data-header-tone={inverse ? "dark" : "light"}
      className={cn(
        "under-header relative isolate overflow-hidden",
        inverse ? "bg-deep text-white" : "bg-frost",
      )}
    >
      {/* The backdrop already drifts on scroll (Parallax), so it is not also
          marked as hero media. */}
      {image ? <PhotoBackdrop src={image} tone="hero" priority imageClassName="anim-media-zoom" /> : null}

      <Shell className={cn("relative", image ? "py-8 lg:pb-12 lg:pt-12" : "py-7 lg:py-10")}>
        <div data-hero-content>
          <div className="anim-fade-in" style={{ animationDelay: "60ms" }}>
            <Breadcrumbs items={crumbs} label={crumbLabel} inverse={inverse} />
          </div>

          <div
            className={cn(
              "mt-5 grid gap-8 lg:mt-7",
              aside ? "lg:grid-cols-[1.3fr_1fr] lg:items-center" : "",
            )}
          >
            <div>
              <div className="anim-rise" style={{ animationDelay: "100ms" }}>
                <Eyebrow inverse={inverse}>{eyebrow}</Eyebrow>
              </div>
              <h1
                className={cn(
                  "mt-3 max-w-[22ch] text-3xl leading-[1.08] tracking-[-0.015em] md:text-4xl lg:text-5xl",
                  inverse && "text-white",
                )}
              >
                {words.map((word, index) => (
                  <Fragment key={`${word}-${index}`}>
                    <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
                      <span
                        className="anim-mask-rise inline-block origin-bottom-left rtl:origin-bottom-right"
                        style={{ animationDelay: `${140 + index * 50}ms` }}
                      >
                        {word}
                      </span>
                    </span>
                    {index < words.length - 1 ? " " : null}
                  </Fragment>
                ))}
              </h1>
              <div className="anim-rise" style={{ animationDelay: `${afterTitle}ms` }}>
                {subline ? (
                  <p
                    className={cn(
                      "mt-4 max-w-[58ch] text-base lg:text-lg",
                      inverse ? "text-white/80" : "text-ink-muted",
                    )}
                  >
                    {subline}
                  </p>
                ) : null}
                {children}
              </div>
            </div>

            {aside ? (
              <div className="anim-rise" style={{ animationDelay: `${afterTitle + 120}ms` }}>
                {aside}
              </div>
            ) : null}
          </div>
        </div>
      </Shell>
    </HeroStage>
  );
}
