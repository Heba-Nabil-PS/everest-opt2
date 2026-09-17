import Link from "next/link";
import { Icon } from "./Icon";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({
  items,
  label,
  inverse,
}: {
  items: Crumb[];
  label: string;
  inverse?: boolean;
}) {
  return (
    <nav aria-label={label}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 ? (
                <Icon
                  name="chevronRight"
                  size={16}
                  className={
                    inverse
                      ? "text-white/40 rtl:-scale-x-100"
                      : "text-ink-muted/50 rtl:-scale-x-100"
                  }
                />
              ) : null}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={
                    inverse
                      ? "inline-flex min-h-6 items-center text-white/70 no-underline hover:text-white hover:underline"
                      : "inline-flex min-h-6 items-center text-ink-muted no-underline hover:text-glacier-600 hover:underline"
                  }
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={inverse ? "font-medium text-white" : "font-medium text-ink-strong"}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
