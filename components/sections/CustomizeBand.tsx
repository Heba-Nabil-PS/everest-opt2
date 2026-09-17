import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { PhotoBackdrop } from "@/components/ui/PhotoBackdrop";
import { Eyebrow, Section, Shell } from "@/components/ui/Section";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";

const featureIcons: IconName[] = ["sparkle", "layers", "globe"];

/**
 * Closing band on product listings: routes an undecided buyer into the
 * customisation flow, with a direct line to an engineer as the fallback.
 */
export function CustomizeBand({
  locale,
  dictionary: d,
  headingId = "customize-band-heading",
}: {
  locale: Locale;
  dictionary: Dictionary;
  headingId?: string;
}) {
  const path = (p: string) => localePath(locale, p);
  const help = d.products.help;

  return (
    <Section aria-labelledby={headingId}>
      <Shell>
        <div className="relative isolate overflow-hidden rounded-3xl text-white shadow-xl">
          <PhotoBackdrop src="/images/leadband-store.jpg" tone="deep" />
          {/* Cyan glow and engineering grid add depth over the photograph. */}
          <div aria-hidden="true" className="absolute -end-32 -top-32 -z-10 h-96 w-96 rounded-full bg-glacier-400/25 blur-3xl" />
          <div aria-hidden="true" className="bg-grid-inverse absolute inset-0 -z-10 opacity-70" />

          <div className="grid gap-10 p-8 sm:p-10 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-14 lg:p-14">
            <div>
              <Eyebrow inverse>{help.eyebrow}</Eyebrow>
              <h2 id={headingId} className="mt-4 max-w-[22ch] text-3xl text-white md:text-4xl">
                {help.heading}
              </h2>
              <p className="mt-5 max-w-[56ch] text-lg text-ink-inverse-muted">{help.body}</p>

              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href={path("/customize")} size="lg" icon="arrowRight">
                  {help.cta}
                </ButtonLink>
                <ButtonLink href={path("/contact")} size="lg" variant="inverse" icon="phone" iconLeading>
                  {help.secondaryCta}
                </ButtonLink>
              </div>
            </div>

            <Reveal as="ul" stagger className="flex flex-col gap-3">
              {help.features.map((feature, index) => (
                <li
                  key={feature.title}
                  className="glass-dark group flex items-center gap-4 rounded-2xl p-4 transition-[transform,border-color] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:border-glacier-300/50 sm:p-5"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-glacier-400 to-steel text-white shadow-[0_8px_20px_-6px_rgb(44_186_226/0.6)] transition-transform duration-300 group-hover:rotate-6">
                    <Icon name={featureIcons[index % featureIcons.length]} size={24} />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-lg font-semibold text-white">{feature.title}</span>
                    <span className="mt-0.5 block text-sm text-ink-inverse-muted">{feature.body}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="ms-auto font-display text-3xl font-bold text-white/10 tabular"
                  >
                    0{index + 1}
                  </span>
                </li>
              ))}
            </Reveal>
          </div>
        </div>
      </Shell>
    </Section>
  );
}
