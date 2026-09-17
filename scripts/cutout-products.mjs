/**
 * Removes the white studio backdrop from the product shots.
 *
 * Only near-white pixels *connected to the image border* are cleared, so a
 * white cabinet body or a lit glass door keeps its pixels — a plain global
 * threshold would punch holes straight through the product. Edge pixels get a
 * ramped alpha so the cut-out doesn't look jagged, and the result is cropped
 * to the product's bounding box.
 *
 *   node scripts/cutout-products.mjs            → writes public/images/products/cutout
 *   node scripts/cutout-products.mjs --preview  → also writes dark-ground PNG previews
 */
import { readdir, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC_DIR = "public/images/products";
const OUT_DIR = "public/images/products/cutout";
/* Kept out of public/ — previews are for eyeballing the cut, not for shipping. */
const PREVIEW_DIR = ".cutout-preview";

/* Thresholds are derived per image from its own border, because a white
 * cabinet face can sit only ~8 levels below the backdrop (247 vs 255) — a
 * fixed threshold eats straight through it and the product turns see-through.
 * A gradient barrier is the second guard: the fill refuses to cross a pixel
 * where the image steps, so the product's outline stops it even when the
 * tones either side are near-identical. */
const SEED_DROP = 2; // below the measured backdrop → still definitely backdrop
const SOFT_DROP = 6; // below that → partial alpha, anti-aliasing the cut edge
const EDGE_LIMIT = 5; // luminance step that counts as a product outline
const NEUTRAL = 22; // max channel spread still considered a neutral grey/white

/** The backdrop's own brightness, read from the border ring. */
function backdropLevel(data, w, h) {
  const samples = [];
  const read = (x, y) =>
    samples.push(Math.min(data[(y * w + x) * 4], data[(y * w + x) * 4 + 1], data[(y * w + x) * 4 + 2]));
  for (let x = 0; x < w; x += 1) {
    read(x, 0);
    read(x, h - 1);
  }
  for (let y = 0; y < h; y += 1) {
    read(0, y);
    read(w - 1, y);
  }
  samples.sort((a, b) => a - b);
  return samples[Math.floor(samples.length / 2)];
}

function makeClassifier(level) {
  const seed = level - SEED_DROP;
  const soft = level - SOFT_DROP;
  return {
    /** Definite backdrop — only these are allowed to spread the fill. */
    isSeed: (r, g, b) => Math.max(r, g, b) - Math.min(r, g, b) <= NEUTRAL && Math.min(r, g, b) >= seed,
    /** Edge tone: partial alpha, but only right next to what was cleared, so
     *  compression blocks inside a white panel never turn see-through. */
    featherAlpha: (r, g, b) => {
      const min = Math.min(r, g, b);
      if (Math.max(r, g, b) - min > NEUTRAL || min < soft) return null;
      return Math.round((255 * (seed - min)) / (seed - soft));
    },
  };
}

/** Per-pixel luminance step, used as a wall the flood fill cannot cross. */
function gradientMap(data, w, h) {
  const lum = new Float32Array(w * h);
  for (let p = 0; p < w * h; p += 1) {
    const i = p * 4;
    lum[p] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  }
  const grad = new Float32Array(w * h);
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const p = y * w + x;
      const l = lum[p];
      let max = 0;
      if (x > 0) max = Math.max(max, Math.abs(l - lum[p - 1]));
      if (x < w - 1) max = Math.max(max, Math.abs(l - lum[p + 1]));
      if (y > 0) max = Math.max(max, Math.abs(l - lum[p - w]));
      if (y < h - 1) max = Math.max(max, Math.abs(l - lum[p + w]));
      grad[p] = max;
    }
  }
  return grad;
}

