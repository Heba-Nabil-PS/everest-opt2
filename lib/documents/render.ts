import { A4, PdfPage, renderPdf } from "@/lib/pdf";
import { categories, productsByCategory } from "@/lib/data/products";
import { certifications, site } from "@/lib/data/site";
import type { CategorySlug, Product, ProductCategory } from "@/lib/data/types";

const MARGIN = 48;
const CONTENT_WIDTH = A4.width - MARGIN * 2;

const NAVY = "0.137 0.133 0.357";
const CYAN = "0.173 0.729 0.886";
const INK = "0.102 0.102 0.18";
const MUTED = "0.357 0.392 0.471";

/** Every generated document opens with the same masthead. */
function masthead(page: PdfPage, title: string, subtitle: string) {
  page.rect(0, A4.height - 110, A4.width, 110, NAVY);
  page.rect(0, A4.height - 114, A4.width, 4, CYAN);

  page.text("EVEREST", MARGIN, A4.height - 52, 20, "bold", "1 1 1");
  page.text("INDUSTRIAL", MARGIN + 112, A4.height - 52, 11, "regular", CYAN);
  page.text(title, MARGIN, A4.height - 78, 13, "bold", "1 1 1");
  page.text(subtitle, MARGIN, A4.height - 95, 9, "regular", "0.66 0.71 0.8");

  return A4.height - 150;
}

function footer(page: PdfPage, note: string, pageLabel: string) {
  page.line(MARGIN, 64, A4.width - MARGIN, 64);
  page.text(
    `${site.address.line1}, ${site.address.line2}, ${site.address.city}, ${site.address.country}`,
    MARGIN,
    50,
    7.5,
    "regular",
    MUTED,
  );
  page.text(`${site.phone}  |  ${site.email}  |  ${site.url}`, MARGIN, 39, 7.5, "regular", MUTED);
  page.text(note, MARGIN, 28, 7, "oblique", MUTED);
  page.text(pageLabel, A4.width - MARGIN - 40, 39, 7.5, "regular", MUTED);
}

function sectionTitle(page: PdfPage, label: string, y: number) {
  page.text(label.toUpperCase(), MARGIN, y, 9, "bold", CYAN);
  page.line(MARGIN, y - 6, A4.width - MARGIN, y - 6, "0.8 0.85 0.9");
  return y - 24;
}

function specRow(page: PdfPage, label: string, value: string, y: number, shaded: boolean) {
  if (shaded) page.rect(MARGIN, y - 6, CONTENT_WIDTH, 20, "0.96 0.975 0.99");
  page.text(label, MARGIN + 8, y, 9, "regular", MUTED);
  page.text(value, MARGIN + 230, y, 9, "bold", INK);
  return y - 20;
}

function specRows(product: Product): [string, string][] {
  const s = product.specs;
  return [
    ["Gross capacity", `${s.capacity} L`],
    ["Net capacity", `${s.netCapacity} L`],
    ["Doors", String(s.doors)],
    ["Dimensions (W x D x H)", `${s.dimensions.width} x ${s.dimensions.depth} x ${s.dimensions.height} mm`],
    ["Net weight", `${s.netWeight} kg`],
    ["Energy class", s.energyClass],
    ["Annual energy consumption", `${s.annualConsumption} kWh/year`],
    ["Refrigerant", s.refrigerant],
    ["Temperature range", `${s.temperatureRange.min} to ${s.temperatureRange.max} C`],
    ["Power supply", s.power],
    ["Lighting", s.lighting.en],
    ["Shelves", s.shelves.en],
    ["Defrost", s.defrost.en],
    ["Climate class", s.climateClass],
    ["Controller", s.controller.en],
    ["Noise level", `${s.noiseLevel} dB(A)`],
    ["Warranty", `${s.warranty.unit} months unit / ${s.warranty.compressor} months compressor`],
  ];
}

const EDITION_NOTE =
  "English edition. Specifications are nominal, measured at 25 C ambient, and confirmed on quotation.";

