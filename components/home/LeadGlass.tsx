import { QuoteButton } from "@/components/forms/QuoteButton";
import { Reveal } from "@/components/motion/Reveal";
import { Glow } from "@/components/ui/Aurora";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading, Shell } from "@/components/ui/Section";
import type { Dictionary } from "@/lib/i18n";

/**
 * The closing conversion: the promise set large and centred, the three
 * reassurances as chips, and the quote CTA under the brightest light of the
 * page. The form itself lives in the site-wide dialog, so the page never has
 * to be left — or scrolled past — to reach it.
 */
export function LeadGlass({ dictionary: d }: { dictionary: Dictionary }) {
  const l = d.home.lead;

  return (
    <section aria-labelledby="lead-heading" className="relative py-12 lg:py-16">
      <Shell>
        <SectionHeading
          id="lead-heading"
          eyebrow={l.eyebrow}
          title={l.heading}
          intro={l.body}
          size="display"
          align="center"
          className="mx-auto"
          inverse
        />

        <ul className="mt-8 flex flex-wrap justify-center gap-2.5">
          {l.reassurance.map((item) => (
            <li key={item} className="glass-chip inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-white/85">
              <Icon name="check" size={16} className="text-glacier-300" />
              {item}
            </li>
          ))}
        </ul>

        <div className="relative mx-auto mt-10 flex max-w-4xl justify-center">
          <Glow className="-start-10 top-10 h-80 w-80" />
          <Glow tone="violet" className="-end-10 bottom-0 h-80 w-80" />
          <Reveal animation="blur-up">
            <QuoteButton size="lg" icon="arrowRight">
              {d.cta.requestQuote}
            </QuoteButton>
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}
