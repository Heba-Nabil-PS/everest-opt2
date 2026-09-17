import { categoryBySlug, productBySlug } from "@/lib/data/products";
import {
  filenameFor,
  isCategorySlug,
  renderBrochure,
  renderCatalogue,
  renderManual,
  renderSpecSheet,
  type DocumentTarget,
} from "@/lib/documents/render";

const kinds = ["spec-sheet", "manual", "brochure", "catalogue"] as const;
type Kind = (typeof kinds)[number];

function isKind(value: string): value is Kind {
  return (kinds as readonly string[]).includes(value);
}

/**
 * Documents are generated on request from the live product data, so a spec
 * sheet can never drift from the page that links to it, and no download button
 * on the site points at a missing file.
 */
export async function GET(_request: Request, context: RouteContext<"/api/documents/[kind]/[slug]">) {
  const { kind, slug } = await context.params;

  if (!isKind(kind)) {
    return new Response("Unknown document type", { status: 404 });
  }

  let target: DocumentTarget;

  if (kind === "catalogue") {
    target = { kind: "catalogue" };
  } else if (kind === "brochure") {
    if (!isCategorySlug(slug)) return new Response("Unknown category", { status: 404 });
    target = { kind: "brochure", category: categoryBySlug.get(slug)! };
  } else {
    const product = productBySlug.get(slug);
    if (!product) return new Response("Unknown model", { status: 404 });
    target = { kind, product, category: categoryBySlug.get(product.categorySlug)! };
  }

  const bytes =
    target.kind === "spec-sheet"
      ? renderSpecSheet(target.product, target.category)
      : target.kind === "manual"
        ? renderManual(target.product, target.category)
        : target.kind === "brochure"
          ? renderBrochure(target.category)
          : renderCatalogue();

  return new Response(bytes as BodyInit, {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `inline; filename="${filenameFor(target)}"`,
      /* Documents change only when the product data changes, which means a
         deploy — so they can be cached hard at the edge. */
      "cache-control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