export function renderSpecSheet(product: Product, category: ProductCategory) {
  const page = new PdfPage();
  let y = masthead(page, `${product.name} — ${product.code}`, `${category.name.en} · Specification sheet`);

  y = page.paragraph(product.summary.en, MARGIN, y, CONTENT_WIDTH, 10.5, 15, "regular", INK);
  y -= 14;
  y = page.paragraph(product.description.en, MARGIN, y, CONTENT_WIDTH, 9.5, 13.5, "regular", MUTED);
  y -= 18;

  y = sectionTitle(page, "Specification", y);
  specRows(product).forEach(([label, value], index) => {
    y = specRow(page, label, value, y, index % 2 === 1);
  });

  y -= 12;
  y = sectionTitle(page, "Technology", y);
  for (const key of product.tech) {
    page.text(`- ${key.toUpperCase()}`, MARGIN + 8, y, 9, "bold", INK);
    y -= 16;
  }

  y -= 8;
  y = sectionTitle(page, "Certified manufacturing", y);
  page.text(
    certifications.map((certification) => certification.standard).join("   |   "),
    MARGIN + 8,
    y,
    9,
    "regular",
    INK,
  );

  footer(page, EDITION_NOTE, "Page 1 of 1");
  return renderPdf([page], `${product.name} ${product.code} specification sheet`);
}

export function renderManual(product: Product, category: ProductCategory) {
  const first = new PdfPage();
  let y = masthead(
    first,
    `${product.name} — ${product.code}`,
    `${category.name.en} · Installation & operation manual`,
  );

  const sections: { title: string; body: string[] }[] = [
    {
      title: "1. Before installation",
      body: [
        `Check the unit against the delivery note and record the serial number. Warranty cover (${product.specs.warranty.unit} months on the unit, ${product.specs.warranty.compressor} months on the compressor) is registered against that number at dispatch.`,
        "Leave the cabinet upright for four hours before first power-on so the refrigerant charge settles.",
        `Confirm the supply matches the rating plate: ${product.specs.power}.`,
      ],
    },
    {
      title: "2. Placement",
      body: [
        `Allow 100 mm clearance at the rear and 50 mm at each side for condenser airflow. Installed footprint is ${product.specs.dimensions.width} x ${product.specs.dimensions.depth} mm.`,
        `The unit is rated to climate class ${product.specs.climateClass}. Do not install in direct sunlight or in the discharge path of a heating appliance.`,
        "Level the cabinet before loading. An out-of-level cabinet will not seal, and a cabinet that does not seal will not hold temperature.",
      ],
    },
    {
      title: "3. First start-up",
      body: [
        `Power on empty and allow the cabinet to reach its set point before loading product. Operating range is ${product.specs.temperatureRange.min} to ${product.specs.temperatureRange.max} C.`,
        `Controller: ${product.specs.controller.en}.`,
        "Load pre-chilled product where possible. Loading warm product extends pull-down and raises consumption for the first cycle.",
      ],
    },
    {
      title: "4. Routine maintenance",
      body: [
        "Clean the condenser every three months, monthly in dusty environments. A blocked condenser is the single most common cause of high running temperature.",
        `Defrost: ${product.specs.defrost.en}.`,
        "Inspect door gaskets monthly. Replace any gasket that does not hold a sheet of paper closed along its full length.",
        "Clean the interior with mild detergent only. Do not use solvent or abrasive cleaners on the glazing or the cabinet finish.",
      ],
    },
    {
      title: "5. First-line fault finding",
      body: [
        "Unit not cooling: check supply, check set point has not been altered, check condenser for blockage, check door closes fully.",
        "Condensation on the glass: check ambient humidity against the climate class, and check perimeter heating where fitted.",
        "High noise or vibration: check the cabinet is level and that nothing is in contact with the compressor compartment.",
        `If the fault persists, contact Everest service with the serial number and the model code ${product.code}.`,
      ],
    },
    {
      title: "6. Service and spare parts",
      body: [
        `Request service at ${site.url} or by email to ${site.email}. Critical spares are held for a minimum of seven years after a model leaves production.`,
        "Refrigerant work must be carried out by a qualified technician. Hydrocarbon circuits require hydrocarbon-rated tooling.",
      ],
    },
  ];

  const pages = [first];
  let page = first;

  for (const section of sections) {
    if (y < 170) {
      footer(page, EDITION_NOTE, `Page ${pages.length} of ?`);
      page = new PdfPage();
      pages.push(page);
      y = masthead(page, `${product.name} — ${product.code}`, "Installation & operation manual");
    }

    y = sectionTitle(page, section.title, y);
    for (const paragraph of section.body) {
      y = page.paragraph(paragraph, MARGIN + 8, y, CONTENT_WIDTH - 16, 9.5, 13.5, "regular", INK);
      y -= 8;
    }
    y -= 10;
  }

  pages.forEach((p, index) => {
    if (index === pages.length - 1) footer(p, EDITION_NOTE, `Page ${index + 1} of ${pages.length}`);
  });

  return renderPdf(pages, `${product.name} ${product.code} manual`);
}

