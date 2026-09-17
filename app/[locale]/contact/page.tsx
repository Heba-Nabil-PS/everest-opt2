import type { Metadata } from "next";
import { categories } from "@/lib/data/products";
import { PageHero } from "@/components/sections/PageHero";
import { Section, SectionHeading, Shell } from "@/components/ui/Section";
import { PhotoBackdrop } from "@/components/ui/PhotoBackdrop";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "@/components/forms/ContactForm";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { markets } from "@/lib/data/markets";
import { site } from "@/lib/data/site";
import { getDictionary } from "@/lib/i18n";
import { localePath, type Locale } from "@/lib/i18n/config";

export async function generateMetadata(props: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await props.params;
  const d = getDictionary(locale);
  return {
    title: d.contact.meta.title,
    description: d.contact.meta.description,
    alternates: { canonical: `/${locale}/contact` },
  };
}

export default async function ContactPage(props: PageProps<"/[locale]/contact">) {
  const { locale } = await props.params;
  const { subject } = await props.searchParams;
  const typedLocale = locale as Locale;
  const d = getDictionary(locale);
  const path = (p: string) => localePath(typedLocale, p);

  /* A link like /contact?subject=service pre-selects the right routing. */
  const requested = typeof subject === "string" ? subject : undefined;
  const defaultType =
    requested && requested in d.contact.inquiryTypes ? requested : "quote";

  const regional = markets.filter((market) => market.contact);

  const details: {
    icon: IconName;
    label: string;
    value: React.ReactNode;
    href?: string;
    external?: boolean;
  }[] = [
    { icon: "phone", label: d.contact.phoneLabel, value: <span className="ltr-inline">{site.phone}</span>, href: `tel:${site.phoneHref}` },
    { icon: "mail", label: d.contact.emailLabel, value: <span className="ltr-inline break-all">{site.email}</span>, href: `mailto:${site.email}` },
    { icon: "whatsapp", label: d.utility.whatsapp, value: d.utility.whatsappHint, href: site.whatsappHref, external: true },
    {
      icon: "pin",
      label: d.contact.headOfficeLabel,
      value: `${site.address.line1}, ${site.address.line2}, ${site.address.city}, ${site.address.country}`,
      href: site.address.mapsUrl,
      external: true,
    },
    { icon: "clock", label: d.contact.hoursLabel, value: d.contact.hours },
  ];

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: d.common.home, url: `${site.url}${path("/")}` },
          { name: d.nav.contact, url: `${site.url}${path("/contact")}` },
        ]}
      />

      <PageHero
        image="/images/contact-city.jpg"
        eyebrow={d.contact.hero.eyebrow}
        title={d.contact.hero.headline}
        subline={d.contact.hero.subline}
        crumbLabel={d.a11y.breadcrumb}
        crumbs={[{ label: d.common.home, href: path("/") }, { label: d.nav.contact }]}
      />

      {/* Inquiry form with the direct contact details beside it */}
      <Section ground="muted" id="inquiry" aria-labelledby="contact-form-heading" className="scroll-mt-32">
        <Shell className="grid gap-8 lg:grid-cols-[1.45fr_1fr] lg:items-start lg:gap-10">
          <div className="rounded-3xl border border-hairline bg-surface p-6 shadow-md sm:p-8 lg:p-10">
            <SectionHeading
              id="contact-form-heading"
              eyebrow={d.contact.formEyebrow}
              title={d.contact.formHeading}
              intro={d.contact.formBody}
            />
            <div className="mt-8">
              <ContactForm
                locale={typedLocale}
                dictionary={d}
                defaultType={defaultType}
                productOptions={categories.flatMap((category) =>
                  category.subcategories.map((sub) => {
                    const label = `${category.name[typedLocale]} · ${sub.name[typedLocale]}`;
                    return { value: label, label };
                  }),
                )}
              />
            </div>
          </div>

          <aside
            aria-labelledby="contact-info-heading"
            className="relative isolate overflow-hidden rounded-3xl bg-deep p-7 text-white shadow-xl lg:sticky lg:top-28 lg:p-9"
          >
            <div aria-hidden="true" className="absolute -end-20 -top-20 -z-10 h-64 w-64 rounded-full bg-glacier-400/20 blur-3xl" />

            <h2 id="contact-info-heading" className="text-2xl text-white">
              {d.contact.infoHeading}
            </h2>
            <p className="mt-2 text-sm text-ink-inverse-muted">{d.contact.infoBody}</p>

            <ul className="mt-7 flex flex-col gap-2">
              {details.map((item) => {
                const body = (
                  <>
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10 text-glacier-300 ring-1 ring-white/10 transition-colors duration-300 group-hover:bg-glacier-400 group-hover:text-navy-900">
                      <Icon name={item.icon} size={20} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-2xs font-semibold uppercase tracking-[0.16em] text-glacier-300">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block text-sm text-white">{item.value}</span>
                    </span>
                  </>
                );

                return (
                  <li key={item.icon}>
                    {item.href ? (
                      <a
                        href={item.href}
                        {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="group -mx-3 flex items-center gap-4 rounded-2xl p-3 no-underline transition-colors hover:bg-white/5"
                      >
                        {body}
                      </a>
                    ) : (
                      <div className="group -mx-3 flex items-center gap-4 p-3">{body}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </aside>
        </Shell>
      </Section>

      {/* Regional contacts */}
      <Section ground="deep" aria-labelledby="regional-heading">
        <PhotoBackdrop src="/images/presence-port.jpg" />
        <div aria-hidden="true" className="bg-grid-inverse absolute inset-0 -z-10 opacity-60" />

        <Shell className="relative">
          <SectionHeading
            id="regional-heading"
            eyebrow={d.contact.regionalEyebrow}
            title={d.presence.regionalHeading}
            intro={d.presence.regionalIntro}
            align="center"
            className="mx-auto"
            inverse
          />

          <Reveal as="ul" stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {regional.map((market) => (
              <li
                key={market.country}
                className="glass-dark group relative flex h-full flex-col overflow-hidden rounded-2xl p-6 transition-[transform,border-color] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-glacier-300/50"
              >
                {/* Accent line that grows on hover */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-glacier-400 to-steel transition-transform duration-500 group-hover:scale-x-100 rtl:origin-right"
                />

                <div className="flex items-center justify-between gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-glacier-400 to-steel text-white shadow-[0_8px_20px_-6px_rgb(44_186_226/0.6)]">
                    <Icon name="globe" size={24} />
                  </span>
                  <span className="ltr-inline rounded-full border border-white/15 px-2.5 py-0.5 font-display text-xs font-semibold tracking-[0.14em] text-white/70">
                    {market.country}
                  </span>
                </div>

                <h3 className="mt-5 text-xl text-white">{market.name[typedLocale]}</h3>
                <p className="mt-1 text-sm text-ink-inverse-muted">{market.contact!.label[typedLocale]}</p>

                <div className="mt-5 flex flex-col gap-2 border-t border-white/10 pt-4 text-sm">
                  {market.contact!.phone ? (
                    <a
                      href={`tel:${market.contact!.phone.replace(/\s/g, "")}`}
                      className="inline-flex min-h-6 items-center gap-2 text-white no-underline transition-colors hover:text-glacier-300"
                    >
                      <Icon name="phone" size={16} className="text-glacier-300" />
                      <span className="ltr-inline">{market.contact!.phone}</span>
                    </a>
                  ) : null}
                  {market.contact!.email ? (
                    <a
                      href={`mailto:${market.contact!.email}`}
                      className="inline-flex min-h-6 items-center gap-2 break-all text-white no-underline transition-colors hover:text-glacier-300"
                    >
                      <Icon name="mail" size={16} className="text-glacier-300" />
                      <span className="ltr-inline">{market.contact!.email}</span>
                    </a>
                  ) : null}
                </div>
              </li>
            ))}
          </Reveal>
        </Shell>
      </Section>
    </>
  );
}
