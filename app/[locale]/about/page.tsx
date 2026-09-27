import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/sections/PageHero";
import { Eyebrow, Section, SectionHeading, Shell } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { QuoteButton } from "@/components/forms/QuoteButton";
import { Icon, type IconName } from "@/components/ui/Icon";
import { PhotoBackdrop } from "@/components/ui/PhotoBackdrop";
import { Glow } from "@/components/ui/Aurora";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { MilestoneTimeline } from "@/components/sections/MilestoneTimeline";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { directors } from "@/lib/data/company";
import { certifications, site } from "@/lib/data/site";
import { getDictionary } from "@/lib/i18n";
import { localePath, type Locale } from "@/lib/i18n/config";

/* One glyph per milestone, in timeline order (1981 → 2026). */
const milestoneIcons: IconName[] = [
  "factory", "star", "shield", "temperature", "snow", "leaf", "bolt", "sparkle", "globe",
];

/* One photograph per milestone, in the same order. */
const milestoneImages = [
  "/images/about-factory.jpg",
  "/images/gallery-retail.jpg",
  "/images/gallery-assembly.jpg",
  "/images/rnd-testing.jpg",
  "/images/products-freezers.jpg",
  "/images/gallery-welding.jpg",
  "/images/gallery-robotics.jpg",
  "/images/esg-nature.jpg",
  "/images/news/news-india-srilanka.jpg",
];

/** Initials for a leader whose approved portrait has not been supplied yet. */
const initials = (name: string) =>
  name
    .replace(/^(Mr|Mrs|Ms|Dr)\.?\s+/i, "")
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export async function generateMetadata(props: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await props.params;
  const d = getDictionary(locale);
  return {
    title: d.about.meta.title,
    description: d.about.meta.description,
    alternates: { canonical: `/${locale}/about` },
  };
}