export function renderBrochure(category: ProductCategory) {
  const models = productsByCategory(category.slug);
  const pages: PdfPage[] = [];

  const cover = new PdfPage();
  let y = masthead(cover, category.name.en, "Range brochure");
  y = cover.paragraph(category.tagline.en, MARGIN, y, CONTENT_WIDTH, 13, 18, "bold", INK);
  y -= 10;
  y = cover.paragraph(category.intro.en, MARGIN, y, CONTENT_WIDTH, 10, 14.5, "regular", MUTED);
  y -= 20;

  y = sectionTitle(cover, "At a glance", y);
  for (const highlight of category.highlights) {
    cover.text(`- ${highlight.en}`, MARGIN + 8, y, 10, "regular", INK);
    y -= 16;
  }

  y -= 14;
  y = sectionTitle(cover, `Models in this range (${models.length})`, y);
  cover.text("Model", MARGIN + 8, y, 8.5, "bold", MUTED);
  cover.text("Code", MARGIN + 150, y, 8.5, "bold", MUTED);
  cover.text("Capacity", MARGIN + 240, y, 8.5, "bold", MUTED);
  cover.text("Doors", MARGIN + 320, y, 8.5, "bold", MUTED);
  cover.text("Energy", MARGIN + 380, y, 8.5, "bold", MUTED);
  cover.text("kWh/year", MARGIN + 440, y, 8.5, "bold", MUTED);
  y -= 16;

  models.forEach((model, index) => {
    if (index % 2 === 1) cover.rect(MARGIN, y - 5, CONTENT_WIDTH, 18, "0.96 0.975 0.99");
    cover.text(model.name, MARGIN + 8, y, 9, "regular", INK);
    cover.text(model.code, MARGIN + 150, y, 9, "bold", INK);
    cover.text(`${model.specs.capacity} L`, MARGIN + 240, y, 9, "regular", INK);
    cover.text(String(model.specs.doors), MARGIN + 320, y, 9, "regular", INK);
    cover.text(model.specs.energyClass, MARGIN + 380, y, 9, "regular", INK);
    cover.text(String(model.specs.annualConsumption), MARGIN + 440, y, 9, "regular", INK);
    y -= 18;
  });

  footer(cover, EDITION_NOTE, "Page 1");
  pages.push(cover);

  /* One detail page per model keeps the brochure usable as a working document. */
  for (const model of models) {
    const page = new PdfPage();
    let cursor = masthead(page, `${model.name} — ${model.code}`, `${category.name.en} · Model detail`);
    cursor = page.paragraph(model.summary.en, MARGIN, cursor, CONTENT_WIDTH, 10.5, 15, "regular", INK);
    cursor -= 14;

    cursor = sectionTitle(page, "Key specification", cursor);
    specRows(model)
      .slice(0, 10)
      .forEach(([label, value], index) => {
        cursor = specRow(page, label, value, cursor, index % 2 === 1);
      });

    cursor -= 12;
    cursor = sectionTitle(page, "Features", cursor);
    for (const feature of model.features) {
      page.text(`- ${feature.title.en}`, MARGIN + 8, cursor, 9.5, "bold", INK);
      cursor -= 14;
      cursor = page.paragraph(feature.body.en, MARGIN + 16, cursor, CONTENT_WIDTH - 24, 9, 12.5, "regular", MUTED);
      cursor -= 10;
    }

    footer(page, EDITION_NOTE, `Page ${pages.length + 1}`);
    pages.push(page);
  }

  return renderPdf(pages, `${category.name.en} brochure`);
}

