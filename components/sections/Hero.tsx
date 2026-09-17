import { HeroStage } from "@/components/motion/HeroStage";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";
import { HeroCarousel, type HeroSlide } from "./HeroCarousel";

/**
 * The home entrance: a full-viewport slideshow of five chapters, each one a
 * doorway into a section of the site.
 *
 * Note: the Website Design Brief (§8) specified a single static hero with no
 * carousel. This slideshow replaces the original video hero at the client's
 * request. Every headline and body comes from the existing dictionary, so both
 * languages stay in step.
 *
 * On scroll, HeroStage closes the photographs into a window and lifts the copy.
 */
export function Hero({ locale, dictionary: d }: { locale: Locale; dictionary: Dictionary }) {
  const path = (p: string) => localePath(locale, p);
  const h = d.home;

  const slides: HeroSlide[] = [
    {
      id: "brand",
      image: "/images/hero-factory.jpg",
      tab: h.discover.heading,
      title: h.hero.headline,
      body: h.hero.carousel.bodies.brand,
      cta: { quote: true, label: h.hero.primaryCta },
      secondary: { href: path("/products"), label: h.hero.secondaryCta },
    },
    {
      id: "ranges",
      image: "/images/products-hero.jpg",
      tab: h.categories.eyebrow,
      title: h.categories.heading,
      body: h.hero.carousel.bodies.ranges,
      cta: { href: path("/products"), label: h.categories.cta },
    },
    {
      id: "technology",
      image: "/images/rnd-lab.jpg",
      tab: h.technology.eyebrow,
      title: h.technology.heading,
      body: h.hero.carousel.bodies.technology,
      cta: { href: path("/innovation"), label: h.technology.cta },
    },
    {
      id: "sustainability",
      image: "/images/esg-solar.jpg",
      tab: h.sustainability.eyebrow,
      title: h.sustainability.heading,
      body: h.hero.carousel.bodies.sustainability,
      cta: { href: path("/sustainability"), label: h.sustainability.cta },
    },
    {
      id: "presence",
      image: "/images/presence-port.jpg",
      tab: h.presence.eyebrow,
      title: h.presence.heading,
      body: h.hero.carousel.bodies.presence,
      cta: { href: path("/distributors"), label: h.presence.cta },
    },
  ];

  return (
    <HeroStage
      data-header-tone="dark"
      aria-labelledby="hero-heading"
      /* At least one full screen; taller only when a short phone needs the room. */
      className="under-header relative isolate flex min-h-svh items-end overflow-hidden bg-navy-950"
    >
      <HeroCarousel
        slides={slides}
        labels={{
          region: h.hero.carousel.label,
          play: h.hero.carousel.play,
          pause: h.hero.carousel.pause,
          goTo: h.hero.carousel.goTo,
          previous: d.interaction.previousSlide,
          next: d.interaction.nextSlide,
        }}
      />
    </HeroStage>
  );
}