async function cutout(file, { preview }) {
  const src = path.join(SRC_DIR, file);
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const out = Buffer.from(data);
  const seen = new Uint8Array(w * h);
  const stack = [];
  const level = backdropLevel(data, w, h);
  const classify = makeClassifier(level);
  const grad = gradientMap(data, w, h);

  const push = (x, y, fromBorder = false) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const p = y * w + x;
    if (seen[p]) return;
    /* An outline stops the fill even when both sides read as near-white. */
    if (!fromBorder && grad[p] > EDGE_LIMIT) return;
    const i = p * 4;
    if (!classify.isSeed(data[i], data[i + 1], data[i + 2])) return;
    seen[p] = 1;
    out[i + 3] = 0;
    stack.push(p);
  };

  for (let x = 0; x < w; x += 1) {
    push(x, 0, true);
    push(x, h - 1, true);
  }
  for (let y = 0; y < h; y += 1) {
    push(0, y, true);
    push(w - 1, y, true);
  }

  while (stack.length) {
    const p = stack.pop();
    const x = p % w;
    const y = (p - x) / w;
    push(x + 1, y);
    push(x - 1, y);
    push(x, y + 1);
    push(x, y - 1);
  }

  /* Feather: two passes softening the pixels that border the cleared area,
     so the cut edge isn't a hard staircase. */
  for (let pass = 0; pass < 2; pass += 1) {
    const edits = [];
    for (let y = 0; y < h; y += 1) {
      for (let x = 0; x < w; x += 1) {
        const p = y * w + x;
        if (seen[p]) continue;
        const nextToCleared =
          (x > 0 && seen[p - 1]) ||
          (x < w - 1 && seen[p + 1]) ||
          (y > 0 && seen[p - w]) ||
          (y < h - 1 && seen[p + w]);
        if (!nextToCleared) continue;
        const i = p * 4;
        const alpha = classify.featherAlpha(data[i], data[i + 1], data[i + 2]);
        if (alpha === null) continue;
        edits.push([p, alpha]);
      }
    }
    for (const [p, alpha] of edits) {
      out[p * 4 + 3] = alpha;
      seen[p] = 1;
    }
  }

  /* Crop to what survived, with a small breathing margin. */
  let minX = w;
  let minY = h;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      if (out[(y * w + x) * 4 + 3] > 12) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) throw new Error(`${file}: nothing left after cutout`);

  const pad = 4;
  const left = Math.max(0, minX - pad);
  const top = Math.max(0, minY - pad);
  const region = {
    left,
    top,
    width: Math.min(w - left, maxX - minX + 1 + pad * 2),
    height: Math.min(h - top, maxY - minY + 1 + pad * 2),
  };

  const cleared = ((seen.reduce((n, v) => n + v, 0) / (w * h)) * 100).toFixed(1);
  const base = sharp(out, { raw: { width: w, height: h, channels: 4 } }).extract(region);

  await base.clone().webp({ quality: 88, alphaQuality: 100 }).toFile(path.join(OUT_DIR, file));

  if (preview) {
    await sharp({
      create: {
        width: region.width + 80,
        height: region.height + 80,
        channels: 4,
        background: { r: 13, g: 20, b: 42, alpha: 1 },
      },
    })
      .composite([{ input: await base.clone().png().toBuffer(), left: 40, top: 40 }])
      .png()
      .toFile(path.join(PREVIEW_DIR, `${path.parse(file).name}.png`));
  }

  return { file, cleared, region };
}

const preview = process.argv.includes("--preview");
const only = process.argv.find((a) => a.startsWith("--only="))?.split("=")[1];

await mkdir(OUT_DIR, { recursive: true });
if (preview) await mkdir(PREVIEW_DIR, { recursive: true });

const files = (await readdir(SRC_DIR)).filter((f) => f.endsWith(".webp"));
const targets = only ? files.filter((f) => f.includes(only)) : files;

for (const file of targets) {
  try {
    const { cleared, region } = await cutout(file, { preview });
    console.log(`${file}  cleared ${cleared}%  →  ${region.width}x${region.height}`);
  } catch (error) {
    console.error(`${file}  FAILED  ${error.message}`);
  }
}
