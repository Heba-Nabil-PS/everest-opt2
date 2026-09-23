"use client";

import { Fragment, useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { ButtonLink } from "@/components/ui/Button";
import { QuoteButton } from "@/components/forms/QuoteButton";
import { Icon } from "@/components/ui/Icon";
import { Magnetic } from "@/components/motion/Magnetic";
import { gsap, isRtl, motion, prefersReducedMotion, registerGsap } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface HeroSlide {
  id: string;
  image: string;
  /** Short name for the slide tab. */
  tab: string;
  title: string;
  body: string;
  /** Either a link, or the control that opens the quote dialog. */
  cta: { label: string } & ({ href: string; quote?: never } | { quote: true; href?: never });
  secondary?: { href: string; label: string };
}

interface HeroCarouselProps {
  slides: HeroSlide[];
  labels: { region: string; play: string; pause: string; previous: string; next: string; goTo: string };
  /** Dwell time per slide in ms. */
  interval?: number;
}

const reducedQuery = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (callback: () => void) => {
  const query = window.matchMedia(reducedQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
};

/**
 * The home hero as a cinematic slideshow.
 *
 * Change of slide: the new photograph wipes in from the reading direction
 * while the old one slides away beneath it, the old headline drops out of its
 * masks and the new one rises word by word. Each photo then drifts in a slow
 * zoom for its dwell time.
 *
 * - The first slide paints with the document (CSS entrance, real `h1`), so
 *   the LCP never waits for JavaScript. Later slides use `h2`.
 * - Autoplay is driven by the active tab's CSS progress bar: when it fills,
 *   the next slide comes. It pauses on the pause button, while keyboard focus
 *   is inside, while the hero is scrolled away and while the tab is hidden —
 *   and never starts for reduced motion (WCAG 2.2.2).
 * - Swipe on touch, previous/next buttons, numbered tabs; hidden slides are
 *   `inert` and out of the accessibility tree.
 * - Photos load on demand: the current slide and its neighbours.
 */
export function HeroCarousel({ slides, labels, interval = 7000 }: HeroCarouselProps) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [visited, setVisited] = useState<number[]>([0]);
  const [userPaused, setUserPaused] = useState(false);
  const [focusInside, setFocusInside] = useState(false);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const reduced = useSyncExternalStore(subscribeReduced, () => window.matchMedia(reducedQuery).matches, () => false);

  const previous = useRef(0);
  const direction = useRef<1 | -1>(1);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const drift = useRef<gsap.core.Tween | null>(null);
  const total = slides.length;

  const running = !userPaused && !reduced && !focusInside && inView && pageVisible;

  const goTo = useCallback(
    (index: number, dir?: 1 | -1) => {
      const next = (index + total) % total;
      setActive((current) => {
        if (next === current) return current;
        direction.current = dir ?? (next > current ? 1 : -1);
        return next;
      });
      setVisited((list) => (list.includes(next) ? list : [...list, next]));
    },
    [total],
  );

  /* Load the photos around every slide seen so far. */
  const loaded = new Set(visited.flatMap((i) => [i, (i + 1) % total, (i - 1 + total) % total]));

  /* --- Transition choreography ------------------------------------------- */
  useGSAP(
    () => {
      registerGsap();
      const scope = root.current;
      const from = previous.current;
      if (!scope || from === active) return;
      previous.current = active;

      const media = (i: number) => scope.querySelector<HTMLElement>(`[data-slide-media="${i}"]`);
      const text = (i: number) => scope.querySelector<HTMLElement>(`[data-slide-text="${i}"]`);
      const inMedia = media(active);
      const outMedia = media(from);
      const inText = text(active);
      const outText = text(from);
      if (!inMedia || !outMedia || !inText || !outText) return;

      /* Finish any transition still running so slides never stack up. */
      timeline.current?.progress(1).kill();

      const others = slides.map((_, i) => i).filter((i) => i !== active && i !== from);
      gsap.set(others.map(media), { visibility: "hidden", zIndex: 0 });
      gsap.set(others.map(text), { visibility: "hidden" });

      if (reduced) {
        gsap.set([outMedia, outText], { visibility: "hidden" });
        gsap.set([inMedia, inText], { visibility: "visible", clipPath: "none", zIndex: 2 });
        gsap.set(inText.querySelectorAll("[data-word], [data-fade]"), { clearProps: "all" });
        return;
      }

      const dir = direction.current;
      /* "Next" arrives from the end side of the reading direction. */
      const fromEnd = dir === 1 !== isRtl();
      const clipFrom = fromEnd ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)";
      const away = fromEnd ? -12 : 12;

      const inImage = inMedia.querySelector("img");
      const outImage = outMedia.querySelector("img");

      gsap.set(outMedia, { zIndex: 1, visibility: "visible" });
      gsap.set(inMedia, { zIndex: 2, visibility: "visible" });
      gsap.set(inText, { visibility: "visible" });

      const tl = gsap.timeline({
        defaults: { overwrite: "auto" },
        onComplete: () => {
          gsap.set([outMedia, outText], { visibility: "hidden" });
          gsap.set(outMedia, { zIndex: 0 });
          if (outImage) gsap.set(outImage, { clearProps: "transform" });
        },
      });

      tl.fromTo(inMedia, { clipPath: clipFrom }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: motion.ease.expressive }, 0);
      if (inImage) {
        tl.fromTo(inImage, { scale: 1.28, xPercent: -away / 2 }, { scale: 1.04, xPercent: 0, duration: 1.8, ease: motion.ease.smooth }, 0);
        /* Slow drift for the dwell time — its own tween, so finishing the
           transition early never jumps the zoom. */
        drift.current?.kill();
        drift.current = gsap.to(inImage, { scale: 1.12, duration: interval / 1000 + 1.5, ease: "none", delay: 1.8 });
      }
      if (outImage) tl.to(outImage, { xPercent: away, duration: 1.2, ease: motion.ease.expressive }, 0);

      tl.to(outText.querySelectorAll("[data-word]"), { yPercent: -130, duration: 0.5, ease: "power3.in", stagger: 0.02 }, 0);
      tl.to(outText.querySelectorAll("[data-fade]"), { opacity: 0, y: -16, duration: 0.4, ease: "power2.in" }, 0);

      tl.fromTo(
        inText.querySelectorAll("[data-word]"),
        { yPercent: 130, rotate: 3 },
        { yPercent: 0, rotate: 0, duration: 1, ease: motion.ease.smooth, stagger: motion.stagger.text * 1.5 },
        0.45,
      );
      tl.fromTo(
        inText.querySelectorAll("[data-fade]"),
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, ease: motion.ease.smooth, stagger: motion.stagger.items },
        0.7,
      );

      timeline.current = tl;
    },
    { scope: root, dependencies: [active, reduced] },
  );

  /* Slow drift on the first slide as well. */
  useGSAP(
    () => {
      registerGsap();
      const image = root.current?.querySelector('[data-slide-media="0"] img');
      if (!image || reduced) return;
      gsap.fromTo(image, { scale: 1.2 }, { scale: 1.04, duration: 2.4, ease: motion.ease.smooth });
      drift.current = gsap.to(image, { scale: 1.12, duration: interval / 1000 + 1, ease: "none", delay: 2.4 });
    },
    { scope: root, dependencies: [reduced] },
  );

  /* --- Pause conditions --------------------------------------------------- */
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    /* The wrapper has no box of its own; watch the hero section. */
    observer.observe(node.parentElement ?? node);
    const onVisibility = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  /* --- Touch swipe -------------------------------------------------------- */
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (event: React.PointerEvent) => {
    if (event.pointerType === "mouse") return;
    swipeStart.current = { x: event.clientX, y: event.clientY };
  };
  const onPointerUp = (event: React.PointerEvent) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
    /* Swiping against the reading direction advances. */
    const forward = isRtl() ? dx > 0 : dx < 0;
    goTo(active + (forward ? 1 : -1), forward ? 1 : -1);
  };

  const counter = (n: number) => String(n).padStart(2, "0");

  return (
    /* Layout-neutral wrapper: the media layer and the copy position against
       the hero section itself. */
    <div ref={root} className="contents">
      {/* Photographs — the frame opens on load; HeroStage drifts the stack on scroll. */}
      <div data-hero-media className="anim-media-in absolute inset-0 -z-10 overflow-hidden bg-navy-950">
        <div className="absolute inset-0">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              data-slide-media={index}
              aria-hidden="true"
              className="absolute inset-0 overflow-hidden"
              style={index === 0 ? { zIndex: 2 } : { visibility: "hidden", zIndex: 0 }}
            >
              {loaded.has(index) ? (
                <Image
                  src={slide.image}
                  alt=""
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  draggable={false}
                  className="object-cover will-change-transform"
                />
              ) : null}
            </div>
          ))}
        </div>
        {/* Reading edge: dark behind the copy, easing to clear photograph beyond it. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-navy-950/90 via-navy-950/55 to-navy-950/10 rtl:bg-gradient-to-l" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-3/4 bg-gradient-to-t from-navy-950/95 via-navy-950/40 to-transparent" />
      </div>

      <div
        data-hero-content
        role="region"
        aria-roledescription="carousel"
        aria-label={labels.region}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        /* Only keyboard focus pauses autoplay; a mouse click on a tab does not. */
        onFocus={(event) => setFocusInside((event.target as Element).matches(":focus-visible"))}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) setFocusInside(false);
        }}
        /* Phones: bottom room for the fixed quote bar. */
        className="shell relative w-full touch-pan-y pb-24 pt-6 sm:pb-10 sm:pt-10"
      >
        {/* All slides share one grid cell, so the hero never changes height. */}
        <div className="grid">
          {slides.map((slide, index) => {
            const Heading = index === 0 ? "h1" : "h2";
            const current = index === active;
            const words = slide.title.split(" ");
            /* CSS entrance timing for the first paint of slide one only. */
            const firstPaint = index === 0;
            const afterTitle = 160 + words.length * 60;

            return (
              <div
                key={slide.id}
                data-slide-text={index}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} / ${total}`}
                aria-hidden={!current}
                inert={!current}
                className="col-start-1 row-start-1 self-end"
                style={index === 0 ? undefined : { visibility: "hidden" }}
              >
                <Heading
                  id={index === 0 ? "hero-heading" : undefined}
                  className="max-w-[22ch] text-[2rem] leading-[1.12] tracking-[-0.015em] text-white sm:text-5xl xl:text-6xl"
                >
                  {words.map((word, wordIndex) => (
                    <Fragment key={`${word}-${wordIndex}`}>
                      {/* The mask clips the rise. Its bottom padding (cancelled by a
                          negative margin) is deep enough for the Cambria/Caladea
                          descenders of g, p and y, so no letter is cut. */}
                      <span className="-mb-[0.3em] inline-block overflow-hidden pb-[0.3em] align-bottom">
                        <span
                          data-word
                          className={cn(
                            "inline-block origin-bottom-left rtl:origin-bottom-right",
                            firstPaint && "anim-mask-rise",
                            /* Gradient text paints only inside its own box, so that
                               box is extended below the baseline as well. */
                            wordIndex >= words.length - 2 && "text-gradient -mb-[0.25em] pb-[0.25em] pe-[0.04em]",
                          )}
                          style={firstPaint ? { animationDelay: `${160 + wordIndex * 60}ms` } : undefined}
                        >
                          {word}
                        </span>
                      </span>
                      {wordIndex < words.length - 1 ? " " : null}
                    </Fragment>
                  ))}
                </Heading>

                {/* Description, then the actions directly beneath it. */}
                <div className="mt-5 flex flex-col items-start gap-6 lg:mt-6">
                  <p
                    data-fade
                    className={cn("max-w-[46ch] text-base text-white/85 sm:text-lg", firstPaint && "anim-rise")}
                    style={firstPaint ? { animationDelay: `${afterTitle}ms` } : undefined}
                  >
                    {slide.body}
                  </p>

                  <div
                    data-fade
                    className={cn("flex flex-wrap gap-3", firstPaint && "anim-rise")}
                    style={firstPaint ? { animationDelay: `${afterTitle + 100}ms` } : undefined}
                  >
                    <Magnetic>
                      {slide.cta.quote ? (
                        <QuoteButton size="lg" icon="arrowRight">
                          {slide.cta.label}
                        </QuoteButton>
                      ) : (
                        <ButtonLink href={slide.cta.href} size="lg" icon="arrowRight">
                          {slide.cta.label}
                        </ButtonLink>
                      )}
                    </Magnetic>
                    {slide.secondary ? (
                      <ButtonLink href={slide.secondary.href} size="lg" variant="inverse">
                        {slide.secondary.label}
                      </ButtonLink>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Controls: numbered tabs with autoplay progress, arrows, pause. */}
        <div
          /* The end padding leaves the corner to the fixed chat launcher
             (a round button on phones, a wider pill from sm up). */
          className="anim-fade-in mt-8 me-20 flex items-center gap-4 rounded-full glass-chip py-2 pe-2 ps-5 sm:me-56 lg:mt-12"
          style={{ animationDelay: "900ms" }}
        >
          <ol
            className="flex min-w-0 flex-1 gap-2 sm:gap-4"
            onKeyDown={(event) => {
              if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
              event.preventDefault();
              const forward = (event.key === "ArrowRight") !== isRtl();
              const next = (active + (forward ? 1 : -1) + total) % total;
              goTo(next, forward ? 1 : -1);
              event.currentTarget.querySelectorAll("button")[next]?.focus();
            }}
          >
            {slides.map((slide, index) => {
              const current = index === active;
              return (
                <li key={slide.id} className="min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => goTo(index)}
                    aria-current={current ? "true" : undefined}
                    aria-label={labels.goTo.replace("{n}", String(index + 1)).replace("{title}", slide.tab)}
                    className="group flex min-h-11 w-full flex-col justify-center gap-2 text-start"
                  >
                    <span className="flex items-baseline gap-2 text-xs font-semibold">
                      <span className={cn("tabular transition-colors duration-300", current ? "text-glacier-300" : "text-white/50 group-hover:text-white")}>
                        {counter(index + 1)}
                      </span>
                      <span
                        className={cn(
                          "hidden truncate transition-colors duration-300 md:inline",
                          current ? "text-white" : "text-white/50 group-hover:text-white/85",
                        )}
                      >
                        {slide.tab}
                      </span>
                    </span>
                    <span aria-hidden="true" className="relative block h-0.5 w-full overflow-hidden rounded-full bg-white/15">
                      {current && reduced ? (
                        <span className="absolute inset-0 bg-glacier-400" />
                      ) : current ? (
                        <span
                          /* Re-keyed per slide, so the bar restarts; its end advances the slide. */
                          key={`progress-${active}`}
                          onAnimationEnd={() => {
                            if (!prefersReducedMotion()) goTo(active + 1, 1);
                          }}
                          className="hero-progress absolute inset-0 origin-left bg-glacier-400 rtl:origin-right"
                          style={{
                            animationDuration: `${interval}ms`,
                            animationPlayState: running ? "running" : "paused",
                          }}
                        />
                      ) : null}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="flex shrink-0 items-center gap-2">
            {([-1, 1] as const).map((dir) => (
              <button
                key={dir}
                type="button"
                onClick={() => goTo(active + dir, dir)}
                aria-label={dir === -1 ? labels.previous : labels.next}
                className="group hidden h-11 w-11 place-items-center rounded-full border border-white/25 text-white transition-[background-color,border-color,color] duration-300 hover:border-glacier-300 hover:bg-glacier-400 hover:text-navy-900 sm:grid"
              >
                <Icon
                  name={dir === -1 ? "arrowLeft" : "arrowRight"}
                  size={20}
                  className={cn(
                    "transition-transform duration-300 rtl:-scale-x-100",
                    dir === -1 ? "group-hover:-translate-x-0.5" : "group-hover:translate-x-0.5",
                  )}
                />
              </button>
            ))}

            {reduced ? null : (
              <button
                type="button"
                onClick={() => setUserPaused((paused) => !paused)}
                aria-label={userPaused ? labels.play : labels.pause}
                aria-pressed={userPaused}
                className="grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-navy-950/40 text-white backdrop-blur-md transition-[border-color,background-color] duration-300 hover:border-white/60 hover:bg-navy-950/60"
              >
                {userPaused ? (
                  <Icon name="play" size={20} className="translate-x-px fill-current" />
                ) : (
                  <span aria-hidden="true" className="flex gap-1">
                    <span className="h-3.5 w-1 rounded-sm bg-current" />
                    <span className="h-3.5 w-1 rounded-sm bg-current" />
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