export default async function AboutPage(props: PageProps<"/[locale]/about">) {
  const { locale } = await props.params;
  const typedLocale = locale as Locale;
  const d = getDictionary(locale);
  const path = (p: string) => localePath(typedLocale, p);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: d.common.home, url: `${site.url}${path("/")}` },
          { name: d.nav.about, url: `${site.url}${path("/about")}` },
        ]}
      />

      <PageHero
        image="/images/about-factory.jpg"
        eyebrow={d.about.hero.eyebrow}
        title={d.about.hero.headline}
        subline={d.about.hero.subline}
        crumbLabel={d.a11y.breadcrumb}
        crumbs={[{ label: d.common.home, href: path("/") }, { label: d.nav.about }]}
      />

      {/* Overview and story */}
      <Section aria-labelledby="story-heading">
        <Shell className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading id="story-heading" eyebrow={d.about.overview.eyebrow} title={d.about.story.heading} />
            {/* `scrub`: each paragraph lights up word by word with the scroll,
                the same treatment the home bento gives its opening claim. Each
                one drives its own trigger, so a plain wrapper here — a
                staggered Reveal would fight them for opacity. */}
            <div className="mt-6 flex flex-col gap-4 text-ink-muted">
              {d.about.story.paragraphs.map((paragraph) => (
                <TextReveal as="p" variant="scrub" key={paragraph.slice(0, 24)}>
                  {paragraph}
                </TextReveal>
              ))}
            </div>
          </div>

          {/* Two-photo collage */}
          <Reveal animation="scale-in" className="relative pb-16 ps-10 sm:ps-16">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
              <Image src="/images/hero-factory.jpg" alt={d.about.hero.imageAlt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </div>
            <div className="absolute bottom-0 start-0 aspect-square w-2/5 overflow-hidden rounded-2xl shadow-lg ring-4 ring-surface">
              <Image src="/images/gallery-assembly.jpg" alt="" fill sizes="20vw" className="object-cover" />
            </div>
          </Reveal>
        </Shell>

        <Shell>
          <Reveal as="dl" stagger className="mt-16 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {d.about.overview.stats.map((stat) => (
              <div
                key={stat.label}
                className="group relative flex flex-col-reverse overflow-hidden rounded-2xl border border-hairline bg-surface p-6 transition-[transform,border-color,box-shadow] duration-500 ease-[var(--ease-smooth)] hover:-translate-y-1 hover:border-glacier-300 hover:shadow-lg"
              >
                {/* A light that runs along the top edge as the tile is picked out. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-glacier-400 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <dt className="mt-2 text-sm text-ink-muted">{stat.label}</dt>
                <dd className="ltr-inline font-display text-4xl text-white">{stat.value}</dd>
              </div>
            ))}
          </Reveal>
        </Shell>
      </Section>

      {/* History timeline */}
      {/* overflow-clip, not -hidden: -hidden would make this a scroll
          container and the timeline's sticky year would stop sticking. */}
      <Section ground="frost" aria-labelledby="milestones-heading" className="overflow-clip">
        <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10" />
        <Shell>
          <SectionHeading
            id="milestones-heading"
            eyebrow={d.about.timeline.eyebrow}
            title={d.about.milestones.heading}
            intro={d.about.milestones.intro}
          />

          <MilestoneTimeline items={d.about.milestones.items} icons={milestoneIcons} images={milestoneImages} />
        </Shell>
      </Section>

      {/* Mission, vision, values */}
      <Section aria-labelledby="mvv-heading">
        <Shell>
          <SectionHeading id="mvv-heading" title={d.about.mvv.heading} />

          {/* Brand message */}
          <figure className="relative mt-10 overflow-hidden rounded-3xl bg-deep px-8 py-10 text-white lg:px-14 lg:py-14">
            <span aria-hidden="true" className="absolute -top-6 start-6 font-display text-[9rem] leading-none text-glacier-400/25">“</span>
            <blockquote className="relative max-w-[34ch] font-display text-2xl leading-snug md:text-3xl lg:text-4xl">
              {d.about.mvv.brandMessage}
            </blockquote>
            <figcaption className="relative mt-6 text-2xs font-semibold uppercase tracking-[0.18em] text-glacier-300">
              Everest Industrial Group
            </figcaption>
          </figure>

          {/* Mission and vision as a matched pair: the same photographic card,
              but the statement is the whole card rather than a caption at the
              foot of it. A big outlined glyph anchors each one so the two read
              as a set rather than two stock images with text on them. */}
          <Reveal as="div" stagger className="mt-12 grid gap-5 md:grid-cols-2">
            {[
              { block: d.about.mvv.mission, image: "/images/careers-team.jpg", icon: "gauge" as IconName },
              { block: d.about.mvv.vision, image: "/images/presence-port.jpg", icon: "globe" as IconName },
            ].map(({ block, image, icon }) => (
              <article
                key={block.label}
                className="group relative isolate flex min-h-80 flex-col justify-end overflow-hidden rounded-3xl p-8 text-white lg:p-10"
              >
                <PhotoBackdrop
                  src={image}
                  tone="deep"
                  className="[&_img]:transition-transform [&_img]:duration-700 group-hover:[&_img]:scale-105"
                />
                <Glow tone="indigo" className="-end-16 -top-16 h-60 w-60 opacity-70" />

                <span
                  aria-hidden="true"
                  className="absolute end-7 top-7 text-white/10 transition-transform duration-700 ease-[var(--ease-smooth)] group-hover:scale-110"
                >
                  <Icon name={icon} size={32} className="h-28 w-28" />
                </span>

                <span className="inline-flex w-fit items-center gap-2.5 rounded-full bg-white/10 px-3.5 py-1.5 text-2xs font-semibold uppercase tracking-[0.18em] text-glacier-300 ring-1 ring-white/20 backdrop-blur-sm">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-glacier-400" />
                  {block.label}
                </span>
                <p className="mt-5 max-w-[44ch] font-display text-2xl leading-snug lg:text-3xl">
                  {block.body}
                </p>
              </article>
            ))}
          </Reveal>

          {/* Eight values is a lot of cards. As a numbered grid of glass tiles
              with the index carrying the rhythm, the block scans in one pass
              instead of reading as eight separate claims. */}
          <div className="mt-16 flex items-center gap-4">
            <Eyebrow inverse>{d.about.mvv.values.label}</Eyebrow>
            <span aria-hidden="true" className="h-px flex-1 bg-white/10" />
          </div>

          <Reveal as="ul" stagger className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {d.about.mvv.values.items.map((value, index) => (
              <li
                key={value.title}
                className="glass-panel glass-spot glass-hover group relative overflow-hidden rounded-2xl p-6"
              >
                <span
                  aria-hidden="true"
                  className="tabular absolute end-4 top-2 font-display text-6xl font-bold text-white/5 transition-colors duration-500 group-hover:text-glacier-400/20"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  aria-hidden="true"
                  className="block h-0.5 w-10 rounded-full bg-gradient-to-r from-glacier-400 to-steel-light transition-[width] duration-500 ease-[var(--ease-smooth)] group-hover:w-16"
                />
                <h3 className="relative mt-5 text-lg">{value.title}</h3>
                <p className="relative mt-2 text-sm text-ink-muted">{value.body}</p>
              </li>
            ))}
          </Reveal>
        </Shell>
      </Section>

      {/* Certifications */}
      <Section ground="deep" tight aria-labelledby="about-certs-heading">
        <PhotoBackdrop src="/images/rnd-testing.jpg" />
        <Shell className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-center">
          <div>
            <SectionHeading
              id="about-certs-heading"
              title={d.about.certifications.heading}
              intro={d.about.certifications.intro}
              inverse
            />
            <ButtonLink href={path("/resources#certifications")} className="mt-8" icon="arrowRight">
              {d.footer.links.certifications}
            </ButtonLink>
          </div>

          <Reveal as="ul" stagger className="grid gap-4 sm:grid-cols-2">
            {certifications.map((cert) => (
              <li key={cert.id} className="glass-dark flex flex-col items-center rounded-2xl p-6 text-center">
                {/* ISO badge */}
                <span className="grid h-24 w-24 place-items-center rounded-full border-2 border-glacier-300/70 bg-white/5 ring-8 ring-white/5">
                  <span className="flex flex-col items-center leading-none">
                    <span className="text-2xs font-bold tracking-[0.2em] text-glacier-300">{cert.standard.split(" ")[0]}</span>
                    <span className="ltr-inline mt-1 font-display text-2xl font-bold text-white">
                      {cert.standard.split(" ").slice(1).join(" ")}
                    </span>
                  </span>
                </span>
                <span className="mt-4 font-display font-semibold text-white">{cert.title[typedLocale]}</span>
                <span className="mt-2 text-xs text-white/65">{cert.scope[typedLocale]}</span>
              </li>
            ))}
          </Reveal>
        </Shell>
      </Section>

      {/* Leadership — meet the directors */}
      <Section aria-labelledby="leadership-heading">
        <Shell>
          <SectionHeading
            id="leadership-heading"
            eyebrow={d.about.directors.eyebrow}
            title={d.about.directors.heading}
            intro={d.about.directors.intro}
          />

          <Reveal as="ul" stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {directors.map((person, index) => (
              <li key={person.id} className="group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-deep shadow-md ring-1 ring-hairline transition-[transform,box-shadow] duration-500 ease-[var(--ease-out-soft)] group-hover:-translate-y-1 group-hover:shadow-xl">
                  {person.photo ? (
                    <>
                      <Image
                        src={person.photo}
                        alt={`${person.name[typedLocale]} — ${person.role[typedLocale]}`}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover object-[center_20%] transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
                      />
                      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy-950/50 to-transparent" />
                    </>
                  ) : (
                    <div
                      role="img"
                      aria-label={person.name[typedLocale]}
                      className="absolute inset-0 grid place-items-center overflow-hidden"
                    >
                      <div aria-hidden="true" className="bg-grid absolute inset-0 opacity-20" />
                      <div aria-hidden="true" className="absolute -end-16 -top-16 h-56 w-56 rounded-full bg-glacier-400/30 blur-3xl" />
                      <span className="relative grid h-32 w-32 place-items-center rounded-full border-2 border-glacier-300/60 bg-white/5 font-display text-5xl font-bold text-white ring-8 ring-white/5">
                        {initials(person.name.en)}
                      </span>
                    </div>
                  )}
                  {index === 0 ? (
                    <span className="absolute start-3 top-3 rounded-full bg-glacier-400 px-3 py-1 text-2xs font-semibold uppercase tracking-[0.12em] text-navy-900">
                      {d.about.directors.founderBadge}
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-5 text-lg">{person.name[typedLocale]}</h3>
                <p className="text-sm font-medium text-glacier-600">{person.role[typedLocale]}</p>
                <p className="mt-2 text-sm text-ink-muted">{person.bio[typedLocale]}</p>
              </li>
            ))}
          </Reveal>

          <div className="mt-16 rounded-2xl border border-hairline bg-surface-muted p-6 lg:p-8">
            <h3 className="text-lg">{d.about.directors.teamHeading}</h3>
            <ul className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              {d.about.leadership.roles.map((person) => (
                <li key={person.role} className="flex gap-3">
                  <Icon name="users" size={20} className="mt-0.5 text-glacier-600" />
                  <span>
                    <span className="block font-medium text-ink-strong">{person.role}</span>
                    <span className="block text-sm text-ink-muted">{person.focus}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-ink-muted">{d.about.leadership.contactNote}</p>
          </div>
        </Shell>
      </Section>

      {/* Careers — a pointer to the careers page rather than a roster of
          named staff, which would need constant upkeep. */}
      <Section tight aria-labelledby="about-careers-heading">
        <Shell>
          <Reveal className="glass-panel relative grid overflow-hidden rounded-[1.75rem] md:grid-cols-[1fr_1.2fr]">
            <div className="relative min-h-60">
              <Image src="/images/careers-team.jpg" alt="" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
            </div>
            <div className="flex flex-col items-start justify-center gap-5 p-7 lg:p-10">
              <Eyebrow inverse>{d.about.careers.eyebrow}</Eyebrow>
              <h2 id="about-careers-heading" className="max-w-[24ch] text-2xl md:text-3xl">
                {d.about.careers.heading}
              </h2>
              <p className="max-w-[52ch] text-ink-muted">{d.about.careers.body}</p>
              <ButtonLink href={path("/careers")} icon="arrowRight">
                {d.about.careers.cta}
              </ButtonLink>
            </div>
          </Reveal>
        </Shell>
      </Section>

      {/* Closing CTA */}
      <Section ground="deep" aria-labelledby="about-cta-heading">
        <PhotoBackdrop src="/images/gallery-welding.jpg" />
        <Shell className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div>
            <Eyebrow inverse>{d.about.hero.eyebrow}</Eyebrow>
            <h2 id="about-cta-heading" className="mt-4 max-w-[22ch] text-3xl text-white md:text-4xl">
              {d.about.cta.heading}
            </h2>
            <p className="mt-4 max-w-[58ch] text-white/75">{d.about.cta.body}</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <ButtonLink href={path("/innovation")} icon="arrowRight">
              {d.about.cta.primary}
            </ButtonLink>
            <QuoteButton variant="inverse">{d.about.cta.secondary}</QuoteButton>
          </div>
        </Shell>
      </Section>
    </>
  );
}
