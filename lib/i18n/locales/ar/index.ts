import type { Dictionary } from "../en";
import { chrome } from "./chrome";
import { home } from "./home";
import { pages } from "./pages";

/**
 * Typed against the English dictionary: any key that is missing, renamed or
 * mistyped fails `tsc` rather than rendering an empty string in production.
 */
export const ar: Dictionary = {
  ...chrome,
  home,
  ...pages,
};
