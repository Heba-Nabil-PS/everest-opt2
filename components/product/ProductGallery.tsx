"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { ProductRender, type RenderAngle } from "@/components/art/ProductRender";
import { Cooler3D } from "./Cooler3D";
import { ProductPhoto } from "./ProductPhoto";
import { cn } from "@/lib/utils";
import { t, type Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import type { Product } from "@/lib/data/types";

const angles: RenderAngle[] = ["three-quarter", "front", "detail"];

/**
 * Product gallery: the model's photographs, a zoom view and a real 3D
 * inspection mode. Every view is a named, described image — a buyer never sees
 * a bare tile. Models without photography fall back to the rendered angles.
 */
export function ProductGallery({
  product,
  locale,
  dictionary: d,
}: {
  product: Product;
  locale: Locale;
  dictionary: Dictionary;
}) {
  const [active, setActive] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);

  const hasPhotos = product.images.length > 0;
  const count = hasPhotos ? product.images.length : angles.length;

  const altFor = (index: number) => {
    if (hasPhotos) {
      return `${product.name} ${product.code} — ${
        locale === "ar" ? `صورة ${index + 1} من ${count}` : `photo ${index + 1} of ${count}`
      }`;
    }
    return {
      "three-quarter": `${product.name} ${product.code} — ${locale === "ar" ? "منظور ثلاثة أرباع" : "three-quarter view"}`,
      front: `${product.name} ${product.code} — ${locale === "ar" ? "منظور أمامي" : "front view"}`,
      detail: `${product.name} ${product.code} — ${locale === "ar" ? "تفاصيل الباب ووحدة التحكّم" : "door seal and controller detail"}`,
    }[angles[index]];
  };

  const view = (index: number, alt: string, sizes: string, priority?: boolean) =>
    hasPhotos ? (
      <ProductPhoto src={product.images[index]} alt={alt} sizes={sizes} priority={priority} />
    ) : (
      <ProductRender art={product.art} angle={angles[index]} alt={alt} />
    );

  return (
    <div className="flex flex-col gap-4">
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border border-hairline",
          hasPhotos ? "aspect-square bg-white" : "bg-ice",
        )}
      >
        {view(active, altFor(active), "(min-width: 1024px) 50vw, 100vw", true)}

        <button
          type="button"
          onClick={() => setZoomOpen(true)}
          className="absolute end-4 top-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-white/90 px-3 text-sm font-medium text-ink-strong shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
        >
          <Icon name="plus" size={20} />
          {locale === "ar" ? "تكبير" : "Zoom"}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <ul className="flex flex-wrap gap-3">
          {Array.from({ length: count }, (_, index) => (
            <li key={index}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-current={index === active}
                aria-label={t(d.a11y.viewImage, { n: index + 1, total: count })}
                className={cn(
                  "relative h-20 w-20 overflow-hidden rounded-lg border-2 transition-colors",
                  hasPhotos ? "bg-white" : "bg-ice",
                  index === active
                    ? "border-glacier-400"
                    : "border-hairline hover:border-hairline-strong",
                )}
              >
                {view(index, "", "80px")}
              </button>
            </li>
          ))}
        </ul>

        <Button
          variant="ghost"
          icon="cube"
          iconLeading
          className="ms-auto"
          onClick={() => setViewerOpen(true)}
        >
          {d.cta.view3d}
        </Button>
      </div>

      <Modal
        open={zoomOpen}
        onClose={() => setZoomOpen(false)}
        title={`${product.name} · ${product.code}`}
        description={altFor(active)}
        closeLabel={d.a11y.closeDialog}
        size="xl"
      >
        <div
          className={cn(
            "relative overflow-hidden rounded-xl",
            hasPhotos ? "aspect-[4/5] max-h-[75vh] w-full bg-white" : "bg-ice",
          )}
        >
          {view(active, altFor(active), "100vw")}
        </div>
      </Modal>

      <Modal
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        title={d.productPage.viewer3dHeading}
        description={d.productPage.viewer3dBody}
        closeLabel={d.a11y.closeDialog}
        size="lg"
      >
        <Cooler3D
          product={product}
          labels={{
            dragToRotate: d.a11y.dragToRotate,
            rotateLeft: d.a11y.rotateLeft,
            rotateRight: d.a11y.rotateRight,
            reset: d.a11y.resetView,
          }}
        />
      </Modal>
    </div>
  );
}
