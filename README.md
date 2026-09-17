# Everest Industrial — bilingual website

Commercial refrigeration manufacturer site, built to the Everest Website Design Brief
(July 2026) and the Everest brand guidelines.

Next.js 16 (App Router, Turbopack) · TypeScript · Tailwind CSS v4 · GSAP.

---

## Running it

```bash
npm install
npm run dev     # http://localhost:3000 -> redirects to /en
npm run build
npm start
```

### Required before launch

Forms fail closed: if no delivery endpoint is configured, a submission in
production returns an error to the visitor rather than a false confirmation.

```bash
# .env.local
EVEREST_INQUIRY_WEBHOOK=https://your-crm-intake.example.com/everest
```

The endpoint receives a JSON POST for every form:

```json
{
  "kind": "quote",
  "locale": "en",
  "submittedAt": "2026-09-12T19:46:00.975Z",
  "fields": { "fullName": "…", "company": "…", "email": "…", "message": "…" }
}
```

`kind` is one of `quote`, `product-inquiry`, `contact`, `service`, `customize`,
`distributor`, `career`, `catalogue`. In development, submissions are logged to the
server console instead and the success state is still shown.

---

## Structure

```
app/
  [locale]/            every page; `[locale]` is the root layout (html lang + dir)
    products/[category]/[model]/     one template, 24 models
  api/documents/[kind]/[slug]/       generated PDFs
  sitemap.ts robots.ts
components/
  ui/        Button, Icon, Card, Badge, Modal, Tabs, Accordion, Breadcrumbs, Section
  layout/    Header, MegaMenu, MobileNav, SearchDialog, LocaleSwitcher, Footer, WhatsAppFab
  sections/  Hero, TrustStrip, CategoryGrid, Pillars, Technology, Sustainability,
             Services, Presence, NewsTeaser, LeadBand, PageHero, LegalPage
  product/   ProductCard, ProductExplorer, ProductGallery, SpecTable, Cooler3D
  forms/     InquiryForm + Quote / Contact / Service / Distributor / Career /
             Catalogue / CustomizeWizard, and the Field primitives
  art/       Logo, ProductRender, FactoryScene, WorldMap, NewsThumbnail
  motion/    Reveal, Counter, Parallax, PageTransition
lib/
  i18n/      locales/en and locales/ar, typed against each other
  data/      products, categories, news, careers, markets, documents, site
  forms/     specs, validation, server action, delivery seam
  pdf.ts     minimal PDF writer
  motion.ts  shared GSAP tokens
```

### Design system

All tokens live in `app/globals.css` under `@theme`. Nothing hard-codes a hex value.

- **Colour** comes from the brand deck: Everest Navy `#23225b`, Glacier Cyan `#2cbae2`,
  Ice Blue `#eaf7fc`, Cool Grey, Steel Blue, Charcoal. Every text pairing used in the UI
  was checked against WCAG AA; the primary CTA is navy text on glacier cyan (6.4:1).
- **Type** is Space Grotesk (display) + Inter (body) + Tajawal (Arabic), per §3.1 of the
  brief. The brand deck names Cambria/Calibri — those are Office document faces, not web
  faces, and the brief's Option B type direction was followed instead. Swapping is a
  two-line change in `app/[locale]/layout.tsx` plus the `--font-*` tokens.
- **Motion** tokens (`duration`, `ease`, `distance`, `stagger`) are in `lib/motion.ts`,
  mirrored as `--dur-*` / `--ease-*` / `--dist-*` in `globals.css`; every animation uses
  them. Hero entrances are CSS, not GSAP, because the headline is the LCP element and must
  never wait for a script. `prefers-reduced-motion` collapses all of it.

### Motion system (`components/motion/`)

