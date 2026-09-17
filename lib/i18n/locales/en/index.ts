import { chrome } from "./chrome";
import { home } from "./home";
import { pages } from "./pages";

export const en = {
  ...chrome,
  home,
  ...pages,
} as const;

/**
 * Widen the `as const` literal types to their primitives so other locales can
 * supply their own strings while still being checked against the same shape.
 */
type Widen<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends readonly (infer U)[]
        ? readonly Widen<U>[]
        : { readonly [K in keyof T]: Widen<T[K]> };

/**
 * The English dictionary defines the contract. Every other locale is typed
 * against this shape, so a missing or misspelled key is a build error rather
 * than a blank string in production.
 */
export type Dictionary = Widen<typeof en>;
