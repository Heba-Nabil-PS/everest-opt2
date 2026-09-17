import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Section, Shell } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { categories } from "@/lib/data/products";
import { getDictionary } from "@/lib/i18n";
import { defaultLocale, localePath } from "@/lib/i18n/config";

/**
 * The locale segment is not available to `not-found`, so this renders in the
 * default language with a language switch available in the header above it.
 */
export default function NotFound() {
  const d = getDictionary(defaultLocale);
  const path = (p: string) => localePath(defaultLocale, p);

  return (
    <Section ground="frost">
      <Shell>
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-display text-6xl font-bold text-glacier-400">404</p>
          <h1 className="mt-6 text-4xl">{d.notFound.title}</h1>
          <p className="mt-4 text-lg text-ink-muted">{d.notFound.body}</p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <ButtonLink href={path("/products")} icon="arrowRight">
              {d.notFound.primary}
            </ButtonLink>
            <ButtonLink href={path("/contact")} variant="ghost">
              {d.notFound.secondary}
            </ButtonLink>
          </div>

          <ul className="mt-12 grid gap-3 text-start sm:grid-cols-2">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={path(`/products/${category.slug}`)}
                  className="flex min-h-12 items-center justify-between gap-3 rounded-lg border border-hairline bg-surface px-4 no-underline transition-colors hover:border-glacier-300"
                >
                  <span className="font-medium text-ink-strong">{category.name.en}</span>
                  <Icon name="arrowRight" size={20} className="text-glacier-600 rtl:-scale-x-100" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Shell>
    </Section>
  );
}