| Component | Use |
| --- | --- |
| `SmoothScroll` | Lenis inertial wheel scroll (native scroll position, so sticky/anchors work). Off for touch and reduced motion. |
| `PageTransition` | React `<ViewTransition>` route transitions; product photos morph card → product page via `product/ProductMorph`. |
| `Reveal` | Scroll reveal: `fade-up`, `fade`, `scale-in`, `blur-up`, optional `stagger`. |
| `TextReveal` | SplitText: `lines` / `words` masked rise, `scrub` word-by-word statement. Used by every `SectionHeading`. |
| `ImageReveal` | `clip-up`, `clip-side`, `scale`, `curtain`, `window`, optional inner `parallax`. |
| `Parallax` | Decorative background drift (halved on phones). |
| `HeroStage` | Scroll exit for heroes: `[data-hero-media]` closes into a window, `[data-hero-content]` lifts. |
| `HorizontalScroll` | Pinned horizontal journey on desktop; native swipe row on touch. |
| `Slider` | Carousel: native snap scroll + mouse drag, controls, progress, RTL. |
| `Magnetic` | Pointer pull for one or two primary actions. |
| `Cursor` | Follower that reads `data-cursor="view" \| "drag" \| "hide"` from markup. Mouse only. |

Immersive heroes add `under-header` and `data-header-tone="dark" | "light"`; the header
picks its transparent palette from that in CSS (`:has()`), so no page needs wiring.

### Bilingual

`app/[locale]` is the root layout and sets `lang` and `dir`. `proxy.ts` redirects `/` to
the visitor's language (cookie, then `Accept-Language`) and remembers the choice.

Layout uses logical properties throughout (`ps/pe`, `ms/me`, `start/end`), so RTL mirrors
without a separate stylesheet. Numerals, model codes and units stay LTR inside Arabic via
the `.ltr-inline` utility.

`lib/i18n/locales/en` defines the dictionary shape; `ar` is typed against it, so a missing
or misspelled key is a build error rather than a blank string in production.

### Products

24 models across four categories in `lib/data/products.ts`, rendered by one template.
Adding a model is a new entry in that array — the grid, filters, search index, sitemap,
related products, brochure and spec sheet all pick it up.

**Specification values are engineering-plausible, not Everest's published datasheets.**
Verify every value against the real spec sheets before launch.

### Documents

Spec sheets, manuals, brochures and the catalogue are generated on request from the same
data that renders the pages (`lib/documents/render.ts`), so a download can never disagree
with the page it came from and no download button is a dead link.

Generated documents are English-only: the PDF writer uses the standard Helvetica faces
with WinAnsi encoding. An Arabic edition needs an embedded Arabic font — tracked below.

### Logo

The official lockup lives at `public/brand/everest-logo.png` (extracted at full resolution from the brand guidelines deck) and is rendered only through `components/art/Logo.tsx` — header, mobile drawer and footer. On dark grounds it sits on a white plate so the black outline and navy dome keep their edge. The favicon (`app/[locale]/icon.svg`) is a simplified dome-and-summit mark, since the full lockup is illegible at 16px; replace it with an official icon file if the brand team has one.

### Imagery

All product renders, the factory scene, the world map and article art are original vector
components in `components/art/`, drawn to one art direction (one light source, one ground,
one contact shadow) so a grid reads as a single photographic set. When real photography
arrives, replace `ProductRender` and `FactoryScene` — they are the only two places that
draw product and factory imagery.

---

## Verification

Checked with a Chrome DevTools Protocol harness at 375 / 768 / 1440 in both languages:

- no horizontal overflow on any page at any breakpoint
- exactly one `h1` per page, no skipped heading levels
- every interactive control has an accessible name; every field has a real label
- every pointer target is at least 24×24 CSS px
- no `href="#"` anywhere
- mega menu, site search, product filters, 3D viewer, modals, mobile drawer, language
  switch and the full form path (validation errors → focus management → delivery →
  success state) all exercised end to end

## Known follow-ups

1. Point `EVEREST_INQUIRY_WEBHOOK` at the real CRM intake.
2. Verify all 24 models' specifications against Everest's datasheets.
3. Have the Arabic copy reviewed by a native marketing writer.
4. Have counsel review `lib/content/legal.ts` (privacy policy and terms).
5. Replace the vector art with the factory and product photography shoot.
6. Embed an Arabic font in `lib/pdf.ts` to ship Arabic document editions.
7. Certification PDFs are deliberately not generated — the certificates tab links to a
   real request instead of a fabricated document. Swap in the registrar's PDFs when
   available.