export function renderCatalogue() {
  const pages: PdfPage[] = [];

  const cover = new PdfPage();
  let y = masthead(cover, "Full product catalogue", "Every model, every specification");
  y = cover.paragraph(
    "Everest Industrial has manufactured commercial refrigeration in Sharjah since 1981. Four million units delivered, 86 countries supplied, ISO 9001, ISO 14001 and ISO 45001 certified.",
    MARGIN,
    y,
    CONTENT_WIDTH,
    11,
    16,
    "regular",
    INK,
  );
  y -= 24;

  for (const category of categories) {
    const models = productsByCategory(category.slug);
    y = sectionTitle(cover, `${category.name.en} (${models.length} models)`, y);
    y = cover.paragraph(category.tagline.en, MARGIN + 8, y, CONTENT_WIDTH - 16, 9.5, 13, "regular", MUTED);
    y -= 14;
  }

  footer(cover, EDITION_NOTE, "Page 1");
  pages.push(cover);

  for (const category of categories) {
    const models = productsByCategory(category.slug);
    const page = new PdfPage();
    let cursor = masthead(page, category.name.en, "Range specification summary");

    cursor = sectionTitle(page, "Models", cursor);
    page.text("Model", MARGIN + 8, cursor, 8.5, "bold", MUTED);
    page.text("Code", MARGIN + 150, cursor, 8.5, "bold", MUTED);
    page.text("Capacity", MARGIN + 240, cursor, 8.5, "bold", MUTED);
    page.text("W x D x H (mm)", MARGIN + 320, cursor, 8.5, "bold", MUTED);
    page.text("Energy", MARGIN + 450, cursor, 8.5, "bold", MUTED);
    cursor -= 16;

    models.forEach((model, index) => {
      if (index % 2 === 1) page.rect(MARGIN, cursor - 5, CONTENT_WIDTH, 18, "0.96 0.975 0.99");
      page.text(model.name, MARGIN + 8, cursor, 9, "regular", INK);
      page.text(model.code, MARGIN + 150, cursor, 9, "bold", INK);
      page.text(`${model.specs.capacity} L`, MARGIN + 240, cursor, 9, "regular", INK);
      page.text(
        `${model.specs.dimensions.width} x ${model.specs.dimensions.depth} x ${model.specs.dimensions.height}`,
        MARGIN + 320,
        cursor,
        9,
        "regular",
        INK,
      );
      page.text(model.specs.energyClass, MARGIN + 450, cursor, 9, "regular", INK);
      cursor -= 18;
    });

    footer(page, EDITION_NOTE, `Page ${pages.length + 1}`);
    pages.push(page);
  }

  return renderPdf(pages, "Everest Industrial full product catalogue");
}

export type DocumentTarget =
  | { kind: "spec-sheet"; product: Product; category: ProductCategory }
  | { kind: "manual"; product: Product; category: ProductCategory }
  | { kind: "brochure"; category: ProductCategory }
  | { kind: "catalogue" };

export function filenameFor(target: DocumentTarget) {
  switch (target.kind) {
    case "spec-sheet":
      return `everest-${target.product.code.toLowerCase()}-spec-sheet.pdf`;
    case "manual":
      return `everest-${target.product.code.toLowerCase()}-manual.pdf`;
    case "brochure":
      return `everest-${target.category.slug}-brochure.pdf`;
    case "catalogue":
      return "everest-full-product-catalogue.pdf";
  }
}

export function isCategorySlug(value: string): value is CategorySlug {
  return categories.some((category) => category.slug === value);
}
